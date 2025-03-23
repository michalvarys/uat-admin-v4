import { useState, useEffect, useCallback } from "react";

interface UseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: any;
}

/**
 * A shared hook for managing dialog state and lifecycle
 */
export const useDialog = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: UseDialogProps) => {
  // Track if the dialog has been initialized
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset initialization state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen]);

  // Initialize the dialog when it opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized]);

  // Handle save action
  const handleSave = useCallback(
    (data: any) => {
      if (onSave) {
        onSave(data);
      }
      onClose();
    },
    [onSave, onClose]
  );

  return {
    isInitialized,
    handleSave,
    onClose,
  };
};

export default useDialog;
