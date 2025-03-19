import React from "react";
import { IconButton } from "@strapi/design-system";
import { FaImage } from 'react-icons/fa';
import { ImageDialog } from "./ImageDialog";
import { useImageDialog } from "./useImageDialog";
import { Editor } from "@tiptap/core";

interface TiptapChakraImageProps {
    editor: Editor;
}

export default function TiptapChakraImage({ editor }: TiptapChakraImageProps) {
    const {
        isOpen,
        onOpen,
        onClose,
        imageAttrs,
        setImageAttrs,
        handleSave,
        handleCancel,
        mediaLibVisible,
        setMediaLibVisible,
        handleMediaLibSelect,
        isEditing,
    } = useImageDialog({
        editor,
        initialAttrs: editor?.isActive("chakraImage")
            ? {
                src: editor.getAttributes("chakraImage").src || "",
                alt: editor.getAttributes("chakraImage").alt || "",
                boxSize: editor.getAttributes("chakraImage").boxSize || "auto",
                objectFit: editor.getAttributes("chakraImage").objectFit || "cover",
                fallbackSrc: editor.getAttributes("chakraImage").fallbackSrc || "",
            }
            : undefined
    });

    if (!editor) return null;

    return (
        <>
            <IconButton
                aria-label="Přidat obrázek"
                icon={<FaImage />}
                onClick={() => {
                    editor.chain().focus();
                    onOpen();
                }}
                size="sm"
                className={isEditing ? "is-active" : ""}
            />

            <ImageDialog
                isOpen={isOpen}
                onClose={onClose}
                imageAttrs={imageAttrs}
                setImageAttrs={setImageAttrs}
                onSave={handleSave}
                onCancel={handleCancel}
                mediaLibVisible={mediaLibVisible}
                setMediaLibVisible={setMediaLibVisible}
                handleMediaLibSelect={handleMediaLibSelect}
                isEditing={isEditing}
            />
        </>
    );
}
