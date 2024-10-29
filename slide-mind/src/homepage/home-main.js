// src/components/HomeMain.js
import React, { useState } from 'react';
import Sidebar from '../sidebar/sidebar.js';
import './home-main-styles.css';
import Keyword from '../keyword/keyword.js';
import SelectFileButton from '../components/FileSelectButton.js';
import TopFileRow from "../fileRow/TopFileRow.js";

function HomeMain() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [links, setLinks] = useState([]);

    // Callback function to handle the processed file data
    const handleFileProcessed = (fileData) => {
        setSelectedFile(fileData.filePath);
        setExtractedText(fileData.description);
        setKeywords(fileData.keywords);
        setLinks(fileData.links || []); // Default to empty array if no links
    };

    return (
        <div className="div-home-main">
            <Sidebar />
            <div className="div-home-main-column">
                <TopFileRow/>
                <h1>SlideMind</h1>

                {/* Render the SelectFileButton component and pass the callback */}
                <SelectFileButton onFileProcessed={handleFileProcessed} />

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
