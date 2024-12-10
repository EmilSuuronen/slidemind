// src/fileRow/TopFileRow.js
import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/index.js'
import slideFileData from '../../localData.json'
import './topFileRowStyles.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`

function TopFileRow({ onFileSelect, selectedFilePath, fileData, searchQuery }) {
	const truncateFileName = (fileName = '', maxLength = 20) => {
		return fileName.length > maxLength
			? fileName.slice(0, maxLength) + '...'
			: fileName
	}

	const doesSlideMatchSearch = (slide) => {
		return slide.textContent
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
	}

	// Flatten fileData to create an array of individual matching slides
	const matchingSlidesData = slideFileData.flatMap((file) => {
		if (file.slides && searchQuery) {
			// Filter slides that match the search query
			return file.slides.filter(doesSlideMatchSearch).map((slide) => ({
				...file,
				slideNumber: slide.slideNumber,
				slideContent: slide.textContent,
			}))
		}
		// If no search query, return the entire file as a single item
		return [{ ...file, slideNumber: 1 }]
	})

	return (
		<div className='top-file-row-main-container'>
			<div className='topFileRow'>
				<h3 className='top-file-row-file-container-title'>Documents</h3>
				<div className='top-file-row-file-container'>
					{fileData.length === 0 ? (
						<i>No files</i>
					) : (
						fileData.map((file, index) => (
							<div
								key={index}
								className={`fileRowItem ${
									file.filePath === selectedFilePath
										? 'selected'
										: ''
								}`}
								onClick={() => onFileSelect(file, false)}
							>
								<Document
									file={`file://${file.pdfPath}`}
									className='pdf-document'
								>
									<Page
										className='pdf-document-page-top-row'
										pageNumber={1}
										width='220'
									/>
								</Document>
								<span className='top-file-fileName'>
									{truncateFileName(file.fileName)}
								</span>
							</div>
						))
					)}
				</div>

				<h3 className='top-file-row-file-container-title'>Slides</h3>
				<div className='top-file-row-file-container'>
					{matchingSlidesData.length === 0 ? (
						<i>No files</i>
					) : (
						matchingSlidesData.map((file, index) => (
							<div
								key={index}
								className={`fileRowItem`}
								id={`singleFileRowItem${index}`}
								onClick={() =>
									onFileSelect(
										file,
										true,
										file.slideNumber,
										index
									)
								}
							>
								<div className='div-page-number'>
									Page {file.slideNumber}
								</div>
								<Document
									file={`file://${file.pdfPath}`}
									className='pdf-document'
								>
									<Page
										className='pdf-document-page-top-row'
										pageNumber={file.slideNumber} // Display only the matched slide's page
										width='220'
									/>
								</Document>
								<span className='top-file-fileName'>
									{truncateFileName(file.fileName)} -{' '}
								</span>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	)
}

export default TopFileRow
