import fs from "fs";
import path from "path";

//       : fs.existsSync(
//           path.join(process.cwd(), "src", "plugins", "uat-tiptap-editor")
//         )
//       ? "./src/plugins/uat-tiptap-editor"
export default ({ env }) => ({
  "tiptap-editor": {
    enabled: false,
    resolve:
      env("NODE_ENV", "development") === "production"
        ? "/opt/node_modules/@ssupat/tiptap-editor"
        : "node_modules/@ssupat/tiptap-editor",
  },
  // "tiptap-editor": {
  //   enabled: true,
  //   resolve: "./src/plugins/uat-tiptap-editor",
  // },
  upload: {
    config: {
      sizeLimit: 1000 * 1024 * 1024, // 256mb in bytes
    },
  },
});
