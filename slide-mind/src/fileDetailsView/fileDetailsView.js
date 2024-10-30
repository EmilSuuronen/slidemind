// src/components/FileDetails.js
import React, {useEffect, useState} from 'react';
import Keyword from '../components/keyword/keyword.js';

function FileDetails({ file }) {

    const [pdfPath, setPdfPath] = useState(null);

    if (!file) {
        return <p style={{ fontStyle: 'italic' }}>No file selected yet</p>;
    }

    // Prepare docs array with properly formatted `selectedFilePath`
    const formattedFilePath = file.selectedFilePath
        ? `file://${encodeURI(file.selectedFilePath.replace(/\\/g, '/'))}`
        : null;
    console.log('filepath:', file.selectedFilePath);

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

    const handleConvertToPdf = async () => {
        try {
            const result = await window.electronAPI.convertPptxToPdf(file.selectedFilePath);
            if (result.success) {
                setPdfPath(result.pdfPath);
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error('Conversion error:', error);
        }
    };

    return (
        <div>
            <h2>{file.selectedFileName}</h2>
            <h3>Description</h3>
            <p>{file.description || <i>No description available</i>}</p>

            {file.keywords && file.keywords.length > 0 ? (
                <Keyword keywords={file.keywords} />
            ) : (
                <p style={{ fontStyle: 'italic' }}>No keywords to display</p>
            )}

            {file.links && file.links.length > 0 ? (
                <Keyword keywords={file.links} />
            ) : (
                <p style={{ fontStyle: 'italic' }}>No sources in material</p>
            )}

            <button onClick={handleOpenFile} className="open-file-button">
                Open File
            </button>

            <button onClick={handleShowFileLocation} className="show-file-location-button">
                Show File Location
            </button>

            <button onClick={handleConvertToPdf}>Convert to PDF</button>

            {pdfPath && (
                <iframe src={`file://${pdfPath}`} width="100%" height="500px" />
            )}
        </div>
    );
}

export default FileDetails;
