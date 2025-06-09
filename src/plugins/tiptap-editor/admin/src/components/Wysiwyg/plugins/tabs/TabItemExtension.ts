import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TabItemComponent } from "./TabItemComponent";

export interface TabItemOptions {
  HTMLAttributes: Record<string, any>;
}

export const TabItemExtension = Node.create<TabItemOptions>({
  name: "tabItem",

  group: "block",

  content: "block+",

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "tab-item",
      },
    };
  },

  addAttributes() {
    return {
      // Title of the tab
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") || "",
        renderHTML: (attributes) => {
          return {
            "data-title": attributes.title,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="tab-item"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-type": "tab-item" },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TabItemComponent);
  },
});

export default TabItemExtension;
