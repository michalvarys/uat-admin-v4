import { Editor } from "@tiptap/core";
import { MediaFile, Page, NewsEntry } from "../../plugins/link/types";
import { ResponsiveArray } from "@chakra-ui/react";

export interface CardItem {
  id: string;
  image: MediaFile | null;
  recordType: "pages" | "news";
  recordId: number | string;
  href: string;
  title?: string; // Automatically populated from the selected record
}

export type ColumnsConfig = ResponsiveArray<number>;

export interface CardListAttributes {
  cards: CardItem[];
  columns?: ColumnsConfig;
}

export interface CardListButtonProps {
  editor: Editor;
}
