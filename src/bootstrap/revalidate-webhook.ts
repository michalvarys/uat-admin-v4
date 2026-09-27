import type { Strapi } from '@strapi/strapi'

/**
 * Založí webhook, kterým Strapi po uložení obsahu řekne frontendu,
 * ať stránku přegeneruje.
 *
 * Bez něj se stránky obnovují jen podle času: po vypršení platnosti
 * vydá Next starou verzi a novou připraví až na pozadí, takže se změna
 * projeví o několik minut později — a na stránku, kam nikdo nechodí,
 * se nedostane vůbec.
 *
 * Nastavovat webhook ručně v administraci by znamenalo, že se na něj
 * po každém obnovení stagingu ze zálohy produkce zapomene: obnoví se
 * i tabulka webhooků, takže by tam zůstal ten produkční. Proto se
 * zakládá při startu, podle proměnných prostředí daného prostředí.
 */

const NAME = 'revalidate-frontend'

const EVENTS = [
  'entry.create',
  'entry.update',
  'entry.delete',
  'entry.publish',
  'entry.unpublish',
]

export async function setupRevalidateWebhook({ strapi }: { strapi: Strapi }) {
  const url = process.env.REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET

  // Bez obou hodnot nemá smysl webhook zakládat — volání by frontend
  // stejně odmítl. Na vývoji běžně nastavené nejsou.
  if (!url || !secret) {
    strapi.log.info(
      `[${NAME}] REVALIDATE_URL nebo REVALIDATE_SECRET není nastavené, webhook se nezakládá.`
    )
    return
  }

  const store = strapi.webhookStore

  if (!store) {
    strapi.log.warn(`[${NAME}] Úložiště webhooků není dostupné.`)
    return
  }

  const wanted = {
    name: NAME,
    url,
    headers: { 'x-revalidate-secret': secret },
    events: EVENTS,
    isEnabled: true,
  }

  try {
    const existing = (await store.findWebhooks()).find((w) => w.name === NAME)

    if (!existing) {
      await store.createWebhook(wanted as any)
      strapi.log.info(`[${NAME}] Webhook založen → ${url}`)
      return
    }

    // Adresa i tajemství se mezi prostředími liší a po obnovení stagingu
    // ze zálohy produkce zůstanou v databázi produkční hodnoty. Proto se
    // existující webhook porovná a případně přepíše.
    const differs =
      existing.url !== wanted.url ||
      existing.headers?.['x-revalidate-secret'] !== secret ||
      !existing.isEnabled ||
      EVENTS.some((e) => !existing.events?.includes(e))

    if (differs) {
      await store.updateWebhook(existing.id, {
        ...wanted,
        id: existing.id,
      } as any)
      strapi.log.info(`[${NAME}] Webhook aktualizován → ${url}`)
      return
    }

    strapi.log.debug(`[${NAME}] Webhook je aktuální.`)
  } catch (error) {
    // Nepodařený webhook nesmí shodit start CMS — obsah se bez něj
    // pořád obnoví podle času, jen pomaleji.
    strapi.log.error(
      `[${NAME}] Webhook se nepodařilo nastavit: ${
        error instanceof Error ? error.message : error
      }`
    )
  }
}
