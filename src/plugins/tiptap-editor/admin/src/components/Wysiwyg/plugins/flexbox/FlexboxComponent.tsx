import React, { useMemo, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
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
    Typography,
    Accordion,
    AccordionToggle,
    AccordionContent,
} from "@strapi/design-system";
import { MdSettings, MdAdd } from "react-icons/md";
import { ColorsSelect } from "../../ColorSelect";
import { getColorValue, findColorKeyByValue } from "../../tools";

export const FlexboxComponent = (props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [mobileAccordionExpanded, setMobileAccordionExpanded] = useState(true);
    const [tabletAccordionExpanded, setTabletAccordionExpanded] = useState(false);

    // State for flexbox settings
    const [flexDirection, setDirection] = useState(props.node.attrs.direction || "row");
    const [padding, setPadding] = useState(props.node.attrs.padding || "0px");
    const [margin, setMargin] = useState(props.node.attrs.margin || "0px");
    // Store both the color key and the color value
    const [backgroundColorKey, setBackgroundColorKey] = useState(() => {
        // If we have a background color, find its key
        if (props.node.attrs.background) {
            return findColorKeyByValue(props.node.attrs.background);
        }
        return "transparent";
    });
    const [background, setBackground] = useState(props.node.attrs.background || "transparent");
    const [gap, setGap] = useState(props.node.attrs.gap || "0px");

    // Responsive settings
    const [responsiveSettings, setResponsiveSettings] = useState(() => {
        try {
            return JSON.parse(props.node.attrs.responsive || "{}");
        } catch (e) {
            return {};
        }
    });

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleApply = () => {
        // Update flexbox attributes
        props.updateAttributes({
            direction: flexDirection,
            padding,
            margin,
            background,
            gap,
            responsive: JSON.stringify(responsiveSettings),
        });

        setIsDialogOpen(false);
    };

    const handleAddItem = () => {
        try {
            // We now know that editor is available in props
            if (!props.editor) {
                console.error("Editor is not available in props");
                return;
            }

            // Get the current position
            if (typeof props.getPos !== 'function') {
                console.error("getPos is not a function");
                return;
            }

            // Get the current node position
            const pos = props.getPos();

            // Use the editor to insert a new flexbox item at the end of the current flexbox
            props.editor.commands.insertContentAt(
                pos + props.node.nodeSize - 1,
                {
                    type: 'flexboxItem',
                    attrs: {
                        width: flexDirection === "row" ? "auto" : "100%",
                        flex: flexDirection === "row" ? "1 1 0" : "0 0 auto"
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
                    ]
                }
            );
        } catch (error) {
            console.error("Error adding flexbox item:", error);
        }
    };

    // Apply styles based on attributes
    const containerStyle = useMemo(() => ({
        position: "relative",
        display: "flex",
        flex: '1 1 0',
        width: "100%",
        // flexWrap: "nowrap",
        backgroundColor: background,
        flexDirection,
        padding,
        margin,
        gap,
    }), [background, flexDirection, padding, margin, gap]);

    return (
        <NodeViewWrapper className="flexbox-container">
            <Box padding={2} background="neutral100" width="100%" style={{ position: "relative" }} >
                <NodeViewContent className="flexbox-content" style={containerStyle} />

                <Flex justifyContent="center" padding={2}>
                    <Button
                        variant="secondary"
                        startIcon={<MdAdd />}
                        onClick={handleAddItem}
                    >
                        Přidat položku
                    </Button>
                    <Button
                        variant="tertiary"
                        startIcon={<MdSettings />}
                        onClick={handleOpenDialog}
                    >
                        Nastavení
                    </Button>
                </Flex>
            </Box>

            <Dialog
                onClose={() => setIsDialogOpen(false)}
                title="Nastavení flexboxu"
                isOpen={isDialogOpen}
            >
                <DialogBody>
                    <TabGroup
                        id="tabs"
                        onTabChange={(selected) => setActiveTab(selected)}
                    >
                        <Tabs>
                            <Tab>Rozložení</Tab>
                            <Tab>Mezery</Tab>
                            <Tab>Vzhled</Tab>
                            <Tab>Responzivita</Tab>
                        </Tabs>
                        <TabPanels>
                            <TabPanel>
                                <Box padding={4}>
                                    <Select
                                        label="Směr"
                                        value={flexDirection}
                                        onChange={(value) => setDirection(value)}
                                    >
                                        <Option value="row">Řádek (horizontálně)</Option>
                                        <Option value="column">Sloupec (vertikálně)</Option>
                                        <Option value="row-reverse">Řádek obráceně</Option>
                                        <Option value="column-reverse">Sloupec obráceně</Option>
                                    </Select>

                                    <Box paddingTop={4}>
                                        <TextInput
                                            label="Mezera mezi položkami"
                                            name="gap"
                                            value={gap}
                                            onChange={(e) => setGap(e.target.value)}
                                            placeholder="např. 10px, 1rem"
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
                                        value={backgroundColorKey}
                                        onChange={(value) => {
                                            setBackgroundColorKey(value);
                                            const colorValue = getColorValue(value);
                                            setBackground(colorValue || "transparent");
                                        }}
                                    />
                                </Box>
                            </TabPanel>

                            <TabPanel>
                                <Box padding={4}>
                                    <Typography>Responzivní nastavení budou použita na různých velikostech obrazovky.</Typography>

                                    <Box paddingTop={4}>
                                        <Accordion
                                            expanded={mobileAccordionExpanded}
                                            id="mobile-settings"
                                            size="S"
                                            onToggle={() => setMobileAccordionExpanded(prev => !prev)}
                                        >
                                            <AccordionToggle
                                                togglePosition="right"
                                                title="Nastavení pro mobily"
                                                description="Použito na obrazovkách menších než 768px"
                                            />
                                            <AccordionContent>
                                                <Box padding={4}>
                                                    <Select
                                                        label="Směr"
                                                        value={responsiveSettings.mobile?.direction || flexDirection}
                                                        onChange={(value) => setResponsiveSettings({
                                                            ...responsiveSettings,
                                                            mobile: {
                                                                ...responsiveSettings.mobile,
                                                                direction: value,
                                                            }
                                                        })}
                                                    >
                                                        <Option value="row">Řádek (horizontálně)</Option>
                                                        <Option value="column">Sloupec (vertikálně)</Option>
                                                        <Option value="row-reverse">Řádek obráceně</Option>
                                                        <Option value="column-reverse">Sloupec obráceně</Option>
                                                    </Select>
                                                </Box>
                                            </AccordionContent>
                                        </Accordion>

                                        <Accordion
                                            expanded={tabletAccordionExpanded}
                                            id="tablet-settings"
                                            size="S"
                                            onToggle={() => setTabletAccordionExpanded(prev => !prev)}
                                        >
                                            <AccordionToggle
                                                togglePosition="right"
                                                title="Nastavení pro tablety"
                                                description="Použito na obrazovkách mezi 768px a 1024px"
                                            />
                                            <AccordionContent>
                                                <Box padding={4}>
                                                    <Select
                                                        label="Směr"
                                                        value={responsiveSettings.tablet?.direction || flexDirection}
                                                        onChange={(value) => setResponsiveSettings({
                                                            ...responsiveSettings,
                                                            tablet: {
                                                                ...responsiveSettings.tablet,
                                                                direction: value,
                                                            }
                                                        })}
                                                    >
                                                        <Option value="row">Řádek (horizontálně)</Option>
                                                        <Option value="column">Sloupec (vertikálně)</Option>
                                                        <Option value="row-reverse">Řádek obráceně</Option>
                                                        <Option value="column-reverse">Sloupec obráceně</Option>
                                                    </Select>
                                                </Box>
                                            </AccordionContent>
                                        </Accordion>
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

export default FlexboxComponent;
