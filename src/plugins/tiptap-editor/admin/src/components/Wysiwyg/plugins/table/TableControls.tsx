// TableControls.tsx
import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    Flex,
    Grid,
    IconButton,
    Typography,
    NumberInput,
} from "@strapi/design-system";
import { Editor } from '@tiptap/react';
import { AiOutlineTable } from "react-icons/ai";
import { useState } from 'react';

interface TableControlsProps {
    editor: Editor;
}
const ButtonGroup = ({ children }: { children: React.ReactNode }) => (
    <Box
        padding={1}
        style={{
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
        }}
    >
        {children}
    </Box>
);

const TableButton = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
    <Button
        onClick={onClick}
        variant="secondary"
        size="S"
        style={{
            minWidth: 'fit-content',
            padding: '4px 8px',
            fontSize: '12px',
            height: 'auto',
        }}
    >
        {children}
    </Button>
);

export const TableControls: React.FC<TableControlsProps> = ({ editor }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [withHeaderRow, setWithHeaderRow] = useState(true);

    const isTableSelected = editor?.isActive('table');

    const insertTable = () => {
        editor
            .chain()
            .focus()
            .insertTable({ rows, cols, withHeaderRow })
            .run();
        setIsModalOpen(false);
    };

    const TableControlsModal = () => (
        <Dialog
            onClose={() => setIsModalOpen(false)}
            title={isTableSelected ? "Editovat tabulku" : "Vložit tabulku"}
            isOpen={isModalOpen}
        >
            <DialogBody>
                {!isTableSelected ? (
                    <Box padding={4} w="full">
                        <Grid gap={4} w="full">
                            <NumberInput
                                label="Řádky"
                                name="rows"
                                size="s"
                                style={{ width: '80px' }}
                                onValueChange={(value) =>
                                    setRows(value)
                                }
                                value={rows}
                                min={1}
                            />
                            <NumberInput
                                label="Sloupce"
                                name="cols"
                                size="s"
                                style={{ width: '80px' }}
                                value={cols}
                                onValueChange={(value) =>
                                    setCols(value)
                                }
                                min={1}
                            />
                            <Box w="full">
                                <Typography variant="pi">Hlavičky</Typography>
                                <Button
                                    variant={withHeaderRow ? "success" : "secondary"}
                                    onClick={() => setWithHeaderRow(!withHeaderRow)}
                                >
                                    {withHeaderRow ? 'Ano' : 'Ne'}
                                </Button>
                            </Box>
                        </Grid>
                    </Box>
                ) : (
                    <Box padding={2}>
                        <Flex direction="column" gap={2}>
                            <Typography variant="sigma">Sloupečky</Typography>
                            <ButtonGroup>
                                <TableButton onClick={() => editor.chain().focus().addColumnBefore().run()}>
                                    Přidat před
                                </TableButton>
                                <TableButton onClick={() => editor.chain().focus().addColumnAfter().run()}>
                                    Přidat za
                                </TableButton>
                                <TableButton onClick={() => editor.chain().focus().deleteColumn().run()}>
                                    Smazat
                                </TableButton>
                            </ButtonGroup>

                            <Typography variant="sigma">Řádky</Typography>
                            <ButtonGroup>
                                <TableButton onClick={() => editor.chain().focus().addRowBefore().run()}>
                                    Přidat nad
                                </TableButton>
                                <TableButton onClick={() => editor.chain().focus().addRowAfter().run()}>
                                    Přidat pod
                                </TableButton>
                                <TableButton onClick={() => editor.chain().focus().deleteRow().run()}>
                                    Delete
                                </TableButton>
                            </ButtonGroup>

                            <Typography variant="sigma">Buňky</Typography>
                            <ButtonGroup>
                                <TableButton onClick={() => editor.chain().focus().mergeCells().run()}>
                                    Sloučit
                                </TableButton>
                                <TableButton onClick={() => editor.chain().focus().splitCell().run()}>
                                    Oddělit
                                </TableButton>
                            </ButtonGroup>

                            <Typography variant="sigma">Přepnout Hlavičku</Typography>
                            <ButtonGroup>
                                <TableButton onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
                                    Sloupeček
                                </TableButton>
                                <TableButton onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
                                    Řádku
                                </TableButton>
                                <TableButton onClick={() => editor.chain().focus().toggleHeaderCell().run()}>
                                    Buňku
                                </TableButton>
                            </ButtonGroup>

                            <Box paddingTop={2}>
                                <Button
                                    variant="danger-light"
                                    size="S"
                                    onClick={() => {
                                        editor.chain().focus().deleteTable().run();
                                        setIsModalOpen(false);
                                    }}
                                >
                                    Smazat tabulku
                                </Button>
                            </Box>
                        </Flex>
                    </Box>
                )}
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
                    !isTableSelected && (
                        <Button
                            onClick={insertTable}
                            variant="success-light"
                            size="S"
                        >
                            Vložit tabulku
                        </Button>
                    )
                }
            />
        </Dialog>
    );

    return (
        <>
            <IconButton
                icon={<AiOutlineTable />}
                label="Table"
                className={[
                    "large-icon",
                    isTableSelected ? "is-active" : "",
                ]}
                onClick={() => setIsModalOpen(true)}
            />
            {isModalOpen && <TableControlsModal />}
        </>
    );
};
