import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import FlexboxComponent from "./FlexboxComponent";

export interface FlexboxOptions {
  HTMLAttributes: Record<string, any>;
}

export const FlexboxExtension = Node.create<FlexboxOptions>({
  name: "flexbox",

  group: "block",

  content: "flexboxItem+",

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "flexbox",
      },
    };
  },

  addAttributes() {
    return {
      direction: {
        default: "row",
        parseHTML: (element) => element.getAttribute("data-direction") || "row",
        renderHTML: (attributes) => {
          return {
            "data-direction": attributes.direction,
            style: `display: flex; flex-direction: ${attributes.direction};`,
          };
        },
      },
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

  addNodeView() {
    return ReactNodeViewRenderer(FlexboxComponent);
  },
});

export default FlexboxExtension;
