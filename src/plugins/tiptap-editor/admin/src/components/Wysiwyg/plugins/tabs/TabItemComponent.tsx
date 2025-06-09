import React, { useMemo, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { IconButton, Button } from '@chakra-ui/react'
import {
    Box,
    Flex,
    Dialog,
    DialogBody,
    DialogFooter,
    TextInput,
} from "@strapi/design-system";
import { Combobox } from '@strapi/ui-primitives';

import { MdSettings, MdDelete, MdMoreVert } from "react-icons/md";

export const TabItemComponent = (props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // State for tab item settings
    const [title, setTitle] = useState(props.node.attrs.title || "");

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleApply = () => {
        // Update tab item attributes
        props.updateAttributes({
            title,
        });

        setIsDialogOpen(false);
    };

    const handleDelete = () => {
        try {
            // Use the editor directly since it's available in props
            if (!props.editor) {
                console.error("Editor is undefined");
                return;
            }

            if (typeof props.getPos !== 'function') {
                console.error("getPos is not a function");
                return;
            }

            // Calculate positions
            const pos = props.getPos();
            const endPos = pos + props.node.nodeSize;

            // Use the editor's deleteRange command
            props.editor.commands.deleteRange({
                from: pos,
                to: endPos
            });
        } catch (error) {
            console.error("Error deleting tab item:", error);
        }
    };

    // Apply styles based on attributes
    const itemStyle = useMemo(() => ({
        border: "1px dashed #ccc",
        borderRadius: "4px",
        position: "relative" as const,
        padding: "10px",
        margin: "5px 0",
    }), []);

    return (
        <NodeViewWrapper className="tab-item">
            <Box style={itemStyle}>
                <Box
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        opacity: 0.7,
                    }}
                >
                    <Combobox.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <Combobox.Trigger>
                            <IconButton
                                variant="link"
                                size="xs"
                                onClick={() => setIsMenuOpen(isMenuOpen => !isMenuOpen)}
                                aria-label="Otevřít menu"
                                icon={<MdMoreVert />}
                                aria-expanded={isMenuOpen}
                            />
                        </Combobox.Trigger>
                        <Combobox.Portal>
                            <Combobox.Content>
                                <Combobox.Viewport>
                                    <Box padding={2} background="neutral100">
                                        <Flex direction="column">
                                            <Flex>
                                                <IconButton
                                                    size="xs"
                                                    variant="solid"
                                                    aria-label="Nastavení záložky"
                                                    icon={<MdSettings />}
                                                    colorScheme="whiteAlpha"
                                                    onClick={() => {
                                                        handleOpenDialog();
                                                        setIsMenuOpen(false);
                                                    }}
                                                />
                                                <IconButton
                                                    size="xs"
                                                    variant="solid"
                                                    aria-label="Smazat záložku"
                                                    icon={<MdDelete />}
                                                    colorScheme="red"
                                                    onClick={() => {
                                                        handleDelete();
                                                        setIsMenuOpen(false);
                                                    }}
                                                />
                                            </Flex>
                                        </Flex>
                                    </Box>
                                </Combobox.Viewport>
                            </Combobox.Content>
                        </Combobox.Portal>
                    </Combobox.Root>
                </Box>

                <Box paddingLeft={4}>
                    <NodeViewContent className="tab-item-content" />
                </Box>
            </Box>

            <Dialog
                onClose={() => setIsDialogOpen(false)}
                title="Nastavení záložky"
                isOpen={isDialogOpen}
            >
                <DialogBody>
                    <Box padding={4}>
                        <TextInput
                            label="Název záložky"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Název záložky"
                        />
                    </Box>
                </DialogBody>
                <DialogFooter
                    startAction={
                        <Button
                            colorScheme="orange"
                            onClick={() => setIsDialogOpen(false)}
                            variant="link"
                        >
                            Zrušit
                        </Button>
                    }
                    endAction={
                        <Button
                            colorScheme="orange"
                            onClick={handleApply}
                            variant="solid"
                        >
                            Použít
                        </Button>
                    }
                />
            </Dialog>
        </NodeViewWrapper>
    );
};

export default TabItemComponent;
