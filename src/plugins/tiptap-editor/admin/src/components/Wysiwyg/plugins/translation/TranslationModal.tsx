import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogBody,
    DialogFooter,
    Button,
    Flex,
    Box,
    Typography,
    Loader,
    Tabs,
    Tab,
    TabGroup,
    TabPanel,
    TabPanels,
} from "@strapi/design-system";
import { EditorContent } from "@tiptap/react";
import { useCustomEditor } from "../../editor";
import { GalleryProvider } from "../gallery/GalleryContext";
import { EditorDataProvider } from "../../context/EditorDataContext";
import Wrapper from '../../style';

type TranslationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    originalContent: any;
    translatedContent: any;
    isLoading: boolean;
    onConfirm: (json: any) => void;
    onRetry?: () => void;
};

const TranslationModal = ({
    isOpen,
    onClose,
    originalContent,
    translatedContent,
    isLoading,
    onConfirm,
    onRetry: onRetranslate,
}: TranslationModalProps) => {
    // Create a read-only editor for the translated content
    const translatedEditor = useCustomEditor({
        value: JSON.stringify(translatedContent || { type: "doc", content: [] }),
        name: "translated-content",
        onChange: () => { },
        editable: false,
    });

    useEffect(() => {
        if (translatedEditor && translatedContent) {
            translatedEditor.commands.setContent(translatedContent);
        }
    }, [translatedContent, translatedEditor]);

    return (
        <Dialog
            id="translation-modal"
            onClose={onClose}
            title="Překlad do angličtiny"
            isOpen={isOpen}
        >
            <DialogBody icon={null}>
                <Flex direction="column" gap={4}>
                    <Box
                        className="editor-content-wrapper"
                        padding={2}
                        background="neutral0"
                        style={{
                            maxHeight: "300px",
                            minHeight: "100px",
                            overflow: "auto",
                            resize: "vertical"
                        }}
                    >
                        {isLoading ? (
                            <Flex justifyContent="center" padding={6}>
                                <Loader>Překládám obsah...</Loader>
                            </Flex>
                        ) : translatedEditor ? (
                            <Wrapper>
                                <EditorDataProvider>
                                    <GalleryProvider editor={translatedEditor}>
                                        <EditorContent editor={translatedEditor} />
                                    </GalleryProvider>
                                </EditorDataProvider>
                            </Wrapper>
                        ) : null}
                    </Box>
                </Flex>
            </DialogBody>
            <DialogFooter
                startAction={
                    <Flex gap={2}>
                        <Button onClick={onClose} variant="tertiary">
                            Zrušit
                        </Button>

                        {onRetranslate && (
                            <Button
                                onClick={onRetranslate}
                                variant="secondary"
                                disabled={isLoading || !originalContent}
                            >
                                Znovu
                            </Button>
                        )}
                    </Flex>
                }
                endAction={
                    <Button
                        onClick={() => onConfirm(translatedEditor?.getJSON())}
                        variant="success-light"
                        disabled={isLoading || !translatedContent}
                    >
                        Použít překlad
                    </Button>
                }
            />
        </Dialog>
    );
};

export default TranslationModal;
