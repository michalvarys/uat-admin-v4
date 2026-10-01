import {
  buildUniqueSlug,
  ensureUniqueSlug,
  recordSlugChange,
} from "../../../../utils/slug";

const UID = "api::news-entry.news-entry";

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    // Kontroluje se i slug, který přišel s daty: tlačítko „Fill in from
    // another locale" ho zkopíruje z originálu, takže by překlad chtěl
    // uložit hodnotu, kterou už někdo má. Pole je přitom unikátní napříč
    // jazyky a uložení by skončilo na „This attribute must be unique".
    const slug = await ensureUniqueSlug({
      strapi,
      uid: UID,
      slug: data.slug,
      title: data.title,
      locale: data.locale,
    });

    if (slug) {
      event.params.data.slug = slug;
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
