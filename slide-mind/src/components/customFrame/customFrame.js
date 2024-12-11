import React from 'react';
import './CustomFrame.css'; // Add styles for customization

const CustomFrame = ({ frameColor = '#333' }) => {
    const handleMinimize = () => {
        window.electronAPI.minimizeWindow();
    };

    const handleClose = () => {
        window.electronAPI.closeWindow();
    };

    const handleToggleFullscreen = () => {
        window.electronAPI.toggleFullscreen();
    };



    return (
        <div className="custom-frame" style={{ backgroundColor: frameColor }}>
            <div className="title-bar">SlideMind</div>
            <div className="window-controls">
                <button className="control-button" onClick={handleMinimize}>
                    _
                </button>
                <button className="control-button fullscreen" onClick={handleToggleFullscreen}>
                    ⛶
                </button>
                <button className="control-button close" onClick={handleClose}>
                    ✕
                </button>
            </div>
        </div>
    );
};

export default CustomFrame;
