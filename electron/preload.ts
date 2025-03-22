import { contextBridge, ipcRenderer } from 'electron';

// Typescript interface for the exposed API
interface ElectronAPI {
  selectImage: () => Promise<{
    success: boolean;
    filePath?: string;
    error?: string;
  }>;
  loadImage: (filePath: string) => Promise<{
    success: boolean;
    filePath?: string;
    imageData?: string;
    error?: string;
  }>;
}

// Constants for IPC channels
const IPCChannels = {
  SELECT_IMAGE: 'select-image',
  LOAD_IMAGE: 'load-image',
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  selectImage: (): Promise<{
    success: boolean;
    filePath?: string;
    error?: string;
  }> => {
    return ipcRenderer.invoke(IPCChannels.SELECT_IMAGE);
  },

  loadImage: (
    filePath: string
  ): Promise<{
    success: boolean;
    filePath?: string;
    imageData?: string;
    error?: string;
  }> => {
    return ipcRenderer.invoke(IPCChannels.LOAD_IMAGE, filePath);
  },
} as ElectronAPI);

// Make the ElectronAPI available to TypeScript
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
