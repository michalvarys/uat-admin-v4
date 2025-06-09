import React, { PropsWithChildren } from "react";
import {
    Dialog,
    DialogBody,
    DialogFooter,
    Tabs,
    Tab,
    TabGroup,
    TabPanel,
    TabPanels,
    Box,
    TextInput,
    SingleSelect,
    SingleSelectOption,
    Typography,
    Accordion,
    AccordionToggle,
    AccordionContent,
    Flex,
} from "@strapi/design-system";
import { Button } from "@chakra-ui/react";
import { MdImage } from "react-icons/md";
import { ColorsSelect } from "../../../ColorSelect";
import { getColorValue } from "../../../tools";
import { FlexDirection, ResponsiveSettings } from "../types";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onApply: () => void;
    onOpenMediaLib: () => void;
    flexDirection: FlexDirection;
    setFlexDirection: (value: FlexDirection) => void;
    gap: string;
    setGap: (value: string) => void;
    padding: string;
    setPadding: (value: string) => void;
    margin: string;
    setMargin: (value: string) => void;
    backgroundColorKey: string;
    setBackgroundColorKey: (value: string) => void;
    setBackground: (value: string) => void;
    backgroundImage: string;
    setBackgroundImage: (value: string) => void;
    responsiveSettings: ResponsiveSettings;
    setResponsiveSettings: (value: ResponsiveSettings) => void;
};

function FlexboxSettingsDialog({
    isOpen,
    onClose,
    onApply,
    onOpenMediaLib,
    flexDirection,
    setFlexDirection,
    gap,
    setGap,
    padding,
    setPadding,
    margin,
    setMargin,
    backgroundColorKey,
    setBackgroundColorKey,
    setBackground,
    backgroundImage,
    setBackgroundImage,
    responsiveSettings,
    setResponsiveSettings,
}: PropsWithChildren<Props>) {
    const [activeTab, setActiveTab] = React.useState(0);
    const [mobileAccordionExpanded, setMobileAccordionExpanded] = React.useState(true);
    const [tabletAccordionExpanded, setTabletAccordionExpanded] = React.useState(false);

    const handleColorChange = (value: string) => {
        setBackgroundColorKey(value);
        const colorValue = getColorValue(value);
        setBackground(colorValue || "transparent");
    };

    const updateResponsiveSetting = (
        device: "mobile" | "tablet",
        key: string,
        value: any
    ) => {
        setResponsiveSettings({
            ...responsiveSettings,
            [device]: {
                ...responsiveSettings[device],
                [key]: value,
            },
        });
    };

    return (
        <Dialog
            onClose={onClose}
            title="Nastavení flexboxu"
            isOpen={isOpen}
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
                                <SingleSelect
                                    label="Směr"
                                    value={flexDirection}
                                    onChange={(value) => setFlexDirection(value as FlexDirection)}
                                >
                                    <SingleSelectOption value="row">Řádek (horizontálně)</SingleSelectOption>
                                    <SingleSelectOption value="column">Sloupec (vertikálně)</SingleSelectOption>
                                    <SingleSelectOption value="row-reverse">Řádek obráceně</SingleSelectOption>
                                    <SingleSelectOption value="column-reverse">Sloupec obráceně</SingleSelectOption>
                                </SingleSelect>

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
                                    onChange={handleColorChange}
                                />

                                <Box paddingTop={4}>
                                    <Flex direction="column" gap={2}>
                                        <TextInput
                                            label="Obrázek na pozadí"
                                            name="backgroundImage"
                                            value={backgroundImage}
                                            onChange={(e) => setBackgroundImage(e.target.value)}
                                            placeholder="URL obrázku (např. https://example.com/image.jpg)"
                                            hint="Zadejte URL adresu obrázku, který se má zobrazit na pozadí"
                                        />
                                        <Button
                                            colorScheme="orange"
                                            variant="outline"
                                            size="sm"
                                            leftIcon={<MdImage />}
                                            onClick={onOpenMediaLib}
                                        >
                                            Vybrat z galerie
                                        </Button>
                                    </Flex>
                                </Box>
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
                                                <SingleSelect
                                                    label="Směr"
                                                    value={responsiveSettings.mobile?.direction || flexDirection}
                                                    onChange={(value) => updateResponsiveSetting("mobile", "direction", value)}
                                                >
                                                    <SingleSelectOption value="row">Řádek (horizontálně)</SingleSelectOption>
                                                    <SingleSelectOption value="column">Sloupec (vertikálně)</SingleSelectOption>
                                                    <SingleSelectOption value="row-reverse">Řádek obráceně</SingleSelectOption>
                                                    <SingleSelectOption value="column-reverse">Sloupec obráceně</SingleSelectOption>
                                                </SingleSelect>
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
                                                <SingleSelect
                                                    label="Směr"
                                                    value={responsiveSettings.tablet?.direction || flexDirection}
                                                    onChange={(value) => updateResponsiveSetting("tablet", "direction", value)}
                                                >
                                                    <SingleSelectOption value="row">Řádek (horizontálně)</SingleSelectOption>
                                                    <SingleSelectOption value="column">Sloupec (vertikálně)</SingleSelectOption>
                                                    <SingleSelectOption value="row-reverse">Řádek obráceně</SingleSelectOption>
                                                    <SingleSelectOption value="column-reverse">Sloupec obráceně</SingleSelectOption>
                                                </SingleSelect>
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
                        colorScheme="orange"
                        onClick={onClose}
                        variant="link"
                    >
                        Zrušit
                    </Button>
                }
                endAction={
                    <Button
                        colorScheme="orange"
                        onClick={onApply}
                        variant="solid"
                    >
                        Použít
                    </Button>
                }
            />
        </Dialog>
    );
}

export default FlexboxSettingsDialog;
