import React, { useState } from 'react';


function HomeMain() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleExtractText = async () => {
        if (selectedFile) {
            try {
                const filePath = selectedFile.path; // This should give you the correct file path in Electron

                if (!filePath) {
                    console.error('File path is undefined!');
                    return;
                }

                const text = await window.electronAPI.extractText(filePath); // Invoke Electron API
                setExtractedText(text);
                console.log(text)
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
