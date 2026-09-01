/**
 * Extrait, d'un dump SQL complet, les seules DONNÉES des trois tables
 * irremplaçables — et rien d'autre.
 *
 *   node scripts/extraire-donnees-dump.mjs <dump.sql> [sortie.donnees.sql]
 *
 * Ce qui est écarté, et c'est le but : la structure (le schéma est déjà en
 * place), les fonctions et tâches pg_cron propres à Lovable, les GRANT sur des
 * rôles qui n'existent pas ailleurs, et toutes les autres tables — prix, cache,
 * journal — qui se régénèrent depuis la source tarifaire.
 *
 * ----------------------------------------------------------------------------
 * POURQUOI CONVERTIR PLUTÔT QUE COLLER LE DUMP
 *
 * `pg_dump` écrit les données sous forme de blocs `COPY … FROM stdin`. C'est
 * une instruction du client `psql`, pas du serveur : l'éditeur SQL de Supabase
 * ne sait pas l'exécuter et échoue sur la première ligne de données. Ce script
 * les transforme en `INSERT`, que n'importe quel client accepte.
 *
 * Les dumps produits avec `--inserts` sont repris tels quels, en leur ajoutant
 * seulement la clause de reprise.
 *
 * ----------------------------------------------------------------------------
 * CE QUI EST PRÉSERVÉ
 *
 * Toutes les colonnes présentes dans le dump, `id`, `created_at` et
 * `unsubscribe_token` compris. Ce dernier est le seul lien entre un e-mail déjà
 * envoyé et son alerte : le laisser se régénérer casserait tous les liens de
 * désinscription déjà dans les boîtes de réception.
 *
 * ATTENTION : le fichier produit contient des adresses e-mail. Il ne doit pas
 * être commité. Le nom par défaut se termine par `.donnees.sql`, motif ignoré
 * par git.
 */
import fs from "node:fs";
import path from "node:path";

const TABLES = new Set(["price_alerts", "newsletter_subscribers", "contact_messages"]);

/** Lignes par instruction INSERT : assez gros pour être rapide, assez petit
 *  pour qu'un éditeur SQL web ne cale pas. */
const PAR_LOT = 250;

const [, , entree, sortieArg] = process.argv;
if (!entree) {
  console.error("usage : node scripts/extraire-donnees-dump.mjs <dump.sql> [sortie.donnees.sql]");
  process.exit(1);
}
if (!fs.existsSync(entree)) {
  console.error(`fichier introuvable : ${entree}`);
  process.exit(1);
}

const sortie = sortieArg ?? path.join(path.dirname(entree), "import.donnees.sql");
const dump = fs.readFileSync(entree, "utf8");
const lignes = dump.split(/\r?\n/);

/** Déséchappe un champ du format texte de COPY. */
function decoderChamp(champ) {
  if (champ === "\\N") return null;
  let out = "";
  for (let i = 0; i < champ.length; i += 1) {
    if (champ[i] !== "\\") {
      out += champ[i];
      continue;
    }
    i += 1;
    const c = champ[i];
    if (c === "n") out += "\n";
    else if (c === "t") out += "\t";
    else if (c === "r") out += "\r";
    else if (c === "b") out += "\b";
    else if (c === "f") out += "\f";
    else if (c === "v") out += "\v";
    else if (c === "\\") out += "\\";
    else out += c ?? "";
  }
  return out;
}

/**
 * Littéral SQL. Tout est écrit comme du texte : PostgreSQL le convertit vers le
 * type de la colonne à l'insertion (uuid, date, numeric, boolean, timestamptz).
 * Les booléens de COPY, `t` et `f`, sont acceptés tels quels par le type bool.
 */
function litteral(valeur) {
  if (valeur === null) return "NULL";
  return `'${valeur.replace(/'/g, "''")}'`;
}

const morceaux = [];
const comptes = {};
let ignorees = 0;

for (let i = 0; i < lignes.length; i += 1) {
  const ligne = lignes[i];

  // --- Bloc COPY ------------------------------------------------------------
  const copie = /^COPY\s+(?:public\.)?"?([a-z_]+)"?\s*\(([^)]*)\)\s+FROM\s+stdin;/i.exec(ligne);
  if (copie) {
    const table = copie[1];
    const colonnes = copie[2].split(",").map((c) => c.trim().replace(/"/g, ""));
    const rangs = [];
    i += 1;
    for (; i < lignes.length && lignes[i] !== "\\."; i += 1) {
      if (lignes[i] === "") continue;
      rangs.push(lignes[i].split("\t").map(decoderChamp));
    }
    if (!TABLES.has(table)) {
      ignorees += rangs.length;
      continue;
    }
    comptes[table] = (comptes[table] ?? 0) + rangs.length;
    for (let debut = 0; debut < rangs.length; debut += PAR_LOT) {
      const lot = rangs.slice(debut, debut + PAR_LOT);
      morceaux.push(
        `INSERT INTO public.${table} (${colonnes.join(", ")}) VALUES\n` +
          lot.map((r) => `  (${r.map(litteral).join(", ")})`).join(",\n") +
          `\nON CONFLICT DO NOTHING;\n`,
      );
    }
    continue;
  }

  // --- Dump produit avec --inserts -----------------------------------------
  const insertion = /^INSERT INTO\s+(?:public\.)?"?([a-z_]+)"?\s/i.exec(ligne);
  if (insertion) {
    if (!TABLES.has(insertion[1])) {
      ignorees += 1;
      continue;
    }
    // Une instruction peut tenir sur plusieurs lignes : on lit jusqu'au `;`.
    let instruction = ligne;
    while (!/;\s*$/.test(instruction) && i + 1 < lignes.length) {
      i += 1;
      instruction += "\n" + lignes[i];
    }
    comptes[insertion[1]] = (comptes[insertion[1]] ?? 0) + 1;
    morceaux.push(
      /ON CONFLICT/i.test(instruction)
        ? `${instruction}\n`
        : `${instruction.replace(/;\s*$/, "")} ON CONFLICT DO NOTHING;\n`,
    );
  }
}

const entete = [
  "-- Données extraites d'un dump complet par scripts/extraire-donnees-dump.mjs.",
  "-- Structure, fonctions, pg_cron et autres tables volontairement écartés.",
  "--",
  "-- CONTIENT DES ADRESSES E-MAIL : ne pas commiter, supprimer après import.",
  "--",
  ...Object.entries(comptes).map(([t, n]) => `--   ${t} : ${n} lignes`),
  "",
  "BEGIN;",
  "",
].join("\n");

const pied = [
  "",
  "COMMIT;",
  "",
  "-- Contrôle : à comparer aux comptes de la source.",
  "SELECT 'price_alerts' AS table, count(*) AS lignes FROM public.price_alerts",
  "UNION ALL SELECT 'newsletter_subscribers', count(*) FROM public.newsletter_subscribers",
  "UNION ALL SELECT 'contact_messages', count(*) FROM public.contact_messages;",
  "",
  "-- Aucun jeton de désinscription ne doit manquer ni être dupliqué.",
  "SELECT count(*) FILTER (WHERE unsubscribe_token IS NULL) AS jetons_manquants,",
  "       count(*) - count(DISTINCT unsubscribe_token)      AS jetons_dupliques,",
  "       count(*) FILTER (WHERE active)                    AS alertes_actives",
  "FROM public.price_alerts;",
  "",
].join("\n");

if (morceaux.length === 0) {
  console.error(
    "Aucune donnée trouvée pour les trois tables.\n" +
      "Le dump est peut-être au format binaire (pg_dump -Fc) : le convertir d'abord\n" +
      "avec `pg_restore -f dump.sql archive.dump`.",
  );
  process.exit(1);
}

fs.writeFileSync(sortie, entete + morceaux.join("\n") + pied);

console.log(`écrit : ${sortie}`);
for (const [table, n] of Object.entries(comptes)) console.log(`  ${table.padEnd(24)} ${n} lignes`);
console.log(`  ${String(ignorees).padStart(5)} lignes ignorées (autres tables)`);
console.log(`  ${morceaux.length} instructions, encadrées par BEGIN/COMMIT`);
