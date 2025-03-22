import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ImageIcon, UploadIcon } from 'lucide-react';

interface ImageInfo {
  filePath: string;
  fileName: string;
  imageData: string;
}

const ImageLoader: React.FC = () => {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleSelectImage = async () => {
    try {
      setLoading(true);
      setError(null);
      setProgress(10); // Start progress

      // Select an image file using the Electron API
      const selectResult = await window.electronAPI.selectImage();

      if (!selectResult.success || !selectResult.filePath) {
        throw new Error(selectResult.error || 'Failed to select image');
      }

      setProgress(50); // Update progress after selection

      // Load the image data
      const loadResult = await window.electronAPI.loadImage(
        selectResult.filePath
      );

      if (!loadResult.success || !loadResult.imageData) {
        throw new Error(loadResult.error || 'Failed to load image data');
      }

      setProgress(90); // Almost complete

      // Get the file name from the path
      const filePath = loadResult.filePath as string;
      const fileName = filePath.split(/[\\/]/).pop() || 'unknown';

      // Set the image information
      setImage({
        filePath,
        fileName,
        imageData: loadResult.imageData,
      });

      setProgress(100); // Complete
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setImage(null);
      setProgress(0); // Reset progress
    } finally {
      setTimeout(() => {
        setLoading(false);
        if (progress === 100) setProgress(0); // Reset progress only after successful completion
      }, 800); // Small delay to show 100% completion
    }
  };

  const handleReset = () => {
    setImage(null);
    setError(null);
    setProgress(0);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image Loader
        </CardTitle>
        <CardDescription>
          Load and preview images from your drive
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Loading image...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 w-full" />
          </div>
        )}

        <div className="image-preview-container rounded-md border border-border bg-background/50 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
          {error && (
            <div className="text-center p-4">
              <p className="text-destructive mb-2">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
              >
                Try Again
              </Button>
            </div>
          )}

          {!image && !error && !loading && (
            <div className="text-center p-6 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mb-2 mx-auto opacity-50" />
              <p>No image loaded</p>
              <p className="text-xs">
                Click the button below to select an image
              </p>
            </div>
          )}

          {loading && !image && (
            <Skeleton className="w-full h-[200px] rounded-md absolute inset-0" />
          )}

          {image && (
            <div className="w-full relative">
              <img
                src={image.imageData}
                alt={`Loaded image: ${image.fileName}`}
                className="max-w-full h-auto max-h-[300px] object-contain mx-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 text-xs">
                <p className="truncate">File: {image.fileName}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <Button
          onClick={handleSelectImage}
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Loading...
            </>
          ) : (
            <>
              <UploadIcon className="h-4 w-4 mr-2" />
              Select Image
            </>
          )}
        </Button>

        {image && (
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            Clear
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ImageLoader;
