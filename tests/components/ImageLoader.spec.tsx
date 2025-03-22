import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageLoader from '../../src/components/ImageLoader';

// Mock the window.electronAPI
window.electronAPI = {
  selectImage: jest.fn(),
  loadImage: jest.fn(),
};

describe('ImageLoader Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should render the initial state correctly', () => {
    // Arrange & Act
    render(<ImageLoader />);

    // Assert
    expect(screen.getByText('Image Loader')).toBeInTheDocument();
    expect(
      screen.getByText('Load images from your drive:')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Select Image' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'No image loaded. Click the button above to select an image.'
      )
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

    // Assert - button should be in loading state
    expect(
      screen.getByRole('button', { name: 'Loading...' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();

    // Resolve the promise to complete the test
    resolveSelectImage!({
      success: false,
      error: 'Cancelled',
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Select Image' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });
});
