// src/fileRow/TopFileRow.js
import "./topFileRowStyles.css";
import {Document, Page, pdfjs} from "react-pdf/dist/esm/index.js";
import React, {useState} from 'react';
import {IoIosArrowDropdown, IoIosArrowDropup} from "react-icons/io";
import slideFileData from '../../localData.json';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

function TopFileRow({onFileSelect, selectedFilePath, fileData, searchQuery}) {

    const [isTopRowExpanded, setIsTopRowExpanded] = useState(false)

    const truncateFileName = (fileName = "", maxLength = 20) => {
        return fileName.length > maxLength ? fileName.slice(0, maxLength) + "..." : fileName;
    };

    function handleTopRowExpandedClick() {
        if (isTopRowExpanded) {
            setIsTopRowExpanded(false)
        } else {
            setIsTopRowExpanded(true)
        }
    }

    const doesSlideMatchSearch = (slide) => {
        return slide.textContent.toLowerCase().includes(searchQuery.toLowerCase());
    };

    // Flatten fileData to create an array of individual matching slides
    const matchingSlidesData = slideFileData.flatMap((file) => {

        if (file.slides && searchQuery) {
            // Filter slides that match the search query
            return file.slides
                .filter(doesSlideMatchSearch)
                .map((slide) => ({
                    ...file,
                    slideNumber: slide.slideNumber,
                    slideContent: slide.textContent
                }));
        }
        // If no search query, return the entire file as a single item
        return [{...file, slideNumber: 1}];
    });

    return (
        <div className="top-file-row-main-container">
            <div className="topFileRow" id={"topRowExpanded" + isTopRowExpanded.toString()}>
                <h3 className="top-file-row-file-container-title">Documents</h3>
                <div className="top-file-row-file-container">
                    {fileData.length === 0 ? (
                        <i>No files</i>
                    ) : (
                        fileData.map((file, index) => (
                            <div
                                key={index}
                                className={`fileRowItem ${file.filePath === selectedFilePath ? "selected" : ""}`}
                                onClick={() => onFileSelect(file, false)}
                            >
                                <Document
                                    file={`file://${file.pdfPath}`}
                                    className="pdf-document"
                                >
                                    <Page
                                        className="pdf-document-page-top-row"
                                        pageNumber={1}
                                        width="100"
                                    />
                                </Document>
                                <span className="fileName">{truncateFileName(file.fileName)}</span>
                            </div>
                        ))
                    )}
                </div>

                <h3 className="top-file-row-file-container-title">Slides</h3>
                <div className="top-file-row-file-container">
                    {matchingSlidesData.length === 0 ? (
                        <i>No files</i>
                    ) : (
                        matchingSlidesData.map((file, index) => (
                            <div
                                key={index}
                                className={`fileRowItem ${file.filePath === selectedFilePath ? "selected" : ""}`}
                                onClick={() => onFileSelect(file, true, file.slideNumber)}
                            >
                                <Document
                                    file={`file://${file.pdfPath}`}
                                    className="pdf-document"
                                >
                                    <Page
                                        className="pdf-document-page-top-row"
                                        pageNumber={file.slideNumber} // Display only the matched slide's page
                                        width={100}
                                    />
                                </Document>
                                <span
                                    className="fileName">{truncateFileName(file.fileName)} - <div className="div-page-number">Page {file.slideNumber}</div></span>
                            </div>
                        ))
                    )}
                </div>

            </div>
            <div className="extend-top-row" onClick={handleTopRowExpandedClick}> {isTopRowExpanded ?
                <IoIosArrowDropup/> : <IoIosArrowDropdown/>} </div>
        </div>
    );
}

export default TopFileRow;
