/**
 * gallery controller
 */

import { factories } from "@strapi/strapi";
import { ApiGalleryGallery } from "../../../../types/generated/contentTypes";

export default factories.createCoreController(
  "api::gallery.gallery",
  ({ strapi }) => {
    return {
      async find(ctx) {
        type Query = {
          locale?: string;
          populate?: Record<keyof ApiGalleryGallery["attributes"], any>;
        };

        await this.validateQuery(ctx);
        const query: Query = await this.sanitizeQuery(ctx);

        const homepage = await strapi.entityService.findMany(
          "api::gallery.gallery",
          query
        );

        return homepage;
      },
    };
  }
);
