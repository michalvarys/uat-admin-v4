import React, { useState } from "react";
import { IconButton } from "@strapi/design-system";
import { Grid } from "@strapi/icons";
import { CardListButtonProps } from "./types";
import CardListDialog from "./CardListDialog";

const CardListButton: React.FC<CardListButtonProps> = ({ editor }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleClick = () => {
        // Open the dialog with the current attributes or empty attributes
        setIsDialogOpen(true);
    };

    const handleSave = (attributes) => {
        try {
            // Close the dialog first
            setIsDialogOpen(false);

            // Then update the editor
            if (editor) {
                // Check if editor has necessary methods
                if (!editor.isActive || !editor.commands) {
                    console.error("Editor is missing required methods");
                    return;
                }

                // Check if we're updating an existing card list or creating a new one
                if (editor.isActive("cardList")) {
                    if (typeof editor.commands.updateCardList !== 'function') {
                        console.error("updateCardList command is not available");
                        return;
                    }

                    editor.commands.updateCardList({
                        cards: attributes.cards,
                        columns: attributes.columns
                    });
                } else {
                    if (typeof editor.commands.setCardList !== 'function') {
                        console.error("setCardList command is not available");
                        return;
                    }

                    editor.commands.setCardList({
                        cards: attributes.cards,
                        columns: attributes.columns
                    });
                }
            }
        } catch (error) {
            console.error("Error saving card list:", error);
        }
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <>
            <IconButton
                icon={<Grid />}
                label="Seznam karet"
                className={editor && editor.isActive ? (editor.isActive("cardList") ? "is-active" : "") : ""}
                onClick={handleClick}
            />

            <CardListDialog
                isOpen={isDialogOpen}
                onClose={handleClose}
                initialAttributes={{
                    cards: editor && editor.isActive && editor.isActive("cardList") && editor.getAttributes
                        ? editor.getAttributes("cardList").cards || []
                        : [],
                    columns: editor && editor.isActive && editor.isActive("cardList") && editor.getAttributes
                        ? editor.getAttributes("cardList").columns || [1, 2, 3, 4, 5]
                        : [1, 2, 3, 4, 5],
                }}
                onSave={handleSave}
            />
        </>
    );
};

export default CardListButton;
