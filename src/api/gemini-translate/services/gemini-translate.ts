/**
 * gemini-translate service
 */

/**
 * Model se bere z prostředí, aby se při jeho vypnutí nemuselo sahat
 * do kódu — Google starší verze postupně odstavuje a volání pak končí
 * chybou 404 nebo „model not found".
 */
const DEFAULT_MODEL = "gemini-3.8-flash";

/** Základ adresy API; přepsat jde kvůli jiné verzi rozhraní. */
const DEFAULT_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

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
      const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
      const apiBase = process.env.GEMINI_API_BASE || DEFAULT_API_BASE;

      if (!apiKey) {
        throw new Error(
          "Chybí GEMINI_API_KEY — překlad bez klíče volat nejde."
        );
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
        `${apiBase}/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }
      );

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as any;
        const detail = errorData.error?.message || response.statusText;

        // Model je v hlášce schválně: nejčastější příčina je, že ho
        // Google odstavil, a ze samotné zprávy to poznat nejde.
        throw new Error(`Gemini API (${model}): ${detail}`);
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
