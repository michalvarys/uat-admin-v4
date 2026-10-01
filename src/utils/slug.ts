import slugify from "slugify";

const SLUGIFY_OPTIONS = {
  lower: true,
  // Nastavení odpovídá původnímu, jen s doplněným otazníkem. Záměrně se
  // sem NEPŘIDÁVÁ `strict: true`: odstranil by i měkké spojovníky, které
  // se do dvou existujících slugů dostaly z názvů. Ty by se pak při první
  // editaci stránky tiše změnily a zaindexované URL by přestaly platit.
  // Čištění těch dvou záznamů je samostatný úkol i s přesměrováním.
  remove: /[*+~./()'"!:@.,=&?]/g,
};

/**
 * Vytvoří slug z názvu a zajistí, že bude v rámci content typu unikátní.
 *
 * Pole `slug` má v Strapi `unique: true`, což platí napříč všemi jazyky —
 * ne jen v rámci jednoho. Při zakládání anglického překladu se ale titulek
 * často nemění, takže by vyšel stejný slug jako u slovenského originálu
 * a uložení skončilo na "This attribute must be unique".
 *
 * Kolize proto řešíme příponou: `-en`, a kdyby ani ta nestačila, `-en-2`.
 * Existující záznam se přeskakuje, aby si úpravou vlastního titulku
 * slug zbytečně neměnil.
 */
export async function buildUniqueSlug({
  strapi,
  uid,
  title,
  locale,
  currentId,
}: {
  strapi: any;
  uid: string;
  title: string;
  locale?: string;
  currentId?: number;
}): Promise<string> {
  const base = slugify(title, SLUGIFY_OPTIONS);

  // Čistý slug má přednost u všech jazyků; přípona se zkouší teprve
  // tehdy, když je obsazený. Dřív se u cizích jazyků dávala dopředu,
  // takže i volný slug zbytečně skončil jako „nazev-en".
  const candidates = [base];
  if (locale && locale !== "sk") {
    candidates.push(`${base}-${locale}`);
  }
  for (let i = 2; i <= 20; i += 1) {
    candidates.push(locale && locale !== "sk" ? `${base}-${locale}-${i}` : `${base}-${i}`);
  }

  for (const candidate of candidates) {
    const existing = await strapi.entityService.findMany(uid, {
      filters: { slug: candidate },
      locale: "all",
      publicationState: "preview",
      fields: ["id"],
      limit: 1,
    });

    const taken = (existing || []).some((item: any) => item.id !== currentId);
    if (!taken) {
      return candidate;
    }
  }

  // Pojistka pro nepravděpodobný případ, že by bylo obsazeno i 20 variant.
  return `${base}-${Date.now()}`;
}

/**
 * Zajistí, že slug bude unikátní — ať už přišel zvenčí, nebo se teprve
 * tvoří z názvu.
 *
 * Tlačítko „Fill in from another locale" v administraci zkopíruje
 * všechna pole včetně slugu, takže překlad dorazí s hodnotou, kterou už
 * má originál. Kontrola „vytvoř slug, když žádný není" takový případ
 * propustí a uložení skončí na „This attribute must be unique".
 *
 * Předaný slug se proto bere jako základ a dostane příponu jazyka,
 * jen když je obsazený.
 */
export async function ensureUniqueSlug({
  strapi,
  uid,
  slug,
  title,
  locale,
  currentId,
}: {
  strapi: any;
  uid: string;
  slug?: string | null;
  title?: string | null;
  locale?: string;
  currentId?: number;
}): Promise<string | undefined> {
  const source = slug?.trim() || title?.trim();

  if (!source) {
    return undefined;
  }

  return buildUniqueSlug({ strapi, uid, title: source, locale, currentId });
}

/**
 * Zaznamená změnu slugu, aby staré adresy mohly přesměrovat na nové.
 *
 * Volá se z beforeUpdate, kde ještě známe původní hodnotu. Bez toho by
 * po přejmenování stránky přestal fungovat každý dosud sdílený odkaz
 * a vyhledávače by adresu vyhodnotily jako 404.
 */
export async function recordSlugChange({
  strapi,
  contentType,
  entryId,
  oldSlug,
  newSlug,
  locale,
}: {
  strapi: any;
  contentType: "page" | "news";
  entryId: number;
  oldSlug?: string | null;
  newSlug: string;
  locale?: string;
}): Promise<void> {
  if (!oldSlug || !newSlug || oldSlug === newSlug || !entryId) {
    return;
  }

  const lang = locale || "sk";

  try {
    // Kdyby se stránka přejmenovala tam a zpět, starý záznam by ukazoval
    // na neplatný cíl — proto se existující dvojice přepisuje.
    const existing = await strapi.entityService.findMany(
      "api::slug-history.slug-history",
      {
        filters: { oldSlug, contentType, locale: lang },
        fields: ["id"],
        limit: 1,
      }
    );

    if (existing?.length) {
      await strapi.entityService.update(
        "api::slug-history.slug-history",
        existing[0].id,
        { data: { newSlug, entryId } }
      );
      return;
    }

    await strapi.entityService.create("api::slug-history.slug-history", {
      data: { oldSlug, newSlug, contentType, locale: lang, entryId },
    });

    // Řetěz přesměrování (A → B → C) vyhledávače nemají rádi, proto se
    // starší záznamy míříci na právě přejmenovaný slug rovnou přesměrují
    // na nový cíl.
    const chained = await strapi.entityService.findMany(
      "api::slug-history.slug-history",
      {
        filters: { newSlug: oldSlug, contentType, locale: lang },
        fields: ["id"],
      }
    );

    for (const item of chained || []) {
      await strapi.entityService.update(
        "api::slug-history.slug-history",
        item.id,
        { data: { newSlug } }
      );
    }
  } catch (error) {
    // Historie je pomocná evidence — její selhání nesmí zabránit uložení
    // samotné stránky.
    strapi.log.warn(`Nepodařilo se zapsat historii slugu: ${error}`);
  }
}
