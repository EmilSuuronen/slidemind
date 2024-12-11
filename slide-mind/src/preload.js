const { contextBridge, ipcRenderer } = require ('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    convertPptxToPdf: (pptxPath) => ipcRenderer.invoke('convert-pptx-to-pdf', pptxPath),
    extractText: (filePath) => ipcRenderer.invoke('extract-text', filePath),
    openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
    loadFileData: (fileName) => ipcRenderer.invoke('load-file-data', fileName),
    checkFileExists: (filePath) => ipcRenderer.invoke('check-file-exists', filePath),
    saveNewFile: (fileObject) => ipcRenderer.invoke('save-new-file', fileObject),
    openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
    showFileLocation: (filePath) => ipcRenderer.invoke('show-file-location', filePath),
    minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
    closeWindow: () => ipcRenderer.invoke('window:close'),
    toggleFullscreen: () => ipcRenderer.invoke('window:toggle-fullscreen'),
});
