import { getResults } from "../../../utils/response";

export default {
  async globalData(ctx, next) {
    const { query } = ctx;
    const { locale = "sk" } = query;
    // TODO
    const sanitize = async (data) => getResults(data);

    const menuStudents = await strapi.entityService.findMany(
      "api::menu-student.menu-student",
      {
        locale,
        populate: {
          documents: {
            populate: "*",
          },
          links: {
            populate: {
              internalLink: {
                populate: "*",
              },
              externalLink: {
                populate: "*",
              },
            },
          },
          news: {
            populate: "*",
          },
        },
      }
    );

    const menuApplicants = await strapi.entityService.findMany(
      "api::menu-applicant.menu-applicant",
      {
        locale,
        populate: {
          bottomLeftLink: {
            populate: "*",
          },
          bottomRightLink: {
            populate: "*",
          },
          links: {
            populate: "*",
          },
          studies: {
            populate: {
              field_of_study: {
                populate: {
                  icon_svg: true,
                },
              },
            },
          },
        },
      }
    );

    const menuSchool = await strapi.entityService.findMany(
      "api::menu-school.menu-school",
      {
        locale,
        populate: {
          contactSections: {
            populate: "*",
          },
          links: {
            populate: "*",
          },
          documents: {
            populate: "*",
          },
          news: {
            populate: "*",
          },
        },
      }
    );

    const menuFestivals = await strapi.entityService.findMany(
      "api::menu-festival.menu-festival",
      {
        locale,
        populate: {
          festivals: {
            populate: {
              links: {
                populate: "*",
              },
              festivals: {
                populate: "*",
              },
            },
          },
          links: {
            populate: "*",
          },
        },
      }
    );

    const festivals = await strapi.service("api::festival.festival").find({
      where: {
        id: menuFestivals.festivals?.map(({ id }) => id),
      },
      locale,
      populate: "*",
      sort: "title:asc",
    });

    const global = {}; //await strapi.services.global.find(ctx.query);
    const footer = await strapi.entityService.findMany("api::footer.footer", {
      locale,
      populate: {
        youtube: {
          populate: "*",
        },
        facebook: {
          populate: "*",
        },
        instagram: {
          populate: "*",
        },
        contact: {
          populate: "*",
        },
        footer_sections: {
          populate: "*",
        },
      },
    });

    const result = {
      ...global,
      footer: await sanitize(footer),
      menu: [
        await sanitize({
          ...menuApplicants,
          studies:
            menuApplicants &&
            menuApplicants.studies
              .slice(0, 5)
              .map((item) => item.field_of_study),
        }),
        await sanitize(menuStudents),
        await sanitize(menuSchool),
        await sanitize({
          ...menuFestivals,
          festivals: await sanitize(festivals),
        }),
      ].filter((item) => item !== null),
    };

    return result;
  },
};
