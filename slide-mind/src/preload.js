const { contextBridge, ipcRenderer, shell } = require('electron');

console.log('preload.js loaded');

contextBridge.exposeInMainWorld('electronAPI', {
    extractText: (filePath) => ipcRenderer.invoke('extract-text', filePath),
    openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
    loadFileData: (fileName) => ipcRenderer.invoke('load-file-data', fileName),
    checkFileExists: (filePath) => ipcRenderer.invoke('check-file-exists', filePath),
    saveNewFile: (fileObject) => ipcRenderer.invoke('save-new-file', fileObject),
    openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
});
