import { buildUniqueSlug, recordSlugChange } from "../../../../utils/slug";

const UID = "api::news-entry.news-entry";

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.title && !data.slug) {
      event.params.data.slug = await buildUniqueSlug({
        strapi,
        uid: UID,
        title: data.title,
        locale: data.locale,
      });
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    if (data.title && !data.slug) {
      const id = where?.id;

      const previous = id
        ? await strapi.entityService.findOne(UID, id, {
            fields: ["slug", "locale"],
          })
        : null;

      const nextSlug = await buildUniqueSlug({
        strapi,
        uid: UID,
        title: data.title,
        locale: data.locale || previous?.locale,
        currentId: id,
      });

      event.params.data.slug = nextSlug;

      await recordSlugChange({
        strapi,
        contentType: "news",
        entryId: id,
        oldSlug: previous?.slug,
        newSlug: nextSlug,
        locale: data.locale || previous?.locale,
      });
    }
  },
};
