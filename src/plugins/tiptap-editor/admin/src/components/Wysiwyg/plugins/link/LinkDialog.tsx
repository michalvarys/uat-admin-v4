import React from "react";
import {
    ModalLayout,
    Button,
    TextInput,
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
    RadioGroup,
    Radio,
} from "@strapi/design-system";
import { LinkAttributes } from "./types";
import { useLinkDialog } from "./useLinkDialog";
import MediaLib from "../../../MediaLib";

interface LinkDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialAttributes: Partial<LinkAttributes>;
    onSave: (attributes: LinkAttributes) => void;
}

export const LinkDialog: React.FC<LinkDialogProps> = (props) => {
    const {
        url,
        type,
        target,
        activeTab,
        mediaLibVisible,
        selectedFile,
        pages,
        newsEntries,
        selectedPage,
        selectedNewsEntry,
        isLoading,
        setUrl,
        setType,
        setTarget,
        setMediaLibVisible,
        handleMediaLibChange,
        handlePageChange,
        handleNewsEntryChange,
        handleSave,
        handleTabChange,
        onClose,
    } = useLinkDialog(props);

    if (!props.isOpen) {
        return null;
    }

    return (
        <>
            <ModalLayout
                onClose={onClose}
                labelledBy="link-dialog-title"
            >
                <Box padding={8} background="neutral100">
                    <Box paddingBottom={4} borderBottom="1px solid">
                        <Typography variant="beta" id="link-dialog-title">
                            Vložit odkaz
                        </Typography>
                    </Box>

                    <Box paddingTop={4}>
                        <TabGroup
                            label="Link options"
                            id="link-tabs"
                            onTabChange={handleTabChange}
                            selectedTabIndex={activeTab}
                        >
                            <Tabs>
                                <Tab>Vlastní odkaz</Tab>
                                <Tab>Stránka</Tab>
                                <Tab>Novinka</Tab>
                                {/* <Tab>Soubor ke stažení</Tab> */}
                            </Tabs>
                            <TabPanels>
                                {/* Custom Link Tab */}
                                <TabPanel>
                                    <Box padding={4}>
                                        <TextInput
                                            label="Odkaz"
                                            name="url"
                                            placeholder="Vložte odkaz"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                        />
                                    </Box>
                                </TabPanel>

                                {/* Page Tab */}
                                <TabPanel>
                                    <Box padding={4}>
                                        {isLoading ? (
                                            <Loader small>Načítání stránek...</Loader>
                                        ) : pages.length > 0 ? (
                                            <Combobox
                                                label="Vyberte stránku"
                                                placeholder="Hledat stránku..."
                                                value={selectedPage}
                                                onChange={handlePageChange}
                                                textInputProps={{
                                                    placeholder: "Hledat stránku...",
                                                }}
                                            >
                                                {pages.map((page) => (
                                                    <ComboboxOption key={page.id} value={page.id.toString()}>
                                                        {page.attributes.title ||
                                                            page.attributes.name ||
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
                                        {isLoading ? (
                                            <Loader small>Načítání novinek...</Loader>
                                        ) : newsEntries.length > 0 ? (
                                            <Combobox
                                                label="Vyberte novinku"
                                                placeholder="Hledat novinku..."
                                                value={selectedNewsEntry}
                                                onChange={handleNewsEntryChange}
                                                textInputProps={{
                                                    placeholder: "Hledat novinku...",
                                                }}
                                            >
                                                {newsEntries.map((entry) => (
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

                                {/* Download Link Tab */}
                                <TabPanel>
                                    <Box padding={4}>
                                        <Button onClick={() => setMediaLibVisible(true)} fullWidth>
                                            Vybrat soubor z knihovny médií
                                        </Button>
                                        {selectedFile && (
                                            <Box marginTop={4} padding={4} background="neutral150" borderRadius="4px">
                                                <Typography variant="pi" fontWeight="bold">
                                                    {selectedFile.alt}
                                                </Typography>
                                                <Typography variant="pi">
                                                    {url}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </Box>

                    <Box paddingTop={4}>
                        <Stack spacing={4}>
                            <Box>
                                <Typography variant="delta">Typ odkazu</Typography>
                                <RadioGroup
                                    onChange={(e) => setType(e.target.value)}
                                    value={type}
                                    name="linkType"
                                >
                                    <Stack spacing={2}>
                                        <Radio value="link">Odkaz</Radio>
                                        <Radio value="button">Tlačítko</Radio>
                                    </Stack>
                                </RadioGroup>
                            </Box>

                            <Box>
                                <Typography variant="delta">Otevřít v</Typography>
                                <RadioGroup
                                    onChange={(e) => setTarget(e.target.value)}
                                    value={target}
                                    name="linkTarget"
                                >
                                    <Stack spacing={2}>
                                        <Radio value="_self">Stejná stránka</Radio>
                                        <Radio value="_blank">Nová stránka</Radio>
                                    </Stack>
                                </RadioGroup>
                            </Box>
                        </Stack>
                    </Box>

                    <Box paddingTop={4} display="flex" justifyContent="flex-end">
                        <Button onClick={onClose} variant="tertiary" style={{ marginRight: '8px' }}>
                            Zrušit
                        </Button>
                        <Button onClick={handleSave} variant="success-light">
                            Uložit
                        </Button>
                    </Box>
                </Box>
            </ModalLayout>

            <MediaLib
                isOpen={mediaLibVisible}
                onChange={handleMediaLibChange}
                onToggle={() => setMediaLibVisible(!mediaLibVisible)}
            />
        </>
    );
};

export default LinkDialog;
