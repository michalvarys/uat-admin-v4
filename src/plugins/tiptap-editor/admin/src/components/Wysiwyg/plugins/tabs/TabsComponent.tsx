import React, { useMemo, useState, useEffect } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import {
    Box,
    Flex,
    Dialog,
    DialogBody,
    DialogFooter,
    Tabs,
    Tab,
    TabGroup,
    TabPanel,
    TabPanels,
    TextInput,
} from "@strapi/design-system";
import { Button } from '@chakra-ui/react'
import { MdSettings, MdAdd, MdEdit } from "react-icons/md";

export const TabsComponent = (props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [editingTabIndex, setEditingTabIndex] = useState<number | null>(null);
    const [editingTabTitle, setEditingTabTitle] = useState("");

    // State for tabs settings
    const [title, setTitle] = useState(props.node.attrs.title || "");
    const [description, setDescription] = useState(props.node.attrs.description || "");

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleApply = () => {
        // Update tabs attributes
        props.updateAttributes({
            title,
            description,
        });

        setIsDialogOpen(false);
    };

    const handleAddItem = () => {
        try {
            // We now know that editor is available in props
            if (!props.editor) {
                console.error("Editor is not available in props");
                return;
            }

            // Get the current position
            if (typeof props.getPos !== 'function') {
                console.error("getPos is not a function");
                return;
            }

            // Get the current node position
            const pos = props.getPos();

            // Use the editor to insert a new tab item at the end of the current tabs
            props.editor.commands.insertContentAt(
                pos + props.node.nodeSize - 1,
                {
                    type: 'tabItem',
                    attrs: {
                        title: `Tab ${props.node.content.childCount + 1}`,
                    },
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "Klikněte pro úpravu obsahu",
                                },
                            ],
                        },
                    ]
                }
            );
        } catch (error) {
            console.error("Error adding tab item:", error);
        }
    };

    // Get tab items from content
    const tabItems = useMemo(() => {
        const items: Array<{ title: string, index: number }> = [];
        if (props.node.content) {
            props.node.content.forEach((item: any, index: number) => {
                if (item.type.name === 'tabItem') {
                    items.push({
                        title: item.attrs.title || `Tab ${index + 1}`,
                        index,
                    });
                }
            });
        }
        return items;
    }, [props.node.content]);

    // Start editing a tab title
    const handleTabTitleClick = (index: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingTabIndex(index);
        setEditingTabTitle(tabItems[index].title);
    };

    // Save the edited tab title
    const handleTabTitleSave = () => {
        if (editingTabIndex === null) return;

        try {
            // Get the tab item node
            const tabItem = props.node.content.child(editingTabIndex);

            // Update the tab item's title attribute
            if (!props.editor) {
                console.error("Editor is undefined");
                return;
            }

            if (typeof props.getPos !== 'function') {
                console.error("getPos is not a function");
                return;
            }

            // Calculate the position of the tab item
            const pos = props.getPos() + 1; // +1 to skip the parent node start
            let tabItemPos = pos;

            // Find the position of the specific tab item
            for (let i = 0; i < editingTabIndex; i++) {
                tabItemPos += props.node.content.child(i).nodeSize;
            }

            // Update the tab item's attributes
            props.editor.chain().focus().setNodeSelection(tabItemPos).updateAttributes('tabItem', {
                title: editingTabTitle,
            }).run();

            setEditingTabIndex(null);
        } catch (error) {
            console.error("Error updating tab title:", error);
        }
    };

    // Handle key press in the tab title input
    const handleTabTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleTabTitleSave();
        } else if (e.key === "Escape") {
            e.preventDefault();
            setEditingTabIndex(null);
        }
    };

    return (
        <NodeViewWrapper className="tabs-container">
            <Box padding={2} background="neutral100" width="100%" style={{ position: "relative" }}>
                {title && (
                    <Box paddingBottom={2}>
                        <h3>{title}</h3>
                    </Box>
                )}

                {description && (
                    <Box paddingBottom={4}>
                        <p>{description}</p>
                    </Box>
                )}

                <TabGroup id="tabs" onTabChange={(selected) => setActiveTab(selected)}>
                    <Tabs>
                        {tabItems.map((item, index) => (
                            <Tab key={item.index} onClick={(e) => {
                                // Prevent tab change if we're editing
                                if (editingTabIndex !== null) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }}>
                                {editingTabIndex === index ? (
                                    <Box onClick={(e) => e.stopPropagation()}>
                                        <input
                                            autoFocus
                                            aria-label="Edit tab title"
                                            name={`tab-title-${index}`}
                                            value={editingTabTitle}
                                            onChange={(e) => setEditingTabTitle(e.target.value)}
                                            onBlur={handleTabTitleSave}
                                            onKeyDown={handleTabTitleKeyDown}
                                            style={{
                                                minWidth: '100px',
                                                padding: '8px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </Box>
                                ) : (
                                    <Flex alignItems="center">
                                        <Box onClick={(e) => e.stopPropagation()}>
                                            {item.title}
                                        </Box>
                                        <Button
                                            variant="tertiary"
                                            onClick={handleTabTitleClick(index)}
                                            style={{ padding: '0 4px', marginLeft: '4px' }}
                                        >
                                            <MdEdit size={14} />
                                        </Button>
                                    </Flex>
                                )}
                            </Tab>
                        ))}
                    </Tabs>
                    <TabPanels>
                        {tabItems.map((item, idx) => (
                            <TabPanel key={item.index}>
                                <Box padding={4}>
                                    {activeTab === idx && (
                                        <NodeViewContent className="tabs-content" />
                                    )}
                                </Box>
                            </TabPanel>
                        ))}
                    </TabPanels>
                </TabGroup>

                <Flex justifyContent="center" gap={2}>
                    <Button
                        size="xs"
                        variant="outline"
                        colorScheme="orange"
                        leftIcon={<MdAdd />}
                        onClick={handleAddItem}
                    >
                        Přidat položku
                    </Button>
                    <Button
                        size="xs"
                        variant="solid"
                        colorScheme="orange"
                        leftIcon={<MdSettings />}
                        onClick={handleOpenDialog}
                    >
                        Nastavení
                    </Button>
                </Flex>
            </Box>

            <Dialog
                onClose={() => setIsDialogOpen(false)}
                title="Nastavení záložek"
                isOpen={isDialogOpen}
            >
                <DialogBody>
                    <Box padding={4}>
                        <TextInput
                            label="Nadpis"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nadpis záložek"
                        />

                        <Box paddingTop={4}>
                            <TextInput
                                label="Popis"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Popis záložek"
                            />
                        </Box>
                    </Box>
                </DialogBody>
                <DialogFooter
                    startAction={
                        <Button
                            colorScheme="orange"
                            onClick={() => setIsDialogOpen(false)}
                            variant="link"
                        >
                            Zrušit
                        </Button>
                    }
                    endAction={
                        <Button
                            colorScheme="orange"
                            onClick={handleApply}
                            variant="solid"
                        >
                            Použít
                        </Button>
                    }
                />
            </Dialog>
        </NodeViewWrapper>
    );
};

export default TabsComponent;
