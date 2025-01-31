import slugify from "slugify";

export default {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    if (data.title && !data.slug) {
      event.params.data.slug = slugify(data.title, {
        lower: true,
        remove: /[*+~./()'"!:@.,=&]/g,
      });
    }
  },

  async beforeUpdate(event) {
    const { data, where, select, populate } = event.params;
    if (data.title && !data.slug) {
      event.params.data.slug = slugify(data.title, {
        lower: true,
        remove: /[*+~./()'"!:@.,=&]/g,
      });
    }
  },
};
