/**
 * Régénère src/data/page-lastmod.ts : la date de dernière modification RÉELLE
 * de chaque page qui n'en porte pas déjà une dans ses données.
 *
 *   node scripts/refresh-page-lastmod.mjs
 *
 * La source est l'historique Git, seule date de modification vérifiable dont
 * nous disposons. Surtout, elle ne bouge que quand le contenu bouge — à la
 * différence d'une date de génération, qui changerait à chaque déploiement et
 * signalerait à Google du contenu automatisé plutôt que de la fraîcheur.
 *
 * Guides, articles, comparatifs et fiches formalités ne sont pas concernés :
 * ils portent déjà un champ `updated` tenu à la main, qui reflète une décision
 * éditoriale et vaut mieux qu'une date de commit.
 *
 * À relancer après toute modification de contenu de ces pages.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src/data/page-lastmod.ts");

/** Pages fixes : leur contenu vit dans le composant de route. */
const STATIC_PAGES = {
  "/": "src/routes/index.tsx",
  "/mode-budget": "src/routes/mode-budget.tsx",
  "/conseils": "src/routes/conseils.index.tsx",
  "/conseils/destinations": "src/routes/conseils.destinations.index.tsx",
  "/comparatifs": "src/routes/comparatifs.index.tsx",
  "/conseils/formalites": "src/routes/conseils.formalites.index.tsx",
  "/faq": "src/routes/faq.tsx",
  "/contact": "src/routes/contact.tsx",
  "/indemnisation": "src/routes/indemnisation.tsx",
  "/hebergement": "src/routes/hebergement.tsx",
};

/** Fichiers portant les pages de liaison éditoriales. */
const EDITORIAL_FILES = ["src/data/destinations.ts", "src/data/destinations-europe.ts"];

/**
 * Les pages de liaison générées déjà indexées n'ont pas de données propres :
 * leur contenu sort entièrement du générateur, c'est donc lui qui les date.
 */
const GENERATED_SOURCE = "src/lib/route-pages.server.ts";
const GENERATED_PAGES = ["paris-birmingham", "paris-trieste", "paris-gdansk"];

function git(args) {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

/** Date du dernier commit ayant touché un fichier (AAAA-MM-JJ). */
function fileDate(file) {
  return git(["log", "-1", "--format=%cs", "--", file]);
}

/**
 * Date du dernier commit ayant touché un intervalle de lignes précis.
 * `git log -L` suit l'intervalle à travers l'historique, ce qui donne une date
 * par route plutôt qu'une date partagée par tout le fichier.
 */
function blockDate(file, start, end) {
  const out = git(["log", "-n", "1", "--format=%cs", `-L`, `${start},${end}:${file}`]);
  const first = out.split("\n")[0]?.trim() ?? "";
  return /^\d{4}-\d{2}-\d{2}$/.test(first) ? first : "";
}

/** Repère le bloc d'objet contenant `slug: "<slug>"` dans un fichier de données. */
function findBlocks(file) {
  const lines = fs.readFileSync(path.join(ROOT, file), "utf8").split(/\r?\n/);
  const blocks = [];
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^ {4}slug: "([a-z0-9-]+)",$/);
    if (!match) continue;
    let start = i;
    while (start > 0 && !/^ {2}\{$/.test(lines[start])) start -= 1;
    let end = i;
    while (end < lines.length - 1 && !/^ {2}\},$/.test(lines[end])) end += 1;
    blocks.push({ slug: match[1], start: start + 1, end: end + 1 });
  }
  return blocks;
}

const lastmod = {};

for (const [route, file] of Object.entries(STATIC_PAGES)) {
  const date = fileDate(file);
  if (date) lastmod[route] = date;
  else console.error(`  ⚠ pas de date Git pour ${route} (${file})`);
}

for (const file of EDITORIAL_FILES) {
  for (const block of findBlocks(file)) {
    const date = blockDate(file, block.start, block.end) || fileDate(file);
    if (date) lastmod[`/vols/${block.slug}`] = date;
    else console.error(`  ⚠ pas de date Git pour /vols/${block.slug}`);
  }
}

const generatedDate = fileDate(GENERATED_SOURCE);
for (const slug of GENERATED_PAGES) {
  if (generatedDate) lastmod[`/vols/${slug}`] = generatedDate;
}

const entries = Object.entries(lastmod)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([route, date]) => `  ${JSON.stringify(route)}: ${JSON.stringify(date)},`)
  .join("\n");

const file = `/**
 * Date de dernière modification réelle des pages qui n'en portent pas dans
 * leurs données.
 *
 * FICHIER GÉNÉRÉ : ne pas éditer à la main.
 * Régénérer avec \`node scripts/refresh-page-lastmod.mjs\`.
 *
 * Les dates viennent de l'historique Git — la seule date de modification
 * vérifiable dont nous disposons. Elles ne bougent que quand le contenu bouge,
 * à la différence d'une date de génération qui changerait à chaque déploiement
 * et signalerait du contenu automatisé plutôt que de la fraîcheur.
 *
 * Guides, articles, comparatifs et fiches formalités n'y figurent pas : ils
 * portent déjà un champ \`updated\` tenu à la main.
 */
export const PAGE_LASTMOD: Readonly<Record<string, string>> = {
${entries}
};

/** Date de dernière modification d'une page, ou undefined si inconnue. */
export function pageLastmod(route: string): string | undefined {
  return PAGE_LASTMOD[route];
}
`;

fs.writeFileSync(OUT, file);

try {
  execFileSync("npx", ["prettier", "--write", path.relative(ROOT, OUT)], {
    cwd: ROOT,
    stdio: "ignore",
    shell: process.platform === "win32",
  });
} catch {
  console.error("⚠ Prettier n'a pas pu formater le fichier — le lancer à la main.");
}

console.error(`${Object.keys(lastmod).length} pages datées.`);
console.error(`Écrit : ${path.relative(ROOT, OUT)}`);
