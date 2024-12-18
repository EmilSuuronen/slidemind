import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import Keyword from '../../components/keyword/keyword.js'
import './fileDetailsViewStyles.css'

const __dirname = window.location.pathname.replace(/\/[^/]*$/, '');

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`
//pdfjs.GlobalWorkerOptions.workerSrc = `file://${__dirname}/static/js/pdf.worker.min.mjs`

function FileDetails({ file }) {
	const [numPages, setNumPages] = useState(null)

	if (!file) {
		return <p style={{ fontStyle: 'italic' }}>No file selected yet</p>
	}

	const handleOpenFile = () => {
		if (file.selectedFilePath) {
			window.electronAPI.openFile(file.selectedFilePath)
		}
	}

	const handleShowFileLocation = () => {
		if (file.selectedFilePath) {
			window.electronAPI.showFileLocation(file.selectedFilePath)
		}
	}

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages)
	}

	console.log(file)

	return (
		<div className='fileDetailsView-main-container'>
			{/*Main divider for info column*/}
			<div className='file-detail-info-column'>
				<div className="div-info-background-box-title">
					<h2>{file.selectedFileName}</h2>
					{file.keywords && file.keywords.length > 0 ? (
						<Keyword keywords={file.keywords} />
					) : (
						<p style={{ fontStyle: 'italic' }}>
							No keywords to display
						</p>
					)}
				</div>
				<div className="div-info-background-box">
					<h3>Description</h3>
					<p>{file.description || <i>No description available</i>}</p>
				</div>

				<div className="div-info-background-box">
					<h3>Content suggestions</h3>
					{file.contentSuggestions ? (
						<p>{file.contentSuggestions}</p>
					) : (
						<p style={{ fontStyle: 'italic' }}>
							Information up to date
						</p>
					)}
				</div>

				<div className="div-info-background-box">
					<h3>Information validity</h3>
					{file.informationValidity.length > 0 ? (
						<p>{file.informationValidity}</p>
					) : (
						<p style={{ fontStyle: 'italic' }}>
							Information up to date
						</p>
					)}
				</div>


				<div className="div-info-background-box">
					<h3>Sources</h3>

					{file.links && file.links.length > 0 ? (
						<p>{file.links}</p>
					) : (
						<p style={{ fontStyle: 'italic' }}>
							No sources in material
						</p>
					)}
				</div>

			</div>

			{/*Container for displaying the pdf preview. Conditional on whether single page or document selected*/}
			{file.filePdfPath && (
				<div className='pdf-document-container'>
					<div className='pdf-view-buttons-container'>
						<b>Preview</b>
						<button onClick={handleOpenFile} className='pdf-button'>
							Open File
						</button>

						<button
							onClick={handleShowFileLocation}
							className='pdf-button'
						>
							Open Location
						</button>
					</div>

					{file.selectedPageNumber ? (
						<div>
							<div className='pdf-view-buttons-container'>
								<b>{file.selectedFileName}</b>
								<span>page: {file.selectedPageNumber}</span>
							</div>
							<Document
								file={`file://${file.filePdfPath}`}
								onLoadSuccess={onDocumentLoadSuccess}
								className='pdf-document'
								width='500'
							>
								<Page
									className='pdf-document-page'
									key={`page_${file.selectedPageNumber}`}
									pageNumber={file.selectedPageNumber}
									renderTextLayer={true}
									width='500'
								/>
							</Document>
						</div>
					) : (
						<Document
							file={`file://${file.filePdfPath}`}
							onLoadSuccess={onDocumentLoadSuccess}
							className='pdf-document'
						>
							{Array.from(new Array(numPages), (el, index) => (
								<Page
									className='pdf-document-page'
									key={`page_${index + 1}`}
									pageNumber={index + 1}
									width='500'
								/>
							))}
						</Document>
					)}
				</div>
			)}
		</div>
	)
}

export default FileDetails
