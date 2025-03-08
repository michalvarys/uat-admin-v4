// BoxComponent.tsx
import React, { useState } from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    Flex,
    Grid,
    NumberInput,
    Select,
    Option,
    TextInput,
    Tabs,
    Tab,
    TabGroup,
    TabPanel,
    TabPanels,
} from "@strapi/design-system"
import { BoxAttributes } from './BoxExtension'
import { IconButton, Box, Switch, FormLabel } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { FaCogs } from 'react-icons/fa';
import { GrMoreVertical } from 'react-icons/gr';
import { ColorsSelect } from '../ColorSelect';
import { getChakraStyles } from '../../tools';

const ResponsiveTab = ({
    attributes,
    onChange,
    breakpoint
}: {
    attributes: Partial<BoxAttributes>,
    onChange: (attrs: Partial<BoxAttributes>) => void,
    breakpoint: string
}) => {

    return (
        <Box padding={4}>
            <Grid gap={4} gridCols={2}>
                <ColorsSelect
                    label="Background"
                    value={attributes.bg || ''}
                    onChange={value => onChange({ ...attributes, bg: value })}
                />

                <ColorsSelect
                    label="Color"
                    value={attributes.color || ''}
                    onChange={value => onChange({ ...attributes, color: value })}
                />

                <NumberInput
                    label="Border Radius"
                    name="borderRadius"
                    value={attributes.borderRadius as number || 0}
                    onValueChange={value => onChange({ ...attributes, borderRadius: value })}
                />
                <NumberInput
                    label="Padding"
                    name="padding"
                    value={attributes.padding as number || 0}
                    onValueChange={value => onChange({ ...attributes, padding: value })}
                />
                <NumberInput
                    label="Margin"
                    name="margin"
                    value={attributes.margin as number || 0}
                    onValueChange={value => onChange({ ...attributes, margin: value })}
                />
                <TextInput
                    label="Width"
                    name="width"
                    value={attributes.width || ''}
                    onChange={e => onChange({ ...attributes, width: e.target.value })}
                />
                <TextInput
                    label="Height"
                    name="height"
                    value={attributes.height || ''}
                    onChange={e => onChange({ ...attributes, height: e.target.value })}
                />
                {attributes.isFlex && (
                    <>
                        <Select
                            label="Flex Direction"
                            value={attributes.flexDirection}
                            onChange={value => onChange({ ...attributes, flexDirection: value })}
                        >
                            <Option value="row">Row</Option>
                            <Option value="column">Column</Option>
                        </Select>
                        <Select
                            label="Align Items"
                            value={attributes.alignItems}
                            onChange={value => onChange({ ...attributes, alignItems: value })}
                        >
                            <Option value="flex-start">Start</Option>
                            <Option value="center">Center</Option>
                            <Option value="flex-end">End</Option>
                            <Option value="stretch">Stretch</Option>
                        </Select>
                        <Select
                            label="Justify Content"
                            value={attributes.justifyContent}
                            onChange={value => onChange({ ...attributes, justifyContent: value })}
                        >
                            <Option value="flex-start">Start</Option>
                            <Option value="center">Center</Option>
                            <Option value="flex-end">End</Option>
                            <Option value="space-between">Space Between</Option>
                            <Option value="space-around">Space Around</Option>
                        </Select>
                        <NumberInput
                            label="Gap"
                            name="gap"
                            value={attributes.gap as number || 0}
                            onValueChange={value => onChange({ ...attributes, gap: value })}
                        />
                    </>
                )}
            </Grid>
        </Box>
    )
}

type BoxProps = NodeViewProps & {
    node: {
        attrs: BoxAttributes
    }
    updateAttributes: (attrs: Partial<BoxAttributes>) => void
}

export const BoxComponent: React.FC<BoxProps> = ({ node: { attrs }, updateAttributes }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentAttrs, setCurrentAttrs] = useState<BoxAttributes>(attrs)

    const handleSave = () => {
        updateAttributes(currentAttrs)
        setIsModalOpen(false)
    }

    const getStyles = (attributes: BoxAttributes) => ({
        color: attributes.color,
        backgroundColor: attributes.bg,
        padding: attributes.padding,
        margin: attributes.margin,
        width: attributes.width,
        height: attributes.height,
        display: attributes.isFlex ? 'flex' : 'block',
        flexDirection: attributes.flexDirection,
        alignItems: attributes.alignItems,
        justifyContent: attributes.justifyContent,
        gap: attributes.gap,
        borderRadius: attributes.borderRadius,
        border: attributes.border,
        borderColor: attributes.borderColor,
    })

    const stackStyles = getChakraStyles(attrs);

    return (
        <NodeViewWrapper>
            <Box
                pos="relative"
                border="1px dotted"
                borderColor="uat_orange"
                px={6}
                py={2}
            >
                <IconButton
                    pos="absolute"
                    right={0}
                    top={2}
                    icon={<GrMoreVertical />}
                    size="xs"
                    p={0}
                    colorScheme='orange'
                    variant="link"
                    aria-label="Settings"
                    onClick={() => setIsModalOpen(true)}
                />
                <Box sx={stackStyles}>
                    <NodeViewContent />
                </Box>
            </Box>

            <Dialog
                onClose={() => setIsModalOpen(false)}
                title="Box Settings"
                isOpen={isModalOpen}
                style={{
                    maxWidth: '800px', maxHeight: '70vh', overflow: 'auto'
                }}
            >
                <DialogBody style={{
                    maxWidth: '800px', maxHeight: '70vh', overflow: 'auto'
                }}>
                    <Flex direction="column" gap={4}>
                        <Box padding={2}>
                            <FormLabel color="white" display="flex" gap={2}>
                                Use Flex
                                <Switch
                                    checked={currentAttrs.isFlex}
                                    onChange={() => setCurrentAttrs(prev => ({ ...prev, isFlex: !prev.isFlex }))}
                                />
                            </FormLabel>
                        </Box>

                        <TabGroup style={{ width: '100%' }}>
                            <Tabs style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <Tab>Default</Tab>
                                {/* <Tab>SM</Tab>
                                <Tab>MD</Tab>
                                <Tab>LG</Tab>
                                <Tab>XL</Tab> */}
                            </Tabs>
                            <TabPanels>
                                <TabPanel>
                                    <ResponsiveTab
                                        attributes={currentAttrs}
                                        onChange={attrs => setCurrentAttrs(prev => ({ ...prev, ...attrs }))}
                                        breakpoint="default"
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <ResponsiveTab
                                        attributes={currentAttrs.sm || {}}
                                        onChange={attrs => setCurrentAttrs(prev => ({ ...prev, sm: attrs }))}
                                        breakpoint="sm"
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <ResponsiveTab
                                        attributes={currentAttrs.md || {}}
                                        onChange={attrs => setCurrentAttrs(prev => ({ ...prev, md: attrs }))}
                                        breakpoint="md"
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <ResponsiveTab
                                        attributes={currentAttrs.lg || {}}
                                        onChange={attrs => setCurrentAttrs(prev => ({ ...prev, lg: attrs }))}
                                        breakpoint="lg"
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <ResponsiveTab
                                        attributes={currentAttrs.xl || {}}
                                        onChange={attrs => setCurrentAttrs(prev => ({ ...prev, xl: attrs }))}
                                        breakpoint="xl"
                                    />
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </Flex>
                </DialogBody>
                <DialogFooter
                    startAction={
                        <Button
                            onClick={() => setIsModalOpen(false)}
                            variant="tertiary"
                            size="S"
                        >
                            Zrušit
                        </Button>
                    }
                    endAction={
                        <Button
                            onClick={handleSave}
                            variant="success-light"
                            size="S"
                        >
                            Uložit
                        </Button>
                    }
                />
            </Dialog>
        </NodeViewWrapper>
    )
}