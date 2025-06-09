/**
 * A controller for handling translation requests using Google Gemini Flash API
 */

export default {
  /**
   * Translate content to English
   * @param {object} ctx - The context object containing the request
   */
  translate: async (ctx) => {
    try {
      const { content, targetLanguage = "en" } = ctx.request.body;

      if (!content) {
        return ctx.badRequest("Content is required");
      }

      // Use the translation service
      const translatedContent = await strapi
        .service("api::gemini-translate.gemini-translate")
        .translate(content, targetLanguage);

      // Return the translated content
      return {
        translatedContent,
      };
    } catch (error) {
      strapi.log.error("Translation error:", error);
      return ctx.badRequest(`Translation error: ${error.message}`);
    }
  },
};
