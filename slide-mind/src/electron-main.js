import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { getTextExtractor } from 'office-text-extractor';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

let mainWindow;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const localDataPath = path.join(__dirname, 'localData.json');

// Load existing data safely from local storage
const loadFromLocalStorage = () => {
    if (fs.existsSync(localDataPath)) {
        try {
            const rawData = fs.readFileSync(localDataPath);
            return JSON.parse(rawData);
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            return [];
        }
    }
    return [];
};

// Save new data to local storage
const saveToLocalStorage = (data) => {
    try {
        const existingData = loadFromLocalStorage();
        existingData.push(data);
        fs.writeFileSync(localDataPath, JSON.stringify(existingData, null, 2));
        console.log('Data saved to local storage');
    } catch (error) {
        console.error('Error saving to local storage:', error);
    }
};

// Electron window creation
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
};

// Handle app lifecycle
app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('check-file-exists', (event, filePath) => {
        const existingData = loadFromLocalStorage();
        return existingData.some(file => file.filePath === filePath);
    });

    ipcMain.handle('save-new-file', (event, fileObject) => {
        const existingData = loadFromLocalStorage();
        existingData.push(fileObject);
        fs.writeFileSync(localDataPath, JSON.stringify(existingData, null, 2));
        console.log('New file data saved to local storage');
    });

    ipcMain.handle('load-file-data', async (event, fileName) => {
        try {
            const data = loadFromLocalStorage();
            const fileData = data.find(file => file.fileName === fileName);
            return fileData || null;
        } catch (error) {
            console.error('Error loading file data:', error);
            throw error;
        }
    });

    ipcMain.handle('extract-text', async (event, filePath) => {
        try {
            if (!filePath) throw new Error('File path is undefined');

            const fileName = path.basename(filePath);
            const extractor = getTextExtractor();
            const textContent = await extractor.extractText({ input: filePath, type: 'file' });

            const pptObject = { filePath, fileName, textContent, keywords: [], description: '' };
            saveToLocalStorage(pptObject);
            return textContent;
        } catch (error) {
            console.error('Error extracting text:', error);
            throw error;
        }
    });

    ipcMain.handle('dialog:openFile', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'PowerPoint Files', extensions: ['pptx'] }],
        });

        return canceled ? null : filePaths[0];
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
