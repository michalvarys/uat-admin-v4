import React, { useState, useEffect } from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Input,
  Flex,
} from '@chakra-ui/react'
import { AccordionIcon } from '@chakra-ui/icons'

type AccordionComponentProps = NodeViewProps & {
  node: {
    attrs: {
      title: string
    }
  }
  updateAttributes: (attrs: { title: string }) => void
}

export const AccordionComponent: React.ComponentType<AccordionComponentProps> = ({
  node: {
    attrs: { title },
  },
  updateAttributes,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [titleValue, setTitleValue] = useState(title)

  useEffect(() => {
    setTitleValue(title)
  }, [title])

  const handleTitleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsEditing(true)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    updateAttributes({ title: titleValue })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      updateAttributes({ title: titleValue })
    }
  }

  return (
    <NodeViewWrapper>
      <Box my={4}>
        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton p={4}>
              <Flex flex="1" alignItems="center">
                {isEditing ? (
                  <Input
                    value={titleValue}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleKeyDown}
                    size="md"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    variant="flushed"
                    placeholder="Enter title"
                    _focus={{
                      borderColor: 'blue.500',
                      boxShadow: 'none',
                    }}
                  />
                ) : (
                  <Box
                    onClick={handleTitleClick}
                    flex="1"
                    textAlign="left"
                    cursor="pointer"
                    _hover={{
                      color: 'blue.500',
                    }}
                  >
                    {titleValue || 'Pro úpravu klikni'}
                  </Box>
                )}
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel p={4}>
              <Box w="full">
                <NodeViewContent />
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </NodeViewWrapper>
  )
}
