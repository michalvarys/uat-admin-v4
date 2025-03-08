import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AccordionComponent } from "./AccordionComponent";

export interface AccordionOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    accordion: {
      setAccordion: (title: string) => ReturnType;
      unsetAccordion: () => ReturnType;
    };
  }
}

export const AccordionExtension = Node.create<AccordionOptions>({
  name: "accordion",

  group: "block",

  content: "block+",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title"),
        renderHTML: (attributes) => ({
          "data-title": attributes.title,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="accordion"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "accordion" }),
      0,
    ];
  },

  addCommands() {
    return {
      setAccordion:
        (title: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { title },
            content: [{ type: "paragraph" }],
          });
        },
      unsetAccordion:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AccordionComponent);
  },
});
