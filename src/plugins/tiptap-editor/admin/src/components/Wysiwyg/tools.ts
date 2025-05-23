// utils/styleHelpers.ts
import { colors } from "@ssupat/components";
import { ChakraStyleProps, BaseAttributes } from "../types/styleTypes";
import { ResponsiveValue, SystemStyleObject } from "@chakra-ui/react";

export const getColorValue = (colorKey?: string): string | undefined => {
  if (!colorKey) return undefined;
  if (colors[colorKey]) return colors[colorKey];
  try {
    const [group, shade] = colorKey.split(".");
    return colors[group][shade];
  } catch {
    return "inherit";
  }
};

export function normalizeColor(color) {
  const tempEl = document.createElement("div");
  tempEl.style.color = color;
  document.body.appendChild(tempEl);

  const computedColor = getComputedStyle(tempEl).color;

  document.body.removeChild(tempEl);
  return computedColor;
}

export function compareColor(color1, color2) {
  return normalizeColor(color1) === normalizeColor(color2);
}

// Get all available color keys from the color system
export const getAvailableColors = () => {
  const colorKeys = {};

  // Base Colors
  ["transparent", "current", "black", "white"].forEach((color) => {
    colorKeys[color] = true;
  });

  // Brand Colors
  ["uat_dark", "uat_light", "uat_green", "uat_orange"].forEach((color) => {
    colorKeys[color] = true;
  });

  // Alpha Colors
  ["whiteAlpha", "blackAlpha"].forEach((colorGroup) => {
    for (let i = 1; i <= 9; i++) {
      colorKeys[`${colorGroup}.${i}00`] = true;
    }
  });

  // Primary Colors
  [
    "gray",
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "cyan",
    "purple",
    "pink",
  ].forEach((colorGroup) => {
    for (let i = 1; i <= 9; i++) {
      colorKeys[`${colorGroup}.${i}00`] = true;
    }
  });

  // Social Colors
  [
    "linkedin",
    "facebook",
    "messenger",
    "whatsapp",
    "twitter",
    "telegram",
  ].forEach((colorGroup) => {
    for (let i = 1; i <= 9; i++) {
      colorKeys[`${colorGroup}.${i}00`] = true;
    }
  });

  return colorKeys;
};

// Find a color key by its value using normalization for comparison
export const findColorKeyByValue = (colorValue: string): string => {
  if (!colorValue) return "";

  // First try direct lookup with getColorKey
  const directKey = getColorKey(colorValue);
  if (directKey !== colorValue) {
    return directKey;
  }

  // If direct lookup fails, try normalizing and comparing
  const normalizedColor = normalizeColor(colorValue);

  // Check all available colors
  for (const key of Object.keys(getAvailableColors())) {
    const value = getColorValue(key);
    if (value && compareColor(normalizedColor, value)) {
      return key;
    }
  }

  // If no match found, return the original value
  return colorValue;
};

// Function to convert a hex color value back to a color key
export const getColorKey = (hexValue?: string): string => {
  if (!hexValue) return "";

  // Check direct colors (non-grouped)
  for (const [key, value] of Object.entries(colors)) {
    if (
      typeof value === "string" &&
      value.toLowerCase() === hexValue.toLowerCase()
    ) {
      return key;
    }
  }

  // Check grouped colors
  for (const [groupKey, groupColors] of Object.entries(colors)) {
    if (typeof groupColors === "object") {
      for (const [shadeKey, colorValue] of Object.entries(groupColors)) {
        if (colorValue.toLowerCase() === hexValue.toLowerCase()) {
          return `${groupKey}.${shadeKey}`;
        }
      }
    }
  }

  // If no match found, return the original hex value
  return hexValue;
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
