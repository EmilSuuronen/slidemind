// src/components/HomeMain.js
import React, { useState } from 'react';
import './home-main-styles.css';
import Sidebar from "../components/sidebar/sidebar.js";
import TopFileRow from "../components/fileRow/TopFileRow.js";
import SelectFileButton from "../components/fileSelectButton/FileSelectButton.js";
import FileDetails from "../fileDetailsView/fileDetailsView.js";

function HomeMain() {
    const [selectedFilePath, setSelectedFilePath] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [links, setLinks] = useState([]);

    const handleFileProcessed = (fileData) => {
        setSelectedFilePath(fileData.filePath);
        setExtractedText(fileData.description);
        setKeywords(fileData.keywords);
        setLinks(fileData.links || []);
    };

    const handleFileSelect = (file) => {
        setSelectedFilePath(file.filePath);
        setExtractedText(file.description);
        setKeywords(file.keywords);
        setLinks(file.links || []);
    };

    return (
        <div className="div-home-main">
            <Sidebar />
            <div className="div-home-main-column">
                <TopFileRow onFileSelect={handleFileSelect} selectedFilePath={selectedFilePath} />

                <SelectFileButton onFileProcessed={handleFileProcessed} />

                <FileDetails file={{ description: extractedText, keywords, links }} />
            </div>
        </div>
    );
}

export default HomeMain;
