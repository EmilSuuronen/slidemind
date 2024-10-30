// src/components/FileDetails.js
import React, { useState } from 'react';
import Keyword from '../components/keyword/keyword.js';

function FileDetails({ file }) {
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

    console.log("file ", file);

    console.log("pdf path: ", file.filePdfPath);

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

            {file.filePdfPath && (
                <iframe src={`file://${file.filePdfPath}`} width="100%" height="500px" />
            )}
        </div>
    );
}

export default FileDetails;
