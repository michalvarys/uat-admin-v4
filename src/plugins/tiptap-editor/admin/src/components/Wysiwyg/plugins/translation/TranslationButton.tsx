import React, { useState } from "react";
// import { IconButton } from "@strapi/design-system";
import { Icon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { MdTranslate } from "react-icons/md";
import TranslationModal from "./TranslationModal";

type TranslationButtonProps = {
    editor: any;
};

const TranslationButton = ({ editor }: TranslationButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [originalContent, setOriginalContent] = useState<any>(null);
    const [translatedContent, setTranslatedContent] = useState<any>(null);
    const [translatedJson, setTranslatedJson] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const translateContent = async (content: any) => {
        setIsLoading(true);

        try {
            // Call the Google Gemini Flash API for translation
            const response = await fetch("/api/gemini-translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                    targetLanguage: "en", // English
                }),
            });

            if (!response.ok) {
                throw new Error(`Translation API error: ${response.statusText}`);
            }

            const data = await response.json();

            try {
                const json = /```json\n(.*)```/s.exec(data.translatedContent)?.[1] || "{}"
                console.log({ json })
                // The API now returns a JSON string that we need to parse
                const parsedJson = JSON.parse(json);
                setTranslatedJson(data);
                setTranslatedContent(parsedJson);
            } catch (jsonError) {
                console.error("JSON parsing error:", jsonError);
                throw new Error(`Failed to parse translated content: ${jsonError.message}`);
            }
        } catch (error) {
            console.error("Translation error:", error);
            setTranslatedContent(null);
            setTranslatedJson(JSON.stringify({
                type: "doc",
                content: [{
                    type: "paragraph",
                    content: [{
                        type: "text",
                        text: `Translation error: ${error.message}`
                    }]
                }]
            }, null, 2));
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranslateClick = async () => {
        if (!editor) return;

        // Get the current content from the editor
        const content = editor.getJSON();
        setOriginalContent(content);
        setIsModalOpen(true);

        // Translate the content
        await translateContent(content);
    };

    const handleRetry = async () => {
        if (originalContent) {
            await translateContent(originalContent);
        }
    };

    const handleConfirmTranslation = (translatedContent: any) => {
        if (editor && translatedContent) {
            // Update the editor content with the translated content
            editor.commands.setContent(translatedContent);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <IconButton
                icon={<MdTranslate />}
                color="white"
                aria-label="Přeložit do angličtiny"
                title="Přeložit do angličtiny"
                className="large-icon"
                size="xs"
                variant="link"
                onClick={handleTranslateClick}
            />

            <TranslationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                originalContent={originalContent}
                translatedContent={translatedContent}
                isLoading={isLoading}
                onConfirm={handleConfirmTranslation}
                onRetry={handleRetry}
            />
        </>
    );
};

export default TranslationButton;
