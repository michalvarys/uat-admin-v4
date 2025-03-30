/**
 * page controller
 */

import { factories } from "@strapi/strapi";
import { ApiPagePage } from "../../../../types/generated/contentTypes";

export default factories.createCoreController(
  "api::page.page",
  ({ strapi }) => {
    return {
      async find(ctx) {
        // console.log("find", ctx);
        await this.validateQuery(ctx);
        type Query = {
          locale?: string;
          populate?: Record<keyof ApiPagePage["attributes"], any>;
        };
        const query: Query = await this.sanitizeQuery(ctx);

        const pages = await strapi.entityService.findMany(
          "api::page.page",
          query
        );

        return pages;
      },
    };
  }
);
