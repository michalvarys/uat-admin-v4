import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Wrapper from "./style";
import {
  Box,
  Stack,
  Flex,
  Field,
  Typography,
  FieldLabel,
} from "@strapi/design-system";
import { useIntl } from "react-intl";
import MenuBar from "./MenuBar";
import EditorDebug from "./EditorDebug";

import { EditorContent, useEditor } from "@tiptap/react";

// Tiptap Extensions
import BoldExtension from "@tiptap/extension-bold";
import BulletListExtension from "@tiptap/extension-bullet-list";
import CodeExtension from "@tiptap/extension-code";
import DocumentExtension from "@tiptap/extension-document";
import GapcursorExtension from "@tiptap/extension-gapcursor";
import HeadingExtension from "@tiptap/extension-heading";
import HistoryExtension from "@tiptap/extension-history";
import ItalicExtension from "@tiptap/extension-italic";
import ListItemExtension from "@tiptap/extension-list-item";
import ParagraphExtension from "@tiptap/extension-paragraph";
import PlaceholderExtension from "@tiptap/extension-placeholder";
import StrikeExtension from "@tiptap/extension-strike";
import TextExtension from "@tiptap/extension-text";
import UnderlineExtension from "@tiptap/extension-underline";
import ImageExtension from "@tiptap/extension-image";
import TextAlignExtension from "@tiptap/extension-text-align";
import TableExtension from "@tiptap/extension-table";
import TableRowExtension from "@tiptap/extension-table-row";
import TableCellExtension from "@tiptap/extension-table-cell";
import TableHeaderExtension from "@tiptap/extension-table-header";
import TextStyleExtension from "@tiptap/extension-text-style";
import CharacterCountExtension from "@tiptap/extension-character-count";
import OrderedListExtension from "@tiptap/extension-ordered-list";
import BlockquoteExtension from "@tiptap/extension-blockquote";
import CodeBlockExtension from "@tiptap/extension-code-block";
import HardBreakExtension from "@tiptap/extension-hard-break";
import HighlightExtension from "@tiptap/extension-highlight";
import HorizontalRuleExtension from "@tiptap/extension-horizontal-rule";
import CharacterCounter from "./CharacterCounter";
import { CustomLink } from "./plugins/LinkButon";
import { AccordionExtension } from "./plugins/accordin/AccordionExtension";
import { HTMLCodeBlockExtension } from "./plugins/code/HTMLCodeBlockExtension";
import { BoxExtension } from "./plugins/box/BoxExtension";
import { StackExtension } from "./plugins/stack/StackExtension";
import { TabsExtension } from "./plugins/tabs/TabsExtension";

export function useCustomEditor(opts) {
  const {
    hint,
    disabled,
    error,
    intlLabel,
    labelAction,
    name,
    onChange,
    placeholder,
    value,
    required,
    playground,
    description,
    attribute,
  } = opts;

  const [content, setContent] = useState(value || "");
  const characterLimit = attribute?.maxLength || 0;

  const editor = useEditor({
    extensions: [
      TabsExtension,
      StackExtension,
      BoxExtension,
      HTMLCodeBlockExtension,
      AccordionExtension,
      DocumentExtension,
      ParagraphExtension,
      TextExtension,
      BoldExtension,
      StrikeExtension,
      ItalicExtension,
      GapcursorExtension,
      ListItemExtension,
      BulletListExtension,
      OrderedListExtension,
      HeadingExtension,
      UnderlineExtension,
      CustomLink.configure({
        openOnClick: false,
      }),
      // CustomLink,
      ImageExtension,
      TextAlignExtension.configure({
        types: ["heading", "paragraph"],
      }),
      TableExtension.configure({
        allowTableNodeSelection: true,
      }),
      TableRowExtension,
      TableCellExtension,
      TableHeaderExtension,
      TextStyleExtension,
      BlockquoteExtension,
      CodeBlockExtension,
      CodeExtension,
      HardBreakExtension,
      HorizontalRuleExtension,
      CharacterCountExtension.configure({
        limit: characterLimit,
      }),

      PlaceholderExtension.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            // console.log('node heading')
            return "Write awesome title...";
          }

          // console.log(node)

          return "Write something awesome...";
        },
      }),
      HistoryExtension,
    ],

    content,

    parseOptions: {
      preserveWhitespace: "full",
    },

    onBeforeCreate({ editor }) {},

    onUpdate({ editor }) {
      // if (debug) console.log('onUpdate')

      onChange({ target: { name, value: editor.getHTML() } });
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (content === "") {
      setContent(value);
      editor.commands.setContent(value, false);
    }
  }, [editor]);

  return editor;
}
