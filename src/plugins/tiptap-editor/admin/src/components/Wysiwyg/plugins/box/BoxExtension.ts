// BoxExtension.ts
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { BoxComponent } from "./BoxComponent";

export interface BoxOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    box: {
      setBox: (attributes: BoxAttributes) => ReturnType;
      updateBox: (attributes: BoxAttributes) => ReturnType;
    };
  }
}

export interface BoxAttributes {
  color?: string;
  bg?: string;
  padding?: string | number;
  margin?: string | number;
  width?: string | number;
  height?: string | number;
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gap?: string | number;
  borderRadius?: string | number;
  border?: string;
  borderColor?: string;
  isFlex?: boolean;
  sm?: Partial<BoxAttributes>;
  md?: Partial<BoxAttributes>;
  lg?: Partial<BoxAttributes>;
  xl?: Partial<BoxAttributes>;
}

export const BoxExtension = Node.create<BoxOptions>({
  name: "box",

  group: "block",

  content: "block+",

  draggable: true,

  addAttributes() {
    return {
      color: { default: "gray.700" },
      bg: { default: "white" },
      padding: { default: 0 },
      margin: { default: 0 },
      width: { default: "auto" },
      height: { default: "auto" },
      display: { default: "block" },
      flexDirection: { default: "row" },
      alignItems: { default: "stretch" },
      justifyContent: { default: "flex-start" },
      gap: { default: 0 },
      borderRadius: { default: 0 },
      border: { default: "none" },
      borderColor: { default: "transparent" },
      isFlex: { default: false },
      sm: { default: {} },
      md: { default: {} },
      lg: { default: {} },
      xl: { default: {} },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="box"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "box" }), 0];
  },

  addCommands() {
    return {
      setBox:
        (attributes: BoxAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
            content: [{ type: "paragraph" }],
          });
        },
      updateBox:
        (attributes: BoxAttributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(BoxComponent);
  },
});
