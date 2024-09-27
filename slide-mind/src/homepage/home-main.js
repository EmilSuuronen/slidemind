import React, { useState } from 'react';
import './home-main-styles.css';
import Sidebar from "../sidebar/sidebar.js";


function HomeMain() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');

    const handleFileChange = async () => {
        // Open the Electron file dialog and get the selected file path
        const selectedFilePath = await window.electronAPI.openFileDialog();
        if (selectedFilePath) {
            console.log('Selected file path:', selectedFilePath);
            setSelectedFile(selectedFilePath);

            try {
                // Automatically extract the text after file selection
                const text = await window.electronAPI.extractText(selectedFilePath); // Extract text from the file
                setExtractedText(text); // Update the state with extracted text
            } catch (error) {
                console.error('Error extracting text:', error);
            }
        } else {
            console.error('File selection was canceled or failed.');
        }
    };

    return (
        <div className="div-home-main">
            <Sidebar/>
            <h1>SlideMind</h1>
            <button onClick={handleFileChange}>Select PowerPoint File</button>

            {extractedText && (
                <div>
                    <h2>Extracted Text:</h2>
                    {extractedText ? (
                        <p>{extractedText}</p>
                    ) : (
                        <p style={{ fontStyle: 'italic' }}>No file selected yet</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomeMain;
