import {app, BrowserWindow, dialog, ipcMain, shell} from 'electron';
import {getTextExtractor} from 'office-text-extractor';
import * as path from 'path';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import * as fs from 'fs';
import * as http from "http";
import express from "express";
import { exec } from 'child_process';

let mainWindow;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const localDataPath = path.join(__dirname, 'localData.json');

const appExpress = express();
const server = http.createServer(appExpress);

appExpress.use('/tempfiles', express.static(path.join(__dirname, 'tempfiles')));
console.log("serving files at location: ", path.join(__dirname, 'tempfiles'));

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

    server.listen(3001, () => {
        console.log('Local file server running on http://localhost:3001');
    });

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

    ipcMain.handle('open-file', async (event, filePath) => {
        try {
            await shell.openPath(filePath);
            return { success: true };
        } catch (error) {
            console.error('Error opening file:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('show-file-location', async (event, filePath) => {
        try {
            shell.showItemInFolder(filePath);
            return { success: true };
        } catch (error) {
            console.error('Error showing file location:', error);
            return { success: false, error: error.message };
        }
    });


    ipcMain.handle('convert-pptx-to-pdf', async (event, pptxPath) => {
        const outputDir = path.join(__dirname, 'tempfiles');
        const scriptPath = path.join(__dirname, '/script/pptx_converter.ps1');

        return new Promise((resolve, reject) => {
            exec(
                `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -pptxPath "${pptxPath}" -outputDir "${outputDir}"`,
                (error, stdout, stderr) => {
                if (error) {
                    console.error(`Conversion error: ${stderr}`);
                    reject({success: false, error: stderr});
                } else {
                    const pdfFileName = path.basename(pptxPath, '.pptx') + '.pdf';
                    const pdfPath = path.join(outputDir, pdfFileName);
                    resolve({success: true, pdfPath});
                }
            });
        });
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
