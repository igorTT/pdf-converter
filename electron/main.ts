import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
try {
  if (require('electron-squirrel-startup')) {
    app.quit();
  }
} catch (error) {
  console.log(
    'Electron-squirrel-startup is not available, skipping Windows installer events'
  );
}

// Channel names for IPC communication
const IPCChannels = {
  SELECT_IMAGE: 'select-image',
  LOAD_IMAGE: 'load-image',
};

// Keep a global reference of the window object to avoid garbage collection
let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // In production load the built app, in development use the dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development mode
    mainWindow.webContents.openDevTools();
  } else {
    // Load the index.html from the dist folder
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers

// Handler for selecting an image file
ipcMain.handle(
  IPCChannels.SELECT_IMAGE,
  async (): Promise<{
    success: boolean;
    filePath?: string;
    error?: string;
  }> => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
          },
        ],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return {
          success: false,
          error: 'No file selected',
        };
      }

      const filePath = result.filePaths[0];
      return {
        success: true,
        filePath,
      };
    } catch (error) {
      console.error('Error selecting image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
);

// Handler for loading an image file
ipcMain.handle(
  IPCChannels.LOAD_IMAGE,
  async (
    _event,
    filePath: string
  ): Promise<{
    success: boolean;
    filePath?: string;
    imageData?: string;
    error?: string;
  }> => {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          error: 'File does not exist',
        };
      }

      // Read file as base64
      const imageBuffer = fs.readFileSync(filePath);
      const imageData = `data:image/${path
        .extname(filePath)
        .slice(1)};base64,${imageBuffer.toString('base64')}`;

      return {
        success: true,
        filePath,
        imageData,
      };
    } catch (error) {
      console.error('Error loading image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
);
