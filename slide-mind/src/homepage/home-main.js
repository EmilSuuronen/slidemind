import React, { useState } from 'react';
import Sidebar from '../sidebar/sidebar.js';
import './home-main-styles.css';
import { callOpenAiAPI } from '../openAI/apiConnection.js';
import Keyword from '../keyword/keyword.js';

function HomeMain() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [links, setLinks] = useState([]);

    const handleFileChange = async () => {
        const selectedFilePath = await window.electronAPI.openFileDialog();
        if (selectedFilePath) {
            const fileExists = await window.electronAPI.checkFileExists(selectedFilePath);
            if (fileExists) {
                console.log('File already exists in storage, skipping addition.');
                return;
            }

            setSelectedFile(selectedFilePath);

            try {
                const text = await window.electronAPI.extractText(selectedFilePath);
                const formattedResponse = await callOpenAiAPI(text);
                setExtractedText(formattedResponse.description);
                setKeywords(formattedResponse.keywords);
                setLinks(formattedResponse.links);

                const newFileObject = {
                    filePath: selectedFilePath,
                    fileName: selectedFilePath.split('/').pop(),
                    textContent: text,
                    keywords: formattedResponse.keywords,
                    description: formattedResponse.description,
                };
                await window.electronAPI.saveNewFile(newFileObject);
            } catch (error) {
                console.error('Error extracting text or saving file:', error);
            }
        } else {
            console.error('File selection was canceled or failed.');
        }
    };

    return (
        <div className="div-home-main">
            <Sidebar />
            <div className="div-home-main-column">
                <h1>SlideMind</h1>
                <button onClick={handleFileChange} className="button-select-file">
                    Select PowerPoint File
                </button>

                {extractedText && (
                    <div>
                        <h2>Description</h2>
                        <p>{extractedText || <i>No file selected yet</i>}</p>
                    </div>
                )}
                {keywords.length > 0 ? (
                    <Keyword keywords={keywords} />
                ) : (
                    <p style={{ fontStyle: 'italic' }}>No keywords to display</p>
                )}
                {links.length > 0 ? (
                    <Keyword keywords={links} />
                ) : (
                    <p style={{ fontStyle: 'italic' }}>No sources in material</p>
                )}
            </div>
        </div>
    );
}

export default HomeMain;
