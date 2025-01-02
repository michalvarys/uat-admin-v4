export default ({ env }) => ({
  "tiptap-editor": {
    enabled: true,
    resolve:
      env("NODE_ENV", "development") === "production"
        ? "/opt/node_modules/@ssupat/tiptap-editor"
        : "node_modules/@ssupat/tiptap-editor",
  },
});
