import React, { useMemo, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { ButtonGroup, IconButton } from '@chakra-ui/react'
import {
    Box,
    Flex,
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    Tabs,
    Tab,
    TabGroup,
    TabPanel,
    TabPanels,
    TextInput,
    Select,
    Option,
    NumberInput,
} from "@strapi/design-system";
import { Combobox } from '@strapi/ui-primitives';

import { MdSettings, MdDelete, MdMoreVert } from "react-icons/md";
import { ColorsSelect } from "../../ColorSelect";
import { getColorValue } from "../../tools";

export const FlexboxItemComponent = (props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // State for item settings
    const [width, setWidth] = useState(props.node.attrs.width || "auto");
    const [flex, setFlex] = useState(props.node.attrs.flex || "1 1 0");
    const [height, setHeight] = useState(props.node.attrs.height || "auto");
    const [padding, setPadding] = useState(props.node.attrs.padding || "0px");
    const [margin, setMargin] = useState(props.node.attrs.margin || "0px");
    const [background, setBackground] = useState(props.node.attrs.background || "transparent");
    const [alignSelf, setAlignSelf] = useState(props.node.attrs.alignSelf || "auto");
    const [order, setOrder] = useState(props.node.attrs.order || "0");

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleApply = () => {
        // Update item attributes
        props.updateAttributes({
            width,
            flex,
            height,
            padding,
            margin,
            background,
            alignSelf,
            order,
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
            console.error("Error deleting flexbox item:", error);
        }
    };

    // Apply styles based on attributes
    const itemStyle = useMemo(() => ({
        border: "1px dashed #ccc",
        borderRadius: "4px",
        position: "relative" as const,
        minWidth: "0", // Prevents overflow issues
        backgroundColor: background,
        width,
        height,
        padding,
        margin,
        alignSelf,
        order,
        flex, // Use the flex property from the attributes
    }), [width, flex, height, padding, margin, background, alignSelf, order]);

    return (
        <NodeViewWrapper className="flexbox-item">
            <Box style={itemStyle}>
                <NodeViewContent className="flexbox-item-content" style={{ paddingLeft: 25 }} />

                <Box
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        opacity: 0.7,
                        zIndex: 10,
                    }}
                >
                    <Combobox.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <Combobox.Trigger>
                            <IconButton
                                variant="link"
                                size="xs"
                                onClick={() => setIsMenuOpen(isMenuOpen => !isMenuOpen)}
                                aria-label="Otevřít menu"
                                icon={<MdMoreVert />}
                                aria-expanded={isMenuOpen}
                            />
                        </Combobox.Trigger>
                        <Combobox.Portal>
                            <Combobox.Content>
                                <Combobox.Viewport>
                                    <Box padding={2} background="neutral100">
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
                                                    aria-label="Nastavení položky flexboxu"
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

            <Dialog
                onClose={() => setIsDialogOpen(false)}
                title="Nastavení položky flexboxu"
                isOpen={isDialogOpen}
            >
                <DialogBody>
                    <TabGroup
                        id="tabs"
                        onTabChange={(selected) => setActiveTab(selected)}
                    >
                        <Tabs>
                            <Tab>Velikost</Tab>
                            <Tab>Mezery</Tab>
                            <Tab>Vzhled</Tab>
                            <Tab>Zarovnání</Tab>
                        </Tabs>
                        <TabPanels>
                            <TabPanel>
                                <Box padding={4}>
                                    <TextInput
                                        label="Šířka"
                                        name="width"
                                        value={width}
                                        onChange={(e) => setWidth(e.target.value)}
                                        placeholder="např. 100%, 300px, 50vw"
                                    />

                                    <Box paddingTop={4}>
                                        <TextInput
                                            label="Flex"
                                            name="flex"
                                            value={flex}
                                            onChange={(e) => setFlex(e.target.value)}
                                            placeholder="např. 1 1 0, 0 0 auto"
                                            hint="Určuje, jak položka roste a zmenšuje se"
                                        />
                                    </Box>

                                    <Box paddingTop={4}>
                                        <TextInput
                                            label="Výška"
                                            name="height"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            placeholder="např. auto, 200px, 50vh"
                                        />
                                    </Box>
                                </Box>
                            </TabPanel>

                            <TabPanel>
                                <Box padding={4}>
                                    <TextInput
                                        label="Vnitřní odsazení"
                                        name="padding"
                                        value={padding}
                                        onChange={(e) => setPadding(e.target.value)}
                                        placeholder="např. 10px, 10px 20px"
                                    />

                                    <Box paddingTop={4}>
                                        <TextInput
                                            label="Vnější odsazení"
                                            name="margin"
                                            value={margin}
                                            onChange={(e) => setMargin(e.target.value)}
                                            placeholder="např. 10px, 10px 20px"
                                        />
                                    </Box>
                                </Box>
                            </TabPanel>

                            <TabPanel>
                                <Box padding={4}>
                                    <ColorsSelect
                                        label="Barva pozadí"
                                        value={background}
                                        onChange={(value) => {
                                            const colorValue = getColorValue(value);
                                            setBackground(colorValue || "transparent");
                                        }}
                                    />
                                </Box>
                            </TabPanel>

                            <TabPanel>
                                <Box padding={4}>
                                    <Select
                                        label="Vlastní zarovnání"
                                        value={alignSelf}
                                        onChange={(value) => setAlignSelf(value)}
                                    >
                                        <Option value="auto">Automaticky</Option>
                                        <Option value="flex-start">Začátek</Option>
                                        <Option value="center">Střed</Option>
                                        <Option value="flex-end">Konec</Option>
                                        <Option value="stretch">Roztažení</Option>
                                    </Select>

                                    <Box paddingTop={4}>
                                        <NumberInput
                                            label="Pořadí"
                                            name="order"
                                            value={parseInt(order, 10)}
                                            onValueChange={(value) => setOrder(value.toString())}
                                        />
                                    </Box>
                                </Box>
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </DialogBody>
                <DialogFooter
                    startAction={
                        <Button
                            onClick={() => setIsDialogOpen(false)}
                            variant="tertiary"
                        >
                            Zrušit
                        </Button>
                    }
                    endAction={
                        <Button
                            onClick={handleApply}
                            variant="success-light"
                        >
                            Použít
                        </Button>
                    }
                />
            </Dialog>
        </NodeViewWrapper>
    );
};

export default FlexboxItemComponent;
