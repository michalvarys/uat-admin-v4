import React from "react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Box, Typography, Card } from "@strapi/design-system";
import { SimpleGrid } from '@chakra-ui/react'
import { CardItem, ColumnsConfig } from "./types";
import { WrapperComponent } from "../../Wrapper";

const CardListComponent: React.FC<NodeViewProps> = ({
    node,
    editor,
    getPos,
    selected,
}) => {
    const cards: CardItem[] = node.attrs.cards || [];
    const columns: ColumnsConfig = node.attrs.columns || [1, 2, 3, 4, 5];

    const handleClick = () => {
        if (typeof getPos === "function") {
            editor.commands.setNodeSelection(getPos());
        }
    };

    return (
        <NodeViewWrapper
            as="div"
            className="card-list-component"
            onClick={handleClick}
            data-selected={selected}
        >
            <WrapperComponent selected={selected}>
                <Box paddingBottom={2}>
                    <Typography variant="delta">Seznam karet</Typography>
                </Box>

                {cards.length === 0 ? (
                    <Typography variant="pi">
                        Prázdný seznam karet. Klikněte pro úpravu.
                    </Typography>
                ) : (
                    <SimpleGrid columns={columns}>
                        {cards.map((card, index) => (
                            <Card
                                key={card.id}
                                padding={0}
                            >
                                {card.image && (
                                    <Box style={{ position: "relative", paddingTop: "56.25%" }}>
                                        <img
                                            src={card.image.url}
                                            alt={card.image.alt}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Box>
                                )}
                                <Box padding={3}>
                                    <Typography variant="pi" textColor="neutral600">
                                        {card.recordType === "pages" ? "Stránka" : "Novinka"}
                                    </Typography>
                                    {'  '}
                                    <Typography variant="pi" fontWeight="bold">
                                        {card.title || `Karta ${index + 1}`}
                                    </Typography>
                                </Box>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </WrapperComponent>
        </NodeViewWrapper>
    );
};

export default CardListComponent;
