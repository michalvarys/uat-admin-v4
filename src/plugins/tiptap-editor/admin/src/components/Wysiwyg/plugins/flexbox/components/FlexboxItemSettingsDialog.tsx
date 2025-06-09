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
    NumberInput,
    Flex,
} from "@strapi/design-system";
import { Button } from "@chakra-ui/react";
import { MdSettings, MdImage } from "react-icons/md";
import { ColorsSelect } from "../../../ColorSelect";
import { getColorValue } from "../../../tools";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onApply: () => void;
    onOpenMediaLib: () => void;
    width: string;
    setWidth: (value: string) => void;
    flex: string;
    setFlex: (value: string) => void;
    height: string;
    setHeight: (value: string) => void;
    padding: string;
    setPadding: (value: string) => void;
    margin: string;
    setMargin: (value: string) => void;
    backgroundColorKey: string;
    setBackgroundColorKey: (value: string) => void;
    setBackground: (value: string) => void;
    backgroundImage: string;
    setBackgroundImage: (value: string) => void;
    alignSelf: string;
    setAlignSelf: (value: string) => void;
    order: string;
    setOrder: (value: string) => void;
};

function FlexboxItemSettingsDialog({
    isOpen,
    onClose,
    onApply,
    onOpenMediaLib,
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
    setBackground,
    backgroundImage,
    setBackgroundImage,
    alignSelf,
    setAlignSelf,
    order,
    setOrder,
}: PropsWithChildren<Props>) {
    const [activeTab, setActiveTab] = React.useState(0);

    const handleColorChange = (value: string) => {
        setBackgroundColorKey(value);
        const colorValue = getColorValue(value);
        setBackground(colorValue || "transparent");
    };

    return (
        <Dialog
            id="flexbox-item-settings-dialog"
            onClose={onClose}
            title="Nastavení položky flexboxu"
            isOpen={isOpen}
        >
            <DialogBody icon={<MdSettings />}>
                <TabGroup
                    id="tabs"
                    onTabChange={(selected) => setActiveTab(selected)}
                >
                    <Tabs>
                        <Tab id="size">Velikost</Tab>
                        <Tab id="spacing">Mezery</Tab>
                        <Tab id="appearance">Vzhled</Tab>
                        <Tab id="alignment">Zarovnání</Tab>
                    </Tabs>
                    <TabPanels>
                        <TabPanel id="size">
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

                        <TabPanel id="spacing">
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

                        <TabPanel id="appearance">
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

                        <TabPanel id="tab-zarovnani">
                            <Box padding={4}>
                                <SingleSelect
                                    label="Vlastní zarovnání"
                                    value={alignSelf}
                                    onChange={(value) => setAlignSelf(value)}
                                >
                                    <SingleSelectOption value="auto">Automaticky</SingleSelectOption>
                                    <SingleSelectOption value="flex-start">Začátek</SingleSelectOption>
                                    <SingleSelectOption value="center">Střed</SingleSelectOption>
                                    <SingleSelectOption value="flex-end">Konec</SingleSelectOption>
                                    <SingleSelectOption value="stretch">Roztažení</SingleSelectOption>
                                </SingleSelect>

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

export default FlexboxItemSettingsDialog;
