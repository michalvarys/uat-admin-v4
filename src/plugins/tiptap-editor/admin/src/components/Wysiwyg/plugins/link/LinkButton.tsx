import React, { useEffect, useState } from "react";
import { FaLink as ButtonLinkIcon } from "react-icons/fa";
import { IconButton } from "@strapi/design-system";
import { LinkButtonProps, LinkAttributes } from "./types";
import LinkDialog from "./LinkDialog";

const LinkButton: React.FC<LinkButtonProps> = ({ editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialAttributes, setInitialAttributes] = useState<Partial<LinkAttributes>>({});

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleSave = (attributes: LinkAttributes) => {
        editor.chain().focus().setLink(attributes).run();
        handleClose();
    };

    useEffect(() => {
        if (isOpen) {
            const attributes = editor.getAttributes("link");
            setInitialAttributes(attributes);
        }
    }, [isOpen, editor]);

    return (
        <>
            <IconButton
                icon={<ButtonLinkIcon />}
                label="Odkaz"
                className={[
                    "medium-icon",
                    editor.isActive("link") ? "is-active" : "",
                ]}
                onClick={handleOpen}
            />

            <LinkDialog
                isOpen={isOpen}
                onClose={handleClose}
                initialAttributes={initialAttributes}
                onSave={handleSave}
            />
        </>
    );
};

export default LinkButton;
