import { buildUniqueSlug } from "../../../../utils/slug";

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
      event.params.data.slug = await buildUniqueSlug({
        strapi,
        uid: UID,
        title: data.title,
        locale: data.locale,
        // vlastní záznam se z kontroly vynechá, jinak by si při každé
        // úpravě názvu přidával další příponu
        currentId: where?.id,
      });
    }
  },
};
