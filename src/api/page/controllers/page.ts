/**
 * page controller
 */

import { factories } from "@strapi/strapi";
import { link } from "fs";

export default factories.createCoreController("api::page.page", {
  async find(ctx) {
    const { query, request } = ctx;
    const { slug, locale = "sk" } = query;

    const page = await strapi.entityService.findMany("api::page.page", {
      locale,
      filters: {
        slug,
      },
      populate: {
        sections: {
          populate: {
            sections: {
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
            cover_image: true,
            gallery_item: {
              populate: "*",
            },
            content: true,
            tabs: {
              populate: {
                content: true,
                title: true,
                items: {
                  populate: {
                    title: true,
                    links: {
                      populate: "*",
                    },
                  },
                },
              },
            },
            teachers: {
              populate: "*",
            },
            CardItem: {
              populate: "*",
            },
          },
        },
        cover_image: true,
      },
    });

    console.log(page.flatMap((p) => p.sections));
    return page;
  },

  async findOne(ctx) {
    const { query, request } = ctx;
    const { slug, locale = "sk" } = query;
    const page = await strapi.entityService.findOne("api::page.page", slug, {
      locale,
      filters: {
        slug,
      },
      populate: {
        sections: {
          populate: "*",
        },
        cover_image: true,
      },
    });

    return page;
  },
});
