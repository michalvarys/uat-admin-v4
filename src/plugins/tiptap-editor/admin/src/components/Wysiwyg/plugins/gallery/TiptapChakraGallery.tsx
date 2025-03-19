import React from "react";
import { IconButton } from "@strapi/design-system";
import { GalleryDialog } from "./GalleryDialog";
import { useGalleryDialog } from "./useGalleryDialog";
import { Editor } from "@tiptap/core";
import { BsImages } from "react-icons/bs";

interface TiptapChakraGalleryProps {
    editor: Editor;
}

export default function TiptapChakraGallery({ editor }: TiptapChakraGalleryProps) {
    const {
        onOpen,
        isEditing,
    } = useGalleryDialog();

    if (!editor) return null;

    return (
        <>
            <IconButton
                aria-label="Přidat galerii"
                icon={<BsImages />}
                onClick={() => {
                    editor.chain().focus();
                    onOpen();
                }}
                size="sm"
                className={isEditing ? "is-active" : ""}
            />

            <GalleryDialog />
        </>
    );
}
