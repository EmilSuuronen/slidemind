import React, {useCallback, useRef, useState} from 'react';
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
    const [isSearching, setIsSearching] = useState(false);
    const [filePdfPath, setFilePdfPath] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state for searches
    const [currentSearchQuery, setCurrentSearchQuery] = useState(''); // Current search query
    const [isSelectedSinglePage, setIsSelectedSinglePage] = useState(false); // Check if the selected file is a single page
    const [selectedPageNumber, setSelectedPageNumber] = useState(null); // Selected page number
    const previousSelectedIndexRef = useRef(null);

    // Gather unique keywords from the file data
    const uniqueKeywords = [...new Set(fileData.flatMap((file) => file.keywords))];

    // Handles when a new file is processed
    const handleFileProcessed = (newFile) => {
        fileData.push(newFile);
        setFilteredFileData([]);
        setIsSearching(false);
        setSelectedFilePath(newFile.filePath);
        setSelectedFileName(newFile.fileName);
        setExtractedText(newFile.description);
        setKeywords(newFile.keywords);
        setLinks(newFile.links);
        setFilePdfPath(newFile.pdfPath);
    };

    // Handles when a file is selected
    const handleFileSelect = (file, isSinglePage, pageNumber, index) => {

        if (previousSelectedIndexRef.current !== null) {
            const previousItem = document.getElementById(`singleFileRowItem${previousSelectedIndexRef.current}`);
            if (previousItem) {
                previousItem.style.border = '';
            }
        }

        // Set border for the current item
        const currentItem = document.getElementById(`singleFileRowItem${index}`);
        if (currentItem) {
            currentItem.style.border = '2px solid red';
        }

        // Update the previous selected index
        previousSelectedIndexRef.current = index;

        if (isSinglePage) {
            setIsSelectedSinglePage(true);
            setSelectedPageNumber(pageNumber);
        } else {
            setIsSelectedSinglePage(false);
            setSelectedPageNumber(null);
        }
        setSelectedFilePath(file.filePath);
        setSelectedFileName(file.fileName);
        setExtractedText(file.description);
        setKeywords(file.keywords);
        setLinks(file.links);
        setFilePdfPath(file.pdfPath);
    };

    // Handles search input from the Sidebar
    const handleSearch = (query) => {
        setLoading(true); // Start loading animation
        const lowerQuery = query.toLowerCase();
        const filteredData = fileData.filter(
            (file) =>
                file.fileName.toLowerCase().includes(lowerQuery) ||
                file.description.toLowerCase().includes(lowerQuery) ||
                file.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery))
        );
        setFilteredFileData(filteredData);
        setCurrentSearchQuery(query);
        setIsSearching(true); // Enable search mode
        setLoading(false); // Stop loading animation
    };

    // Handles keyword selection from the Sidebar
    const handleKeywordSelect = (keyword) => {
        setLoading(true); // Start loading animation
        const filteredData = fileData.filter((file) => file.keywords.includes(keyword));
        setFilteredFileData(filteredData);
        setIsSearching(true); // Enable search mode
        setLoading(false); // Stop loading animation
    };

    return (
        <div className="div-home-main">
            {/* Sidebar for search and keyword selection */}
            <Sidebar
                onSearch={handleSearch}
                onKeywordSelect={handleKeywordSelect}
                keywords={uniqueKeywords}
            />

            <div className="div-home-main-column">
                {/* Loading animation */}
                {loading && <div className="loading-spinner">Loading...</div>}

                {/* Top file row */}
                <TopFileRow
                    onFileSelect={handleFileSelect}
                    selectedFilePath={selectedFilePath}
                    fileData={isSearching ? filteredFileData : fileData} // Show filtered data during search
                    searchQuery={currentSearchQuery}
                />

                {/* File selector button */}
                <SelectFileButton onFileProcessed={handleFileProcessed} />

                {/* File details. Conditional based on whether single page or document selected*/}

                {isSelectedSinglePage ? (
                    <FileDetails
                        file={{
                            selectedFileName,
                            description: extractedText,
                            keywords,
                            links,
                            selectedFilePath,
                            filePdfPath,
                            selectedPageNumber,
                            currentSearchQuery
                        }}
                    />
                ) : (
                    <FileDetails
                        file={{
                            selectedFileName,
                            description: extractedText,
                            keywords,
                            links,
                            selectedFilePath,
                            filePdfPath,
                        }}
                    />
                )
                }
            </div>
        </div>
    );
}

export default HomeMain;
