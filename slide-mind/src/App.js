import React, { useRef, useState } from 'react'
import './App.css'
import TopFileRow from './components/fileRow/TopFileRow.js'
import Topbar from './components/topbar/topbar.js'
import fileData from './localData.json'
import FileDetails from './views/fileDetailsView/fileDetailsView.js'

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
		setLinks(newFile.links)
		setFilePdfPath(newFile.pdfPath)
	}

	const handleFileSelect = (file, isSinglePage, pageNumber, index) => {
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
		setLinks(file.links)
		setFilePdfPath(file.pdfPath)
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
				)}
			</div>
		</div>
	)
}

export default App
