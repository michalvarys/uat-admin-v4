import { factories } from "@strapi/strapi";
import { ApiHomepageHomepage } from "../../../../types/generated/contentTypes";

export default factories.createCoreController(
  "api::homepage.homepage",
  ({ strapi }) => {
    return {
      async find(ctx) {
        await this.validateQuery(ctx);
        type Query = {
          locale?: string;
          populate?: Record<keyof ApiHomepageHomepage["attributes"], any>;
        };
        await this.validateQuery(ctx);
        const query: Query = await this.sanitizeQuery(ctx);

        const homepage = await strapi.entityService.findMany(
          "api::homepage.homepage",
          query
        );

        return homepage;
      },
    };
  }
);
