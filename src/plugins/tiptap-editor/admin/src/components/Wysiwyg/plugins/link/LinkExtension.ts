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
});

export default CustomLink;
