import React, {useCallback, useState} from 'react';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleFileSelect = (file, isSinglePage) => {
        if (isSinglePage){
            console.log("file.filepath:", file.filePath);
            setSelectedFilePath(file.filePath);
            console.log("selectedFilePath:", selectedFilePath);
            setSelectedFileName(file.fileName);
            setExtractedText(file.description);
            setKeywords(file.keywords);
            setLinks(file.links);
            setFilePdfPath(file.pdfPath);
        } else {
            setSelectedFilePath(file.filePath);
            setSelectedFileName(file.fileName);
            setExtractedText(file.description);
            setKeywords(file.keywords);
            setLinks(file.links);
            setFilePdfPath(file.pdfPath);
        }
    };

    function debounce(func, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }

    const handleSearch = useCallback(
        debounce((query) => {
            setLoading(true);
            const lowerQuery = query.toLowerCase();
            const filteredData = fileData.filter(
                (file) =>
                    file.fileName.toLowerCase().includes(lowerQuery) ||
                    file.description.toLowerCase().includes(lowerQuery) ||
                    file.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery))
            );
            setFilteredFileData(filteredData);
            setIsSearching(true);
            setLoading(false);
        }, 300), // 300ms debounce delay
        []
    );

    const handleKeywordSelect = useCallback(
        debounce((keyword) => {
            setLoading(true);
            const filteredData = fileData.filter((file) => file.keywords.includes(keyword));
            setFilteredFileData(filteredData);
            setIsSearching(true);
            setLoading(false);
        }, 300),
        []
    );

    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        handleSearch(query); // Call the debounced search
    };

    return (
        <div className="div-home-main">
            <Sidebar onSearch={handleSearch} onKeywordSelect={handleKeywordSelect} keywords={uniqueKeywords} />
            <div className="div-home-main-column">
                {loading && <div className="loading-spinner">Loading...</div>}
                <TopFileRow
                    onFileSelect={handleFileSelect}
                    selectedFilePath={selectedFilePath}
                    fileData={isSearching ? filteredFileData : fileData} // Use filtered data only when searching
                    searchQuery={searchQuery}
                />

                <SelectFileButton onFileProcessed={handleFileProcessed} />

                <FileDetails file={{ selectedFileName, description: extractedText, keywords, links, selectedFilePath, filePdfPath }} />
            </div>
        </div>
    );
}

export default HomeMain;
