import React, {useRef, useState} from 'react'
import './App.css'
import TopFileRow from './components/fileRow/TopFileRow.js'
import Topbar from './components/topbar/topbar.js'
import fileData from './localData.json'
import FileDetails from './views/fileDetailsView/fileDetailsView.js'
import CustomFrame from "./components/customFrame/customFrame.js";

function App() {
    const [selectedFilePath, setSelectedFilePath] = useState(null)
    const [selectedFileName, setSelectedFileName] = useState(null)
    const [extractedText, setExtractedText] = useState('')
    const [keywords, setKeywords] = useState([])
    const [links, setLinks] = useState([])
    const [filteredFileData, setFilteredFileData] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [filePdfPath, setFilePdfPath] = useState(null)
    const [loading, setLoading] = useState(false)
    const [currentSearchQuery, setCurrentSearchQuery] = useState('')
    const [isSelectedSinglePage, setIsSelectedSinglePage] = useState(false)
    const [selectedPageNumber, setSelectedPageNumber] = useState(null)
    const previousSelectedIndexRef = useRef(null)
    const [contentSuggestions, setContentSuqggestions] = useState("No content suggestions available.")
    const [informationValidity, setInformationValidity] = useState("Information seems to be up to date.")

    const uniqueKeywords = [
        ...new Set(fileData.flatMap((file) => file.keywords)),
    ]

    const handleFileProcessed = (newFile) => {
        fileData.push(newFile)
        setFilteredFileData([])
        setIsSearching(false)
        setSelectedFilePath(newFile.filePath)
        setSelectedFileName(newFile.fileName)
        setExtractedText(newFile.description)
        setKeywords(newFile.keywords)
        setLinks(newFile.sources)
        setFilePdfPath(newFile.pdfPath)
        setContentSuqggestions(newFile.contentSuggestion)
        setInformationValidity(newFile.informationValidity)
        console.log("newFile: ", newFile)
    }

    const handleFileSelect = (file, isSinglePage, pageNumber, index) => {
        console.log("filefajewifjewoiafejawio", file)
        if (previousSelectedIndexRef.current !== null) {
            const previousItem = document.getElementById(
                `singleFileRowItem${previousSelectedIndexRef.current}`
            )
            if (previousItem) {
                previousItem.style.border = ''
            }
        }

        const currentItem = document.getElementById(`singleFileRowItem${index}`)
        if (currentItem) {
            currentItem.style.border = '2px solid red'
        }

        previousSelectedIndexRef.current = index

        if (isSinglePage) {
            setIsSelectedSinglePage(true)
            setSelectedPageNumber(pageNumber)
        } else {
            setIsSelectedSinglePage(false)
            setSelectedPageNumber(null)
        }
        setSelectedFilePath(file.filePath)
        setSelectedFileName(file.fileName)
        setExtractedText(file.description)
        setKeywords(file.keywords)
        setLinks(file.sources)
        setFilePdfPath(file.pdfPath)
        setContentSuqggestions(file.contentSuggestion)
        setInformationValidity(file.informationValidity)
    }

    const handleSearch = (query) => {
        setLoading(true)
        const lowerQuery = query.toLowerCase()
        const filteredData = fileData.filter(
            (file) =>
                file.fileName.toLowerCase().includes(lowerQuery) ||
                file.description.toLowerCase().includes(lowerQuery) ||
                file.keywords.some((keyword) =>
                    keyword.toLowerCase().includes(lowerQuery)
                )
        )
        setFilteredFileData(filteredData)
        setCurrentSearchQuery(query)
        setIsSearching(true)
        setLoading(false)
    }

    const handleKeywordSelect = (keyword) => {
        setLoading(true)
        const filteredData = fileData.filter((file) =>
            file.keywords.includes(keyword)
        )
        setFilteredFileData(filteredData)
        setIsSearching(true)
        setLoading(false)
    }

    return (
        <div className='div-home-main'>
            <CustomFrame frameColor="#00847f" />

            <Topbar
                onSearch={handleSearch}
                onKeywordSelect={handleKeywordSelect}
                keywords={uniqueKeywords}
                onFileProcessed={handleFileProcessed}
            />

            <div className='div-home-main-column'>
                {loading && <div className='loading-spinner'>Loading...</div>}

                <TopFileRow
                    onFileSelect={handleFileSelect}
                    selectedFilePath={selectedFilePath}
                    fileData={isSearching ? filteredFileData : fileData}
                    searchQuery={currentSearchQuery}
                />

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
                            currentSearchQuery,
                            contentSuggestions,
                            informationValidity,
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
                            selectedPageNumber,
                            currentSearchQuery,
                            contentSuggestions,
                            informationValidity,
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default App
