export default {
  routes: [
    {
      method: "GET",
      path: "/news",
      handler: "news-entry.getNews",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/news-generate",
      handler: "news-entry.getLocalisedNewsBySlug",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/news/:slug",
      handler: "news-entry.getNewsBySlug",
      config: {
        auth: false,
      },
    },
  ],
};
