import React, { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Select, Option } from "@strapi/design-system";
import { fontFamilyOptions } from "./TextStyleExtensions";

interface FontFamilyButtonProps {
    editor: Editor;
}

const FontFamilyButton: React.FC<FontFamilyButtonProps> = ({ editor }) => {
    const [selectedFontFamily, setSelectedFontFamily] = useState("");

    // Update selected font family when editor selection changes
    useEffect(() => {
        const updateSelectedFontFamily = () => {
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

            // Extract font family from textStyle marks
            let currentFontFamily = "";

            // Look for style attribute in textStyle marks
            for (const mark of textStyleMarks) {
                if (mark.attrs.style) {
                    // Extract font-family from style
                    const fontFamilyMatch = mark.attrs.style.match(/font-family:\s*([^;]+)/);
                    if (fontFamilyMatch && fontFamilyMatch[1]) {
                        currentFontFamily = fontFamilyMatch[1].trim();
                    }
                }

                // Also check direct attributes
                if (mark.attrs.fontFamily) {
                    currentFontFamily = mark.attrs.fontFamily;
                }
            }

            // If no font family found in marks, try getting it from textStyle attributes
            if (!currentFontFamily) {
                currentFontFamily = editor.getAttributes("textStyle").fontFamily || "";
            }

            setSelectedFontFamily(currentFontFamily);
        };

        // Initial update
        updateSelectedFontFamily();

        // Listen for selection changes
        editor.on('selectionUpdate', updateSelectedFontFamily);

        return () => {
            editor.off('selectionUpdate', updateSelectedFontFamily);
        };
    }, [editor]);

    const handleFontFamilyChange = (value: string) => {
        // Apply font family
        if (value) {
            // First use the FontFamily extension command
            editor.chain().focus().setFontFamily(value).run();
        } else {
            // Reset font family
            editor.chain().focus().unsetFontFamily().run();
        }

        // Update selected font family
        setSelectedFontFamily(value);
    };

    return (
        <>
            <Select
                label="Rodina písma"
                value={selectedFontFamily}
                onChange={handleFontFamilyChange}
            >
                <Option value="">Výchozí</Option>
                {fontFamilyOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                        {option.label}
                    </Option>
                ))}
            </Select>
        </>
    );
};

export default FontFamilyButton;
