import { Strapi } from "@strapi/strapi";
import pluginPkg from "../../package.json";
import Wysiwyg from "./components/Wysiwyg";
import pluginId from "./pluginId";

const name = pluginPkg.strapi.name;

export default {
  register(app: Strapi["app"]) {
    app.addFields({ type: "wysiwyg", Component: Wysiwyg });

    app.registerPlugin({
      id: pluginId,
      isReady: true,
      name,
    });
  },
  bootstrap() {},
};
