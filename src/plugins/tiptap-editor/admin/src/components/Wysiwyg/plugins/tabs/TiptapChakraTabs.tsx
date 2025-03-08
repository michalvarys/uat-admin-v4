import React, { useState, useEffect } from "react";
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    Box,
    TabPanel,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    IconButton,
} from "@chakra-ui/react";
import {
    Dialog,
    DialogBody,
    DialogFooter,
    Grid,
    NumberInput,
    Select,
    Option,
    TextInput,
    TabGroup,
} from "@strapi/design-system";
import styled from "styled-components";
import { EditorContent } from "@tiptap/react";
import { useCustomEditor } from "../../editor";
import MenuBar from "../../MenuBar";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { TabType } from "./TabsExtension";
import Wrapper from '../../style'

const _interopDefault = (e) => (e && e.__esModule ? e : { default: e });
const styled__default = /*#__PURE__*/ _interopDefault(styled);
const StyledDialog = styled__default.default(Dialog)`
    max-width: 100%;
`;
const StyledDialogBody = styled__default.default(DialogBody)`
    max-width: 800px;
    min-width: 600px;
`;

interface TiptapChakraTabsProps {
    tabs: TabType[];
    setTabs: (tabs: TabType[]) => void;
}

export default function TiptapChakraTabs({
    tabs,
    setTabs,
}: TiptapChakraTabsProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [currentTab, setCurrentTab] = useState(0);

    const editor = useCustomEditor({
        content: tabs[currentTab].content,
    });

    const addTab = () => {
        const newTabs = [
            ...tabs,
            { title: `Tab ${tabs.length + 1}`, content: "", json: "" },
        ];
        setTabs(newTabs);
        setCurrentTab(newTabs.length - 1);
    };

    const saveContent = () => {
        if (!editor) {
            return;
        }
        const newTabs = [...tabs];
        newTabs[currentTab].content = editor.getHTML();
        newTabs[currentTab].json = JSON.stringify(editor.getJSON());
        setTabs(newTabs);
        onClose();
    };

    const handleTitleClick = (index: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        setEditingIndex(index);
    };

    const handleTitleChange =
        (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const newTabs = [...tabs];
            newTabs[index] = { ...newTabs[index], title: e.target.value };
            setTabs(newTabs);
        };

    const handleTitleBlur = () => {
        setEditingIndex(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            setEditingIndex(null);
        }
    };

    const deleteTab = () => {
        const newTabs = [...tabs];
        if (tabs.length === 1) {
            return;
        }
        newTabs.splice(currentTab, 1);
        setTabs(newTabs);
        setCurrentTab(newTabs.length - 1);
        onClose();
    };

    const resetContent = () => {
        editor?.commands.setContent(tabs[currentTab].content);
    };

    const handleCancel = () => {
        onClose();
        resetContent();
    };

    // Aktualizujte editor, když se změní aktuální záložka
    useEffect(() => {
        resetContent();
    }, [currentTab, editor]);

    return (
        <>
            <Tabs
                // TODO sjednotit web a admin přes @ssupat/components knihovnu
                variant="solid-rounded"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="md"
                py={4}
                mt={4}
                index={currentTab}
                onChange={(index) => setCurrentTab(index)}
            >
                <TabList>
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            _active={{ color: "white", bgColor: "brand.500" }}
                            p={4}
                        >
                            {editingIndex === index ? (
                                <Input
                                    value={tab.title}
                                    onChange={handleTitleChange(index)}
                                    onBlur={handleTitleBlur}
                                    onKeyDown={handleKeyDown}
                                    size="md"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                    variant="flushed"
                                    placeholder="Název záložky"
                                    _focus={{
                                        borderColor: "blue.500",
                                        boxShadow: "none",
                                    }}
                                />
                            ) : (
                                <Box
                                    onClick={handleTitleClick(index)}
                                    flex="1"
                                    textAlign="left"
                                    cursor="pointer"
                                    _hover={{
                                        color: "blue.500",
                                    }}
                                >
                                    {tab.title || "Klikněte pro úpravu"}
                                </Box>
                            )}
                        </Tab>
                    ))}
                    <IconButton
                        aria-label="Přidat"
                        onClick={addTab}
                        ml={2}
                        size="xs"
                        icon={<AddIcon />}
                    />
                </TabList>
                <TabPanels>
                    {tabs.map((tab, index) => (
                        <TabPanel key={index} position="relative">
                            <IconButton
                                position="absolute"
                                top={2}
                                right={2}
                                aria-label="Upravit"
                                icon={<EditIcon />}
                                size="xs"
                                onClick={onOpen}
                            />

                            <Box
                                sx={{
                                    "a:hover": {
                                        color: "uat_orange",
                                        textDecoration: "underline",
                                    },
                                }}
                                dangerouslySetInnerHTML={{ __html: tab.content || "" }}
                            />
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>

            <StyledDialog
                onClose={onClose}
                title="Nastavení záložky"
                isOpen={isOpen}
                style={{
                    width: "100%",
                    maxWidth: "800px",
                    maxHeight: "70vh",
                    overflow: "auto",
                    color: "white",
                }}
            >
                <StyledDialogBody>
                    <Wrapper>

                        <MenuBar
                            editor={editor}
                            debug
                            playground={false}
                            setDebug={(debug) => console.log(debug)}
                        />
                        <Box
                            className="editor-content-wrapper"
                            padding={2}
                            background="neutral0"
                            maxHeight={'600px'}
                            minHeight={'100px'}
                            style={{ resize: 'vertical', overflow: 'auto' }}
                        >
                            <EditorContent editor={editor} />
                        </Box>
                    </Wrapper>
                </StyledDialogBody>

                <DialogFooter
                    startAction={
                        <>
                            <Button onClick={handleCancel} variant="tertiary" size="xs">
                                Zrušit
                            </Button>

                            <IconButton
                                disabled={tabs.length === 1}
                                aria-label="smazat"
                                variant="link"
                                colorScheme="red"
                                onClick={deleteTab}
                                icon={<DeleteIcon />}
                                size="xs"
                            />
                        </>
                    }
                    endAction={
                        <Button onClick={saveContent} mt={4}>
                            Save
                        </Button>
                    }
                />
            </StyledDialog>
        </>
    );
}
