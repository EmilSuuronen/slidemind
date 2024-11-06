// src/fileRow/TopFileRow.js
import "./topFileRowStyles.css";
import {Document, Page, pdfjs} from "react-pdf/dist/esm/index.js";
import React, { useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

function TopFileRow({onFileSelect, selectedFilePath, fileData, filePdfPath}) {

    const truncateFileName = (fileName = "", maxLength = 20) => {
        return fileName.length > maxLength ? fileName.slice(0, maxLength) + "..." : fileName;
    };

    console.log("filedata topfilerow: ", fileData)

    return (
        <div className="topFileRow">
            {fileData.length === 0 ? (
                <i>No files</i>
            ) : (
                fileData.map((file, index) => (
                    <div
                        key={index}
                        className={`fileRowItem ${file.filePath === selectedFilePath ? "selected" : ""}`}
                        onClick={() => onFileSelect(file)}
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
    );
}

export default TopFileRow;
