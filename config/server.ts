import axios from "axios";

export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  cron: {
    enabled: true,
    scrapperUrl: env("SCRAPPER_URL", "http://localhost:8080/fb"),

    tasks: {
      "0 1 * * * *": async ({ strapi }) => {
        const url =
          env("SCRAPPER_URL", "http://localhost:8080/fb") ||
          process.env.SCRAPPER_URL ||
          "http://scrapper:8080/fb";
        try {
          await axios.post(url);
        } catch (err) {
          console.log(err);
        }
      },
    },
  },
});
