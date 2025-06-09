import { useState, useMemo } from "react";
import { FlexboxItemAttributes } from "../types";
import { findColorKeyByValue } from "../../../tools";

export function useFlexboxItemSettings(initialAttrs: FlexboxItemAttributes) {
  const [width, setWidth] = useState(initialAttrs.width || "auto");
  const [flex, setFlex] = useState(initialAttrs.flex || "1 1 0");
  const [height, setHeight] = useState(initialAttrs.height || "auto");
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
  const [alignSelf, setAlignSelf] = useState(initialAttrs.alignSelf || "auto");
  const [order, setOrder] = useState(initialAttrs.order || "0");

  const itemStyle = useMemo(
    () => ({
      border: "1px dashed #ccc",
      borderRadius: "4px",
      position: "relative" as const,
      minWidth: "0",
      backgroundColor: background,
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      backgroundSize: "cover" as const,
      backgroundPosition: "center",
      width,
      height,
      padding,
      margin,
      alignSelf,
      order,
      flex,
    }),
    [
      width,
      flex,
      height,
      padding,
      margin,
      background,
      backgroundImage,
      alignSelf,
      order,
    ]
  );

  const getAttributes = (): Partial<FlexboxItemAttributes> => ({
    width,
    flex,
    height,
    padding,
    margin,
    background,
    backgroundImage,
    alignSelf,
    order,
  });

  return {
    width,
    setWidth,
    flex,
    setFlex,
    height,
    setHeight,
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
    alignSelf,
    setAlignSelf,
    order,
    setOrder,
    itemStyle,
    getAttributes,
  };
}
