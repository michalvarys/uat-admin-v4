import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageComponent } from "./ImageComponent";

export interface ImageAttributes {
  src: string;
  alt?: string;
  boxSize?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  fallbackSrc?: string;
}

export interface ImageOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    chakraImage: {
      setImage: (attrs: ImageAttributes) => ReturnType;
      unsetImage: () => ReturnType;
      updateImage: (attrs: Partial<ImageAttributes>) => ReturnType;
    };
  }
}

export const ChakraImageExtension = Node.create<ImageOptions>({
  name: "chakraImage",

  group: "block",

  inline: false,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: "",
      },
      alt: {
        default: "",
      },
      boxSize: {
        default: "auto",
      },
      objectFit: {
        default: "cover",
      },
      fallbackSrc: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="chakra-image"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "chakra-image",
      }),
    ];
  },

  addCommands() {
    return {
      setImage:
        (attrs: ImageAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
      unsetImage:
        () =>
        ({ commands }) => {
          return commands.deleteSelection();
        },
      updateImage:
        (attrs: Partial<ImageAttributes>) =>
        ({ state, commands }) => {
          const { selection } = state;
          const pos = selection.$anchor.pos;
          const node = state.doc.nodeAt(pos);

          if (!node || node.type.name !== this.name) {
            return false;
          }

          return commands.updateAttributes(this.name, attrs);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent, {
      as: "div",
      className: "chakra-image-wrapper",
    });
  },
});
