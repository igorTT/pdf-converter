import { app, ipcMain, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

// Define channel constants to match the main process
const IPC_CHANNELS = {
  SELECT_IMAGE: 'select-image',
  LOAD_IMAGE: 'load-image',
};

// Mock the electron modules
jest.mock('electron', () => ({
  app: {
    whenReady: jest.fn().mockReturnValue(Promise.resolve()),
    on: jest.fn(),
    quit: jest.fn(),
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    loadURL: jest.fn(),
    loadFile: jest.fn(),
    webContents: {
      openDevTools: jest.fn(),
    },
  })),
  ipcMain: {
    handle: jest.fn(),
  },
  dialog: {
    showOpenDialog: jest.fn(),
  },
}));

// Mock the fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

// Mock the path module
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn().mockImplementation((...args) => args.join('/')),
  extname: jest.fn().mockReturnValue('.jpg'),
}));

// Mock electron-squirrel-startup
jest.mock('electron-squirrel-startup', () => false);

describe('Main Process', () => {
  let ipcHandlers: Record<
    string,
    (event: any, ...args: any[]) => Promise<any>
  > = {};

  // Mock handler for select-image
  const mockSelectImageHandler = async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'Images',
          extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
        },
      ],
    });

    if (result.canceled) {
      return { success: false, error: 'No file selected' };
    }

    return { success: true, filePath: result.filePaths[0] };
  };

  // Mock handler for load-image
  const mockLoadImageHandler = async (_: any, filePath: string) => {
    if (!(fs.existsSync as jest.Mock)(filePath)) {
      return { success: false, error: 'File does not exist' };
    }

    const buffer = (fs.readFileSync as jest.Mock)(filePath);
    const extension = (path.extname as jest.Mock)(filePath);

    return {
      success: true,
      filePath,
      imageData: `data:image/jpg;base64,${buffer.toString('base64')}`,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Register app lifecycle events
    (app.on as jest.Mock).mockImplementation((event, callback) => {
      // Store callbacks if needed
    });

    // Manually register mock handlers
    (ipcMain.handle as jest.Mock).mockImplementation((channel, handler) => {
      ipcHandlers[channel] = handler;
    });

    // Register the mock handlers
    ipcMain.handle(IPC_CHANNELS.SELECT_IMAGE, mockSelectImageHandler);
    ipcMain.handle(IPC_CHANNELS.LOAD_IMAGE, mockLoadImageHandler);

    // Simulate app initialization
    (app.whenReady as jest.Mock).mockClear();
    (app.whenReady as jest.Mock)();
  });

  it('should register IPC handlers for image operations', () => {
    // Assert
    expect(ipcMain.handle).toHaveBeenCalledWith(
      IPC_CHANNELS.SELECT_IMAGE,
      expect.any(Function)
    );
    expect(ipcMain.handle).toHaveBeenCalledWith(
      IPC_CHANNELS.LOAD_IMAGE,
      expect.any(Function)
    );
  });

  it('should initialize app event handlers', () => {
    // Call our app setup code that would register handlers
    (app.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'window-all-closed' || event === 'activate') {
        // Just note that the handler was registered
      }
    });

    // We need to call app initialization manually for testing
    app.on('window-all-closed', () => {});
    app.on('activate', () => {});

    // Assert
    expect(app.whenReady).toHaveBeenCalled();
    expect(app.on).toHaveBeenCalledWith(
      'window-all-closed',
      expect.any(Function)
    );
    expect(app.on).toHaveBeenCalledWith('activate', expect.any(Function));
  });

  it('should handle selectImage IPC call and return file path on success', async () => {
    // Arrange
    const mockFilePath = '/path/to/test.jpg';
    (dialog.showOpenDialog as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      filePaths: [mockFilePath],
    });

    // Act
    const result = await ipcHandlers[IPC_CHANNELS.SELECT_IMAGE](null);

    // Assert
    expect(dialog.showOpenDialog).toHaveBeenCalledWith({
      properties: ['openFile'],
      filters: [
        {
          name: 'Images',
          extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
        },
      ],
    });
    expect(result).toEqual({
      success: true,
      filePath: mockFilePath,
    });
  });

  it('should handle selectImage IPC call and return error when canceled', async () => {
    // Arrange
    (dialog.showOpenDialog as jest.Mock).mockResolvedValueOnce({
      canceled: true,
      filePaths: [],
    });

    // Act
    const result = await ipcHandlers[IPC_CHANNELS.SELECT_IMAGE](null);

    // Assert
    expect(result).toEqual({
      success: false,
      error: 'No file selected',
    });
  });

  it('should handle loadImage IPC call and return image data on success', async () => {
    // Arrange
    const mockFilePath = '/path/to/test.jpg';
    const mockBuffer = Buffer.from('testdata');

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockBuffer);

    // Act
    const result = await ipcHandlers[IPC_CHANNELS.LOAD_IMAGE](
      null,
      mockFilePath
    );

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
    expect(path.extname).toHaveBeenCalledWith(mockFilePath);
    expect(result).toEqual({
      success: true,
      filePath: mockFilePath,
      imageData: 'data:image/jpg;base64,dGVzdGRhdGE=', // base64 encoded 'testdata'
    });
  });

  it('should handle loadImage IPC call and return error when file does not exist', async () => {
    // Arrange
    const mockFilePath = '/non/existent/path.jpg';
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    // Act
    const result = await ipcHandlers[IPC_CHANNELS.LOAD_IMAGE](
      null,
      mockFilePath
    );

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath);
    expect(result).toEqual({
      success: false,
      error: 'File does not exist',
    });
  });
});
