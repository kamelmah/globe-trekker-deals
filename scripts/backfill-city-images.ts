/**
 * Remplit `image_url` sur les lignes déjà générées, une seule fois.
 *
 *   npx tsx scripts/backfill-city-images.ts [--dry-run] [--limit=50] [--tout]
 *
 * (ou `bun scripts/backfill-city-images.ts`, mêmes options, si Bun est installé.)
 *
 * POURQUOI UN SCRIPT ET PAS UNE TÂCHE PLANIFIÉE. `rediger-routes` pose
 * désormais l'image en même temps que le texte, et `/destinations-proposes` en
 * fait autant pour les guides : le flux courant se suffit. Restent les lignes
 * écrites avant, qui n'ont rien à attendre d'un passage récurrent — une reprise
 * unique les traite toutes, puis le script n'a plus lieu d'être lancé.
 *
 * CE QUI EST REPRIS. Une ligne sans image, ou dont l'image ne vient ni de
 * Wikimedia ni de Pexels : elle n'a pas été posée par cette chaîne et rien ne
 * dit qu'elle montre la bonne ville. `--tout` reprend en plus les lignes déjà
 * pourvues, pour forcer un nouveau relevé.
 *
 * VARIABLES D'ENVIRONNEMENT, lues dans .env puis dans l'environnement :
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  obligatoires
 *   PEXELS_API_KEY                           facultative — sans elle, seul
 *                                            Wikipédia est interrogé
 *
 * SUPABASE_SERVICE_ROLE_KEY n'est pas dans le .env du dépôt (elle n'a rien à y
 * faire) : passez-la en variable d'environnement le temps du passage.
 */

import { AIRPORT_NAMES_FR, COUNTRY_NAMES_FR } from "@/data/route-whitelist";
import { estImageDeConfiance, getCityImage } from "@/lib/city-image.server";

// Bun lit .env de lui-même ; Node veut qu'on le lui demande. Un fichier absent
// n'est pas une erreur : en CI, les variables viennent de l'environnement.
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env");
  } catch {
    // Pas de .env : on continue avec l'environnement tel quel.
  }
}

/* -------------------------------------------------------------------------- */
/* Arguments                                                                   */
/* -------------------------------------------------------------------------- */

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const TOUT = args.includes("--tout");
const LIMITE = Number(args.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 0) || Infinity;

/**
 * Wikipédia n'impose pas de quota chiffré aux lectures du REST, mais demande un
 * usage raisonnable. Une pause courte entre deux villes suffit à rester dans les
 * clous sans allonger sérieusement un passage de quelques centaines de lignes.
 */
const PAUSE_MS = 200;

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------------------------------------------------------------- */
/* Nom de la ville                                                             */
/* -------------------------------------------------------------------------- */

/** « marseille-alger » → « Alger ». Dernier recours quand rien d'autre ne nomme la ville. */
function villeDepuisSlug(slug: string): string | null {
  const segment = slug.split("-").slice(1).join(" ").trim();
  if (!segment) return null;
  return segment.replace(/\b\p{Ll}/gu, (lettre) => lettre.toUpperCase());
}

/**
 * Ville d'arrivée d'un trajet rédigé.
 *
 * `source_snapshot` conserve le contexte transmis au modèle, nom français de la
 * ville compris : c'est la source la plus sûre. Viennent ensuite le référentiel
 * des noms français par code IATA, puis le slug — qui porte le nom d'usage,
 * puisque c'est lui qui a servi à le construire.
 */
function villeDuTrajet(row: {
  route_slug: string;
  destination: string;
  source_snapshot: unknown;
}): { ville: string; pays: string | null } | null {
  const snapshot = row.source_snapshot as {
    trajet?: { destination?: { ville?: unknown; pays?: unknown } };
  } | null;
  const depuisSnapshot = snapshot?.trajet?.destination;
  if (typeof depuisSnapshot?.ville === "string" && depuisSnapshot.ville.trim()) {
    return {
      ville: depuisSnapshot.ville,
      pays: typeof depuisSnapshot.pays === "string" ? depuisSnapshot.pays : null,
    };
  }

  const code = row.destination.toUpperCase();
  const ville = AIRPORT_NAMES_FR[code] ?? villeDepuisSlug(row.route_slug);
  if (!ville) return null;
  return { ville, pays: COUNTRY_NAMES_FR[code] ?? null };
}

/* -------------------------------------------------------------------------- */
/* Reprise                                                                     */
/* -------------------------------------------------------------------------- */

type Compteurs = { vues: number; remplies: number; sansImage: number; echecs: number };

function aReprendre(imageUrl: string | null): boolean {
  if (TOUT) return true;
  return !imageUrl?.trim() || !estImageDeConfiance(imageUrl);
}

async function main(): Promise<void> {
  for (const variable of ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]) {
    if (!process.env[variable]) {
      console.error(`Variable d'environnement manquante : ${variable}`);
      process.exit(1);
    }
  }
  if (!process.env["PEXELS_API_KEY"]) {
    console.warn("PEXELS_API_KEY absente : seul Wikipédia sera interrogé.\n");
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const total: Compteurs = { vues: 0, remplies: 0, sansImage: 0, echecs: 0 };

  /* ---------------------------------------------------------------------- */
  /* Trajets rédigés                                                         */
  /* ---------------------------------------------------------------------- */

  const { data: trajets, error: erreurTrajets } = await supabaseAdmin
    .from("route_editorials")
    .select("route_slug,destination,image_url,source_snapshot")
    .order("generated_at", { ascending: true });
  if (erreurTrajets) throw erreurTrajets;

  for (const row of trajets ?? []) {
    if (total.vues >= LIMITE) break;
    if (!aReprendre(row.image_url)) continue;
    total.vues += 1;

    const lieu = villeDuTrajet(row);
    if (!lieu) {
      console.warn(`· ${row.route_slug} — ville d'arrivée non identifiée, ignoré`);
      total.echecs += 1;
      continue;
    }

    const imageUrl = await getCityImage(lieu.ville, lieu.pays);
    if (!imageUrl) {
      console.log(`· ${row.route_slug} (${lieu.ville}) — aucune image`);
      total.sansImage += 1;
      await pause(PAUSE_MS);
      continue;
    }

    if (DRY_RUN) {
      console.log(`· ${row.route_slug} (${lieu.ville}) → ${imageUrl}`);
      total.remplies += 1;
    } else {
      const { error } = await supabaseAdmin
        .from("route_editorials")
        .update({ image_url: imageUrl })
        .eq("route_slug", row.route_slug);
      if (error) {
        console.error(`· ${row.route_slug} — écriture impossible : ${error.message}`);
        total.echecs += 1;
      } else {
        console.log(`✓ ${row.route_slug} (${lieu.ville})`);
        total.remplies += 1;
      }
    }
    await pause(PAUSE_MS);
  }

  /* ---------------------------------------------------------------------- */
  /* Guides destinations                                                     */
  /* ---------------------------------------------------------------------- */

  const { data: guides, error: erreurGuides } = await supabaseAdmin
    .from("guide_requests")
    .select("id,slug,city,country,image_url")
    .order("created_at", { ascending: true });
  if (erreurGuides) throw erreurGuides;

  for (const row of guides ?? []) {
    if (total.vues >= LIMITE) break;
    if (!aReprendre(row.image_url)) continue;
    total.vues += 1;

    // Le cache de `getCityImage` fait que Marrakech, croisée dans les deux
    // tables, ne coûte qu'une requête sur tout le passage.
    const imageUrl = await getCityImage(row.city, row.country);
    if (!imageUrl) {
      console.log(`· guide ${row.slug} (${row.city}) — aucune image`);
      total.sansImage += 1;
      await pause(PAUSE_MS);
      continue;
    }

    if (DRY_RUN) {
      console.log(`· guide ${row.slug} (${row.city}) → ${imageUrl}`);
      total.remplies += 1;
    } else {
      const { error } = await supabaseAdmin
        .from("guide_requests")
        .update({ image_url: imageUrl })
        .eq("id", row.id);
      if (error) {
        console.error(`· guide ${row.slug} — écriture impossible : ${error.message}`);
        total.echecs += 1;
      } else {
        console.log(`✓ guide ${row.slug} (${row.city})`);
        total.remplies += 1;
      }
    }
    await pause(PAUSE_MS);
  }

  console.log(
    `\n${DRY_RUN ? "[simulation] " : ""}${total.vues} lignes reprises · ` +
      `${total.remplies} image${total.remplies > 1 ? "s" : ""} · ` +
      `${total.sansImage} sans image · ${total.echecs} échec${total.echecs > 1 ? "s" : ""}`,
  );
}

main().catch((error) => {
  console.error("Backfill interrompu", error);
  process.exit(1);
});
