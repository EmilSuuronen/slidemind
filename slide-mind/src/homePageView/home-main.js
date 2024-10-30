// src/components/HomeMain.js
import React, { useState, useEffect } from 'react';
import './home-main-styles.css';
import Sidebar from "../components/sidebar/sidebar.js";
import TopFileRow from "../components/fileRow/TopFileRow.js";
import SelectFileButton from "../components/fileSelectButton/FileSelectButton.js";
import FileDetails from "../fileDetailsView/fileDetailsView.js";
import fileData from "../localData.json";

function HomeMain() {
    const [selectedFilePath, setSelectedFilePath] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [links, setLinks] = useState([]);
    const [filteredFileData, setFilteredFileData] = useState(fileData);

    // Gather unique keywords from file data
    const uniqueKeywords = [...new Set(fileData.flatMap(file => file.keywords))];

    const handleFileProcessed = (fileData) => {
        setSelectedFilePath(fileData.filePath);
        setExtractedText(fileData.description);
        setKeywords(fileData.keywords);
        setLinks(fileData.links);
        setFilteredFileData(fileData);
    };

    const handleFileSelect = (file) => {
        setSelectedFilePath(file.filePath);
        setSelectedFileName(file.fileName);
        setExtractedText(file.description);
        setKeywords(file.keywords);
        setLinks(file.links || []);
    };

    const handleSearch = (query) => {
        const lowerQuery = query.toLowerCase();
        const filteredData = fileData.filter(file =>
            file.fileName.toLowerCase().includes(lowerQuery) ||
            file.description.toLowerCase().includes(lowerQuery) ||
            file.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
        );
        setFilteredFileData(filteredData);
    };

    const handleKeywordSelect = (keyword) => {
        const filteredData = fileData.filter(file => file.keywords.includes(keyword));
        setFilteredFileData(filteredData);
    };

    return (
        <div className="div-home-main">
            <Sidebar onSearch={handleSearch} onKeywordSelect={handleKeywordSelect} keywords={uniqueKeywords} />
            <div className="div-home-main-column">
                <TopFileRow
                    onFileSelect={handleFileSelect}
                    selectedFilePath={selectedFilePath}
                    fileData={filteredFileData}
                />

                <SelectFileButton onFileProcessed={handleFileProcessed} />

                <FileDetails file={{ selectedFileName, description: extractedText, keywords, links, selectedFilePath }} />
            </div>
        </div>
    );
}

export default HomeMain;
