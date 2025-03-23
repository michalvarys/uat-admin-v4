import { useState, useCallback } from "react";
import { MediaFile } from "../plugins/link/types";

interface UseMediaLibraryProps {
  onFileSelect?: (file: MediaFile) => void;
}

/**
 * A shared hook for handling media library interactions
 */
export const useMediaLibrary = ({
  onFileSelect,
}: UseMediaLibraryProps = {}) => {
  // State
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  // Toggle media library visibility
  const toggleMediaLibrary = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  // Open media library
  const openMediaLibrary = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Close media library
  const closeMediaLibrary = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Handle media library file selection
  const handleMediaLibChange = useCallback(
    (files: MediaFile[]) => {
      if (files && files.length > 0) {
        const file = files[0];
        setSelectedFile(file);

        // Call the onFileSelect callback if provided
        if (onFileSelect) {
          onFileSelect(file);
        }
      }

      setIsVisible(false);
    },
    [onFileSelect]
  );

  return {
    // State
    isVisible,
    selectedFile,

    // Setters
    setIsVisible,
    setSelectedFile,

    // Actions
    toggleMediaLibrary,
    openMediaLibrary,
    closeMediaLibrary,
    handleMediaLibChange,
  };
};

export default useMediaLibrary;
