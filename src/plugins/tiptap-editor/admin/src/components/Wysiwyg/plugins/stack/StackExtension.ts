// StackExtension.ts
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { StackComponent } from "./StackComponent";
import { BaseAttributes } from "../../../types/styleTypes";

export interface StackOptions {
  HTMLAttributes: Record<string, any>;
}

export interface StackAttributes extends BaseAttributes {
  spacing?: number | string;
  wrap?: boolean;
  bg?: string;
  color?: string;
  padding?: string | number;
  margin?: string | number;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  divider?: boolean;
  dividerColor?: string;
  sm?: Partial<StackAttributes>;
  md?: Partial<StackAttributes>;
  lg?: Partial<StackAttributes>;
  xl?: Partial<StackAttributes>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    stack: {
      setStack: (attributes: StackAttributes) => ReturnType;
      updateStack: (attributes: StackAttributes) => ReturnType;
    };
  }
}

export const StackExtension = Node.create<StackOptions>({
  name: "stack",

  group: "block",

  content: "block+",

  draggable: true,

  addAttributes() {
    return {
      direction: { default: "column" },
      spacing: { default: 2 },
      align: { default: "start" },
      justify: { default: "start" },
      wrap: { default: false },
      bg: { default: "" },
      color: { default: "" },
      padding: { default: 0 },
      margin: { default: 0 },
      width: { default: "auto" },
      height: { default: "auto" },
      borderRadius: { default: 0 },
      divider: { default: false },
      dividerColor: { default: "gray.200" },
      sm: { default: {} },
      md: { default: {} },
      lg: { default: {} },
      xl: { default: {} },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="stack"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "stack" }),
      0,
    ];
  },

  addCommands() {
    return {
      setStack:
        (attributes: StackAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
            content: [{ type: "paragraph" }],
          });
        },
      updateStack:
        (attributes: StackAttributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(StackComponent);
  },
});
