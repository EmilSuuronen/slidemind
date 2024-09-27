import React, { useState } from 'react';


function HomeMain() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');

    const handleFileChange = async () => {
        // Open the Electron file dialog and get the selected file path
        const selectedFilePath = await window.electronAPI.openFileDialog();
        if (selectedFilePath) {
            console.log('Selected file path:', selectedFilePath);
            setSelectedFile(selectedFilePath);
        } else {
            console.error('File selection was canceled or failed.');
        }
    };

    const handleExtractText = async () => {
        if (selectedFile) {
            try {
                // Extract the file path from the selected file
                console.log('Selected file:', selectedFile)
                const filePath = selectedFile;

                if (!filePath) {
                    console.error('File path is undefined');
                    return;
                }
                const text = await window.electronAPI.extractText(filePath); // Invoke Electron API
                setExtractedText(text);
            } catch (error) {
                console.error('Error extracting text:', error);
            }
        }
    };

    return (
        <div>
            <h1>PowerPoint Text Extractor</h1>
            <input type="file" accept=".pptx" onChange={handleFileChange} />
            <button onClick={handleExtractText}>Extract Text</button>

            {extractedText && (
                <div>
                    <h2>Extracted Text:</h2>
                    <p>{extractedText}</p>
                </div>
            )}
        </div>
    );
};

export default HomeMain;
