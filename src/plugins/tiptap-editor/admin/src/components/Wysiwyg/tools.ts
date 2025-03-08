// utils/styleHelpers.ts
import { colors } from "@ssupat/components";
import { ChakraStyleProps, BaseAttributes } from "../types/styleTypes";
import { ResponsiveValue, SystemStyleObject } from "@chakra-ui/react";

export const getColorValue = (colorKey?: string): string | undefined => {
  if (!colorKey) return undefined;
  if (colors[colorKey]) return colors[colorKey];
  const [group, shade] = colorKey.split(".");
  return colors[group]?.[shade];
};

export const createResponsiveValue = <T>(
  baseValue: T | undefined,
  sm?: T,
  md?: T,
  lg?: T,
  xl?: T
): ResponsiveValue<T> | undefined => {
  if (baseValue === undefined && !sm && !md && !lg && !xl) return undefined;

  const values: Record<string, T> = {};
  if (baseValue !== undefined) values.base = baseValue;
  if (sm !== undefined) values.sm = sm;
  if (md !== undefined) values.md = md;
  if (lg !== undefined) values.lg = lg;
  if (xl !== undefined) values.xl = xl;

  return Object.keys(values).length === 1 ? baseValue : values;
};

export const getChakraStyles = (
  attributes: BaseAttributes
): SystemStyleObject => {
  const getValue = <K extends keyof BaseAttributes>(key: K) => {
    const base = attributes[key];
    const sm = attributes.sm?.[key];
    const md = attributes.md?.[key];
    const lg = attributes.lg?.[key];
    const xl = attributes.xl?.[key];
    return createResponsiveValue(base, sm, md, lg, xl);
  };

  const getResponsiveColor = (key: "bg" | "color") => {
    const base = attributes[key]
      ? getColorValue(attributes[key] as string)
      : undefined;
    const sm = attributes.sm?.[key]
      ? getColorValue(attributes.sm[key] as string)
      : undefined;
    const md = attributes.md?.[key]
      ? getColorValue(attributes.md[key] as string)
      : undefined;
    const lg = attributes.lg?.[key]
      ? getColorValue(attributes.lg[key] as string)
      : undefined;
    const xl = attributes.xl?.[key]
      ? getColorValue(attributes.xl[key] as string)
      : undefined;
    return createResponsiveValue(base, sm, md, lg, xl);
  };

  const styles: ChakraStyleProps = {
    display: getValue("direction") ? "flex" : "block",
    flexDirection: getValue("direction"),
    alignItems: getValue("align"),
    justifyContent: getValue("justify"),
    flexWrap: createResponsiveValue(
      attributes.wrap ? "wrap" : "nowrap",
      attributes.sm?.wrap ? "wrap" : "nowrap",
      attributes.md?.wrap ? "wrap" : "nowrap",
      attributes.lg?.wrap ? "wrap" : "nowrap",
      attributes.xl?.wrap ? "wrap" : "nowrap"
    ),
    bg: getResponsiveColor("bg"),
    color: getResponsiveColor("color"),
    p: getValue("padding"),
    m: getValue("margin"),
    w: getValue("width"),
    h: getValue("height"),
    borderRadius: getValue("borderRadius"),
  };

  // Odstraníme undefined hodnoty
  return Object.entries(styles).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as SystemStyleObject);
};
