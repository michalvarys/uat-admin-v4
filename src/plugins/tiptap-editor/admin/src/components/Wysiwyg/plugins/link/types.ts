import { Editor } from "@tiptap/core";

export interface MediaFile {
  alt: string;
  url: string;
  mime: string;
}

export interface PageAttributes {
  title?: string;
  name?: string;
  slug: string;
  [key: string]: any;
}

export interface NewsEntryAttributes {
  title?: string;
  slug: string;
  [key: string]: any;
}

export interface Page extends PageAttributes {}

export interface NewsEntry {
  id: number;
  title?: string;
  slug: string;
  [key: string]: any;
}

export interface LinkAttributes {
  href: string;
  type: string;
  linkCategory: string;
  class: string;
  target: string;
  rel: string;
  download?: string | boolean | null;
  recordType?: string;
  recordId?: number | string;
}

export interface LinkButtonProps {
  editor: Editor;
}
