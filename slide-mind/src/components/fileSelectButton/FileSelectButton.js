import React from 'react';
import { callOpenAiAPI } from '../../api/apiConnection.js';

function SelectFileButton({ onFileProcessed }) {
    const handleFileChange = async () => {
        const selectedFilePaths = await window.electronAPI.openFileDialog();

        if (!selectedFilePaths || selectedFilePaths.length === 0) {
            console.error('File selection was canceled or failed.');
            return;
        }

        for (const selectedFilePath of selectedFilePaths) {
            try {
                console.log('Processing file:', selectedFilePath);
                const fileExists = await window.electronAPI.checkFileExists(selectedFilePath);
                if (fileExists) {
                    continue;
                }

                const isPdf = selectedFilePath.toLowerCase().endsWith('.pdf');

                // Extract text content
                const { filePath, fileName, textContent, slides } = await window.electronAPI.extractText(selectedFilePath);

                // Generate AI response
                const formattedResponse = await callOpenAiAPI(textContent);

                let pdfPath = null;

                // Convert PPTX to PDF
                if (!isPdf) {
                    const pdfResult = await window.electronAPI.convertPptxToPdf(selectedFilePath);
                    pdfPath = pdfResult.success ? pdfResult.pdfPath : null;
                } else {
                    console.log('File is already a PDF. Skipping conversion.');
                    pdfPath = filePath; // Use the original PDF path
                }

                // Construct the final file object with pdfPath
                const newFileObject = {
                    filePath,
                    fileName,
                    textContent,
                    keywords: formattedResponse.keywords,
                    description: formattedResponse.description,
                    sources: formattedResponse.sources,
                    pdfPath,
                    slides
                };

                // Save the file data to JSON
                await window.electronAPI.saveNewFile(newFileObject);

                // Pass the data back to HomeMain
                onFileProcessed(newFileObject);

            } catch (error) {
                console.error(`Error processing file ${selectedFilePath}:`, error);
            }
        }
    };

    return (
        <button onClick={handleFileChange} className="button-select-file">
            Add files
        </button>
    );
}

export default SelectFileButton;
