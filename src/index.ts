import type { Strapi } from "@strapi/strapi";

import { setupRevalidateWebhook } from "./bootstrap/revalidate-webhook";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Strapi }) {
    strapi.server.httpServer.requestTimeout = 30 * 60 * 1000;

    // Webhook na přegenerování frontendu se zakládá při každém startu,
    // aby ho nebylo nutné po obnovení prostředí nastavovat ručně.
    await setupRevalidateWebhook({ strapi });
  },
};
