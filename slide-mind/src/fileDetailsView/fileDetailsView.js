// src/components/FileDetails.js
import React, {useEffect, useState} from 'react';
import Keyword from '../components/keyword/keyword.js';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

function FileDetails({ file }) {

    if (!file) {
        return <p style={{ fontStyle: 'italic' }}>No file selected yet</p>;
    }

    // Prepare docs array with properly formatted `selectedFilePath`
    const formattedFilePath = file.selectedFilePath
        ? `file://${encodeURI(file.selectedFilePath.replace(/\\/g, '/'))}`
        : null;
    console.log('formattedFilePath:', formattedFilePath)
    const docs = formattedFilePath ? [{ uri: formattedFilePath, fileType: 'pptx' }] : [];

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

            {/* DocViewer component to display the PowerPoint file content */}
            {formattedFilePath && (
                <div className="doc-viewer-container">
                    <DocViewer
                        documents={docs}
                        pluginRenderers={DocViewerRenderers}
                        config={{
                            header: {
                                disableFileName: true,
                                disableHeader: true,
                            },
                        }}
                    />
                </div>
            )}

            <button onClick={handleOpenFile} className="open-file-button">
                Open File
            </button>

            <button onClick={handleShowFileLocation} className="show-file-location-button">
                Show File Location
            </button>
        </div>
    );
}

export default FileDetails;
