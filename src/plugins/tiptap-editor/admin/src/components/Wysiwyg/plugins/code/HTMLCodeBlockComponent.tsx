import React, { useState } from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import {
  Box,
  // Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  useDisclosure,
  IconButton,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { EditIcon, DragHandleIcon, ViewIcon } from '@chakra-ui/icons'
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button
} from "@strapi/design-system";

import Wrapper from '../../style'

import { HTMLCodeBlockView } from '@ssupat/components'
import { WrapperComponent } from '../../Wrapper'

interface HTMLCodeBlockComponentProps {
  node: {
    attrs: {
      htmlContent: string
    }
  }
  updateAttributes: (attrs: { htmlContent: string }) => void
  selected: boolean
}

export const HTMLCodeBlockComponent: React.ComponentType<NodeViewProps> = ({
  node: {
    attrs: { htmlContent },
  },
  updateAttributes,
  selected,
  editor,
  getPos
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentHTML, setCurrentHTML] = useState(htmlContent)
  const [preview, setPreview] = useState(false)

  const handleSave = () => {
    updateAttributes({ htmlContent: currentHTML })
    onClose()
  }

  const handleClick = () => {
    if (typeof getPos === "function") {
      editor.commands.setNodeSelection(getPos());
    }
  };


  return (
    <NodeViewWrapper
      as="div"
      className="html-code-block"
      onClick={handleClick}
      data-selected={selected}
    >
      <WrapperComponent selected={selected}>
        <Grid templateColumns="1fr auto" gap={4} alignItems="start">
          {/* Content Column */}
          <GridItem>
            {preview ? (
              <HTMLCodeBlockView htmlContent={htmlContent} />
            ) : (
              <pre>{htmlContent}</pre>
            )}
          </GridItem>

          {/* Controls Column */}
          <GridItem>
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              position="sticky"
              top={2}
            >
              <IconButton
                size="sm"
                aria-label="Přesunout"
                title="Přesunout"
                icon={<DragHandleIcon />}
                cursor="move"
                data-drag-handle
              />
              <IconButton
                size="sm"
                title="Upravit HTML"
                aria-label="Upravit HTML"
                icon={<EditIcon />}
                onClick={onOpen}
              />
              <IconButton
                size="sm"
                title="Přepnout náhled"
                aria-label="Přepnout náhled"
                icon={<ViewIcon />}
                onClick={() => setPreview(!preview)}
              />
            </Box>
          </GridItem>
        </Grid>

        <Dialog
          title="Upravit HTML kód" isOpen={isOpen} onClose={onClose} size="xl">
          <DialogBody>
            <Wrapper>
              <Textarea
                value={currentHTML}
                onChange={(e) => setCurrentHTML(e.target.value)}
                minHeight="300px"
                fontFamily="mono"
                color="white"
              />
            </Wrapper>
          </DialogBody>

          <DialogFooter startAction={
            <Button
              variant="tertiary"
              size="S"
              onClick={onClose}
            >
              Zrušit
            </Button>
          }
            endAction={
              <Button
                variant="success-light"
                size="S"
                onClick={handleSave}
              >
                Uložit
              </Button>
            }
          />
        </Dialog>
      </WrapperComponent>
    </NodeViewWrapper>
  )
}
