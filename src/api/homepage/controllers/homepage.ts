import { factories } from "@strapi/strapi";

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
      async find(ctx) {
        const { request, response } = ctx;
        const url = new URL(request.url, "http://localhost");
        const locale = url.searchParams.get("locale");
        const inl = url.searchParams.get("inl");
        const nl = url.searchParams.get("nl");
        const { importantNewsLimit, newsLimit } = parseLimits({ inl, nl });
        const sanitize = async (data) => {
          if (!data) {
            return;
          }

          const sanitized = await this.sanitizeOutput(data, ctx);
          // @ts-ignore
          if (sanitized.results) {
            // @ts-ignore
            return sanitized.results;
          }

          return sanitized;
        };

        try {
          const news = await strapi.entityService.findMany(
            "api::news-entry.news-entry",
            {
              offset: 0,
              limit: newsLimit || 25,
              sort: {
                date: "desc",
              },
              populate: {
                sections: true,
              },
              where: {
                locale,
              },
            }
          );

          const importantNews = await strapi.entityService.findPage(
            "api::news-entry.news-entry",
            {
              where: { locale, important_news: true },
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

          const galleries = await strapi.service("api::gallery.gallery").find({
            locale,
          });

          const galleryEvents = await strapi
            .service("api::gallery-event.gallery-event")
            .find({
              where: { locale },
            });

          const footer = await strapi.service("api::footer.footer").find({
            where: { locale },
            populate: {
              footer_sections: true,
              instagram: true,
              youtube: true,
              facebook: true,
            },
          });

          const homepage = await strapi.service("api::homepage.homepage").find({
            where: { locale },
            populate: {
              sections: true,
              text_with_image: true,
              fields_of_studies: true,
              cover_image: true,
              festivals: true,
              galleries: true,
              video_with_text: true,
              logo: true,
            },
          });

          const sanitizedGalleries = await sanitize(galleries);

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
            news: await sanitize(news),
            importantNews: await sanitize(importantNews),
            galleries: {
              ...sanitizedGalleries,
              galleries_uats: transformedUATGalleries,
            },
            galleryEvents: await sanitize(galleryEvents),
            fields_of_studies: await sanitize(
              (home.fields_of_studies || [])
                .map((item) => item.field_of_study)
                .slice(0, 5)
            ),
            social: {
              facebook: footerData?.facebook,
              instagram: footerData?.instagram,
              youtube: footerData?.youtube,
            },
          };
          console.log(result);

          return result;
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
    };
  }
);
