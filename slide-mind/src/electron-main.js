import {app, BrowserWindow, ipcMain, dialog} from 'electron';
import {getTextExtractor} from 'office-text-extractor';
import * as path from "path";
import {dirname} from "path";
import {fileURLToPath} from 'url';

let mainWindow;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('extract-text', async (event, filePath) => {
        try {
            if (!filePath) {
                throw new Error('File path is undefined');
            }
            const extractor = getTextExtractor();
            // Use the path as input to extract text
            return await extractor.extractText({input: filePath, type: 'file'});
        } catch (error) {
            console.error('Error extracting text:', error);
            throw error;
        }
    });

    ipcMain.handle('dialog:openFile', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'PowerPoint Files', extensions: ['pptx'] }]
        });

        if (canceled) {
            return null;
        } else {
            return filePaths[0]; // Return the selected file path
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
