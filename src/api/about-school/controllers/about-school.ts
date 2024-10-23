/**
 * about-school controller
 */

import { factories } from "@strapi/strapi";
import { getResults } from "../../../utils/response";

export default factories.createCoreController(
  "api::about-school.about-school",
  {
    async find(ctx) {
      const { locale = "sk" } = ctx.query;

      const aboutSchool = await strapi.entityService.findMany(
        "api::about-school.about-school",
        {
          locale,
          populate: {
            applications_at_university: {
              populate: {
                sections: {
                  populate: "*",
                },
              },
            },

            eu_projects: {
              populate: "*",
            },

            employment_statistics: {
              populate: {
                statistic_entry: {
                  populate: "*",
                },
              },
            },

            buttons: {
              populate: "*",
            },

            video: {
              populate: {
                cover_image: true,
                youtube_video_id: true,
              },
            },
          },
          publicationState: "live",
        }
      );

      const data = getResults(aboutSchool);
      return data;
    },
  }
);
