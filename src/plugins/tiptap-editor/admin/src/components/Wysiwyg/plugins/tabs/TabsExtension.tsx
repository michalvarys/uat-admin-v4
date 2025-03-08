import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TabsComponent } from './TabsComponent';

export type TabType = { title: string; content: string; json: string };
export interface TabsOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tabs: {
      setTabs: (tabs: TabType[]) => ReturnType;
      unsetTabs: () => ReturnType;
    };
  }
}

export const TabsExtension = Node.create<TabsOptions>({
  name: 'tabs',

  group: 'block', // Musí být block node

  // content: 'block+', // Povolíme obsah (bloky jako odstavce, nadpisy atd.)

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
      tabs: {
        default: [
          { title: 'Tab 1', content: '<p>Tab 1 content</p>', json: JSON.stringify({ type: 'doc', content: [] }) },
          { title: 'Tab 2', content: '<p>Tab 2 content</p>', json: JSON.stringify({ type: 'doc', content: [] }) },
        ],
        parseHTML: (element) => JSON.parse(element.getAttribute('data-tabs') || '[]'),
        renderHTML: (attributes) => ({
          'data-tabs': JSON.stringify(attributes.tabs),
        }),
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
      'div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'tabs'
      })
    ];
  },

  addCommands() {
    return {
      setTabs:
        (tabs: TabType[]) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: { tabs },
            });
          },
      unsetTabs:
        () =>
          ({ commands }) => {
            return commands.lift(this.name);
          },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(TabsComponent);
  },
});
