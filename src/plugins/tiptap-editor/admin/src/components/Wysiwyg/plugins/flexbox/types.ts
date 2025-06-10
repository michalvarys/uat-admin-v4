import { Editor, NodeViewProps } from "@tiptap/core";
import { Node } from "prosemirror-model";

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";

export interface ResponsiveSettings {
  mobile?: {
    direction?: FlexDirection;
  };
  tablet?: {
    direction?: FlexDirection;
  };
}

export interface FlexboxAttributes {
  direction: FlexDirection;
  padding: string;
  margin: string;
  background: string;
  backgroundImage: string;
  gap: string;
  responsive: string;
}

export interface FlexboxItemAttributes {
  width: string;
  flex: string;
  height: string;
  padding: string;
  margin: string;
  background: string;
  backgroundImage: string;
  alignSelf: string;
  order: string;
}

export interface FlexboxComponentProps extends NodeViewProps {
  node: Node & {
    attrs: FlexboxAttributes;
  };
  updateAttributes: (attrs: Partial<FlexboxAttributes>) => void;
  editor: Editor;
  getPos: () => number;
}

export interface FlexboxItemComponentProps extends NodeViewProps {
  node: Node & {
    attrs: FlexboxItemAttributes;
  };
  updateAttributes: (attrs: Partial<FlexboxItemAttributes>) => void;
  editor: Editor;
  getPos: () => number;
}
