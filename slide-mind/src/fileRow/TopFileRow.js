import React from "react";
import "./topFileRowStyles.css";
import fileData from "../localData.json";

function TopFileRow() {

    const truncateFileName = (fileName = "", maxLength = 20) => {
        if (fileName && typeof fileName === "string" && fileName.length > maxLength) {
            return fileName.slice(0, maxLength) + "...";
        }
        return fileName;
    };

    return (
        <div className="topFileRow">
            {fileData.length === 0 ? (
                <i>No files</i>
            ) : (
                fileData.map((file, index) => (
                    <div key={index} className="fileRowItem">
                        <span className="fileName">{truncateFileName(file.fileName)}</span>
                    </div>
                ))
            )}
        </div>
    );
}

export default TopFileRow;
