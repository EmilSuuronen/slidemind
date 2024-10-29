// src/fileRow/TopFileRow.js
import React, {useState} from "react";
import "./topFileRowStyles.css";

function TopFileRow({ onFileSelect, selectedFilePath, fileData }) {
    const truncateFileName = (fileName = "", maxLength = 20) => {
        return fileName.length > maxLength ? fileName.slice(0, maxLength) + "..." : fileName;
    };

    useState();

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
                        <span className="fileName">{truncateFileName(file.fileName)}</span>
                    </div>
                ))
            )}
        </div>
    );
}

export default TopFileRow;
