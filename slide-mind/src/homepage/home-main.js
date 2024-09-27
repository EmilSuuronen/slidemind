import React, { useState } from 'react';
const { ipcRenderer } = window.require('electron');

function HomeMain() {
    const [extractedText, setExtractedText] = useState('');

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const filePath = file.path;  // Use the file's path in Electron's context
                const text = await ipcRenderer.invoke('extract-pptx-text', filePath);
                setExtractedText(text);
            } catch (error) {
                console.error('Error extracting text:', error);
            }
        }
    };

    return (
        <div>
            <input type="file" accept=".pptx" onChange={handleFileUpload} />
            <div>
                <h3>Extracted Text:</h3>
                <pre>{extractedText}</pre>
            </div>
        </div>
    );
};

export default HomeMain;
