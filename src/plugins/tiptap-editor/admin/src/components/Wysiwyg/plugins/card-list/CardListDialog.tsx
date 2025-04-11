import React from "react";
import {
    ModalLayout,
    Button,
    Combobox,
    ComboboxOption,
    Stack,
    Typography,
    Box,
    Loader,
    Tabs,
    Tab,
    TabGroup,
    TabPanels,
    TabPanel,
    Flex,
    IconButton,
    Card,
    NumberInput,
    Grid,
    GridItem,
} from "@strapi/design-system";
import { Plus, Trash, ArrowUp, ArrowDown } from "@strapi/icons";
import { CardListAttributes } from "./types";
import { breakpoints, useCardListDialog } from "./useCardListDialog";
import MediaLib from "../../../MediaLib";

interface CardListDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialAttributes: Partial<CardListAttributes>;
    onSave: (attributes: CardListAttributes) => void;
}

export const CardListDialog: React.FC<CardListDialogProps> = (props) => {
    const {
        cards,
        columns,
        selectedCardIndex,
        activeTab,
        recordSelector,
        mediaLibrary,
        handleRecordChange,
        handleTabChange,
        handleColumnsChange,
        addCard,
        removeCard,
        selectCard,
        moveCardUp,
        moveCardDown,
        handleSave,
        onClose,
    } = useCardListDialog(props);

    if (!props.isOpen) {
        return null;
    }

    return (
        <>
            <ModalLayout
                labelledBy="card-list-dialog-title"
                as="form"
            >
                <Box padding={8} background="neutral100">
                    <Box paddingBottom={4} borderBottom="1px solid">
                        <Typography variant="beta" id="card-list-dialog-title">
                            Seznam karet
                        </Typography>
                    </Box>

                    {/* Columns configuration */}
                    <Box paddingTop={4} paddingBottom={4}>
                        <Typography variant="delta" paddingBottom={2}>
                            Nastavení sloupců
                        </Typography>
                        <Grid gap={4}>
                            <GridItem col={4} s={12}>
                                <NumberInput
                                    label="Mobilní zařízení (xs)"
                                    name="xs-columns"
                                    value={columns[breakpoints.xs] === null ? "" : columns[breakpoints.xs]}
                                    placeholder="Počet sloupců"
                                    hint="Počet sloupců na mobilních zařízeních"
                                    onValueChange={(value) => handleColumnsChange("xs", value === "" ? null : value)}
                                />
                            </GridItem>
                            <GridItem col={4} s={12}>
                                <NumberInput
                                    label="Malé obrazovky (sm)"
                                    name="sm-columns"
                                    value={columns[breakpoints.sm] === null ? "" : columns[breakpoints.sm]}
                                    placeholder="Počet sloupců"
                                    hint="Počet sloupců na malých obrazovkách"
                                    onValueChange={(value) => handleColumnsChange("sm", value === "" ? null : value)}
                                />
                            </GridItem>
                            <GridItem col={4} s={12}>
                                <NumberInput
                                    label="Střední obrazovky (md)"
                                    name="md-columns"
                                    value={columns[breakpoints.md] === null ? "" : columns[breakpoints.md]}
                                    placeholder="Počet sloupců"
                                    hint="Počet sloupců na středních obrazovkách"
                                    onValueChange={(value) => handleColumnsChange("md", value === "" ? null : value)}
                                />
                            </GridItem>
                            <GridItem col={6} s={12}>
                                <NumberInput
                                    label="Velké obrazovky (lg)"
                                    name="lg-columns"
                                    value={columns[breakpoints.lg] === null ? "" : columns[breakpoints.lg]}
                                    placeholder="Počet sloupců"
                                    hint="Počet sloupců na velkých obrazovkách"
                                    onValueChange={(value) => handleColumnsChange("lg", value === "" ? null : value)}
                                />
                            </GridItem>
                            <GridItem col={6} s={12}>
                                <NumberInput
                                    label="Extra velké obrazovky (xl)"
                                    name="xl-columns"
                                    value={columns[breakpoints.xl] === null ? "" : columns[breakpoints.xl]}
                                    placeholder="Počet sloupců"
                                    hint="Počet sloupců na extra velkých obrazovkách"
                                    onValueChange={(value) => handleColumnsChange("xl", value === "" ? null : value)}
                                />
                            </GridItem>
                        </Grid>
                    </Box>

                    <Box paddingTop={4}>
                        <Flex gap={4}>
                            {/* Left side - Card list */}
                            <Box width="40%" background="neutral150" padding={4} borderRadius="4px">
                                <Flex justifyContent="space-between" alignItems="center" paddingBottom={4}>
                                    <Typography variant="delta">Karty</Typography>
                                    <IconButton
                                        onClick={addCard}
                                        label="Přidat kartu"
                                        icon={<Plus />}
                                    />
                                </Flex>

                                <Stack spacing={2}>
                                    {cards.length === 0 ? (
                                        <Typography variant="pi">
                                            Žádné karty. Klikněte na + pro přidání karty.
                                        </Typography>
                                    ) : (
                                        cards.map((card, index) => (
                                            <Card
                                                key={card.id}
                                                padding={3}
                                                background={selectedCardIndex === index ? "primary100" : "neutral0"}
                                                onClick={() => selectCard(index)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <Flex justifyContent="space-between" alignItems="center">
                                                    <Typography variant="pi" fontWeight={selectedCardIndex === index ? "bold" : "normal"}>
                                                        {card.title || `Karta ${index + 1}`}
                                                    </Typography>
                                                    <Flex gap={1}>
                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                moveCardUp(index);
                                                            }}
                                                            label="Posunout nahoru"
                                                            icon={<ArrowUp />}
                                                            disabled={index === 0}
                                                        />
                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                moveCardDown(index);
                                                            }}
                                                            label="Posunout dolů"
                                                            icon={<ArrowDown />}
                                                            disabled={index === cards.length - 1}
                                                        />
                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeCard(index);
                                                            }}
                                                            label="Odstranit kartu"
                                                            icon={<Trash />}
                                                        />
                                                    </Flex>
                                                </Flex>
                                            </Card>
                                        ))
                                    )}
                                </Stack>
                            </Box>

                            {/* Right side - Card editor */}
                            <Box width="60%">
                                {selectedCardIndex !== null ? (
                                    <>
                                        <Box paddingBottom={4}>
                                            <Typography variant="epsilon" fontWeight="bold">
                                                Náhledový obrázek
                                            </Typography>
                                            <Box paddingTop={2}>
                                                <Button onClick={() => mediaLibrary.setIsVisible(true)} fullWidth>
                                                    {cards[selectedCardIndex].image
                                                        ? "Změnit obrázek"
                                                        : "Vybrat obrázek z knihovny médií"}
                                                </Button>
                                                {cards[selectedCardIndex].image && (
                                                    <Box marginTop={2} padding={2} background="neutral150" borderRadius="4px">
                                                        <Typography variant="pi" fontWeight="bold">
                                                            {cards[selectedCardIndex].image.alt}
                                                        </Typography>
                                                        <Box marginTop={1}>
                                                            <img
                                                                src={cards[selectedCardIndex].image.url}
                                                                alt={cards[selectedCardIndex].image.alt}
                                                                style={{ maxWidth: "100%", maxHeight: "100px" }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>

                                        <Box paddingTop={4} key={selectedCardIndex}>
                                            <Typography variant="epsilon" fontWeight="bold">
                                                Odkaz na
                                            </Typography>
                                            <TabGroup
                                                label="Card link options"
                                                id="card-tabs"
                                                onTabChange={(index) => handleTabChange(index)}
                                                selectedTabIndex={activeTab}
                                            >
                                                <Tabs>
                                                    <Tab>Stránka</Tab>
                                                    <Tab>Novinka</Tab>
                                                </Tabs>
                                                <TabPanels>
                                                    {/* Page Tab */}
                                                    <TabPanel>
                                                        <Box padding={4}>
                                                            {recordSelector.pages.length > 0 ? (
                                                                <Combobox
                                                                    label="Vyberte stránku"
                                                                    placeholder="Hledat stránku..."
                                                                    value={recordSelector.recordId}
                                                                    onChange={handleRecordChange}
                                                                    textInputProps={{
                                                                        placeholder: "Hledat stránku...",
                                                                    }}
                                                                >
                                                                    {recordSelector.pages.map((page) => (
                                                                        <ComboboxOption key={page.id} value={page.id.toString()}>
                                                                            {page.title ||
                                                                                page.name ||
                                                                                `Page ${page.id}`}
                                                                        </ComboboxOption>
                                                                    ))}
                                                                </Combobox>
                                                            ) : (
                                                                <Typography variant="pi">
                                                                    Žádné stránky nebyly nalezeny
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </TabPanel>

                                                    {/* News Entry Tab */}
                                                    <TabPanel>
                                                        <Box padding={4}>
                                                            {recordSelector.newsEntries.length > 0 ? (
                                                                <Combobox
                                                                    label="Vyberte novinku"
                                                                    placeholder="Hledat novinku..."
                                                                    value={recordSelector.recordId}
                                                                    onChange={handleRecordChange}
                                                                    textInputProps={{
                                                                        placeholder: "Hledat novinku...",
                                                                    }}
                                                                >
                                                                    {recordSelector.newsEntries.map((entry) => (
                                                                        <ComboboxOption key={entry.id} value={entry.id.toString()}>
                                                                            {entry.title || `Novinka ${entry.id}`}
                                                                        </ComboboxOption>
                                                                    ))}
                                                                </Combobox>
                                                            ) : (
                                                                <Typography variant="pi">
                                                                    Žádné novinky nebyly nalezeny
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </TabPanel>
                                                </TabPanels>
                                            </TabGroup>
                                        </Box>
                                    </>
                                ) : (
                                    <Box padding={4} background="neutral150" borderRadius="4px">
                                        <Typography variant="pi" textAlign="center">
                                            Vyberte kartu ze seznamu nebo přidejte novou kartu pomocí tlačítka +
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Flex>
                    </Box>

                    <Box paddingTop={4} display="flex" justifyContent="flex-end">
                        <Button onClick={onClose} variant="tertiary" style={{ marginRight: "8px" }}>
                            Zrušit
                        </Button>
                        <Button onClick={handleSave} variant="success-light">
                            Uložit
                        </Button>
                    </Box>
                </Box>
            </ModalLayout>

            <MediaLib
                isOpen={mediaLibrary.isVisible}
                onChange={mediaLibrary.handleMediaLibChange}
                onToggle={() => mediaLibrary.setIsVisible(visibility => !visibility)}
            />
        </>
    );
};

export default CardListDialog;
