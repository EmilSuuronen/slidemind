import React, {useState} from 'react';
import { callOpenAiAPI } from '../../api/apiConnection.js';
import './fileSelectButtonStyles.css';



function SelectFileButton({ onFileProcessed }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleOpenModal = () => setModalOpen(true);

    const handleCloseModal = () => {
        setSelectedFiles([]);
        setModalOpen(false);
    };

    const handleFileSelection = async () => {
        const filePaths = await window.electronAPI.openFileDialog();

        if (!filePaths || filePaths.length === 0) {
            console.error('No files were selected.');
            return;
        }

        // Add the new files to the list
        setSelectedFiles((prevFiles) => [
            ...prevFiles,
            ...filePaths.filter((file) => !prevFiles.includes(file)), // Avoid duplicates
        ]);
    };

    const handleRemoveFile = (filePath) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((file) => file !== filePath));
    };

    const handleSaveFiles = async () => {
        for (const selectedFilePath of selectedFiles) {
            try {
                console.log('Processing file:', selectedFilePath);
                const fileExists = await window.electronAPI.checkFileExists(selectedFilePath);
                if (fileExists) {
                    console.warn(`File ${selectedFilePath} already exists. Skipping.`);
                    continue;
                }

                const isPdf = selectedFilePath.toLowerCase().endsWith('.pdf');

                // Extract text content
                const { filePath, fileName, textContent, slides } = await window.electronAPI.extractText(selectedFilePath);

                // Generate AI response
                const formattedResponse = await callOpenAiAPI(textContent);

                let pdfPath = null;

                // Convert PPTX to PDF if not already a PDF
                if (!isPdf) {
                    const pdfResult = await window.electronAPI.convertPptxToPdf(selectedFilePath);
                    pdfPath = pdfResult.success ? pdfResult.pdfPath : null;
                } else {
                    pdfPath = filePath;
                }

                // Construct the final file object
                const newFileObject = {
                    filePath,
                    fileName,
                    textContent,
                    keywords: formattedResponse.keywords,
                    description: formattedResponse.description,
                    sources: formattedResponse.links,
                    contentSuggestion: formattedResponse.contentSuggestion,
                    informationValidity: formattedResponse.informationValidity,
                    pdfPath,
                    slides,
                };

                // Save the file data to JSON
                await window.electronAPI.saveNewFile(newFileObject);

                // Pass the processed file object to the parent
                onFileProcessed(newFileObject);
            } catch (error) {
                console.error(`Error processing file ${selectedFilePath}:`, error);
            }
        }

        handleCloseModal();
    };

    return (
        <div>
            <button onClick={handleOpenModal} className="button-select-file">
                Add Files
            </button>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Select Files</h2>
                        <i> Select multiple files holding shift + click</i>
                        <button onClick={handleFileSelection} className="button-select-file">
                            Select Files
                        </button>


                        {selectedFiles.length > 0 && (
                            <ul className="file-list">
                                {selectedFiles.map((file, index) => (
                                    <li key={index} className="file-item">
                                        {file}
                                        <button
                                            onClick={() => handleRemoveFile(file)}
                                            className="button-remove-file"
                                        >
                                            X
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="modal-actions">
                            <button onClick={handleSaveFiles} className="button-save-files">
                                Save
                            </button>
                            <button onClick={handleCloseModal} className="button-cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SelectFileButton;
