import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Keyword from '../../components/keyword/keyword.js';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import './fileDetailsViewStyles.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

function FileDetails({ file }) {
    const [numPages, setNumPages] = useState(null);

    if (!file) {
        return <p style={{ fontStyle: 'italic' }}>No file selected yet</p>;
    }

    const handleOpenFile = () => {
        if (file.selectedFilePath) {
            window.electronAPI.openFile(file.selectedFilePath);
        }
    };

    const handleShowFileLocation = () => {
        if (file.selectedFilePath) {
            window.electronAPI.showFileLocation(file.selectedFilePath);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="fileDetailsView-main-container">
            <div className="file-detail-info-column">
                <h2>{file.selectedFileName}</h2>
                <h3>Description</h3>
                <p>{file.description || <i>No description available</i>}</p>

                {file.keywords && file.keywords.length > 0 ? (
                    <Keyword keywords={file.keywords} />
                ) : (
                    <p style={{ fontStyle: 'italic' }}>No keywords to display</p>
                )}

                <h3>Sources</h3>

                {file.links && file.links.length > 0 ? (
                    <Keyword keywords={file.links} />
                ) : (
                    <p style={{ fontStyle: 'italic' }}>No sources in material</p>
                )}
            </div>

            {file.filePdfPath && (
                <div className="pdf-document-container">
                    <div className="pdf-view-buttons-container">
                        <b>Preview</b>
                        <button onClick={handleOpenFile} className="open-file-button">
                            Open File
                        </button>

                        <button onClick={handleShowFileLocation} className="show-file-location-button">
                            Open Location
                        </button>
                    </div>

                    <Document
                        file={`file://${file.filePdfPath}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="pdf-document"
                    >
                        {Array.from(
                            new Array(numPages),
                            (el, index) => (
                                <Page
                                    className="pdf-document-page"
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    width="450"
                                />
                            )
                        )}
                    </Document>
                </div>
            )}
        </div>
    );
}

export default FileDetails;
