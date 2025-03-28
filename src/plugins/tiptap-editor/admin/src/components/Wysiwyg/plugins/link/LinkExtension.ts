import { mergeAttributes } from "@tiptap/core";
import LinkExtension from "@tiptap/extension-link";

export const CustomLink = LinkExtension.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: true,
      linkOnPaste: true,
      autolink: false,
      HTMLAttributes: {
        class: "custom-link",
      },
    };
  },

  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML(element) {
          return element.getAttribute("href");
        },
      },
      type: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-link-type"),
        renderHTML: (attributes) => {
          if (!attributes.type) {
            return {};
          }
          return { "data-link-type": attributes.type };
        },
      },
      linkCategory: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-link-category"),
        renderHTML: (attributes) => {
          if (!attributes.linkCategory) {
            return {};
          }
          return { "data-link-category": attributes.linkCategory };
        },
      },
      target: {
        default: this.options.HTMLAttributes.target,
      },
      rel: {
        default: this.options.HTMLAttributes.rel,
      },
      class: {
        default: this.options.HTMLAttributes.class,
        parseHTML: (element) => {
          const type = element.getAttribute("data-link-type");
          return type === "button" ? "custom-link button" : "custom-link";
        },
        renderHTML: (attributes) => {
          if (attributes.type === "button") {
            return { class: "custom-link button" };
          }
          return { class: "custom-link" };
        },
      },
      download: {
        default: null,
        parseHTML: (element) => element.getAttribute("download"),
        renderHTML: (attributes) => {
          if (!attributes.download) {
            return {};
          }
          return { download: attributes.download };
        },
      },
      recordType: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-record-type"),
        renderHTML: (attributes) => {
          if (!attributes.recordType) {
            return {};
          }
          return { "data-record-type": attributes.recordType };
        },
      },
      recordId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-record-id"),
        renderHTML: (attributes) => {
          if (!attributes.recordId) {
            return {};
          }
          return { "data-record-id": attributes.recordId };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "a",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const recordType = element.getAttribute("data-record-type");
          const recordId = element.getAttribute("data-record-id");
          const type = element.getAttribute("data-link-type");
          const href = element.getAttribute("href");
          const rel = element.getAttribute("rel");
          const target = element.getAttribute("target");
          const linkCategory = element.getAttribute("data-link-category");
          const className = element.getAttribute("class");
          return {
            class: className,
            linkCategory,
            recordType,
            recordId,
            href,
            type,
            rel,
            target,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, mark }) {
    return [
      "a",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "custom-link",
        "data-link-type": mark.attrs.type,
        "data-link-category": mark.attrs.linkCategory,
        "data-record-type": mark.attrs.recordType,
        "data-record-id": mark.attrs.recordId,
      }),
    ];
  },
});

export default CustomLink;
