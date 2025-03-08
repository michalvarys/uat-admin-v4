// HTMLCodeBlockExtension.ts
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { HTMLCodeBlockComponent } from "./HTMLCodeBlockComponent";

export interface HTMLCodeBlockOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    htmlCodeBlock: {
      setHTMLCodeBlock: (htmlContent: string) => ReturnType;
      updateHTMLCodeBlock: (pos: number, htmlContent: string) => ReturnType;
    };
  }
}

export const HTMLCodeBlockExtension = Node.create<HTMLCodeBlockOptions>({
  name: "htmlCodeBlock",

  group: "block",

  draggable: true,

  // Důležité: nastavíme inline na false a marks na prázdné pole
  inline: false,

  // Definujeme, že node je atom - nemá vnitřní obsah
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      htmlContent: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-html-content"),
        renderHTML: (attributes) => ({
          "data-html-content": attributes.htmlContent,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="html-code-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "html-code-block",
      }),
    ];
  },

  addCommands() {
    return {
      setHTMLCodeBlock:
        (htmlContent: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { htmlContent },
          });
        },
      updateHTMLCodeBlock:
        (pos: number, htmlContent: string) =>
        ({ commands }) => {
          return commands.command(({ tr }) => {
            tr.setNodeAttribute(pos, "htmlContent", htmlContent);
            return true;
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(HTMLCodeBlockComponent);
  },
});
