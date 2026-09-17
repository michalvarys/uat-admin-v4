import { buildUniqueSlug, recordSlugChange } from "../../../../utils/slug";

const UID = "api::page.page";

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

    // Původní chování: u stránek se slug drží synchronizovaný s názvem,
    // proto se přegeneruje i tehdy, když slug už nějaký je.
    if (data.title) {
      const id = where?.id;

      // Původní hodnotu je potřeba načíst teď, po uložení už není dostupná.
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
        // vlastní záznam se z kontroly vynechá, jinak by si při každé
        // úpravě názvu přidával další příponu
        currentId: id,
      });

      event.params.data.slug = nextSlug;

      await recordSlugChange({
        strapi,
        contentType: "page",
        entryId: id,
        oldSlug: previous?.slug,
        newSlug: nextSlug,
        locale: data.locale || previous?.locale,
      });
    }
  },
};
