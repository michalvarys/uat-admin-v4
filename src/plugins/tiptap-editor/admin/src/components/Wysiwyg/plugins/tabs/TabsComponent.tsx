import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Input, Flex } from '@chakra-ui/react';
import TiptapChakraTabs from './TiptapChakraTabs';
import { TabType } from './TabsExtension';

interface TabsComponentProps {
    node: {
        attrs: {
            tabs: TabType[];
        };
    };
    updateAttributes: (attrs: { tabs: TabType[] }) => void;
}

export const TabsComponent: React.FC<NodeViewProps & TabsComponentProps> = ({
    node: {
        attrs: { tabs },
    },
    updateAttributes,
    editor
}) => {
    return (
        <NodeViewWrapper>
            <Box my={4}>
                <TiptapChakraTabs tabs={tabs} setTabs={(tabs) => updateAttributes({ tabs })} />
            </Box>
        </NodeViewWrapper>
    );
};
