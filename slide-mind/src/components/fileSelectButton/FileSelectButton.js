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
                const fileExists = await window.electronAPI.checkFileExists(selectedFilePath);
                if (fileExists) {
                    console.log(`File ${selectedFilePath} already exists in storage, skipping addition.`);
                    continue;
                }

                // Extract text content
                const { filePath, fileName, textContent } = await window.electronAPI.extractText(selectedFilePath);

                // Generate AI response
                const formattedResponse = await callOpenAiAPI(textContent);

                // Convert PPTX to PDF
                const pdfResult = await window.electronAPI.convertPptxToPdf(selectedFilePath);
                const pdfPath = pdfResult.success ? pdfResult.pdfPath : null;

                // Construct the final file object with pdfPath
                const newFileObject = {
                    filePath,
                    fileName,
                    textContent,
                    keywords: formattedResponse.keywords,
                    description: formattedResponse.description,
                    pdfPath, // Include PDF path
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
