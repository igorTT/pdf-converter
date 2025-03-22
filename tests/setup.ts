// Add Jest specific mocks and setup here
import '@testing-library/jest-dom';

// Mock CSS modules
jest.mock('*.module.css', () => ({}), { virtual: true });

// Mock the Electron API
Object.defineProperty(window, 'electron', {
  value: {
    contextBridge: {
      exposeInMainWorld: jest.fn(),
    },
    ipcRenderer: {
      invoke: jest.fn(),
    },
    getSystemInfo: jest.fn(),
  },
  writable: true,
});

// Define global types for TypeScript
declare global {
  interface Window {
    electron: {
      contextBridge?: {
        exposeInMainWorld: jest.MockedFunction<any>;
      };
      ipcRenderer?: {
        invoke: jest.MockedFunction<any>;
      };
      getSystemInfo?: jest.MockedFunction<any>;
      [key: string]: any;
    };
  }
}

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
