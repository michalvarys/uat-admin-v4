import React, { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { ColorsSelect } from "../../ColorSelect";
import { getColorValue, findColorKeyByValue } from "../../tools";

interface ColorButtonProps {
    editor: Editor;
}

const ColorButton: React.FC<ColorButtonProps> = ({ editor }) => {
    const [selectedColor, setSelectedColor] = useState("");

    // Update selected color when editor selection changes
    useEffect(() => {
        const updateSelectedColor = () => {
            const currentColorHex = editor.getAttributes("textStyle").color || "";

            if (!currentColorHex) {
                setSelectedColor("");
                return;
            }

            // Find the color key for the current color value
            const colorKey = findColorKeyByValue(currentColorHex);
            setSelectedColor(colorKey);
        };

        // Initial update
        updateSelectedColor();

        // Listen for selection changes
        editor.on('selectionUpdate', updateSelectedColor);

        return () => {
            editor.off('selectionUpdate', updateSelectedColor);
        };
    }, [editor]);

    const handleColorChange = (value: string) => {
        // Apply color if selected
        if (value) {
            const colorValue = getColorValue(value);
            if (colorValue) {
                editor.chain().focus().setColor(colorValue).run();
            } else {
                editor.chain().focus().unsetColor().run();
            }
        } else {
            // Reset color if empty value selected
            editor.chain().focus().unsetColor().run();
        }

        // Update selected color
        setSelectedColor(value);
    };

    return (
        <ColorsSelect
            label="Barva textu"
            value={selectedColor}
            onChange={handleColorChange}
        />
    );
};

export default ColorButton;
