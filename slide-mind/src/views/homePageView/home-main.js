import React, { useState } from 'react';
import './home-main-styles.css';
import Sidebar from '../../components/sidebar/sidebar.js';
import TopFileRow from '../../components/fileRow/TopFileRow.js';
import SelectFileButton from '../../components/fileSelectButton/FileSelectButton.js';
import FileDetails from '../fileDetailsView/fileDetailsView.js';
import fileData from '../../localData.json';

function HomeMain() {
    const [selectedFilePath, setSelectedFilePath] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [links, setLinks] = useState([]);
    const [filteredFileData, setFilteredFileData] = useState([]);
    const [isSearching, setIsSearching] = useState(false); // Track search state
    const [filePdfPath, setFilePdfPath] = useState(null);

    // Gather unique keywords from file data
    const uniqueKeywords = [...new Set(fileData.flatMap(file => file.keywords))];

    const handleFileProcessed = (newFile) => {
        // Refresh original fileData and reset any search filtering
        fileData.push(newFile); // Update the original data source
        setFilteredFileData([]); // Clear the search filter to use full data
        setIsSearching(false); // Reset search state
        setSelectedFilePath(newFile.filePath); // Set selected file
        setSelectedFileName(newFile.fileName);
        setExtractedText(newFile.description);
        setKeywords(newFile.keywords);
        setLinks(newFile.links);
        setFilePdfPath(newFile.pdfPath);
    };

    const handleFileSelect = (file) => {
        setSelectedFilePath(file.filePath);
        setSelectedFileName(file.fileName);
        setExtractedText(file.description);
        setKeywords(file.keywords);
        setLinks(file.links);
        setFilePdfPath(file.pdfPath);
    };

    const handleSearch = (query) => {
        const lowerQuery = query.toLowerCase();
        const filteredData = fileData.filter(file =>
            file.fileName.toLowerCase().includes(lowerQuery) ||
            file.description.toLowerCase().includes(lowerQuery) ||
            file.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
        );
        setFilteredFileData(filteredData);
        setIsSearching(true); // Indicate a search is active
        console.log("filtered data", filteredData);
    };

    const handleKeywordSelect = (keyword) => {
        const filteredData = fileData.filter(file => file.keywords.includes(keyword));
        setFilteredFileData(filteredData);
        setIsSearching(true); // Indicate a search is active
    };

    return (
        <div className="div-home-main">
            <Sidebar onSearch={handleSearch} onKeywordSelect={handleKeywordSelect} keywords={uniqueKeywords} />
            <div className="div-home-main-column">
                <TopFileRow
                    onFileSelect={handleFileSelect}
                    selectedFilePath={selectedFilePath}
                    fileData={isSearching ? filteredFileData : fileData} // Use filtered data only when searching
                />

                <SelectFileButton onFileProcessed={handleFileProcessed} />

                <FileDetails file={{ selectedFileName, description: extractedText, keywords, links, selectedFilePath, filePdfPath }} />
            </div>
        </div>
    );
}

export default HomeMain;
