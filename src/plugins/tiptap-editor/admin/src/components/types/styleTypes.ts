// types/styleTypes.ts
import type {
  SystemStyleObject,
  ResponsiveValue,
  ThemeTypings,
} from "@chakra-ui/react";

// Základní typy pro Chakra UI properties
export interface ChakraStyleProps {
  display?: ResponsiveValue<
    "flex" | "block" | "inline" | "inline-block" | "none" | undefined
  >;
  flexDirection?: ResponsiveValue<
    "row" | "column" | "row-reverse" | "column-reverse" | undefined
  >;
  alignItems?: ResponsiveValue<
    "flex-start" | "flex-end" | "center" | "stretch" | "baseline" | undefined
  >;
  justifyContent?: ResponsiveValue<
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | undefined
  >;
  gap?: ResponsiveValue<number | string>;
  p?: ResponsiveValue<number | string | undefined>;
  m?: ResponsiveValue<number | string | undefined>;
  w?: ResponsiveValue<string | number | undefined>;
  h?: ResponsiveValue<string | number | undefined>;
  bg?: ResponsiveValue<string>;
  color?: ResponsiveValue<string>;
  borderRadius?: ResponsiveValue<number | string | undefined>;
  flexWrap?: ResponsiveValue<"wrap" | "nowrap" | "wrap-reverse">;
}

// Základní atributy pro Box i Stack komponenty
export interface BaseAttributes {
  direction?: "row" | "column";
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  wrap?: boolean;
  bg?: string;
  color?: string;
  padding?: string | number;
  margin?: string | number;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  sm?: Partial<BaseAttributes>;
  md?: Partial<BaseAttributes>;
  lg?: Partial<BaseAttributes>;
  xl?: Partial<BaseAttributes>;
}
