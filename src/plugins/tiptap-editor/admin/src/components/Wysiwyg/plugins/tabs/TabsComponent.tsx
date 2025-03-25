import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Box } from "@strapi/design-system";
import TiptapChakraTabs from './TiptapChakraTabs';
import { TabType } from './TabsExtension';
import { WrapperComponent } from '../../Wrapper';

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
    getPos,
    editor,
    selected
}) => {
    const handleClick = () => {
        if (typeof getPos === "function") {
            editor.commands.setNodeSelection(getPos());
        }
    };

    return (
        <NodeViewWrapper
            as="div"
            className="tabs-component"
            data-selected={selected}
            onClick={handleClick}
        >
            <WrapperComponent selected={selected}>
                <TiptapChakraTabs tabs={tabs} setTabs={(tabs) => updateAttributes({ tabs })} />
            </WrapperComponent>
        </NodeViewWrapper>
    );
};
