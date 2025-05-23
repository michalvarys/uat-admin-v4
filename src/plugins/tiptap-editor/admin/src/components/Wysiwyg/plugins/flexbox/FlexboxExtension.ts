import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FlexboxComponent } from "./FlexboxComponent";
import { FlexboxItemExtension } from "./FlexboxItemExtension";

export interface FlexboxOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    flexbox: {
      /**
       * Add a flexbox container
       */
      setFlexbox: (options?: { direction?: string }) => ReturnType;
    };
  }
}

export const FlexboxExtension = Node.create<FlexboxOptions>({
  name: "flexbox",

  group: "block",

  content: "flexboxItem+",

  defining: true,

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "flexbox-container",
      },
    };
  },

  addAttributes() {
    return {
      // Direction of the flexbox (row or column)
      direction: {
        default: "row",
        parseHTML: (element) => element.getAttribute("data-direction") || "row",
        renderHTML: (attributes) => {
          return {
            "data-direction": attributes.direction,
          };
        },
      },
      // Padding (top, right, bottom, left)
      padding: {
        default: "0px",
        parseHTML: (element) => element.getAttribute("data-padding") || "0px",
        renderHTML: (attributes) => {
          return {
            "data-padding": attributes.padding,
            style: `padding: ${attributes.padding};`,
          };
        },
      },
      // Margin (top, right, bottom, left)
      margin: {
        default: "0px",
        parseHTML: (element) => element.getAttribute("data-margin") || "0px",
        renderHTML: (attributes) => {
          return {
            "data-margin": attributes.margin,
            style: `margin: ${attributes.margin};`,
          };
        },
      },
      // Background color
      background: {
        default: "transparent",
        parseHTML: (element) =>
          element.getAttribute("data-background") || "transparent",
        renderHTML: (attributes) => {
          return {
            "data-background": attributes.background,
            style: `background-color: ${attributes.background};`,
          };
        },
      },
      // Gap between items
      gap: {
        default: "0px",
        parseHTML: (element) => element.getAttribute("data-gap") || "0px",
        renderHTML: (attributes) => {
          return {
            "data-gap": attributes.gap,
            style: `gap: ${attributes.gap};`,
          };
        },
      },
      // Responsive settings (JSON string)
      responsive: {
        default: "{}",
        parseHTML: (element) => element.getAttribute("data-responsive") || "{}",
        renderHTML: (attributes) => {
          return {
            "data-responsive": attributes.responsive,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="flexbox"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-type": "flexbox" },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },

  addCommands() {
    return {
      setFlexbox:
        (options = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
            content: [
              {
                type: "flexboxItem",
                attrs: {
                  width: "auto",
                  flex: "1 1 0",
                },
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Klikněte pro úpravu textu",
                      },
                    ],
                  },
                ],
              },
            ],
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(FlexboxComponent);
  },

  // Add the FlexboxItemExtension as a dependency
  addExtensions() {
    return [FlexboxItemExtension];
  },
});

export default FlexboxExtension;
