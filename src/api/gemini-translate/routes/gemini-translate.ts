export default {
  routes: [
    {
      method: "POST",
      path: "/gemini-translate",
      handler: "gemini-translate.translate",
      config: {
        policies: [],
        description: "Translate content using Google Gemini Flash API",
        tag: {
          plugin: "gemini-translate",
          name: "Translation",
        },
        auth: false,
      },
    },
  ],
};
