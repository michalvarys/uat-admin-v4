import React, { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import {
    Select,
    Option,
    NumberInput,
    Flex,
    Box,
    IconButton,
} from "@strapi/design-system";
import { MdFormatSize } from "react-icons/md";

interface FontSizeButtonProps {
    editor: Editor;
}

const fontSizeOptions = [
    { value: "12", label: "12px" },
    { value: "14", label: "14px" },
    { value: "16", label: "16px" },
    { value: "18", label: "18px" },
    { value: "20", label: "20px" },
    { value: "24", label: "24px" },
    { value: "28", label: "28px" },
    { value: "32", label: "32px" },
    { value: "36", label: "36px" },
    { value: "42", label: "42px" },
    { value: "48", label: "48px" },
    { value: "56", label: "56px" },
    { value: "64", label: "64px" },
    { value: "72", label: "72px" },
];

const FontSizeButton: React.FC<FontSizeButtonProps> = ({ editor }) => {
    const [selectedFontSize, setSelectedFontSize] = useState("16px");
    const [customFontSize, setCustomFontSize] = useState<number>(16);
    const [usesCustomFontSize, setUsesCustomFontSize] = useState(false);

    // Update selected font size when editor selection changes
    useEffect(() => {
        const updateSelectedFontSize = () => {
            // Get the current selection
            const { from, to, empty } = editor.state.selection;

            if (empty) {
                return;
            }

            // Get current styles from the selection
            const textStyleMarks: any[] = [];
            editor.state.doc.nodesBetween(from, to, (node) => {
                if (node.marks) {
                    node.marks.forEach(mark => {
                        if (mark.type.name === 'textStyle') {
                            textStyleMarks.push(mark);
                        }
                    });
                }
            });

            // Extract font size from textStyle marks
            let currentFontSize = "";

            // Look for style attribute in textStyle marks
            for (const mark of textStyleMarks) {
                if (mark.attrs.style) {
                    // Extract font-size from style
                    const fontSizeMatch = mark.attrs.style.match(/font-size:\s*([^;]+)/);
                    if (fontSizeMatch && fontSizeMatch[1]) {
                        currentFontSize = fontSizeMatch[1].trim();
                    }
                }

                // Also check direct attributes
                if (mark.attrs.fontSize) {
                    currentFontSize = mark.attrs.fontSize;
                }
            }

            // If no font size found in marks, try getting it from textStyle attributes
            if (!currentFontSize) {
                currentFontSize = editor.getAttributes("textStyle").fontSize || "16px";
            }

            // Check if current font size is in our predefined options
            const fontSizeOption = fontSizeOptions.find(option => option.value === currentFontSize);
            if (fontSizeOption) {
                setSelectedFontSize(currentFontSize);
                setUsesCustomFontSize(false);
            } else if (currentFontSize) {
                // Try to parse custom font size
                const sizeMatch = currentFontSize.match(/(\d+)px/);
                if (sizeMatch && sizeMatch[1]) {
                    setCustomFontSize(parseInt(sizeMatch[1], 10));
                    setUsesCustomFontSize(true);
                } else {
                    // Default to 16px if we can't parse the font size
                    setSelectedFontSize("16px");
                    setUsesCustomFontSize(false);
                }
            } else {
                // Default to 16px if no font size is found
                setSelectedFontSize("16px");
                setUsesCustomFontSize(false);
            }
        };

        // Initial update
        updateSelectedFontSize();

        // Listen for selection changes
        editor.on('selectionUpdate', updateSelectedFontSize);

        return () => {
            editor.off('selectionUpdate', updateSelectedFontSize);
        };
    }, [editor]);

    const handleFontSizeChange = (value: string) => {
        if (value === "custom") {
            setUsesCustomFontSize(true);
            return;
        }

        // Apply font size
        if (value) {
            // First set the fontSize attribute on the textStyle mark
            editor.chain().focus().setMark('textStyle', { fontSize: value }).run();
        } else {
            // Reset font size
            editor.chain().focus()
                .setMark('textStyle', { fontSize: null })
                .removeEmptyTextStyle()
                .run();
        }

        // Update selected font size
        setSelectedFontSize(value);
        setUsesCustomFontSize(false);
    };

    const handleCustomFontSizeApply = () => {
        const fontSize = `${customFontSize}px`;

        // First set the fontSize attribute on the textStyle mark
        editor.chain().focus().setMark('textStyle', { fontSize }).run();

    };

    return (
        <>
            <Flex direction="column" spacing={4} alignItems="flex-start">
                <Select
                    label="Velikost písma"
                    value={usesCustomFontSize ? "custom" : selectedFontSize}
                    onChange={handleFontSizeChange}
                >
                    <Option value="">Výchozí</Option>
                    {fontSizeOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                    <Option value="custom">Vlastní velikost</Option>
                </Select>

                {usesCustomFontSize && (
                    <Flex justifyContent="space-between" alignItems="flex-end">
                        <Box style={{ flex: 1 }}>
                            <NumberInput
                                label="Velikost písma (px)"
                                name="customFontSize"
                                value={customFontSize}
                                onValueChange={(value) => setCustomFontSize(value)}
                            />
                        </Box>
                        <Box paddingLeft={2}>
                            <IconButton
                                icon={<MdFormatSize />}
                                label="Aplikovat"
                                onClick={handleCustomFontSizeApply}
                            />
                        </Box>
                    </Flex>
                )}
            </Flex>
        </>
    );
};

export default FontSizeButton;
