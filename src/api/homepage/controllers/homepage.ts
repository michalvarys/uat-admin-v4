import { factories } from "@strapi/strapi";
import { getResults } from "../../../utils/response";
import { ApiHomepageHomepage } from "../../../../types/generated/contentTypes";

const parseLimits = (query) => {
  const inl = Number(query.inl);
  const nl = Number(query.nl);

  return {
    newsLimit: !Number.isNaN(nl) ? nl : undefined,
    importantNewsLimit: !Number.isNaN(inl) ? inl : undefined,
  };
};

export default factories.createCoreController(
  "api::homepage.homepage",
  ({ strapi }) => {
    return {
      // TODO
      async getHomepageData(ctx) {
        const { query } = ctx;
        const { inl, nl, locale = "sk" } = query;

        const { importantNewsLimit, newsLimit } = parseLimits({ inl, nl });
        // TODO
        const sanitize = async (data) => {
          if (!data) {
            return;
          }

          const sanitized = await this.sanitizeOutput(data, ctx);
          return getResults(sanitized);
        };

        try {
          const news = await strapi.entityService.findMany(
            "api::news-entry.news-entry",
            {
              locale,
              offset: 0,
              limit: newsLimit || 25,
              sort: {
                date: "desc",
              },
              populate: {
                sections: true,
              },
            }
          );

          const importantNews = await strapi.entityService.findPage(
            "api::news-entry.news-entry",
            {
              locale,
              filters: {
                important_news: true,
              },
              populate: {
                sections: true,
              },
              page: 1,
              sort: {
                date: "desc",
              },
              pageSize: importantNewsLimit,
            }
          );

          const galleries = await strapi.entityService.findMany(
            "api::gallery.gallery",
            {
              locale,
              populate: "*",
            }
          );

          const galleryEvents = await strapi.entityService.findMany(
            "api::gallery-event.gallery-event",
            {
              locale,
              populate: "*",
              limit: 3,
              publicationState: "live",
              sort: {
                date: "desc",
              },
            }
          );

          const footer = await strapi.entityService.findMany(
            "api::footer.footer",
            {
              locale,
              populate: "*",
            }
          );

          const homepage = await strapi.entityService.findMany(
            "api::homepage.homepage",
            {
              locale,
              publicationState: "live",
              populate: {
                sections: {
                  populate: "*",
                },
                text_with_image: {
                  populate: "*",
                },
                galleries: {
                  populate: {
                    title: true,
                    subtitle: true,
                    description: true,
                    galleries_uat: {
                      populate: {
                        image_424x488: true,
                        address: true,
                        name: true,
                      },
                    },
                    image: true,
                  },
                },
                video_with_text: {
                  populate: "*",
                },
                fields_of_studies: {
                  populate: "*",
                },
                festivals: {
                  populate: "*",
                },
                cover_image: true,
                logo: true,
                localizations: { populate: "*" },
              },
            }
          );

          const fields_of_studies = homepage?.fields_of_studies?.length
            ? await strapi.service("api::field-of-study.field-of-study").find({
                where: {
                  id: homepage.fields_of_studies.map(({ id }) => id),
                },
                populate: "*",
              })
            : [];

          const festivals = homepage?.festivals?.length
            ? await strapi.service("api::festival.festival").find({
                where: {
                  id: homepage.festivals.map(({ id }) => id),
                },
                populate: "*",
                sort: "title:asc",
              })
            : [];

          const sanitizedGalleries = await sanitize(galleries);

          console.log({ sanitizedGalleries });
          const transformedUATGalleries = homepage?.galleries?.map((item) => {
            if (item.galleries_uat?.image_424x488) {
              let transformed = {
                ...item.galleries_uat,
                image: item.galleries_uat.image_424x488,
              };
              delete transformed.image_424x488;
              return transformed;
            }

            return item.galleries_uat;
          });

          const footerData = await sanitize(footer);
          const home = await sanitize(homepage);
          const result = {
            ...home,
            festivals: await sanitize(festivals),
            news: await sanitize(news),
            importantNews: await sanitize(importantNews),
            galleries: {
              ...sanitizedGalleries,
              galleries_uats: transformedUATGalleries,
            },
            galleryEvents: await sanitize(galleryEvents),
            fields_of_studies: await sanitize(fields_of_studies),
            social: {
              facebook: footerData?.facebook,
              instagram: footerData?.instagram,
              youtube: footerData?.youtube,
            },
          };

          return result;
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
      async find(ctx) {
        await this.validateQuery(ctx);
        type Query = {
          locale?: string;
          populate?: Record<keyof ApiHomepageHomepage["attributes"], any>;
        };
        const query: Query = await this.sanitizeQuery(ctx);

        const homepage = await strapi.entityService.findMany(
          "api::homepage.homepage",
          ctx.query
        );

        return homepage; //this.sanitizeOutput(homepage, ctx);
      },
    };
  }
);
