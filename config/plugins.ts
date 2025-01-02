export default ({ env }) => ({
  "tiptap-editor": {
    enabled: true,
    resolve:
      env("NODE_ENV", "development") === "production"
        ? "/opt/app/node_modules/@ssupat/tiptap-editor"
        : "node_modules/@ssupat/tiptap-editor",
  },
});
