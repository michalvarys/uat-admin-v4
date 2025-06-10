import React, { PropsWithChildren, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Box, Flex } from "@strapi/design-system";
import { chakra, Button } from "@chakra-ui/react";
import { MdSettings, MdAdd } from "react-icons/md";
import MediaLib from "../../../MediaLib";
import { FlexboxComponentProps } from "./types";
import { useFlexboxSettings } from "./hooks/useFlexboxSettings";
import FlexboxSettingsDialog from "./components/FlexboxSettingsDialog";

function FlexboxComponent({
    node,
    updateAttributes,
    editor,
    getPos,
}: PropsWithChildren<FlexboxComponentProps>) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mediaLibVisible, setMediaLibVisible] = useState(false);

    const {
        flexDirection,
        setBackgroundImage,
        containerStyle,
        getAttributes,
    } = useFlexboxSettings(node.attrs);

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleMediaLibSelect = (files: any[]) => {
        if (files && files.length > 0) {
            const file = files[0];
            setBackgroundImage(file.url);
        }
        setMediaLibVisible(false);
    };

    const handleApply = () => {
        updateAttributes(getAttributes());
        setIsDialogOpen(false);
    };

    const handleAddItem = () => {
        try {
            if (!editor) {
                console.error("Editor is not available in props");
                return;
            }

            if (typeof getPos !== "function") {
                console.error("getPos is not a function");
                return;
            }

            const pos = getPos();

            editor.commands.insertContentAt(
                pos + node.nodeSize - 1,
                {
                    type: "flexboxItem",
                    attrs: {
                        width: flexDirection === "row" ? "auto" : "100%",
                        flex: flexDirection === "row" ? "1 1 0" : "0 0 auto",
                    },
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "Klikněte pro úpravu textu",
                                },
                            ],
                        },
                    ],
                }
            );
        } catch (error) {
            console.error("Error adding flexbox item:", error);
        }
    };

    return (
        <NodeViewWrapper className="flexbox-container">
            <Box
                padding={2}
                background="neutral100"
                width="100%"
                style={{ position: "relative" }}
            >
                <chakra.div
                    sx={{
                        "& .flexbox-content > div": {
                            display: "flex",
                            flexDirection: "column",
                        },
                    }}
                >
                    <NodeViewContent
                        className="flexbox-content"
                        style={containerStyle}
                    />
                </chakra.div>

                <Flex justifyContent="center" gap={2}>
                    <Button
                        size="xs"
                        variant="outline"
                        colorScheme="orange"
                        leftIcon={<MdAdd />}
                        onClick={handleAddItem}
                    >
                        Přidat položku
                    </Button>
                    <Button
                        size="xs"
                        variant="solid"
                        colorScheme="orange"
                        leftIcon={<MdSettings />}
                        onClick={handleOpenDialog}
                    >
                        Nastavení
                    </Button>
                </Flex>
            </Box>

            <FlexboxSettingsDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onApply={handleApply}
                onOpenMediaLib={() => setMediaLibVisible(true)}
                node={node}
            />

            <MediaLib
                isOpen={mediaLibVisible}
                onChange={handleMediaLibSelect}
                onToggle={() => setMediaLibVisible(!mediaLibVisible)}
            />
        </NodeViewWrapper>
    );
}

export default FlexboxComponent;
