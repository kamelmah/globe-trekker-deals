/**
 * Cartes Open Graph par trajet.
 *
 * Une seule image pour tout le site, c'est une vignette identique quel que soit
 * le vol partagé. Ce script produit une carte par page /vols/* : le trajet, le
 * prix d'appel constaté, et la date de ce relevé.
 *
 * La date est dans l'image, et ce n'est pas décoratif. Facebook et WhatsApp
 * gardent une vignette en cache pendant des semaines : le prix qu'elle affiche
 * est figé au moment du partage, quoi qu'on fasse ensuite. Un prix sans date y
 * deviendrait un prix faux. Daté, il reste un relevé — la même règle que sur le
 * reste du site.
 *
 * Génération hors ligne, volontairement : les images sont commitées, le build
 * de production n'exécute rien de tout ceci et ne dépend d'aucune de ces
 * bibliothèques. Elles ne sont donc pas dans package.json. Pour relancer :
 *
 *   npm i --no-save --no-package-lock @resvg/resvg-js wawoff2
 *   node scripts/generate-og-images.mjs
 *
 * À relancer quand la liste blanche change, ou quand les prix affichés ont
 * assez vieilli pour ne plus rien vouloir dire (quelques mois).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Resvg } from "@resvg/resvg-js";
import { decompress } from "wawoff2";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "og", "routes");
const MANIFEST = path.join(ROOT, "src", "data", "og-routes.ts");

const WIDTH = 1200;
const HEIGHT = 630;

/* Palette de marque, convertie depuis les tokens oklch de src/styles.css. */
const FOND = "#020618";
const FOND_HAUT = "#152b3b";
const PRIMAIRE = "#4baaff";
const TEXTE = "#fbfeff";
const ATTENUE = "#93a9c0";

/* -------------------------------------------------------------------------- */
/* Données                                                                     */
/* -------------------------------------------------------------------------- */

const CHAMPS =
  /slug: "([^"]+)",\s*\n\s*origin: "([^"]+)",\s*\n\s*originCity: "([^"]+)",\s*\n\s*destination: "([^"]+)",\s*\n\s*destinationCity: "([^"]+)"/g;

/**
 * Trois pages héritées, déjà présentes dans l'index de Google et conservées à
 * ce titre, mais absentes de la liste blanche comme des pages éditoriales :
 * leur trajet n'existe nulle part sous forme de fiche. Elles sont donc
 * énumérées ici, explicitement. Rien n'est généré au-delà de cette liste.
 */
const TRAJETS_HERITES = [
  {
    slug: "paris-birmingham",
    origin: "PAR",
    originCity: "Paris",
    destination: "BHX",
    destinationCity: "Birmingham",
  },
  {
    slug: "paris-trieste",
    origin: "PAR",
    originCity: "Paris",
    destination: "TRS",
    destinationCity: "Trieste",
  },
  {
    slug: "paris-gdansk",
    origin: "PAR",
    originCity: "Paris",
    destination: "GDN",
    destinationCity: "Gdańsk",
  },
];

/** Toutes les pages /vols/* : liste blanche et pages éditoriales. */
function lireTrajets() {
  const fichiers = [
    path.join("src", "data", "route-whitelist.ts"),
    ...fs
      .readdirSync(path.join(ROOT, "src", "data"))
      .filter((f) => /^destinations.*\.ts$/.test(f))
      .map((f) => path.join("src", "data", f)),
  ];
  const parSlug = new Map();
  for (const fichier of fichiers) {
    const chemin = path.join(ROOT, fichier);
    if (!fs.existsSync(chemin)) continue;
    for (const m of fs.readFileSync(chemin, "utf8").matchAll(CHAMPS)) {
      const [, slug, origin, originCity, destination, destinationCity] = m;
      if (!parSlug.has(slug)) {
        parSlug.set(slug, { slug, origin, originCity, destination, destinationCity });
      }
    }
  }
  for (const trajet of TRAJETS_HERITES) {
    if (!parSlug.has(trajet.slug)) parSlug.set(trajet.slug, trajet);
  }
  return [...parSlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

/* -------------------------------------------------------------------------- */
/* Prix                                                                        */
/* -------------------------------------------------------------------------- */

function lireToken() {
  const fromEnv = process.env["TRAVELPAYOUTS_TOKEN"];
  if (fromEnv) return fromEnv.replace(/[\r"']/g, "").trim();
  const envFile = path.join(ROOT, ".env");
  if (!fs.existsSync(envFile)) return "";
  const match = fs.readFileSync(envFile, "utf8").match(/^TRAVELPAYOUTS_TOKEN=(.*)$/m);
  return (match?.[1] ?? "").replace(/[\r"']/g, "").trim();
}

const TOKEN = lireToken();

function prochainsMois(count) {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}

/** Prix le plus bas constaté sur un mois, ou null. Aucune valeur n'est inventée. */
async function prixDuMois(origin, destination, month) {
  const url = new URL("https://api.travelpayouts.com/aviasales/v3/prices_for_dates");
  const params = {
    origin,
    destination,
    departure_at: month,
    one_way: "true",
    direct: "false",
    sorting: "price",
    limit: "30",
    currency: "eur",
    token: TOKEN,
  };
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  for (let essai = 0; essai < 3; essai += 1) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(20000),
      });
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 1500 * (essai + 1)));
        continue;
      }
      if (!res.ok) return null;
      const json = await res.json();
      const releves = (Array.isArray(json?.data) ? json.data : [])
        .map((o) => Number(o.price))
        .filter((p) => Number.isFinite(p) && p > 0);
      return releves.length ? Math.min(...releves) : null;
    } catch {
      await new Promise((r) => setTimeout(r, 1200 * (essai + 1)));
    }
  }
  return null;
}

async function prixLePlusBas(trajet, mois) {
  const releves = [];
  for (const m of mois) {
    const p = await prixDuMois(trajet.origin, trajet.destination, m);
    if (p !== null) releves.push(p);
  }
  return releves.length ? Math.min(...releves) : null;
}

async function enParallele(items, taille, worker) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: taille }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await worker(items[i], i);
      }
    }),
  );
  return out;
}

/* -------------------------------------------------------------------------- */
/* Rendu                                                                       */
/* -------------------------------------------------------------------------- */

async function chargerPolices() {
  const dir = path.join(ROOT, "src", "assets", "fonts");
  // Sora seule : le nom de famille des fichiers Manrope est corrompu par le
  // sous-ensemble Google Fonts ("Manrope ExtraLight Medium"), fontdb ne le
  // resout pas et retombait silencieusement sur Sora de toute facon.
  // Le seul sous-ensemble latin. Charger aussi le latin-ext ne sert à rien et
  // nuit : les deux fichiers déclarent la même famille et la même graisse, si
  // bien que fontdb n'en retient qu'un — et ils sont complémentaires, pas
  // redondants (latin a G, d, a, s, k mais pas ń ; latin-ext l'inverse). Le mot
  // entier basculait alors vers une police à empattements. Les caractères hors
  // de ce sous-ensemble sont traités plus bas, explicitement.
  const fichiers = ["sora-700-latin.woff2", "sora-500-latin.woff2"];
  const buffers = [];
  for (const f of fichiers) {
    const chemin = path.join(dir, f);
    if (!fs.existsSync(chemin)) throw new Error(`police absente : ${f}`);
    buffers.push(Buffer.from(await decompress(fs.readFileSync(chemin))));
  }
  return buffers;
}

/** Points de code réellement dessinables, lus dans la table cmap (format 4). */
function couverture(ttf) {
  const num = ttf.readUInt16BE(4);
  let cmapOff = 0;
  for (let i = 0; i < num; i += 1) {
    const o = 12 + i * 16;
    if (ttf.toString("ascii", o, o + 4) === "cmap") cmapOff = ttf.readUInt32BE(o + 8);
  }
  const points = new Set();
  if (!cmapOff) return points;
  const n = ttf.readUInt16BE(cmapOff + 2);
  for (let i = 0; i < n; i += 1) {
    const sub = cmapOff + ttf.readUInt32BE(cmapOff + 4 + i * 8 + 4);
    if (ttf.readUInt16BE(sub) !== 4) continue;
    const segX2 = ttf.readUInt16BE(sub + 6);
    const endO = sub + 14;
    const startO = endO + segX2 + 2;
    for (let seg = 0; seg < segX2 / 2; seg += 1) {
      const fin = ttf.readUInt16BE(endO + seg * 2);
      const debut = ttf.readUInt16BE(startO + seg * 2);
      for (let c = debut; c <= fin && c !== 0xffff; c += 1) points.add(c);
    }
  }
  return points;
}

const signales = new Set();

/**
 * Remplace les caractères que la police ne sait pas dessiner par leur forme
 * sans diacritique. Sans ça, usvg fait basculer le mot entier vers une police
 * à empattements — le résultat reste lisible, donc l'anomalie passe inaperçue
 * alors que la carte n'est plus du tout à la charte. Chaque substitution est
 * signalée : mieux vaut « Gdansk » assumé qu'un rendu qui déraille en silence.
 */
function dessinable(texte, couvert) {
  let sortie = "";
  for (const ch of texte) {
    if (couvert.has(ch.codePointAt(0))) {
      sortie += ch;
      continue;
    }
    const nu = ch.normalize("NFD").replace(/\p{M}/gu, "");
    const repli = [...nu].every((c) => couvert.has(c.codePointAt(0))) ? nu : "";
    if (!signales.has(ch)) {
      signales.add(ch);
      console.warn(
        `  glyphe absent de Sora : ${JSON.stringify(ch)} -> ${JSON.stringify(repli)}`,
      );
    }
    sortie += repli;
  }
  return sortie;
}

const echapper = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const MOIS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

function dateLisible(d) {
  const jour = d.getDate();
  return `${jour === 1 ? "1er" : jour} ${MOIS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * La flèche est dessinée, pas écrite : le glyphe U+2192 n'existe pas dans Sora
 * et se serait affiché en carré vide.
 */
const FLECHE = `
  <g stroke="${PRIMAIRE}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M84 322 H136" />
    <path d="M118 306 L136 322 L118 338" />
  </g>`;

function carte({ originCity, destinationCity, prix, releveLe, couvert }) {
  originCity = dessinable(originCity, couvert);
  destinationCity = dessinable(destinationCity, couvert);
  const lignePrix =
    prix === null
      ? `<text x="80" y="452" font-family="Sora" font-weight="700" font-size="46" fill="${PRIMAIRE}">Prix suivis chaque jour</text>`
      : `<text x="80" y="452" font-family="Sora" font-weight="700" font-size="56" fill="${PRIMAIRE}">à partir de ${prix} €</text>
  <text x="80" y="498" font-family="Sora" font-weight="500" font-size="25" fill="${ATTENUE}">prix relevé le ${echapper(releveLe)}, aller simple</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${FOND}"/>
  <polygon points="830,0 ${WIDTH},0 ${WIDTH},${HEIGHT} 650,${HEIGHT}" fill="${FOND_HAUT}"/>
  <rect x="0" y="0" width="${WIDTH}" height="8" fill="${PRIMAIRE}"/>

  <text x="80" y="98" font-family="Sora" font-weight="500" font-size="27" letter-spacing="6" fill="${PRIMAIRE}">TROUVEMONVOL</text>

  <text x="80" y="238" font-family="Sora" font-weight="700" font-size="84" fill="${TEXTE}">${echapper(originCity)}</text>
  ${FLECHE}
  <text x="164" y="348" font-family="Sora" font-weight="700" font-size="84" fill="${TEXTE}">${echapper(destinationCity)}</text>

  ${lignePrix}

  <text x="80" y="580" font-family="Sora" font-weight="500" font-size="25" fill="${ATTENUE}">Prix total, taxes incluses · vendeur affiché</text>
  <text x="1120" y="580" text-anchor="end" font-family="Sora" font-weight="500" font-size="25" fill="${ATTENUE}">trouvemonvol.fr</text>
</svg>`;
}

/* -------------------------------------------------------------------------- */
/* Programme                                                                   */
/* -------------------------------------------------------------------------- */

const seulement = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const sansPrix = process.argv.includes("--sans-prix");

const trajets = lireTrajets().filter((t) => !seulement.length || seulement.includes(t.slug));
if (!trajets.length) {
  console.error("aucun trajet trouvé");
  process.exit(1);
}
if (!TOKEN && !sansPrix) {
  console.error("TRAVELPAYOUTS_TOKEN absent. Relancer avec --sans-prix pour des cartes sans prix.");
  process.exit(1);
}

const polices = await chargerPolices();
const couvert = couverture(polices[0]);
const mois = prochainsMois(3);
const releveLe = dateLisible(new Date());

console.log(`${trajets.length} trajets · ${sansPrix ? "sans prix" : `prix sur ${mois.join(", ")}`}`);

const prix = sansPrix
  ? trajets.map(() => null)
  : await enParallele(trajets, 6, async (t, i) => {
      const p = await prixLePlusBas(t, mois);
      if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${trajets.length} interrogés`);
      return p;
    });

fs.mkdirSync(OUT_DIR, { recursive: true });

let avecPrix = 0;
let octets = 0;
for (const [i, trajet] of trajets.entries()) {
  const svg = carte({ ...trajet, prix: prix[i], releveLe, couvert });
  const png = new Resvg(svg, {
    font: { fontBuffers: polices, loadSystemFonts: false, defaultFontFamily: "Sora" },
    fitTo: { mode: "width", value: WIDTH },
  })
    .render()
    .asPng();
  fs.writeFileSync(path.join(OUT_DIR, `${trajet.slug}.png`), png);
  octets += png.length;
  if (prix[i] !== null) avecPrix += 1;
}

// Le manifeste décrit tout le dossier, pas la seule fournée qu'on vient de
// rendre : l'écrire depuis une liste filtrée effacerait les cartes déjà là et
// l'application cesserait de les déclarer. Un run ciblé le laisse donc tel quel.
if (seulement.length) {
  console.log(`${trajets.length} cartes réécrites · manifeste inchangé (run ciblé)`);
  process.exit(0);
}

const slugs = trajets.map((t) => t.slug).sort();
fs.writeFileSync(
  MANIFEST,
  `// Généré par scripts/generate-og-images.mjs — ne pas modifier à la main.\n` +
    `// Cartes Open Graph présentes dans public/og/routes/.\n` +
    `// Relevé du ${releveLe}.\n\n` +
    `export const OG_ROUTE_SLUGS: ReadonlySet<string> = new Set([\n` +
    slugs.map((s) => `  "${s}",`).join("\n") +
    `\n]);\n`,
);

console.log(
  `${trajets.length} cartes écrites · ${avecPrix} avec prix · ` +
    `${Math.round(octets / trajets.length / 1024)} Ko en moyenne`,
);
