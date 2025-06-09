import React, { PropsWithChildren, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { Box, Flex } from "@strapi/design-system";
import { Combobox } from "@strapi/ui-primitives";
import { MdSettings, MdDelete, MdMoreVert } from "react-icons/md";
import MediaLib from "../../../MediaLib";
import { FlexboxItemComponentProps } from "./types";
import { useFlexboxItemSettings } from "./hooks/useFlexboxItemSettings";
import FlexboxItemSettingsDialog from "./components/FlexboxItemSettingsDialog";

function FlexboxItemComponent({
    node,
    updateAttributes,
    editor,
    getPos,
}: PropsWithChildren<FlexboxItemComponentProps>) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mediaLibVisible, setMediaLibVisible] = useState(false);

    const {
        width,
        setWidth,
        flex,
        setFlex,
        height,
        setHeight,
        padding,
        setPadding,
        margin,
        setMargin,
        backgroundColorKey,
        setBackgroundColorKey,
        background,
        setBackground,
        backgroundImage,
        setBackgroundImage,
        alignSelf,
        setAlignSelf,
        order,
        setOrder,
        itemStyle,
        getAttributes,
    } = useFlexboxItemSettings(node.attrs);

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

    const handleDelete = () => {
        try {
            if (!editor) {
                console.error("Editor is undefined");
                return;
            }

            if (typeof getPos !== "function") {
                console.error("getPos is not a function");
                return;
            }

            const pos = getPos();
            const endPos = pos + node.nodeSize;

            editor.commands.deleteRange({
                from: pos,
                to: endPos,
            });
        } catch (error) {
            console.error("Error deleting flexbox item:", error);
        }
    };

    return (
        <NodeViewWrapper className="flexbox-item">
            <Box style={itemStyle}>
                <NodeViewContent
                    className="flexbox-item-content"
                    style={{ paddingBlock: 10, paddingLeft: 25 }}
                />

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
                                onClick={() => setIsMenuOpen((isMenuOpen) => !isMenuOpen)}
                                aria-label="Otevřít menu"
                                icon={<MdMoreVert />}
                                aria-expanded={isMenuOpen}
                            />
                        </Combobox.Trigger>
                        <Combobox.Portal>
                            <Combobox.Content>
                                <Combobox.Viewport>
                                    <Box padding={2} marginTop={2} background="neutral100">
                                        <Flex direction="column">
                                            <ButtonGroup>
                                                <IconButton
                                                    size="xs"
                                                    variant="solid"
                                                    aria-label="Nastavení položky flexboxu"
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
                                                    aria-label="Smazat položku flexboxu"
                                                    icon={<MdDelete />}
                                                    colorScheme="red"
                                                    onClick={() => {
                                                        handleDelete();
                                                        setIsMenuOpen(false);
                                                    }}
                                                />
                                            </ButtonGroup>
                                        </Flex>
                                    </Box>
                                </Combobox.Viewport>
                            </Combobox.Content>
                        </Combobox.Portal>
                    </Combobox.Root>
                </Box>
            </Box>

            <FlexboxItemSettingsDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onApply={handleApply}
                onOpenMediaLib={() => setMediaLibVisible(true)}
                width={width}
                setWidth={setWidth}
                flex={flex}
                setFlex={setFlex}
                height={height}
                setHeight={setHeight}
                padding={padding}
                setPadding={setPadding}
                margin={margin}
                setMargin={setMargin}
                backgroundColorKey={backgroundColorKey}
                setBackgroundColorKey={setBackgroundColorKey}
                setBackground={setBackground}
                backgroundImage={backgroundImage}
                setBackgroundImage={setBackgroundImage}
                alignSelf={alignSelf}
                setAlignSelf={setAlignSelf}
                order={order}
                setOrder={setOrder}
            />

            <MediaLib
                isOpen={mediaLibVisible}
                onChange={handleMediaLibSelect}
                onToggle={() => setMediaLibVisible(!mediaLibVisible)}
            />
        </NodeViewWrapper>
    );
}

export default FlexboxItemComponent;
