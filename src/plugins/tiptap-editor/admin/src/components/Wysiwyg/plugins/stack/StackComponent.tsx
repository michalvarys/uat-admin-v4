// StackComponent.tsx
import React, { useState } from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
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
import { Box, FormLabel, IconButton, Switch, SystemStyleObject } from '@chakra-ui/react'
import { GrMoreVertical } from 'react-icons/gr'
import { colors } from '@ssupat/components'
import { StackAttributes } from './StackExtension'
import { ColorsSelect } from '../ColorSelect'
import { getChakraStyles, createResponsiveValue, getColorValue } from '../../tools'
import { BaseAttributes } from '../../../types/styleTypes'

const ResponsiveTab = ({
    attributes,
    onChange,
    breakpoint
}: {
    attributes: Partial<StackAttributes>,
    onChange: (attrs: Partial<StackAttributes>) => void,
    breakpoint: string
}) => {

    return (
        <Box padding={4}>
            <Grid gap={4} gridCols={2}>
                <Select
                    label="Směr"
                    value={attributes.direction}
                    onChange={value => onChange({ ...attributes, direction: value })}
                >
                    <Option value="row">Za sebe</Option>
                    <Option value="column">Pod sebe</Option>
                </Select>

                <NumberInput
                    label="Rozestupy"
                    name="spacing"
                    value={attributes.spacing as number}
                    onValueChange={value => onChange({ ...attributes, spacing: value })}
                />

                <Select
                    label="Align"
                    value={attributes.align}
                    onChange={value => onChange({ ...attributes, align: value })}
                >
                    <Option value="start">Začátek</Option>
                    <Option value="center">Prostředek</Option>
                    <Option value="end">Konec</Option>
                    <Option value="stretch">Roztažené</Option>
                </Select>

                <Select
                    label="Justify"
                    value={attributes.justify}
                    onChange={value => onChange({ ...attributes, justify: value })}
                >
                    <Option value="start">Začátek</Option>
                    <Option value="center">Prostředek</Option>
                    <Option value="end">Konec</Option>
                    <Option value="space-between">Prostor mezi</Option>
                    <Option value="space-around">Prostor kolem</Option>
                </Select>

                <FormLabel color="white" display="flex" gap={2}>
                    Zalamovat
                    <Switch
                        checked={attributes.wrap}
                        onChange={() => onChange({ ...attributes, wrap: !attributes.wrap })}
                    />
                </FormLabel>

                <FormLabel color="white" display="flex" gap={2}>
                    Oddělovač
                    <Switch
                        checked={attributes.divider}
                        onChange={() => onChange({ ...attributes, divider: !attributes.divider })}
                    />
                </FormLabel>

                {attributes.divider && (
                    <ColorsSelect
                        label="Divider Color"
                        value={attributes.dividerColor}
                        onChange={value => onChange({ ...attributes, dividerColor: value })} />
                )}

                <ColorsSelect
                    label="Pozadí"
                    value={attributes.bg}
                    onChange={value => onChange({ ...attributes, bg: value })} />

                <ColorsSelect
                    label="Barva textu"
                    value={attributes.color}
                    onChange={value => onChange({ ...attributes, color: value })}
                />

                <NumberInput
                    label="Vnitřní odsazení"
                    value={attributes.padding as number}
                    onValueChange={value => onChange({ ...attributes, padding: value })}
                />

                <NumberInput
                    label="Vnější odsazení"
                    value={attributes.margin as number}
                    onValueChange={value => onChange({ ...attributes, margin: value })}
                />

                <TextInput
                    label="Šířka"
                    value={attributes.width as string}
                    onChange={e => onChange({ ...attributes, width: e.target.value })}
                />

                <TextInput
                    label="Výška"
                    value={attributes.height as string}
                    onChange={e => onChange({ ...attributes, height: e.target.value })}
                />

                <NumberInput
                    label="Poloměr okraje"
                    value={attributes.borderRadius as number}
                    onValueChange={value => onChange({ ...attributes, borderRadius: value })}
                />
            </Grid>
        </Box>
    );
};

type StackProps = NodeViewProps & {
    node: {
        attrs: StackAttributes
    }
    updateAttributes: (attrs: Partial<StackAttributes>) => void
}

export const StackComponent: React.ComponentType<StackProps> = ({ node: { attrs }, updateAttributes }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAttrs, setCurrentAttrs] = useState<StackAttributes>(attrs);

    const stackStyles = getChakraStyles(attrs);

    // Přidáme stack-specifické styly
    const styles: SystemStyleObject = {
        ...stackStyles,
        // Stack je vždy flex
        display: 'flex',
        // Přidáme divider styles pokud je potřeba
        ...(attrs.divider && {
            '& > *:not(:last-child)': {
                borderBottom: createResponsiveValue(
                    attrs.direction === 'column' ? `1px solid ${getColorValue(attrs.dividerColor)}` : 'none',
                    attrs.sm?.direction === 'column' ? `1px solid ${getColorValue(attrs.sm?.dividerColor)}` : 'none',
                    attrs.md?.direction === 'column' ? `1px solid ${getColorValue(attrs.md?.dividerColor)}` : 'none',
                    attrs.lg?.direction === 'column' ? `1px solid ${getColorValue(attrs.lg?.dividerColor)}` : 'none',
                    attrs.xl?.direction === 'column' ? `1px solid ${getColorValue(attrs.xl?.dividerColor)}` : 'none'
                ),
                borderRight: createResponsiveValue(
                    attrs.direction === 'row' ? `1px solid ${getColorValue(attrs.dividerColor)}` : 'none',
                    attrs.sm?.direction === 'row' ? `1px solid ${getColorValue(attrs.sm?.dividerColor)}` : 'none',
                    attrs.md?.direction === 'row' ? `1px solid ${getColorValue(attrs.md?.dividerColor)}` : 'none',
                    attrs.lg?.direction === 'row' ? `1px solid ${getColorValue(attrs.lg?.dividerColor)}` : 'none',
                    attrs.xl?.direction === 'row' ? `1px solid ${getColorValue(attrs.xl?.dividerColor)}` : 'none'
                ),
            }
        })
    };


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
                <Box sx={styles}>
                    <NodeViewContent />
                </Box>
            </Box>

            <Dialog
                onClose={() => setIsModalOpen(false)}
                title="Stack Nastavení"
                isOpen={isModalOpen}
                style={{
                    maxWidth: '800px',
                    maxHeight: '70vh',
                    overflow: 'auto'
                }}
            >
                <DialogBody
                    style={{
                        maxWidth: '800px',
                        minWidth: '600px',
                    }}>
                    <TabGroup>
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
                            {/* Podobně pro ostatní breakpointy */}
                        </TabPanels>
                    </TabGroup>
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
                            onClick={() => {
                                updateAttributes(currentAttrs);
                                setIsModalOpen(false);
                            }}
                            variant="success-light"
                            size="S"
                        >
                            Uložit
                        </Button>
                    }
                />
            </Dialog>
        </NodeViewWrapper>
    );
};
