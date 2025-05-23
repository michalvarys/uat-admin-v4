import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import {
    IconButton,
    Dialog,
    DialogBody,
    DialogFooter,
    Button,
    Tabs,
    Tab,
    TabGroup,
    TabPanel,
    TabPanels,
    NumberInput,
    Select,
    Option,
} from "@strapi/design-system";
import { MdFormatColorText, MdFormatSize, MdFontDownload } from "react-icons/md";
import { Box, Flex } from "@chakra-ui/react";
import { ColorsSelect } from "../../ColorSelect";
import { getColorValue, getColorKey } from "../../tools";
import { fontFamilyOptions } from "./TextStyleExtensions";

interface TextStyleButtonProps {
    editor: Editor;
}

const fontSizeOptions = [
    { value: "12px", label: "12px" },
    { value: "14px", label: "14px" },
    { value: "16px", label: "16px" },
    { value: "18px", label: "18px" },
    { value: "20px", label: "20px" },
    { value: "24px", label: "24px" },
    { value: "28px", label: "28px" },
    { value: "32px", label: "32px" },
    { value: "36px", label: "36px" },
    { value: "42px", label: "42px" },
    { value: "48px", label: "48px" },
    { value: "56px", label: "56px" },
    { value: "64px", label: "64px" },
    { value: "72px", label: "72px" },
];

const TextStyleButton: React.FC<TextStyleButtonProps> = ({ editor }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedFontSize, setSelectedFontSize] = useState("16px");
    const [customFontSize, setCustomFontSize] = useState<number>(16);
    const [usesCustomFontSize, setUsesCustomFontSize] = useState(false);
    const [selectedFontFamily, setSelectedFontFamily] = useState("");

    const handleOpenDialog = () => {
        // Get the current selection
        const { from, to, empty } = editor.state.selection;

        if (empty) {
            // If no selection, use default values
            setSelectedColor("");
            setSelectedFontSize("16px");
            setUsesCustomFontSize(false);
            setSelectedFontFamily("");
            setIsDialogOpen(true);
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

        // Extract color from the Color extension
        const currentColorHex = editor.getAttributes("textStyle").color || "";

        // Extract font size and font family from textStyle marks
        let currentFontSize = "";
        let currentFontFamily = "";

        // Look for style attribute in textStyle marks
        for (const mark of textStyleMarks) {
            if (mark.attrs.style) {
                // Extract font-size from style
                const fontSizeMatch = mark.attrs.style.match(/font-size:\s*([^;]+)/);
                if (fontSizeMatch && fontSizeMatch[1]) {
                    currentFontSize = fontSizeMatch[1].trim();
                }

                // Extract font-family from style
                const fontFamilyMatch = mark.attrs.style.match(/font-family:\s*([^;]+)/);
                if (fontFamilyMatch && fontFamilyMatch[1]) {
                    currentFontFamily = fontFamilyMatch[1].trim();
                }
            }

            // Also check direct attributes
            if (mark.attrs.fontSize) {
                currentFontSize = mark.attrs.fontSize;
            }
            if (mark.attrs.fontFamily) {
                currentFontFamily = mark.attrs.fontFamily;
            }
        }

        // If no font size found in marks, try getting it from textStyle attributes
        if (!currentFontSize) {
            currentFontSize = editor.getAttributes("textStyle").fontSize || "16px";
        }

        // If no font family found in marks, try getting it from fontFamily attributes
        if (!currentFontFamily) {
            currentFontFamily = editor.getAttributes("textStyle").fontFamily || "";
        }

        // Convert hex color back to color key
        const currentColor = getColorKey(currentColorHex);
        setSelectedColor(currentColor);
        setSelectedFontFamily(currentFontFamily);

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

        setIsDialogOpen(true);
    };

    const handleApply = () => {
        // Apply color if selected
        if (selectedColor) {
            const colorValue = getColorValue(selectedColor);
            if (colorValue) {
                editor.chain().focus().setColor(colorValue).run();
            } else {
                editor.chain().focus().unsetColor().run();
            }
        } else {
            editor.chain().focus().unsetColor().run();
        }

        // Apply font size
        const fontSize = usesCustomFontSize ? `${customFontSize}px` : selectedFontSize;
        if (fontSize) {
            // First set the fontSize attribute on the textStyle mark
            editor.chain().focus().setMark('textStyle', { fontSize }).run();

            // Then explicitly set the style attribute on the selected text
            const selection = editor.state.selection;
            if (!selection.empty) {
                const tr = editor.state.tr;
                const style = `font-size: ${fontSize};`;
                tr.addMark(
                    selection.from,
                    selection.to,
                    editor.schema.marks.textStyle.create({ style })
                );
                editor.view.dispatch(tr);
            }
        } else {
            editor.chain().focus().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
        }

        // Apply font family
        if (selectedFontFamily) {
            // First use the FontFamily extension command
            editor.chain().focus().setFontFamily(selectedFontFamily).run();

            // Then explicitly set the style attribute on the selected text
            const selection = editor.state.selection;
            if (!selection.empty) {
                const tr = editor.state.tr;
                const style = `font-family: ${selectedFontFamily};`;
                tr.addMark(
                    selection.from,
                    selection.to,
                    editor.schema.marks.textStyle.create({ style })
                );
                editor.view.dispatch(tr);
            }
        } else {
            editor.chain().focus().unsetFontFamily().run();
        }

        setIsDialogOpen(false);
    };

    const handleReset = () => {
        // Unset color
        editor.chain().focus().unsetColor().run();

        // Unset font size and font family
        editor.chain().focus()
            .setMark('textStyle', { fontSize: null, fontFamily: null })
            .removeEmptyTextStyle()
            .run();

        // Also remove inline styles
        const selection = editor.state.selection;
        if (!selection.empty) {
            const tr = editor.state.tr;
            // Remove any textStyle marks in the selection
            tr.removeMark(
                selection.from,
                selection.to,
                editor.schema.marks.textStyle
            );
            editor.view.dispatch(tr);
        }

        setIsDialogOpen(false);
    };

    return (
        <>
            <IconButton
                icon={<MdFormatColorText />}
                label="Styl textu"
                onClick={handleOpenDialog}
                className={[
                    "large-icon",
                    editor.isActive("textStyle") || editor.isActive("color")
                        ? "is-active"
                        : "",
                ]}
            />

            <Dialog
                onClose={() => setIsDialogOpen(false)}
                title="Text Style"
                isOpen={isDialogOpen}
            >
                <DialogBody>
                    <TabGroup
                        id="tabs"
                        onTabChange={(selected) => setActiveTab(selected)}
                    >
                        <Tabs>
                            <Tab>Barva písma</Tab>
                            <Tab>Velikost písma</Tab>
                            <Tab>Rodina písma</Tab>
                        </Tabs>
                        <TabPanels>
                            <TabPanel>
                                <Box padding={4}>
                                    <ColorsSelect
                                        label="Barva písma"
                                        value={selectedColor}
                                        onChange={(value) => setSelectedColor(value)}
                                    />
                                </Box>
                            </TabPanel>
                            <TabPanel>
                                <Box padding={4}>
                                    <Flex direction="column" gap={4}>
                                        <Select
                                            label="Velikost písma"
                                            value={usesCustomFontSize ? "custom" : selectedFontSize}
                                            onChange={(value) => {
                                                if (value === "custom") {
                                                    setUsesCustomFontSize(true);
                                                } else {
                                                    setSelectedFontSize(value);
                                                    setUsesCustomFontSize(false);
                                                }
                                            }}
                                        >
                                            {fontSizeOptions.map((option) => (
                                                <Option key={option.value} value={option.value}>
                                                    {option.label}
                                                </Option>
                                            ))}
                                            <Option value="custom">Vlastní velikost</Option>
                                        </Select>

                                        {usesCustomFontSize && (
                                            <NumberInput
                                                label="Velikost písma (px)"
                                                name="customFontSize"
                                                value={customFontSize}
                                                onValueChange={(value) => setCustomFontSize(value)}
                                            />
                                        )}
                                    </Flex>
                                </Box>
                            </TabPanel>
                            <TabPanel>
                                <Box padding={4}>
                                    <Select
                                        label="Rodina písma"
                                        value={selectedFontFamily}
                                        onChange={(value) => setSelectedFontFamily(value)}
                                    >
                                        <Option value="">Výchozí</Option>
                                        {fontFamilyOptions.map((option) => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Box>
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </DialogBody>
                <DialogFooter
                    startAction={
                        <Button
                            onClick={handleReset}
                            variant="danger-light"
                            size="S"
                        >
                            Resetovat styly
                        </Button>
                    }
                    endAction={
                        <>
                            <Button
                                onClick={() => setIsDialogOpen(false)}
                                variant="tertiary"
                                size="S"
                            >
                                Zrušit
                            </Button>
                            <Button
                                onClick={handleApply}
                                variant="success-light"
                                size="S"
                            >
                                Aplikovat
                            </Button>
                        </>
                    }
                />
            </Dialog>
        </>
    );
};

export default TextStyleButton;
