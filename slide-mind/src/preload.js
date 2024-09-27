const { contextBridge, ipcRenderer } = require('electron');

console.log('preload.js loaded')

contextBridge.exposeInMainWorld('electronAPI', {
    extractText: (filePath) => ipcRenderer.invoke('extract-text', filePath)
});

