import React from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import {
    Box,
    IconButton,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { GalleryView, GalleryAttributes } from "@ssupat/components";
import { useGalleryDialog } from "./useGalleryDialog";

interface GalleryComponentProps extends NodeViewProps {
    editable?: boolean;
}

export const GalleryComponent = ({
    node,
    editor,
    editable = true,
}: GalleryComponentProps) => {
    const attrs: GalleryAttributes = {
        images: node.attrs.images || [],
        columns: node.attrs.columns || 3,
        spacing: node.attrs.spacing || 4,
        aspectRatio: node.attrs.aspectRatio || "1",
    };

    const { onOpen: openEdit } = useGalleryDialog();

    return (
        <NodeViewWrapper>
            <Box position="relative">
                {editable && (
                    <IconButton
                        aria-label="Upravit galerii"
                        icon={<EditIcon />}
                        position="absolute"
                        top="8px"
                        right="8px"
                        zIndex={2}
                        size="sm"
                        onClick={openEdit}
                    />
                )}
                <GalleryView attrs={attrs} />
            </Box>
        </NodeViewWrapper>
    );
};

// Export a version that can be used outside of the editor
export const StandaloneGallery: React.FC<{ attrs: GalleryAttributes }> = ({ attrs }) => {
    return <GalleryView attrs={attrs} />;
};
