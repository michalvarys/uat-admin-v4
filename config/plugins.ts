export default ({ env }) => ({
  // "tiptap-editor": {
  //   enabled: true,
  //   resolve:
  //     env("NODE_ENV", "development") === "production"
  //       ? "/opt/node_modules/@ssupat/tiptap-editor"
  //       : "node_modules/@ssupat/tiptap-editor",
  // },
  "tiptap-editor": {
    enabled: true,
    resolve: "./src/plugins/uat-tiptap-editor",
  },
  upload: {
    config: {
      sizeLimit: 1000 * 1024 * 1024, // 256mb in bytes
    },
  },
});
