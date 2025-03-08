import React, { useState } from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import {
  Box,
  Button,
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
import { HTMLCodeBlockView } from '@ssupat/components'

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
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentHTML, setCurrentHTML] = useState(htmlContent)
  const [preview, setPreview] = useState(false)

  const handleSave = () => {
    updateAttributes({ htmlContent: currentHTML })
    onClose()
  }

  return (
    <NodeViewWrapper>
      <Box
        border="1px dashed"
        borderColor={selected ? "blue.400" : "gray.200"}
        p={4}
        my={2}
      >
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
                aria-label="Drag handle"
                icon={<DragHandleIcon />}
                cursor="move"
                data-drag-handle
              />
              <IconButton
                size="sm"
                aria-label="Edit HTML"
                icon={<EditIcon />}
                onClick={onOpen}
              />
              <IconButton
                size="sm"
                aria-label="Toggle preview"
                icon={<ViewIcon />}
                onClick={() => setPreview(!preview)}
              />
            </Box>
          </GridItem>
        </Grid>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit HTML Code</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                value={currentHTML}
                onChange={(e) => setCurrentHTML(e.target.value)}
                minHeight="300px"
                fontFamily="mono"
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSave}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </NodeViewWrapper>
  )
}
