import React from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Box, IconButton } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { ImageAttributes } from "./ImageExtension";
import { ImageDialog } from "./ImageDialog";
import { EditIcon } from "@chakra-ui/icons";
import { useImageDialog } from "./useImageDialog";

interface ImageComponentProps {
    node: {
        attrs: ImageAttributes;
    };
    updateAttributes: (attrs: Partial<ImageAttributes>) => void;
    editor: any;
}

export const ImageComponent: React.FC<NodeViewProps> = ({
    node,
    editor,
}) => {
    const { src, alt, boxSize, objectFit, fallbackSrc } = node.attrs;
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
    } = useImageDialog({
        editor,
        initialAttrs: { src, alt, boxSize, objectFit, fallbackSrc },
    });

    return (
        <NodeViewWrapper>
            <Box my={4} position="relative">
                <Box pos="relative">
                    <IconButton
                        aria-label="Upravit obrázek"
                        icon={<EditIcon />}
                        size="sm"
                        position="absolute"
                        top={2}
                        right={2}
                        onClick={onOpen}
                        zIndex={2}
                    />
                    <Image
                        src={src}
                        alt={alt}
                        boxSize={boxSize}
                        objectFit={objectFit}
                        fallbackSrc={fallbackSrc}
                    />
                </Box>

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
                    isEditing
                />
            </Box>
        </NodeViewWrapper>
    );
};
