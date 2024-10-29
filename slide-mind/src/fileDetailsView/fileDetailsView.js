// src/components/FileDetails.js
import React from 'react';
import Keyword from '../components/keyword/keyword.js';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

function FileDetails({ file }) {
    if (!file) {
        return <p style={{ fontStyle: 'italic' }}>No file selected yet</p>;
    }

    // Prepare docs array with properly formatted `selectedFilePath`
    const formattedFilePath = file.selectedFilePath
        ? `file://${file.selectedFilePath.replace(/\\/g, '/')}`
        : null;
    const docs = formattedFilePath ? [{ uri: formattedFilePath }] : [];

    console.log("Formatted File Path:", docs);

    return (
        <div>
            <h2>Description</h2>
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
        </div>
    );
}

export default FileDetails;
