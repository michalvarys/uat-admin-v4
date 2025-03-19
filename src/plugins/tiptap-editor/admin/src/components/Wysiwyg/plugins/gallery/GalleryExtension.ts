import React from "react";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { GalleryComponent } from "./GalleryComponent";
import { GalleryAttributes } from "@ssupat/components";

export interface GalleryOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    gallery: {
      setGallery: (attrs: GalleryAttributes) => ReturnType;
      updateGallery: (attrs: Partial<GalleryAttributes>) => ReturnType;
      removeGallery: () => ReturnType;
    };
  }
}

export const GalleryExtension = Node.create<GalleryOptions>({
  name: "gallery",

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
      images: {
        default: [],
      },
      columns: {
        default: 3,
      },
      spacing: {
        default: 4,
      },
      aspectRatio: {
        default: "1",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="gallery"]',
        getAttrs: (node) => {
          if (!(node instanceof HTMLElement)) return false;
          try {
            const data = JSON.parse(node.getAttribute("data-gallery") || "{}");
            return {
              images: data.images || [],
              columns: data.columns || 3,
              spacing: data.spacing || 4,
              aspectRatio: data.aspectRatio || "1",
            };
          } catch (e) {
            return {
              images: [],
              columns: 3,
              spacing: 4,
              aspectRatio: "1",
            };
          }
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-type": "gallery",
        "data-gallery": JSON.stringify({
          images: node.attrs.images || [],
          columns: node.attrs.columns || 3,
          spacing: node.attrs.spacing || 4,
          aspectRatio: node.attrs.aspectRatio || "1",
        }),
      }),
    ];
  },

  addCommands() {
    return {
      setGallery:
        (attrs: GalleryAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
      updateGallery:
        (attrs: Partial<GalleryAttributes>) =>
        ({ state, commands }) => {
          const { selection } = state;
          const pos = selection.$anchor.pos;
          const node = state.doc.nodeAt(pos);

          if (!node || node.type.name !== this.name) {
            return false;
          }

          return commands.updateAttributes(this.name, attrs);
        },
      removeGallery:
        () =>
        ({ commands }) => {
          return commands.deleteSelection();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(GalleryComponent, {
      as: "div",
      className: "chakra-gallery-wrapper",
    });
  },
});
