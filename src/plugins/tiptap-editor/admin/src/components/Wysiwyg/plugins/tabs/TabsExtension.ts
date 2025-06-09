import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TabsComponent } from "./TabsComponent";
import { TabItemExtension } from "./TabItemExtension";

export interface TabsOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tabs: {
      /**
       * Add a tabs container
       */
      setTabs: (options?: { title?: string }) => ReturnType;
    };
  }
}

export const TabsExtension = Node.create<TabsOptions>({
  name: "tabs",

  group: "block",

  content: "tabItem+",

  defining: true,

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "tabs-container",
      },
    };
  },

  addAttributes() {
    return {
      // Title of the tabs
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") || "",
        renderHTML: (attributes) => {
          return {
            "data-title": attributes.title,
          };
        },
      },
      // Description of the tabs
      description: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-description") || "",
        renderHTML: (attributes) => {
          return {
            "data-description": attributes.description,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="tabs"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-type": "tabs" },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },

  addCommands() {
    return {
      setTabs:
        (options = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
            content: [
              {
                type: "tabItem",
                attrs: {
                  title: "Tab 1",
                },
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Klikněte pro úpravu obsahu",
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
    return ReactNodeViewRenderer(TabsComponent);
  },

  // Add the TabItemExtension as a dependency
  addExtensions() {
    return [TabItemExtension];
  },
});

export default TabsExtension;
