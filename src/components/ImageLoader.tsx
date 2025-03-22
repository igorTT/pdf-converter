import React, { useState } from 'react';

interface ImageInfo {
  filePath: string;
  fileName: string;
  imageData: string;
}

const ImageLoader: React.FC = () => {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectImage = async () => {
    try {
      setLoading(true);
      setError(null);

      // Select an image file using the Electron API
      const selectResult = await window.electronAPI.selectImage();

      if (!selectResult.success || !selectResult.filePath) {
        throw new Error(selectResult.error || 'Failed to select image');
      }

      // Load the image data
      const loadResult = await window.electronAPI.loadImage(
        selectResult.filePath
      );

      if (!loadResult.success || !loadResult.imageData) {
        throw new Error(loadResult.error || 'Failed to load image data');
      }

      // Get the file name from the path
      const filePath = loadResult.filePath as string;
      const fileName = filePath.split(/[\\/]/).pop() || 'unknown';

      // Set the image information
      setImage({
        filePath,
        fileName,
        imageData: loadResult.imageData,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setImage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="image-section">
      <h2>Image Loader</h2>
      <p>Load images from your drive:</p>
      <button
        className="primary-button"
        onClick={handleSelectImage}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Select Image'}
      </button>

      <div className="image-container">
        {error && <p className="error-message">{error}</p>}

        {!image && !error && !loading && (
          <p id="image-placeholder">
            No image loaded. Click the button above to select an image.
          </p>
        )}

        {image && (
          <>
            <img
              src={image.imageData}
              alt={`Loaded image: ${image.fileName}`}
              className="loaded-image"
            />
            <p className="image-info">File: {image.fileName}</p>
          </>
        )}
      </div>
    </section>
  );
};

export default ImageLoader;
