import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import ImageLoader from '../../src/components/ImageLoader';

// Add TypeScript declaration for the electronAPI on window
declare global {
  interface Window {
    electronAPI: {
      selectImage: jest.Mock;
      loadImage: jest.Mock;
    };
  }
}

// Mock the window.electronAPI
window.electronAPI = {
  selectImage: jest.fn(),
  loadImage: jest.fn(),
};

// Mock setTimeout to control timing
jest.useFakeTimers();

describe('ImageLoader Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Reset any component state between tests
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it('should render the initial state correctly', () => {
    // Arrange & Act
    render(<ImageLoader />);

    // Assert
    expect(screen.getByText('Image Loader')).toBeInTheDocument();
    expect(
      screen.getByText('Load and preview images from your drive')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Select Image' })
    ).toBeInTheDocument();
    expect(screen.getByText('No image loaded')).toBeInTheDocument();
    expect(
      screen.getByText('Click the button below to select an image')
    ).toBeInTheDocument();
  });

  it('should call selectImage API when button is clicked', async () => {
    // Arrange
    (window.electronAPI.selectImage as jest.Mock).mockResolvedValue({
      success: false,
      error: 'User cancelled',
    });

    render(<ImageLoader />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Select Image' }));

    // Assert
    await waitFor(() => {
      expect(window.electronAPI.selectImage).toHaveBeenCalledTimes(1);
    });
  });

  it('should display an error message when image selection fails', async () => {
    // Arrange
    (window.electronAPI.selectImage as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Failed to select image',
    });

    render(<ImageLoader />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Select Image' }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Failed to select image')).toBeInTheDocument();
    });
  });

  it('should load and display an image when selection is successful', async () => {
    // Arrange
    const mockFilePath = '/path/to/image.jpg';
    const mockImageData = 'data:image/jpg;base64,mockdata';

    (window.electronAPI.selectImage as jest.Mock).mockResolvedValue({
      success: true,
      filePath: mockFilePath,
    });

    (window.electronAPI.loadImage as jest.Mock).mockResolvedValue({
      success: true,
      filePath: mockFilePath,
      imageData: mockImageData,
    });

    render(<ImageLoader />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Select Image' }));

    // Assert
    await waitFor(() => {
      expect(window.electronAPI.selectImage).toHaveBeenCalledTimes(1);
      expect(window.electronAPI.loadImage).toHaveBeenCalledWith(mockFilePath);

      const imageElement = screen.getByAltText(/Loaded image:/);
      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute('src', mockImageData);

      expect(screen.getByText(/File: image.jpg/)).toBeInTheDocument();
    });
  });

  it('should handle image loading failures', async () => {
    // Arrange
    const mockFilePath = '/path/to/image.jpg';

    (window.electronAPI.selectImage as jest.Mock).mockResolvedValue({
      success: true,
      filePath: mockFilePath,
    });

    (window.electronAPI.loadImage as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Failed to load image data',
    });

    render(<ImageLoader />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Select Image' }));

    // Assert
    await waitFor(() => {
      expect(window.electronAPI.selectImage).toHaveBeenCalledTimes(1);
      expect(window.electronAPI.loadImage).toHaveBeenCalledWith(mockFilePath);
      expect(screen.getByText('Failed to load image data')).toBeInTheDocument();
    });
  });

  it('should show loading state while processing image', async () => {
    // Arrange
    // Use a promise that we can resolve manually to control the timing
    let resolveSelectImage: (value: any) => void;
    const selectImagePromise = new Promise((resolve) => {
      resolveSelectImage = resolve;
    });

    (window.electronAPI.selectImage as jest.Mock).mockReturnValue(
      selectImagePromise
    );

    render(<ImageLoader />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Select Image' }));

    // Assert - check for loading indicator
    await waitFor(() => {
      expect(screen.getByText('Loading image...')).toBeInTheDocument();
    });

    // Resolve the promise to complete the test with an error for a cleaner test resolution
    resolveSelectImage!({
      success: false,
      error: 'Cancelled',
    });

    // Wait for the loading state to clear and error to show
    await waitFor(() => {
      expect(screen.getByText('Cancelled')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Try Again' })
      ).toBeInTheDocument();
    });
  });

  it('should reset image and clear errors when Clear button is clicked', async () => {
    // Arrange - First load an image
    const mockFilePath = '/path/to/image.jpg';
    const mockImageData = 'data:image/jpg;base64,mockdata';

    (window.electronAPI.selectImage as jest.Mock).mockResolvedValue({
      success: true,
      filePath: mockFilePath,
    });

    (window.electronAPI.loadImage as jest.Mock).mockResolvedValue({
      success: true,
      filePath: mockFilePath,
      imageData: mockImageData,
    });

    render(<ImageLoader />);

    // Load the image
    fireEvent.click(screen.getByRole('button', { name: 'Select Image' }));

    // Wait for image to load and handle the setTimeout
    await waitFor(() => {
      expect(screen.getByAltText(/Loaded image:/)).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Act - Click the Clear button
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    // Assert - Image should be removed
    expect(screen.queryByAltText(/Loaded image:/)).not.toBeInTheDocument();
    expect(screen.getByText('No image loaded')).toBeInTheDocument();
  });

  it('should complete loading process with setTimeout after successful image load', async () => {
    // Arrange
    const mockFilePath = '/path/to/image.jpg';
    const mockImageData = 'data:image/jpg;base64,mockdata';

    (window.electronAPI.selectImage as jest.Mock).mockResolvedValue({
      success: true,
      filePath: mockFilePath,
    });

    (window.electronAPI.loadImage as jest.Mock).mockResolvedValue({
      success: true,
      filePath: mockFilePath,
      imageData: mockImageData,
    });

    render(<ImageLoader />);

    // Act - Start loading
    fireEvent.click(screen.getByRole('button', { name: 'Select Image' }));

    // Wait for progress to appear
    await waitFor(() => {
      expect(screen.getByText('Loading image...')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    // Advance timers to trigger setTimeout callback
    act(() => {
      jest.advanceTimersByTime(800);
    });

    // Assert - Loading indicators should be gone
    expect(screen.queryByText('Loading image...')).not.toBeInTheDocument();
    expect(screen.queryByText('100%')).not.toBeInTheDocument();

    // And image should be visible
    expect(screen.getByAltText(/Loaded image:/)).toBeInTheDocument();
  });

  it('should clear error message when Try Again button is clicked', async () => {
    // Arrange - First trigger an error
    (window.electronAPI.selectImage as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Failed to select image',
    });

    render(<ImageLoader />);

    // Trigger error
    fireEvent.click(screen.getByRole('button', { name: 'Select Image' }));

    // Wait for error to appear and handle the setTimeout
    await waitFor(() => {
      expect(screen.getByText('Failed to select image')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Try Again' })
      ).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Act - Click Try Again
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));

    // Wait for UI to update
    await waitFor(() => {
      // Assert - Error should be dismissed
      expect(
        screen.queryByText('Failed to select image')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Try Again' })
      ).not.toBeInTheDocument();

      // Back to initial state
      expect(screen.getByText('No image loaded')).toBeInTheDocument();
    });
  });
});
