/**
 * about-school router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::about-school.about-school", {
  config: {
    find: {
      auth: false,
    },
  },
});
