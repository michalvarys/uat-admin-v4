/**
 * gemini-translate service
 */

export default {
  /**
   * Translate content using Google Gemini Flash API
   * @param {object} content - The content to translate (JSON object)
   * @param {string} targetLanguage - The target language code (default: 'en')
   * @returns {Promise<string>} - The translated content as a JSON string
   */
  async translate(
    content: any,
    targetLanguage: string = "en"
  ): Promise<string> {
    try {
      // Configure the API key for Google Gemini Flash
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("API key is not configured");
      }

      const body = JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Translate the following json values that contain text and html content from Czech to ${
                  targetLanguage === "en" ? "English" : targetLanguage
                }. These include regular text content, tab titles, accordion titles, and other UI elements. Keep the same format and preserve any special characters or formatting. \`\`\`json\n${JSON.stringify(
                  content
                )}\n\`\`\``,
              },
            ],
          },
        ],
      });

      // Call the Google Gemini Flash API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }
      );

      if (!response.ok) {
        const errorData = (await response.json()) as any;
        throw new Error(
          `Gemini API error: ${errorData.error?.message || response.statusText}`
        );
      }

      const data = (await response.json()) as any;

      // Extract the translated content from the response
      const translatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return translatedText;
    } catch (error) {
      strapi.log.error("Translation service error:", error);
      throw error;
    }
  },
};
