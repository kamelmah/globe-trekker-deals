/**
 * Régénère src/data/route-whitelist.ts à partir des données de vol réelles.
 *
 *   node scripts/refresh-route-whitelist.mjs
 *
 * Le principe : on n'écrit jamais la liste blanche à la main. Pour chaque couple
 * candidat, on demande à l'API Travelpayouts s'il existe de vraies offres en VOL
 * DIRECT sur les trois prochains mois. Une liaison qui n'existe que via une
 * correspondance construite par l'agrégateur n'est pas une route commerciale :
 * elle n'a pas de trafic de recherche et elle est écartée.
 *
 * À relancer tous les six mois : les réseaux aériens changent.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src/data/route-whitelist.ts");

/* -------------------------------------------------------------------------- */
/* Candidats                                                                   */
/* -------------------------------------------------------------------------- */

/** Départs testés, par ordre de priorité du site. */
const ORIGINS = [
  { code: "MRS", fr: "Marseille" },
  { code: "NCE", fr: "Nice" },
  { code: "TLS", fr: "Toulouse" },
  { code: "MPL", fr: "Montpellier" },
  { code: "PAR", fr: "Paris" },
  { code: "LYS", fr: "Lyon" },
];

/**
 * Destinations testées, avec leur nom français d'usage courant — celui qu'un
 * voyageur tape dans Google. Ce dictionnaire est la seule source des noms
 * affichés : on n'utilise jamais le référentiel géographique de Travelpayouts,
 * qui renvoie des libellés administratifs ("Ville de Madrid", "Buda", "Fés").
 */
const DESTINATIONS = [
  ["ALG", "Alger", "maghreb"],
  ["ORN", "Oran", "maghreb"],
  ["CZL", "Constantine", "maghreb"],
  ["AAE", "Annaba", "maghreb"],
  ["QSF", "Sétif", "maghreb"],
  ["BJA", "Béjaïa", "maghreb"],
  ["TLM", "Tlemcen", "maghreb"],
  ["TUN", "Tunis", "maghreb"],
  ["DJE", "Djerba", "maghreb"],
  ["MIR", "Monastir", "maghreb"],
  ["CMN", "Casablanca", "maghreb"],
  ["RAK", "Marrakech", "maghreb"],
  ["TNG", "Tanger", "maghreb"],
  ["FEZ", "Fès", "maghreb"],
  ["NDR", "Nador", "maghreb"],
  ["OUD", "Oujda", "maghreb"],
  ["AGA", "Agadir", "maghreb"],

  ["IST", "Istanbul", "turquie-orient"],
  ["AYT", "Antalya", "turquie-orient"],
  ["IZM", "Izmir", "turquie-orient"],
  ["CAI", "Le Caire", "turquie-orient"],
  ["HRG", "Hurghada", "turquie-orient"],
  ["SSH", "Charm el-Cheikh", "turquie-orient"],
  ["DXB", "Dubaï", "turquie-orient"],

  ["BCN", "Barcelone", "europe-sud"],
  ["MAD", "Madrid", "europe-sud"],
  ["SVQ", "Séville", "europe-sud"],
  ["AGP", "Malaga", "europe-sud"],
  ["ALC", "Alicante", "europe-sud"],
  ["PMI", "Palma", "europe-sud"],
  ["IBZ", "Ibiza", "europe-sud"],
  ["LIS", "Lisbonne", "europe-sud"],
  ["OPO", "Porto", "europe-sud"],
  ["FAO", "Faro", "europe-sud"],
  ["ROM", "Rome", "europe-sud"],
  ["MIL", "Milan", "europe-sud"],
  ["NAP", "Naples", "europe-sud"],
  ["VCE", "Venise", "europe-sud"],
  ["PMO", "Palerme", "europe-sud"],
  ["CTA", "Catane", "europe-sud"],
  ["CAG", "Cagliari", "europe-sud"],
  ["OLB", "Olbia", "europe-sud"],
  ["ATH", "Athènes", "europe-sud"],
  ["HER", "Héraklion", "europe-sud"],
  ["RHO", "Rhodes", "europe-sud"],
  ["CFU", "Corfou", "europe-sud"],
  ["MLA", "Malte", "europe-sud"],
  ["SPU", "Split", "europe-sud"],
  ["DBV", "Dubrovnik", "europe-sud"],

  ["LON", "Londres", "europe-nord-est"],
  ["BRU", "Bruxelles", "europe-nord-est"],
  ["AMS", "Amsterdam", "europe-nord-est"],
  ["FRA", "Francfort", "europe-nord-est"],
  ["MUC", "Munich", "europe-nord-est"],
  ["BER", "Berlin", "europe-nord-est"],
  ["GVA", "Genève", "europe-nord-est"],
  ["ZRH", "Zurich", "europe-nord-est"],
  ["VIE", "Vienne", "europe-nord-est"],
  ["PRG", "Prague", "europe-nord-est"],
  ["WAW", "Varsovie", "europe-nord-est"],
  ["KRK", "Cracovie", "europe-nord-est"],
  ["BUD", "Budapest", "europe-nord-est"],
  ["BUH", "Bucarest", "europe-nord-est"],
  ["DUB", "Dublin", "europe-nord-est"],
  ["CPH", "Copenhague", "europe-nord-est"],

  ["PAR", "Paris", "france-corse"],
  ["LIL", "Lille", "france-corse"],
  ["NTE", "Nantes", "france-corse"],
  ["SXB", "Strasbourg", "france-corse"],
  ["BES", "Brest", "france-corse"],
  ["AJA", "Ajaccio", "france-corse"],
  ["BIA", "Bastia", "france-corse"],
  ["FSC", "Figari", "france-corse"],
  ["CLY", "Calvi", "france-corse"],
].map(([code, fr, family]) => ({ code, fr, family }));

/**
 * Pays en français par code IATA. Explicite comme les noms de villes : les
 * pages affichent ces libellés, ils ne doivent pas dépendre d'un référentiel
 * tiers qui peut changer sous nos pieds.
 */
const COUNTRIES = {
  AAE: "Algérie",
  AGA: "Maroc",
  AGP: "Espagne",
  AJA: "France",
  ALC: "Espagne",
  ALG: "Algérie",
  AMS: "Pays-Bas",
  ATH: "Grèce",
  AYT: "Turquie",
  BCN: "Espagne",
  BER: "Allemagne",
  BES: "France",
  BIA: "France",
  BJA: "Algérie",
  BRU: "Belgique",
  BUD: "Hongrie",
  BUH: "Roumanie",
  CAG: "Italie",
  CAI: "Égypte",
  CFU: "Grèce",
  CLY: "France",
  CMN: "Maroc",
  CPH: "Danemark",
  CTA: "Italie",
  CZL: "Algérie",
  DBV: "Croatie",
  DJE: "Tunisie",
  DUB: "Irlande",
  DXB: "Émirats arabes unis",
  FAO: "Portugal",
  FEZ: "Maroc",
  FRA: "Allemagne",
  FSC: "France",
  GVA: "Suisse",
  HER: "Grèce",
  HRG: "Égypte",
  IBZ: "Espagne",
  IST: "Turquie",
  IZM: "Turquie",
  KRK: "Pologne",
  LIL: "France",
  LIS: "Portugal",
  LON: "Royaume-Uni",
  LYS: "France",
  MAD: "Espagne",
  MIL: "Italie",
  MIR: "Tunisie",
  MLA: "Malte",
  MPL: "France",
  MRS: "France",
  MUC: "Allemagne",
  NAP: "Italie",
  NCE: "France",
  NDR: "Maroc",
  NTE: "France",
  OLB: "Italie",
  OPO: "Portugal",
  ORN: "Algérie",
  OUD: "Maroc",
  PAR: "France",
  PMI: "Espagne",
  PMO: "Italie",
  PRG: "République tchèque",
  QSF: "Algérie",
  RAK: "Maroc",
  RHO: "Grèce",
  ROM: "Italie",
  SPU: "Croatie",
  SSH: "Égypte",
  SVQ: "Espagne",
  SXB: "France",
  TLM: "Algérie",
  TLS: "France",
  TNG: "Maroc",
  TUN: "Tunisie",
  VCE: "Italie",
  VIE: "Autriche",
  WAW: "Pologne",
  ZRH: "Suisse",
};

/**
 * Politique de sélection — LE point à ajuster pour élargir ou resserrer le site.
 *
 * Marseille est le départ de référence : on garde tout ce que l'API valide.
 * Nice, Toulouse et Montpellier sont resserrés sur le Maghreb et quelques têtes
 * de pont, pour rester dans une taille de site que Google évalue sérieusement.
 * Paris et Lyon sont absents : leurs pages relèvent de l'éditorial rédigé à la
 * main ou de l'exception « déjà indexée ».
 */
const POLICY = {
  MRS: "*",
  NCE: ["ALG", "CZL", "TUN", "DJE", "MIR", "CMN", "RAK", "IST", "LON", "PAR"],
  TLS: ["ALG", "ORN", "TUN", "DJE", "CMN", "RAK", "TNG", "FEZ", "PAR"],
  MPL: ["ALG", "CMN", "RAK", "FEZ", "PAR"],
};

/* -------------------------------------------------------------------------- */
/* Sonde API                                                                   */
/* -------------------------------------------------------------------------- */

function readToken() {
  const fromEnv = process.env["TRAVELPAYOUTS_TOKEN"];
  if (fromEnv) return fromEnv.replace(/[\r"']/g, "").trim();
  const envFile = path.join(ROOT, ".env");
  if (!fs.existsSync(envFile)) return "";
  const match = fs.readFileSync(envFile, "utf8").match(/^TRAVELPAYOUTS_TOKEN=(.*)$/m);
  return (match?.[1] ?? "").replace(/[\r"']/g, "").trim();
}

/** Les trois prochains mois, au format AAAA-MM. */
function nextMonths(count = 3) {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}

const TOKEN = readToken();
if (!TOKEN) {
  console.error("TRAVELPAYOUTS_TOKEN absent (variable d'environnement ou .env).");
  process.exit(1);
}
const MONTHS = nextMonths();

let apiCalls = 0;

/** Offres en vol direct pour un couple sur un mois, ou [] si l'API échoue. */
async function directOffers(origin, destination, month) {
  const url = new URL("https://api.travelpayouts.com/aviasales/v3/prices_for_dates");
  const params = {
    origin,
    destination,
    departure_at: month,
    one_way: "true",
    direct: "true",
    sorting: "price",
    limit: "30",
    currency: "eur",
    token: TOKEN,
  };
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(20000),
      });
      apiCalls += 1;
      if (res.status === 429 || res.status >= 500) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
        continue;
      }
      if (!res.ok) return [];
      const json = await res.json();
      const data = Array.isArray(json?.data) ? json.data : [];
      // L'API élargit parfois hors du mois demandé : on recadre nous-mêmes.
      return data.filter((offer) => String(offer.departure_at ?? "").startsWith(month));
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1200 * (attempt + 1)));
    }
  }
  return [];
}

async function pool(items, size, worker) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await worker(items[i]);
      }
    }),
  );
  return out;
}

/* -------------------------------------------------------------------------- */
/* Génération                                                                  */
/* -------------------------------------------------------------------------- */

const TRANSLITERATE = {
  ł: "l",
  Ł: "l",
  ø: "o",
  Ø: "o",
  đ: "d",
  Đ: "d",
  ð: "d",
  þ: "th",
  ı: "i",
  ß: "ss",
  æ: "ae",
  Æ: "ae",
  œ: "oe",
  Œ: "oe",
  å: "a",
  Å: "a",
};

/** Doit rester identique à slugify() dans src/lib/slug.ts. */
function slugify(value) {
  return value
    .replace(/[łŁøØđĐðþıßæÆœŒåÅ]/g, (c) => TRANSLITERATE[c] ?? c)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const pairs = [];
for (const origin of ORIGINS) {
  for (const destination of DESTINATIONS) {
    if (origin.code !== destination.code) pairs.push({ origin, destination });
  }
}

console.error(`Sonde de ${pairs.length} couples sur ${MONTHS.join(", ")}…`);
let done = 0;
const probed = await pool(pairs, 6, async ({ origin, destination }) => {
  let offers = 0;
  let minPrice = null;
  const airlines = new Set();
  for (const month of MONTHS) {
    for (const offer of await directOffers(origin.code, destination.code, month)) {
      offers += 1;
      const price = Number(offer.price);
      if (Number.isFinite(price) && (minPrice === null || price < minPrice)) minPrice = price;
      if (offer.airline) airlines.add(offer.airline);
    }
  }
  done += 1;
  if (done % 50 === 0) console.error(`  ${done}/${pairs.length}`);
  return { origin, destination, offers, minPrice, airlines: [...airlines].sort() };
});

const validated = probed.filter((row) => row.offers > 0);
const rows = validated.filter((row) => {
  const allowed = POLICY[row.origin.code];
  return allowed === "*" || (Array.isArray(allowed) && allowed.includes(row.destination.code));
});

for (const [origin, allowed] of Object.entries(POLICY)) {
  if (allowed === "*") continue;
  for (const code of allowed) {
    const kept = rows.some((r) => r.origin.code === origin && r.destination.code === code);
    if (!kept) {
      console.error(`  ⚠ ${origin}-${code} demandé par POLICY mais non validé par l'API — écarté.`);
    }
  }
}

const names = {};
for (const place of [...ORIGINS, ...DESTINATIONS]) names[place.code] = place.fr;

const q = (value) => JSON.stringify(value);
const today = new Date().toISOString().slice(0, 10);

const routeLines = rows.map((row) => {
  const slug = `${slugify(row.origin.fr)}-${slugify(row.destination.fr)}`;
  const validation = `{ offers: ${row.offers}, minPriceEur: ${row.minPrice ?? "null"}, airlines: [${row.airlines.map(q).join(", ")}] }`;
  return `  { slug: ${q(slug)}, origin: ${q(row.origin.code)}, originCity: ${q(row.origin.fr)}, destination: ${q(row.destination.code)}, destinationCity: ${q(row.destination.fr)}, country: ${q(COUNTRIES[row.destination.code] ?? "")}, family: ${q(row.destination.family)}, validation: ${validation} },`;
});

const countryLines = Object.entries(COUNTRIES)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([code, fr]) => `  ${code}: ${q(fr)},`)
  .join("\n");

const missingCountry = rows.filter((row) => !COUNTRIES[row.destination.code]);
for (const row of missingCountry) {
  console.error(`  ⚠ pays manquant pour ${row.destination.code} — compléter COUNTRIES.`);
}

const nameLines = Object.entries(names)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([code, fr]) => `  ${code}: ${q(fr)},`)
  .join("\n");

const file = `/**
 * Liste blanche des routes — SOURCE DE VÉRITÉ UNIQUE du site.
 *
 * FICHIER GÉNÉRÉ : ne pas éditer à la main.
 * Régénérer avec \`node scripts/refresh-route-whitelist.mjs\`.
 *
 * Ce fichier pilote à lui seul la génération des pages /vols, le sitemap et la
 * navigation. Aucune page de route ne doit exister en dehors de lui.
 *
 * Chaque route a été vérifiée contre l'API Travelpayouts le ${today} : seules
 * sont retenues les liaisons renvoyant de vraies offres en VOL DIRECT sur les
 * mois ${MONTHS.join(", ")}. Une liaison qui n'existe que via une correspondance
 * construite par l'agrégateur n'est pas une route commerciale : elle n'a pas de
 * trafic de recherche, elle ne figure pas ici.
 */

export type RouteFamily =
  | "maghreb"
  | "turquie-orient"
  | "europe-sud"
  | "europe-nord-est"
  | "france-corse";

export type WhitelistedRoute = {
  slug: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  country: string;
  family: RouteFamily;
  /** Preuve de validation : ce que l'API a réellement renvoyé sur la fenêtre. */
  validation: { offers: number; minPriceEur: number | null; airlines: string[] };
};

/** Date de la dernière validation de la liste contre l'API. */
export const WHITELIST_VALIDATED_AT = ${q(today)};

/**
 * Noms français d'usage courant par code IATA — ceux qu'un voyageur tape dans
 * Google. Volontairement explicite : le référentiel géographique de
 * Travelpayouts renvoie des libellés administratifs inutilisables en SEO
 * ("Ville de Madrid" pour MAD, "Buda" pour BUD, "Fés" pour FEZ).
 */
export const AIRPORT_NAMES_FR: Record<string, string> = {
${nameLines}
};

/** Pays en français par code IATA, pour les mêmes raisons. */
export const COUNTRY_NAMES_FR: Record<string, string> = {
${countryLines}
};

/** Nom français d'usage d'un code IATA, ou null si nous ne le connaissons pas. */
export function frenchName(code: string): string | null {
  return AIRPORT_NAMES_FR[code.toUpperCase()] ?? null;
}

/**
 * Les ${rows.length} routes retenues. Marseille est le départ de référence du site et
 * concentre l'essentiel de la couverture ; Nice, Toulouse et Montpellier sont
 * resserrés sur le Maghreb et quelques têtes de pont. Paris et Lyon ne figurent
 * pas ici : leurs pages relèvent de l'éditorial rédigé à la main ou de
 * l'exception « déjà indexée » ci-dessous.
 */
export const ROUTE_WHITELIST: WhitelistedRoute[] = [
${routeLines.join("\n")}
];

export const WHITELIST_SLUGS: ReadonlySet<string> = new Set(ROUTE_WHITELIST.map((r) => r.slug));

/** Routes de la liste blanche au départ d'une ville donnée (code IATA). */
export function routesFrom(origin: string): WhitelistedRoute[] {
  const code = origin.toUpperCase();
  return ROUTE_WHITELIST.filter((route) => route.origin === code);
}

export function findWhitelistedRoute(slug: string): WhitelistedRoute | null {
  return ROUTE_WHITELIST.find((route) => route.slug === slug) ?? null;
}

/* -------------------------------------------------------------------------- */
/* Exception : pages déjà présentes dans l'index Google                        */
/* -------------------------------------------------------------------------- */

/**
 * Pages /vols GÉNÉRÉES déjà présentes dans l'index Google (relevé
 * \`site:trouvemonvol.fr\` du 2026-09-01) alors qu'elles sont hors liste blanche.
 *
 * On ne retire jamais de l'index une page qui y figure déjà sans raison forte :
 * elles restent en ligne, indexables et dans le sitemap. Cette liste constate
 * l'existant, elle n'autorise rien de neuf — elle ne doit jamais s'allonger.
 */
export const INDEXED_LEGACY_SLUGS: readonly string[] = [
  "paris-birmingham",
  "paris-trieste",
  "paris-gdansk",
];

/**
 * Un slug de route a-t-il le droit d'être indexé ?
 *
 * Les pages éditoriales (\`DESTINATIONS\`, rédigées à la main) sont passées en
 * paramètre plutôt qu'importées, pour garder ce fichier généré sans dépendance.
 *
 * Tout ce qui n'est pas autorisé ici passe en \`noindex, follow\` et sort du
 * sitemap. Ces pages n'ont jamais été indexées : il suffit d'arrêter de demander
 * à Google de les évaluer. Elles ne sont ni supprimées ni mises en 404 tant que
 * l'indexation n'est pas stabilisée.
 */
export function isIndexableRoute(
  slug: string,
  editorialRoutes: readonly { slug: string }[],
): boolean {
  return (
    WHITELIST_SLUGS.has(slug) ||
    INDEXED_LEGACY_SLUGS.includes(slug) ||
    editorialRoutes.some((route) => route.slug === slug)
  );
}
`;

fs.writeFileSync(OUT, file);

// Le fichier est écrit en une ligne par route pour rester lisible en diff ;
// Prettier le remet ensuite au format du dépôt, sinon ESLint le rejette.
try {
  const { execFileSync } = await import("node:child_process");
  execFileSync("npx", ["prettier", "--write", path.relative(ROOT, OUT)], {
    cwd: ROOT,
    stdio: "ignore",
    shell: process.platform === "win32",
  });
} catch {
  console.error("⚠ Prettier n'a pas pu formater le fichier — le lancer à la main.");
}

const slugs = rows.map((row) => `${slugify(row.origin.fr)}-${slugify(row.destination.fr)}`);
const dupes = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
console.error(`\n${apiCalls} appels API.`);
console.error(`Couples avec vols directs réels : ${validated.length}/${pairs.length}`);
console.error(`Routes retenues après POLICY : ${rows.length}`);
for (const origin of ORIGINS) {
  const count = rows.filter((row) => row.origin.code === origin.code).length;
  if (count) console.error(`  ${origin.fr} : ${count}`);
}
if (dupes.length) console.error(`⚠ slugs en double : ${dupes.join(", ")}`);
if (rows.length < 60 || rows.length > 90) {
  console.error(`⚠ ${rows.length} routes — hors de la fourchette cible 60-90, ajuster POLICY.`);
}
console.error(`\nÉcrit : ${path.relative(ROOT, OUT)}`);
