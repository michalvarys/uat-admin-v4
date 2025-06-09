import { useState, useMemo } from "react";
import { FlexboxAttributes, ResponsiveSettings, FlexDirection } from "../types";
import { findColorKeyByValue } from "../../../tools";

export function useFlexboxSettings(initialAttrs: FlexboxAttributes) {
  const [flexDirection, setFlexDirection] = useState<FlexDirection>(
    initialAttrs.direction || "row"
  );
  const [padding, setPadding] = useState(initialAttrs.padding || "0px");
  const [margin, setMargin] = useState(initialAttrs.margin || "0px");
  const [backgroundColorKey, setBackgroundColorKey] = useState(() => {
    if (initialAttrs.background) {
      return findColorKeyByValue(initialAttrs.background);
    }
    return "transparent";
  });
  const [background, setBackground] = useState(
    initialAttrs.background || "transparent"
  );
  const [backgroundImage, setBackgroundImage] = useState(
    initialAttrs.backgroundImage || ""
  );
  const [gap, setGap] = useState(initialAttrs.gap || "0px");
  const [responsiveSettings, setResponsiveSettings] =
    useState<ResponsiveSettings>(() => {
      try {
        return JSON.parse(initialAttrs.responsive || "{}");
      } catch (e) {
        return {};
      }
    });

  const containerStyle = useMemo(
    () => ({
      position: "relative" as const,
      width: "100%",
      backgroundColor: background,
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      backgroundSize: "cover" as const,
      backgroundPosition: "center",
      padding,
      margin,
      gap,
    }),
    [background, backgroundImage, padding, margin, gap]
  );

  const getAttributes = (): Partial<FlexboxAttributes> => ({
    direction: flexDirection,
    padding,
    margin,
    background,
    backgroundImage,
    gap,
    responsive: JSON.stringify(responsiveSettings),
  });

  return {
    flexDirection,
    setFlexDirection,
    padding,
    setPadding,
    margin,
    setMargin,
    backgroundColorKey,
    setBackgroundColorKey,
    background,
    setBackground,
    backgroundImage,
    setBackgroundImage,
    gap,
    setGap,
    responsiveSettings,
    setResponsiveSettings,
    containerStyle,
    getAttributes,
  };
}
