/**
 * news-entry router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::news-entry.news-entry", {
  config: {
    find: {
      auth: false,
    },
  },
});
