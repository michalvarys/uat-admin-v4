import React, { useEffect } from "react";
import {
    ModalLayout,
    Button,
    TextInput,
    Select,
    Option,
    Stack,
    Typography,
    Box,
    IconButton,
} from "@strapi/design-system";
import { Trash, Drag } from "@strapi/icons";
import MediaLib from "../../../MediaLib";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useGalleryDialog } from "./useGalleryDialog";

export const GalleryDialog: React.FC = () => {
    const {
        isOpen,
        onClose,
        galleryAttrs,
        setGalleryAttrs,
        handleSave,
        handleCancel,
        mediaLibVisible,
        setMediaLibVisible,
        handleMediaLibSelect,
        removeImage,
        reorderImages,
        isEditing,
    } = useGalleryDialog();

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        reorderImages(result.source.index, result.destination.index);
    };

    return (
        <>
            {isOpen && (
                <ModalLayout
                    onClose={onClose}
                    labelledBy="gallery-title"
                >
                    <Box padding={8} background="neutral100">
                        <Box paddingBottom={4} borderBottom="1px solid">
                            <Typography variant="beta" id="gallery-title">
                                {isEditing ? "Upravit galerii" : "Vložit galerii"}
                            </Typography>
                        </Box>
                        <Stack spacing={6}>
                            <Box>
                                <Button onClick={() => setMediaLibVisible(true)} fullWidth>
                                    Přidat obrázky z galerie
                                </Button>
                                {galleryAttrs.images.length > 0 && (
                                    <Typography variant="pi" textColor="neutral600" style={{ marginTop: '0.5rem' }}>
                                        Počet obrázků v galerii: {galleryAttrs.images.length}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <Typography variant="delta">Nastavení galerie</Typography>
                                <Stack spacing={4}>
                                    <TextInput
                                        label="Počet sloupců"
                                        name="columns"
                                        type="number"
                                        value={galleryAttrs.columns}
                                        onChange={(e) =>
                                            setGalleryAttrs(prev => ({
                                                ...prev,
                                                columns: Math.min(Math.max(parseInt(e.target.value) || 1, 1), 6),
                                            }))
                                        }
                                        hint="Hodnota mezi 1-6"
                                    />

                                    <TextInput
                                        label="Mezera mezi obrázky"
                                        name="spacing"
                                        type="number"
                                        value={galleryAttrs.spacing}
                                        onChange={(e) =>
                                            setGalleryAttrs(prev => ({
                                                ...prev,
                                                spacing: Math.min(Math.max(parseInt(e.target.value) || 0, 0), 8),
                                            }))
                                        }
                                        hint="Hodnota mezi 0-8"
                                    />

                                    <Select
                                        label="Poměr stran"
                                        value={galleryAttrs.aspectRatio}
                                        onChange={(value) =>
                                            setGalleryAttrs(prev => ({
                                                ...prev,
                                                aspectRatio: value,
                                            }))
                                        }
                                    >
                                        <Option value="1">1:1 (čtverec)</Option>
                                        <Option value="4/3">4:3</Option>
                                        <Option value="16/9">16:9</Option>
                                        <Option value="2/3">2:3 (portrét)</Option>
                                    </Select>
                                </Stack>
                            </Box>

                            <Box>
                                <Typography variant="delta">Obrázky v galerii</Typography>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="gallery-images" direction="horizontal">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '1rem',
                                                    marginTop: '1rem',
                                                    minHeight: galleryAttrs.images.length ? 'auto' : '100px',
                                                    border: galleryAttrs.images.length ? 'none' : '2px dashed #ddd',
                                                    borderRadius: '4px',
                                                    padding: '1rem',
                                                }}
                                            >
                                                {galleryAttrs.images.map((image, index) => (
                                                    <Draggable
                                                        key={image.src}
                                                        draggableId={image.src}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                style={{
                                                                    position: 'relative',
                                                                    width: 'calc(25% - 0.75rem)', // 4 items per row with gap
                                                                    aspectRatio: galleryAttrs.aspectRatio,
                                                                    // backgroundColor: '#f6f6f9',
                                                                    borderRadius: '4px',
                                                                    overflow: 'hidden',
                                                                    boxShadow: provided.draggableProps.style?.transform
                                                                        ? '0 5px 15px rgba(0,0,0,0.3)'
                                                                        : '0 1px 3px rgba(0,0,0,0.1)',
                                                                    transition: 'box-shadow 0.2s',
                                                                    ...provided.draggableProps.style,
                                                                }}
                                                            >
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '4px',
                                                                        left: '4px',
                                                                        zIndex: 2,
                                                                        width: '30px',
                                                                        height: '30px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        cursor: 'grab',
                                                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                                        borderRadius: '4px',
                                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                                                                        transition: 'all 0.2s',
                                                                    }}
                                                                    onMouseOver={(e) => {
                                                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                                                                        e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                                                                    }}
                                                                    onMouseOut={(e) => {
                                                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
                                                                    }}
                                                                >
                                                                    <Drag />
                                                                </div>
                                                                <IconButton
                                                                    label="Smazat"
                                                                    icon={<Trash />}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '4px',
                                                                        right: '4px',
                                                                        zIndex: 2,
                                                                    }}
                                                                    onClick={() => removeImage(index)}
                                                                />
                                                                <img
                                                                    src={image.src}
                                                                    alt={image.alt}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover',
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Box>
                        </Stack>
                        <Box paddingTop={4} display="flex" justifyContent="flex-end" textAlign="right">
                            <Button onClick={handleCancel} variant="tertiary" style={{ marginRight: '8px' }}>
                                Zrušit
                            </Button>
                            <Button onClick={handleSave} variant="success-light">
                                {isEditing ? "Upravit galerii" : "Vložit galerii"}
                            </Button>
                        </Box>
                    </Box>
                </ModalLayout>
            )}

            <MediaLib
                isOpen={mediaLibVisible}
                onChange={(files) => {
                    handleMediaLibSelect(files);
                }}
                onToggle={() => {
                    setMediaLibVisible(mediaLibVisible => !mediaLibVisible);
                }}
            />
        </>
    );
};
