/** Slugs SEO partagés client/serveur pour les pages /vols/<origine>-<destination>. */

/**
 * Lettres que la décomposition Unicode NFD ne sait pas réduire.
 *
 * NFD sépare une lettre accentuée en « lettre + diacritique » et le diacritique
 * est ensuite supprimé : `é` devient bien `e`. Mais `ł`, `ø` ou `đ` sont des
 * lettres à part entière, pas des lettres accentuées : NFD ne les touche pas et
 * elles finissaient purement supprimées — d'où des slugs cassés comme
 * `wroc-aw` pour Wrocław, `troms` pour Tromsø ou `bod` pour Bodø.
 */
const TRANSLITERATE: Record<string, string> = {
  ł: "l",
  Ł: "l",
  ø: "o",
  Ø: "o",
  đ: "d",
  Đ: "d",
  ð: "d",
  Ð: "d",
  þ: "th",
  Þ: "th",
  ı: "i",
  İ: "i",
  ß: "ss",
  æ: "ae",
  Æ: "ae",
  œ: "oe",
  Œ: "oe",
  å: "a",
  Å: "a",
};

/**
 * Les caractères réellement accentués (`ğ`, `ș`, `ş`, `ż`, `ć`…) sont, eux,
 * correctement réduits par NFD : `ğ` → `g`, `ș` → `s`, `ż` → `z`.
 */
export function slugify(value: string): string {
  return value
    .replace(/[łŁøØđĐðÐþÞıİßæÆœŒåÅ]/g, (char) => TRANSLITERATE[char] ?? char)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug canonique d'un trajet, ex. "paris-marrakech". */
export function routeSlug(originCity: string, destinationCity: string): string {
  return `${slugify(originCity)}-${slugify(destinationCity)}`;
}
