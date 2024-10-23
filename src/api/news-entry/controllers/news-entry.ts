/**
 * news-entry controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::news-entry.news-entry", {
  async getNewsBySlug(ctx) {
    const { request } = ctx;
    const slug = request.url.split("/").pop().split("?").shift();
    const query = await this.sanitizeQuery(ctx);

    await this.validateQuery(ctx);

    const news = await strapi.entityService.findMany(
      "api::news-entry.news-entry",
      {
        ...query,
        filters: {
          // @ts-ignore
          ...query.filters,
          slug: slug,
        },
      }
    );

    const sanitizedResults = await this.sanitizeOutput(news[0], ctx);

    return sanitizedResults;
  },
  async getLocalisedNewsBySlug(ctx) {
    const { locale } = ctx.query;
    const locales = Array.isArray(locale) ? locale : [locale];

    const news = await Promise.all(
      locales.map((locale) =>
        strapi.entityService.findMany("api::news-entry.news-entry", {
          locale,
          populate: {
            sections: {
              populate: {
                gallery_item: {
                  populate: {
                    thumbnail_410x551: {
                      populate: "*",
                    },
                    fullsize: {
                      populate: "*",
                    },
                  },
                },
                content: true,
                cover_image: {
                  populate: "*",
                },
              },
            },

            localizations: {
              populate: "*",
              publicationState: "live",
            },
          },
        })
      )
    );

    return this.sanitizeOutput(news.flat(), ctx);
  },

  async getNews(ctx) {
    const { slug, locale = "sk" } = ctx.query;
    const query = await this.sanitizeQuery(ctx);

    await this.validateQuery(ctx);

    const news = await strapi.entityService.findMany(
      "api::news-entry.news-entry",
      query
    );

    const sanitizedResults = await this.sanitizeOutput(news, ctx);

    return sanitizedResults;
  },
  async find(ctx) {
    const { year, locale = "sk" } = ctx.query;

    await this.validateQuery(ctx);
    const query = await this.sanitizeQuery(ctx);

    // List of years
    const years = await strapi.entityService.findMany(
      "api::news-entry.news-entry",
      {
        filters: {
          locale,
        },
        fields: ["date"],
        sort: {
          date: "desc",
        },
      }
    );

    const news = await strapi.entityService.findMany(
      "api::news-entry.news-entry",
      query
    );

    return {
      years: [
        ...new Set(years.map((year) => new Date(year.date).getFullYear())),
      ]
        .filter((year) => year !== 1970)
        .map(String),
      news: await this.sanitizeOutput(news, ctx),
      year,
    };
  },
});
