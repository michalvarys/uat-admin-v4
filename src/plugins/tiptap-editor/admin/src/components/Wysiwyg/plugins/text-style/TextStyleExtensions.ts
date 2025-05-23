import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";

// Configure TextStyle extension
// This is the base extension that allows applying inline styles to text
export const TextStyleExtension = TextStyle.configure({
  // By default, TextStyle applies to itself only
  // We don't need to configure anything specific here
});

// Configure Color extension
// This extension adds the ability to change text color
export const ColorExtension = Color.configure({
  // The types option specifies which marks the color attribute should be applied to
  // By default, it's set to ['textStyle']
  types: ["textStyle"],
});

// Configure FontFamily extension
// This extension adds the ability to change font family
export const FontFamilyExtension = FontFamily.configure({
  // The types option specifies which marks the fontFamily attribute should be applied to
  // By default, it's set to ['textStyle']
  types: ["textStyle"],
});

// List of common font families that can be used
export const fontFamilyOptions = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Tahoma, sans-serif", label: "Tahoma" },
  { value: "Trebuchet MS, sans-serif", label: "Trebuchet MS" },
  { value: "Impact, sans-serif", label: "Impact" },
  { value: "Comic Sans MS, cursive", label: "Comic Sans MS" },
];
