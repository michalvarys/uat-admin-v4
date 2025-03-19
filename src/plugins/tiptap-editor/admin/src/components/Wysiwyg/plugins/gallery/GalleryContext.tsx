import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { Editor } from "@tiptap/core";
import { GalleryAttributes, GalleryImage } from "@ssupat/components";

interface GalleryContextType {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    galleryAttrs: GalleryAttributes;
    setGalleryAttrs: React.Dispatch<React.SetStateAction<GalleryAttributes>>;
    handleSave: () => void;
    handleCancel: () => void;
    mediaLibVisible: boolean;
    setMediaLibVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleMediaLibSelect: (files: any[]) => void;
    removeImage: (index: number) => void;
    reorderImages: (fromIndex: number, toIndex: number) => void;
    isEditing: boolean;
    editor: Editor | null;
}

const defaultGalleryAttrs: GalleryAttributes = {
    images: [],
    columns: 3,
    spacing: 4,
    aspectRatio: "1",
};

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const useGalleryContext = () => {
    const context = useContext(GalleryContext);
    if (!context) {
        throw new Error("useGalleryContext must be used within a GalleryProvider");
    }
    return context;
};

interface GalleryProviderProps {
    children: ReactNode;
    editor: Editor;
}

export const GalleryProvider: React.FC<GalleryProviderProps> = ({
    children,
    editor,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mediaLibVisible, setMediaLibVisible] = useState(false);
    const [galleryAttrs, setGalleryAttrs] = useState<GalleryAttributes>(defaultGalleryAttrs);

    const isEditing = editor?.isActive("gallery");

    const resetForm = () => {
        setGalleryAttrs(defaultGalleryAttrs);
    };

    const handleOpen = () => {
        setIsOpen(true);
        console.log("handleOpen")
        if (editor?.isActive("gallery")) {
            const attrs = editor.getAttributes("gallery");
            setGalleryAttrs({
                images: attrs.images || [],
                columns: attrs.columns || 3,
                spacing: attrs.spacing || 4,
                aspectRatio: attrs.aspectRatio || "1",
            });
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSave = () => {
        if (!editor) return;

        editor.chain().focus();

        if (editor.isActive("gallery")) {
            editor.commands.updateAttributes("gallery", galleryAttrs);
        } else {
            editor.commands.insertContent({
                type: "gallery",
                attrs: galleryAttrs,
            });
        }

        handleClose();
        resetForm();
    };

    const handleCancel = () => {
        handleClose();
        resetForm();
    };

    const handleMediaLibSelect = (files: any[]) => {
        if (files?.length) {
            const newImages: GalleryImage[] = files.map((file) => ({
                src: file.url,
                alt: file.alternativeText || "",
                title: file.caption || "",
            }));

            setGalleryAttrs((prev) => ({
                ...prev,
                images: [...prev.images, ...newImages],
            }));
        }
        // Close the media library but ensure the gallery dialog stays open
        setMediaLibVisible(false);
        // Make sure the gallery dialog is still open
        setIsOpen(true);
    };

    const removeImage = (index: number) => {
        setGalleryAttrs((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const reorderImages = (fromIndex: number, toIndex: number) => {
        setGalleryAttrs((prev) => {
            const newImages = [...prev.images];
            const [movedImage] = newImages.splice(fromIndex, 1);
            newImages.splice(toIndex, 0, movedImage);
            return {
                ...prev,
                images: newImages,
            };
        });
    };

    const value: GalleryContextType = useMemo(() => ({
        isOpen,
        onOpen: handleOpen,
        onClose: handleClose,
        galleryAttrs,
        setGalleryAttrs,
        handleSave,
        handleCancel,
        mediaLibVisible,
        setMediaLibVisible,
        handleMediaLibSelect,
        removeImage,
        reorderImages,
        isEditing: !!isEditing,
        editor,
    }),
        [
            isOpen,
            handleOpen,
            handleClose,
            galleryAttrs,
            setGalleryAttrs,
            handleSave,
            handleCancel,
            mediaLibVisible,
            setMediaLibVisible,
            handleMediaLibSelect,
            removeImage,
            reorderImages,
            isEditing,
            editor
        ]
    );

    return (
        <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
    );
};
