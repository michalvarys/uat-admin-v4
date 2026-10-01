/**
 * Zajistí unikátní slug dřív, než Strapi ověří unikátnost polí.
 *
 * Tlačítko „Fill in from another locale" v administraci zkopíruje do
 * překladu všechna pole včetně slugu, takže se překlad pokouší uložit
 * hodnotu, kterou už má originál. Pole má `unique: true`, které ve
 * Strapi platí napříč jazyky, a uložení skončí na „This attribute must
 * be unique".
 *
 * Řešit to v lifecycle hooku nestačí: entityService volá
 * `validateEntityCreation` ještě před zápisem do databáze, takže chyba
 * padne dřív, než se `beforeCreate` vůbec spustí. Middleware upraví
 * tělo požadavku dřív než kdokoli jiný.
 *
 * Týká se jen zakládání záznamu přes Content Manager; úpravy
 * existujícího slugu řeší lifecycle hooky dál.
 */

import { buildUniqueSlug } from "../utils/slug";

/** Které typy obsahu mají slug a kam v Content Manageru patří. */
const SLUG_TYPES: Record<string, string> = {
  "api::page.page": "page",
  "api::news-entry.news-entry": "news-entry",
};

export default (_config: unknown, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: any) => {
    if (ctx.method !== "POST") {
      return next();
    }

    // Cesta se v různých verzích Strapi liší (prefix /admin, pozice
    // uid), proto se uid hledá podle tvaru „api::neco.neco" kdekoli
    // v cestě, ne na pevném indexu.
    const uid = ctx.path
      .split("/")
      .find((part: string) => /^api::[\w-]+\.[\w-]+$/.test(part));

    if (!uid || !SLUG_TYPES[uid] || !ctx.path.includes("collection-types")) {
      return next();
    }

    const data = ctx.request.body;
    const slug = typeof data?.slug === "string" ? data.slug.trim() : "";
    const title = typeof data?.title === "string" ? data.title.trim() : "";

    if (!slug && !title) {
      return next();
    }

    try {
      ctx.request.body = {
        ...data,
        slug: await buildUniqueSlug({
          strapi,
          uid,
          title: slug || title,
          locale: data?.locale,
        }),
      };
    } catch (error) {
      // Když se slug spočítat nepovede, pokračuje se beze změny —
      // Strapi případnou kolizi ohlásí jako dosud.
      strapi.log.error("[unique-slug] Nepodařilo se dopočítat slug:", error);
    }

    return next();
  };
};
