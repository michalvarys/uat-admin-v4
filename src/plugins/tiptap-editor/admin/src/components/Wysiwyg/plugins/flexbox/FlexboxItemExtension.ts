import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import FlexboxItemComponent from "./FlexboxItemComponent";

export interface FlexboxItemOptions {
  HTMLAttributes: Record<string, any>;
}

export const FlexboxItemExtension = Node.create<FlexboxItemOptions>({
  name: "flexboxItem",

  group: "block",

  content: "block+",

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "flexbox-item",
      },
    };
  },

  addAttributes() {
    return {
      // Width of the item
      width: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("data-width") || "auto",
        renderHTML: (attributes) => {
          return {
            "data-width": attributes.width,
            style: `width: ${attributes.width};`,
          };
        },
      },
      // Flex property for flexbox layout
      flex: {
        default: "1 1 0",
        parseHTML: (element) => element.getAttribute("data-flex") || "1 1 0",
        renderHTML: (attributes) => {
          return {
            "data-flex": attributes.flex,
            style: `flex: ${attributes.flex};`,
          };
        },
      },
      // Height of the item
      height: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("data-height") || "auto",
        renderHTML: (attributes) => {
          return {
            "data-height": attributes.height,
            style: `height: ${attributes.height};`,
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
      // Background image
      backgroundImage: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-background-image") || "",
        renderHTML: (attributes) => {
          if (!attributes.backgroundImage) {
            return { "data-background-image": "" };
          }
          return {
            "data-background-image": attributes.backgroundImage,
            style: `background-image: url(${attributes.backgroundImage}); background-size: cover; background-position: center;`,
          };
        },
      },
      // Align self (auto, flex-start, flex-end, center, baseline, stretch)
      alignSelf: {
        default: "auto",
        parseHTML: (element) =>
          element.getAttribute("data-align-self") || "auto",
        renderHTML: (attributes) => {
          return {
            "data-align-self": attributes.alignSelf,
            style: `align-self: ${attributes.alignSelf};`,
          };
        },
      },
      // Order
      order: {
        default: "0",
        parseHTML: (element) => element.getAttribute("data-order") || "0",
        renderHTML: (attributes) => {
          return {
            "data-order": attributes.order,
            style: `order: ${attributes.order};`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="flexbox-item"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-type": "flexbox-item" },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FlexboxItemComponent);
  },
});

export default FlexboxItemExtension;
