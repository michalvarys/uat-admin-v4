import { FaLink as ButtonLinkIcon } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import {
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import {
  IconButton,
  Button,
} from '@strapi/design-system'
import { Editor } from "@tiptap/core";
import LinkExtension from '@tiptap/extension-link'

export const CustomLink = LinkExtension.extend({
  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML(element) {
          return element.getAttribute('href')
        },
      },
      type: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-link-type'),
        renderHTML: (attributes) => {
          if (!attributes.type) {
            return {};
          }
          return { 'data-link-type': attributes.type };
        },
      },
      target: {
        default: this.options.HTMLAttributes.target,
      },
      rel: {
        default: this.options.HTMLAttributes.rel,
      },
      class: {
        default: this.options.HTMLAttributes.class,
      },
    }
  },
})

const defaultType = 'link'
const defaultTarget = '_self'
const LinkButton = ({ editor }: { editor: Editor }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [url, setUrl] = useState("");
  const [type, setType] = useState(defaultType);
  const [target, setTarget] = useState(defaultTarget);

  const handleAddLink = () => {
    if (url) {
      const attributes = {
        href: url,
        type: type,
        class: `custom-link ${type}`,
        target: target,
        rel: "",
      };

      editor.chain().focus().setLink(attributes).run();
      onClose();
      setUrl('')
      setType(defaultType)
      setTarget(defaultTarget)
    }
  };

  useEffect(() => {
    if (isOpen) {
      const attributes = editor.getAttributes('link')
      setUrl(attributes.href)
      setType(attributes.type || defaultType)
      setTarget(attributes.target)
    }
  }, [isOpen])

  return (
    <>
      <IconButton
        icon={<ButtonLinkIcon />}
        label="Link Button"
        className={[
          'medium-icon',
          editor.isActive('link') ? 'is-active' : '',
        ]}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Vložit odkaz</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Vložte odkaz"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              mb={4}
            />

            <RadioGroup
              onChange={(value) => setType(value)}
              value={type}
              mb={4}
            >
              <Stack direction="row">
                <Radio value="link">Odkaz</Radio>
                <Radio value="button">Tlačítko</Radio>
              </Stack>
            </RadioGroup>

            <RadioGroup
              onChange={(value) => setTarget(value)}
              value={target}
            >
              <Stack direction="row">
                <Radio value="_self">Stejná stránka</Radio>
                <Radio value="_blank">Nová stránka</Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddLink}>
              Uložit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LinkButton;
