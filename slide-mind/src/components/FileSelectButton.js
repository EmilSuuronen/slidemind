import React from 'react';
import { callOpenAiAPI } from '../openAI/apiConnection.js';

function SelectFileButton({ onFileProcessed }) {
    const handleFileChange = async () => {
        // Open the Electron file dialog and get the selected file path
        const selectedFilePath = await window.electronAPI.openFileDialog();
        if (selectedFilePath) {
            const fileExists = await window.electronAPI.checkFileExists(selectedFilePath);

            if (fileExists) {
                console.log('File already exists in storage, skipping addition.');
                return;
            }

            try {
                // Extract text content
                const { filePath, fileName, textContent } = await window.electronAPI.extractText(selectedFilePath);

                // Generate AI response
                const formattedResponse = await callOpenAiAPI(textContent);

                // Construct the final file object
                const newFileObject = {
                    filePath,
                    fileName,
                    textContent,
                    keywords: formattedResponse.keywords,
                    description: formattedResponse.description,
                };

                // Save the file data to JSON
                await window.electronAPI.saveNewFile(newFileObject);

                // Pass the data back to HomeMain
                onFileProcessed(newFileObject);

            } catch (error) {
                console.error('Error extracting text or saving file:', error);
            }
        } else {
            console.error('File selection was canceled or failed.');
        }
    };

    return (
        <button onClick={handleFileChange} className="button-select-file">
            Select PowerPoint File
        </button>
    );
}

export default SelectFileButton;
