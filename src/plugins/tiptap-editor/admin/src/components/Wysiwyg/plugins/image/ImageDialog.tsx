import React from "react";
import {
    Stack,
} from "@chakra-ui/react";
import {
    Dialog,
    DialogBody,
    DialogFooter,
    Button,
    Select,
    Option,
    TextInput
} from "@strapi/design-system";
import { ImageAttributes } from "./ImageExtension";
import MediaLib from "../../../MediaLib";

interface ImageDialogProps {
    isOpen: boolean;
    onClose: () => void;
    imageAttrs: ImageAttributes;
    setImageAttrs: React.Dispatch<React.SetStateAction<ImageAttributes>>;
    onSave: () => void;
    onCancel: () => void;
    mediaLibVisible: boolean;
    setMediaLibVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleMediaLibSelect: (files: any[]) => void;
    isEditing: boolean;
}

export const ImageDialog: React.FC<ImageDialogProps> = ({
    isOpen,
    onClose,
    imageAttrs,
    setImageAttrs,
    onSave,
    onCancel,
    mediaLibVisible,
    setMediaLibVisible,
    handleMediaLibSelect,
    isEditing,
}) => {
    return (
        <>
            <Dialog
                onClose={onClose}
                title={isEditing ? "Upravit obrázek" : "Vložit obrázek"}
                isOpen={isOpen}
                style={{
                    width: "100%",
                    maxWidth: "800px",
                    maxHeight: "70vh",
                    overflow: "auto",
                }}
            >
                <DialogBody style={{ maxWidth: "800px", minWidth: "600px" }}>
                    <Stack spacing={4}>
                        <Button onClick={() => setMediaLibVisible(true)}>
                            Vybrat z galerie
                        </Button>

                        <TextInput
                            label="URL Obrázku"
                            name="src"
                            value={imageAttrs.src}
                            onChange={(e) =>
                                setImageAttrs(prev => ({
                                    ...prev,
                                    src: e.target.value,
                                }))
                            }
                            placeholder="Vložit URL"
                        />

                        <TextInput
                            label="Alternativní Text"
                            name="alt"
                            value={imageAttrs.alt}
                            onChange={(e) =>
                                setImageAttrs(prev => ({
                                    ...prev,
                                    alt: e.target.value,
                                }))
                            }
                            placeholder="Zadat alternativní text"
                        />

                        <TextInput
                            label="Box Size"
                            name="boxSize"
                            value={imageAttrs.boxSize}
                            onChange={(e) =>
                                setImageAttrs(prev => ({
                                    ...prev,
                                    boxSize: e.target.value,
                                }))
                            }
                            placeholder="e.g., 200px, 50%, auto"
                        />

                        {/* <Select
                            label="Object Fit"
                            value={imageAttrs.objectFit}
                            onChange={(value) =>
                                setImageAttrs(prev => ({
                                    ...prev,
                                    objectFit: value as ImageAttributes["objectFit"],
                                }))
                            }
                        >
                            <Option value="contain">Contain</Option>
                            <Option value="cover">Cover</Option>
                            <Option value="fill">Fill</Option>
                            <Option value="none">None</Option>
                            <Option value="scale-down">Scale Down</Option>
                        </Select> */}

                        <TextInput
                            label="URL Záložního zdroje"
                            name="fallbackSrc"
                            value={imageAttrs.fallbackSrc}
                            onChange={(e) =>
                                setImageAttrs(prev => ({
                                    ...prev,
                                    fallbackSrc: e.target.value,
                                }))
                            }
                            placeholder="URL Záložního zdroje"
                        />
                    </Stack>
                </DialogBody>

                <DialogFooter
                    startAction={
                        <Button onClick={onCancel} variant="tertiary">
                            Zrušit
                        </Button>
                    }
                    endAction={
                        <Button onClick={onSave} variant="success-light">
                            {isEditing ? "Upravit obrázek" : "Vložit obrázek"}
                        </Button>
                    }
                />
            </Dialog>

            <MediaLib
                isOpen={mediaLibVisible}
                onChange={handleMediaLibSelect}
                onToggle={() => setMediaLibVisible(!mediaLibVisible)}
            />
        </>
    );
};
