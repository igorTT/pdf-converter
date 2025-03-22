// Type declarations for the test environment

interface ElectronAPI {
  selectImage: jest.Mock;
  loadImage: jest.Mock;
}

interface Window {
  electronAPI: ElectronAPI;
}
