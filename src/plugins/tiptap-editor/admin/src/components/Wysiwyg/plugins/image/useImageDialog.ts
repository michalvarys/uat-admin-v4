import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { ImageAttributes } from "./ImageExtension";

interface UseImageDialogProps {
  editor: any;
  onClose?: () => void;
  initialAttrs?: ImageAttributes;
}

export const useImageDialog = ({
  editor,
  onClose: externalOnClose,
  initialAttrs,
}: UseImageDialogProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mediaLibVisible, setMediaLibVisible] = useState(false);
  const [imageAttrs, setImageAttrs] = useState<ImageAttributes>(
    initialAttrs || {
      src: "",
      alt: "",
      boxSize: "auto",
      objectFit: "cover",
      fallbackSrc: "",
    }
  );

  const handleMediaLibSelect = (files: any[]) => {
    if (files?.[0]) {
      setImageAttrs((prev) => ({
        ...prev,
        src: files[0].url,
        alt: files[0].alternativeText || "",
      }));
    }
    setMediaLibVisible(false);
  };

  const resetForm = () => {
    setImageAttrs({
      src: "",
      alt: "",
      boxSize: "auto",
      objectFit: "cover",
      fallbackSrc: "",
    });
  };

  const handleSave = () => {
    if (!editor) return;

    editor.chain().focus();

    if (editor.isActive("chakraImage")) {
      // Update existing image
      editor.commands.updateAttributes("chakraImage", imageAttrs);
    } else {
      // Insert new image
      editor.commands.insertContent({
        type: "chakraImage",
        attrs: imageAttrs,
      });
    }
    onClose();
    externalOnClose?.();
    resetForm();
  };

  const handleCancel = () => {
    onClose();
    externalOnClose?.();
    resetForm();
  };

  // Load current image attributes when opening dialog
  const handleOpen = () => {
    if (editor?.isActive("chakraImage")) {
      const attrs = editor.getAttributes("chakraImage");
      setImageAttrs({
        src: attrs.src || "",
        alt: attrs.alt || "",
        boxSize: attrs.boxSize || "auto",
        objectFit: attrs.objectFit || "cover",
        fallbackSrc: attrs.fallbackSrc || "",
      });
    }
    onOpen();
  };

  return {
    isOpen,
    onOpen: handleOpen,
    onClose,
    imageAttrs,
    setImageAttrs,
    handleSave,
    handleCancel,
    mediaLibVisible,
    setMediaLibVisible,
    handleMediaLibSelect,
    isEditing: editor?.isActive("chakraImage"),
  };
};
