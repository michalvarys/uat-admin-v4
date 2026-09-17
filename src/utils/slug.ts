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

  // U výchozího jazyka zůstává slug čistý, ostatní dostanou příponu
  // jen tehdy, když by se srazily.
  const candidates = [base];
  if (locale && locale !== "sk") {
    candidates.unshift(`${base}-${locale}`);
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
