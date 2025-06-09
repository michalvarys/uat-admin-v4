import { Extension } from "@tiptap/core";

export interface TranslationOptions {
  // Options for the translation extension
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    translation: {
      /**
       * Translate the editor content
       */
      translateContent: () => ReturnType;
    };
  }
}

export const TranslationExtension = Extension.create<TranslationOptions>({
  name: "translation",

  addCommands() {
    return {
      translateContent:
        () =>
        ({ editor }) => {
          // This command will be called when the translation button is clicked
          // The actual translation logic will be handled in the button component
          return true;
        },
    };
  },
});

export default TranslationExtension;
