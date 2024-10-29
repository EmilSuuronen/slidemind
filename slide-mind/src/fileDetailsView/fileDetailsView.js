// src/components/FileDetails.js
import React from 'react';
import Keyword from '../components/keyword/keyword.js';

function FileDetails({ file }) {
    if (!file) {
        return <p style={{ fontStyle: 'italic' }}>No file selected yet</p>;
    }

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
        </div>
    );
}

export default FileDetails;
