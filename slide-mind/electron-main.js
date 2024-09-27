const { app, BrowserWindow, ipcMain } = await import('electron');
import path from 'path';
import 'electron-is-dev';
import isDev from "electron-is-dev";
import JSZip from 'jszip';
import { parseStringPromise } from 'xml2js';
import fs from 'fs';


let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    const startURL = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.handle('extract-pptx-text', async (event, filePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const zip = new JSZip();
        const pptx = await zip.loadAsync(fileBuffer);

        const slideFiles = Object.keys(pptx.files).filter((filename) =>
            filename.includes('ppt/slides/slide')
        );

        let allText = '';
        for (const slideFile of slideFiles) {
            const slideContent = await pptx.files[slideFile].async('string');
            const slideText = await extractTextFromSlide(slideContent); // Use your XML extraction function
            allText += slideText + '\n';
        }

        return allText;
    } catch (error) {
        console.error('Error extracting PPTX:', error);
        throw error;
    }
});

async function extractTextFromSlide(xmlContent) {
    let textContent = '';
    try {
        const xml = await parseStringPromise(xmlContent);
        const texts = xml['p:sld']['p:cSld'][0]['p:spTree'][0]['p:sp'];
        texts.forEach((textBlock) => {
            const paragraphs = textBlock['p:txBody'][0]['a:p'];
            paragraphs.forEach((para) => {
                const texts = para['a:r']?.map((r) => r['a:t'][0]).join(' ');
                if (texts) textContent += texts + '\n';
            });
        });
    } catch (error) {
        console.error('Error parsing XML:', error);
    }
    return textContent;
}
