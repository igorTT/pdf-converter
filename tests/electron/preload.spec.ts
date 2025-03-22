import { contextBridge, ipcRenderer } from 'electron';

// Mock the electron modules
jest.mock('electron', () => ({
  contextBridge: {
    exposeInMainWorld: jest.fn(),
  },
  ipcRenderer: {
    invoke: jest.fn(),
  },
}));

describe('Preload Script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should expose the electronAPI to the renderer process', () => {
    // Arrange & Act
    // Re-import the module for each test to reset the state
    jest.isolateModules(() => {
      require('../../electron/preload');
    });

    // Assert
    expect(contextBridge.exposeInMainWorld).toHaveBeenCalledWith(
      'electronAPI',
      expect.objectContaining({
        selectImage: expect.any(Function),
        loadImage: expect.any(Function),
      })
    );
  });

  it('should call ipcRenderer.invoke with correct arguments when selectImage is called', () => {
    // Arrange
    let exposedApi: any;
    (contextBridge.exposeInMainWorld as jest.Mock).mockImplementation(
      (key, api) => {
        if (key === 'electronAPI') {
          exposedApi = api;
        }
      }
    );

    jest.isolateModules(() => {
      require('../../electron/preload');
    });

    // Act
    exposedApi.selectImage();

    // Assert
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('select-image');
  });

  it('should call ipcRenderer.invoke with correct arguments when loadImage is called', () => {
    // Arrange
    let exposedApi: any;
    (contextBridge.exposeInMainWorld as jest.Mock).mockImplementation(
      (key, api) => {
        if (key === 'electronAPI') {
          exposedApi = api;
        }
      }
    );

    jest.isolateModules(() => {
      require('../../electron/preload');
    });

    const testFilePath = '/path/to/image.jpg';

    // Act
    exposedApi.loadImage(testFilePath);

    // Assert
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('load-image', testFilePath);
  });

  // Edge case: Test error handling for selectImage
  it('should handle errors from ipcRenderer.invoke in selectImage', async () => {
    // Arrange
    let exposedApi: any;
    (contextBridge.exposeInMainWorld as jest.Mock).mockImplementation(
      (key, api) => {
        if (key === 'electronAPI') {
          exposedApi = api;
        }
      }
    );

    jest.isolateModules(() => {
      require('../../electron/preload');
    });

    // Mock ipcRenderer to throw an error
    const mockError = new Error('Test error');
    (ipcRenderer.invoke as jest.Mock).mockRejectedValueOnce(mockError);

    // Act & Assert - should not throw error outside
    await expect(exposedApi.selectImage()).rejects.toThrow('Test error');
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('select-image');
  });

  // Edge case: Test error handling for loadImage with invalid input
  it('should handle invalid file path in loadImage', async () => {
    // Arrange
    let exposedApi: any;
    (contextBridge.exposeInMainWorld as jest.Mock).mockImplementation(
      (key, api) => {
        if (key === 'electronAPI') {
          exposedApi = api;
        }
      }
    );

    jest.isolateModules(() => {
      require('../../electron/preload');
    });

    // Mock different types of invalid inputs
    const invalidInputs = [null, undefined, '', 123, {}, []];

    // Check each invalid input
    for (const invalidInput of invalidInputs) {
      // Reset the mock
      jest.clearAllMocks();

      // Act
      try {
        // @ts-ignore - intentionally passing invalid types for testing
        await exposedApi.loadImage(invalidInput);
      } catch (e) {
        // Expected to possibly throw, but we'll check ipcRenderer was still called
      }

      // Assert - it should still try to call the IPC, and main process would handle validation
      expect(ipcRenderer.invoke).toHaveBeenCalledWith(
        'load-image',
        invalidInput
      );
    }
  });

  // Edge case: Test handling of successful responses
  it('should pass through successful responses from main process', async () => {
    // Arrange
    let exposedApi: any;
    (contextBridge.exposeInMainWorld as jest.Mock).mockImplementation(
      (key, api) => {
        if (key === 'electronAPI') {
          exposedApi = api;
        }
      }
    );

    jest.isolateModules(() => {
      require('../../electron/preload');
    });

    const mockSuccessResponse = {
      success: true,
      filePath: '/path/to/image.jpg',
      imageData: 'base64-encoded-data',
    };

    (ipcRenderer.invoke as jest.Mock).mockResolvedValueOnce(
      mockSuccessResponse
    );

    // Act
    const result = await exposedApi.loadImage('/path/to/image.jpg');

    // Assert
    expect(result).toEqual(mockSuccessResponse);
    expect(ipcRenderer.invoke).toHaveBeenCalledWith(
      'load-image',
      '/path/to/image.jpg'
    );
  });
});
