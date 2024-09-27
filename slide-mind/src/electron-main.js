import { app, BrowserWindow, ipcMain } from 'electron';
import { getTextExtractor } from 'office-text-extractor';
import * as path from "path";
let mainWindow;
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadURL('http://localhost:3000');
};

app.whenReady().then(() => {
    createWindow();

    const extractor = getTextExtractor();

    ipcMain.handle('extract-text', async (event, filePath) => {
        try {
            if (!filePath) {
                throw new Error('File path is undefined');
            }
            const extractor = getTextExtractor();
            // Use the path as input to extract text
            const text = await extractor.extractText({ input: filePath, type: 'file' });

            return text;
        } catch (error) {
            console.error('Error extracting text:', error);
            throw error;
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
