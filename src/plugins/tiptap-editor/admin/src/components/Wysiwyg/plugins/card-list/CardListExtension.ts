import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CardListAttributes } from "./types";
import { v4 as uuidv4 } from "uuid";
import CardListComponent from "./CardListComponent";

export interface CardListOptions {
  HTMLAttributes: Record<string, any>;
}
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cardList: {
      /**
       * Set a card list
       */
      setCardList: (attributes: CardListAttributes) => ReturnType;
      /**
       * Update a card list
       */
      updateCardList: (attributes: CardListAttributes) => ReturnType;
    };
  }
}

export const CardList = Node.create<CardListOptions>({
  name: "cardList",

  group: "block",

  content: "",

  draggable: true,

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "card-list",
      },
    };
  },

  addAttributes() {
    return {
      cards: {
        default: [],
        parseHTML: (element) => {
          const cardsAttr = element.getAttribute("data-cards");
          if (!cardsAttr) return [];
          try {
            return JSON.parse(cardsAttr);
          } catch (e) {
            console.error("Error parsing cards attribute:", e);
            return [];
          }
        },
        renderHTML: (attributes) => {
          if (!attributes.cards || !attributes.cards.length) {
            return {};
          }
          return {
            "data-cards": JSON.stringify(attributes.cards),
          };
        },
      },
      columns: {
        default: [1, 2, 3, 4, 5],
        parseHTML: (element) => {
          const columnsAttr = element.getAttribute("data-columns");
          if (!columnsAttr) return [1, 2, 3, 4, 5];
          try {
            return JSON.parse(columnsAttr);
          } catch (e) {
            console.error("Error parsing columns attribute:", e);
            return [1, 2, 3, 4, 5];
          }
        },
        renderHTML: (attributes) => {
          if (!attributes.columns) {
            return {};
          }
          return {
            "data-columns": JSON.stringify(attributes.columns),
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="card-list"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "card-list",
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CardListComponent);
  },

  addCommands() {
    return {
      setCardList:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              cards: attributes.cards.map((card) => ({
                ...card,
                id: card.id || uuidv4(),
              })),
              columns: attributes.columns || [1, 2, 3, 4, 5],
            },
          });
        },
      updateCardList:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            cards: attributes.cards.map((card) => ({
              ...card,
              id: card.id || uuidv4(),
            })),
            columns: attributes.columns || [1, 2, 3, 4, 5],
          });
        },
    };
  },
});

export default CardList;
