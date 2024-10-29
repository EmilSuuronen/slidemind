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


// Electron window creation
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false,
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

            // Extract text content from PowerPoint
            const textContent = await extractor.extractText({ input: filePath, type: 'file' });

            return { filePath, fileName, textContent }; // Return all necessary fields
        } catch (error) {
            console.error('Error extracting text:', error);
            throw error;
        }
    });

    ipcMain.handle('dialog:openFile', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'], // Allow multiple file selection
            filters: [{ name: 'PowerPoint Files', extensions: ['pptx'] }],
        });

        return canceled ? null : filePaths;
    });

    ipcMain.handle('load-file-content', async (event, filePath) => {
        try {
            const fileContent = fs.readFileSync(filePath); // Read file content as binary
            return { success: true, data: fileContent.toString('base64') }; // Send data as base64 to renderer
        } catch (error) {
            console.error('Error reading file:', error);
            return { success: false, error: error.message };
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
