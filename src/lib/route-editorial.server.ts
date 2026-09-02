/**
 * Textes éditoriaux propres à chaque page de liaison générée.
 *
 * POURQUOI. Les pages /vols/<slug> générées partagent leur structure : mêmes
 * sections, mêmes formulations, seuls les noms de villes changent. Mesuré entre
 * marseille-alger et marseille-oran, cela donne 69 % de phrases identiques —
 * deux destinations d'une même origine, desservies par les mêmes compagnies, se
 * ressemblent trop pour que le gabarit suffise. Ce module fait rédiger, par
 * trajet, un texte qui part des données réelles de CE trajet.
 *
 * CE QUI EST FOURNI AU MODÈLE ne contient que des faits relevés : prix plancher
 * et sa date, distance, compagnies validées, saisonnalité calculée. Rien n'est
 * comblé par une estimation, et `source_snapshot` conserve exactement ce qui a
 * été transmis — sans quoi on ne pourrait pas vérifier, après coup, qu'un
 * chiffre du texte n'a pas été inventé.
 *
 * Les pages éditoriales écrites à la main sont hors périmètre : elles ont déjà
 * un texte propre, et `stalestEditorialRoutes` les écarte.
 */

import { z } from "zod";

import { secondaryAirport } from "@/data/airports";
import { getDestination } from "@/data/destinations";
import {
  findWhitelistedRoute,
  ROUTE_WHITELIST,
  WHITELIST_VALIDATED_AT,
} from "@/data/route-whitelist";
import { formatDateMedium, formatMonthLong } from "@/lib/dates";
import { flushOpsLogs, logOps } from "@/lib/ops-log.server";
import {
  displayCity,
  displayCountry,
  distanceKm,
  durationLabel,
  readObservedPrice,
  resolveRouteSlug,
} from "@/lib/route-pages.server";
import { computeSeasonality, SEASON_MINIMUM_POINTS } from "@/lib/seasonality";
import { fetchSeasonalityPoints } from "@/lib/seasonality.server";
import { airlineName } from "@/lib/travelpayouts.server";

/** Même modèle que la génération de guides : la tâche est cadrée et validée. */
const ANTHROPIC_MODEL_PAR_DEFAUT = "claude-sonnet-5";

/** Au-delà, le texte est réécrit pour suivre l'évolution des prix relevés. */
const FRAICHEUR_JOURS = 90;

/* -------------------------------------------------------------------------- */
/* Contexte transmis au modèle                                                 */
/* -------------------------------------------------------------------------- */

export type EditorialContext = {
  trajet: { slug: string; origine: Lieu; destination: Lieu };
  vol: {
    distanceKm: number;
    dureeTheorique: string;
    volDirect: boolean;
    compagnies: string[];
    compagniesValideesLe: string | null;
  };
  prixReleve: {
    montantEur: number;
    releveLe: string | null;
    moisDeDepart: string | null;
    compagnie: string | null;
  } | null;
  saisonnalite: {
    moisLeMoinsCher: string;
    prixMoisLeMoinsCherEur: number;
    moisLePlusCher: string;
    prixMoisLePlusCherEur: number;
    prixMedianEur: number;
    ecartPct: number;
    moisReleves: number;
  } | null;
};

type Lieu = {
  ville: string;
  pays: string;
  codeIata: string;
  /** Renseigné seulement quand l'aéroport relevé est excentré (type Beauvais). */
  aeroportEloigne?: { code: string; ville: string; distanceKm: number; acces: string };
};

/**
 * Rassemble tout ce qu'on sait du trajet, et rien d'autre.
 *
 * Une donnée absente reste absente : `null` plutôt qu'une moyenne, un ordre de
 * grandeur ou une valeur « typique ». C'est ce qui garantit que le modèle ne
 * peut pas s'appuyer sur un chiffre que nous n'avons pas relevé.
 */
export async function buildEditorialContext(slug: string): Promise<EditorialContext | null> {
  const pair = await resolveRouteSlug(slug);
  if (!pair) return null;
  const { cached } = pair;

  const origine = {
    ...pair.origin,
    city: displayCity(pair.origin),
    country: displayCountry(pair.origin),
  };
  const destination = {
    ...pair.destination,
    city: displayCity(pair.destination),
    country: displayCountry(pair.destination),
  };

  const observed = await readObservedPrice(origine.code, destination.code, cached);
  const km = distanceKm(origine, destination);
  const whitelisted = findWhitelistedRoute(slug) ?? null;

  const aeroportDepart = secondaryAirport(cached?.originAirport);
  const aeroportArrivee = secondaryAirport(cached?.destinationAirport);

  const lieu = (
    ville: string,
    pays: string,
    codeIata: string,
    eloigne: ReturnType<typeof secondaryAirport>,
  ): Lieu => ({
    ville,
    pays,
    codeIata,
    ...(eloigne
      ? {
          aeroportEloigne: {
            code: eloigne.code,
            ville: eloigne.city,
            distanceKm: eloigne.distanceKm,
            acces: eloigne.access,
          },
        }
      : {}),
  });

  const points = await fetchSeasonalityPoints({
    origin: origine.code,
    destination: destination.code,
  });
  const saison =
    points.length >= SEASON_MINIMUM_POINTS
      ? computeSeasonality(points, {
          originCity: origine.city,
          destinationCity: destination.city,
        })
      : null;

  return {
    trajet: {
      slug,
      origine: lieu(origine.city, origine.country, origine.code, aeroportDepart),
      destination: lieu(destination.city, destination.country, destination.code, aeroportArrivee),
    },
    vol: {
      distanceKm: km,
      dureeTheorique: durationLabel(km),
      volDirect: whitelisted?.nonstop ?? true,
      compagnies: [...new Set(whitelisted?.validation.airlines ?? [])].map((c) => airlineName(c)),
      compagniesValideesLe: whitelisted ? WHITELIST_VALIDATED_AT : null,
    },
    prixReleve: observed
      ? {
          montantEur: observed.priceEur,
          releveLe: observed.observedAt ? formatDateMedium(observed.observedAt.slice(0, 10)) : null,
          moisDeDepart: observed.departureAt
            ? formatMonthLong(observed.departureAt.slice(0, 7))
            : null,
          compagnie: observed.airline
            ? /^[A-Z0-9]{2}$/i.test(observed.airline)
              ? airlineName(observed.airline)
              : observed.airline
            : null,
        }
      : null,
    saisonnalite: saison
      ? {
          moisLeMoinsCher: formatMonthLong(saison.cheapest.month),
          prixMoisLeMoinsCherEur: saison.cheapest.priceEur,
          moisLePlusCher: formatMonthLong(saison.dearest.month),
          prixMoisLePlusCherEur: saison.dearest.priceEur,
          prixMedianEur: saison.medianEur,
          ecartPct: saison.spreadPct,
          moisReleves: saison.points.length,
        }
      : null,
  };
}

/* -------------------------------------------------------------------------- */
/* Rédaction                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Bornes de longueur reprises telles quelles dans le prompt : le modèle les
 * connaît, le schéma les fait respecter. Un texte hors bornes est rejeté plutôt
 * que publié tel quel.
 */
const editorialSchema = z.object({
  // Contrainte SEO, pas stylistique : au-delà de 160 caractères Google coupe.
  metaDescription: z.string().trim().min(120).max(160),
  intro: z.string().trim().min(150).max(450),
  sections: z
    .array(
      z.object({
        heading: z.string().trim().min(3).max(120),
        // Le prompt demande 200 à 400 ; le schéma tolère au-delà, pour qu'un
        // texte un peu court ou un peu long reste publiable plutôt que perdu.
        paragraphs: z.array(z.string().trim().min(150).max(500)).min(2).max(2),
      }),
    )
    .min(2)
    .max(2),
});

export type RouteEditorial = z.infer<typeof editorialSchema>;

/**
 * Sortie contrainte par un outil plutôt que demandée en texte libre.
 *
 * Le format était jusqu'ici décrit dans le prompt, et le modèle ne le
 * respectait pas : marseille-constantine a été tronqué à 2 500 tokens pour un
 * JSON attendu autour de 800. Une consigne de longueur en langue naturelle est
 * une suggestion ; un schéma d'outil est une contrainte que l'API fait
 * respecter à la génération.
 *
 * Les longueurs restent dans les `description` : le schéma impose la forme,
 * les descriptions guident la rédaction, et zod tranche à l'arrivée.
 */
const OUTIL_REDACTION = {
  name: "rediger_texte",
  description: "Enregistre le texte éditorial de la page de ce trajet.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["metaDescription", "intro", "sections"],
    properties: {
      metaDescription: {
        type: "string",
        minLength: 120,
        maxLength: 160,
        description:
          "Description meta de la page, entre 120 et 160 caractères. Au-delà, elle est tronquée dans les résultats de recherche.",
      },
      intro: {
        type: "string",
        minLength: 200,
        maxLength: 350,
        description: "Paragraphe d'introduction, entre 200 et 350 caractères.",
      },
      sections: {
        type: "array",
        // minItems / maxItems retires : l’API les refuse au-dela de 1 sous
        // strict. Le nombre attendu vit dans la description, et zod le verifie.
        description: "Exactement 2 sections, dans cet ordre.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["heading", "paragraphs"],
          properties: {
            heading: {
              type: "string",
              description: "Titre de section propre à ce trajet, pas un intitulé générique.",
            },
            paragraphs: {
              type: "array",
              description: "Exactement 2 paragraphes, entre 200 et 400 caractères chacun.",
              items: { type: "string", minLength: 200, maxLength: 400 },
            },
          },
        },
      },
    },
  },
  // Garantit que les arguments reçus valident le schéma. Les prérequis sont
  // réunis (additionalProperties: false et required à chaque niveau). Si l'API
  // devait un jour refuser ce champ, le retirer suffit : zod valide déjà.
  strict: true,
};

const SYSTEME = [
  "Tu es rédacteur voyage pour un comparateur de vols français.",
  "Ton factuel et concret. Aucun superlatif, aucune formule promotionnelle, aucune exclamation.",
  "",
  "RÈGLE ABSOLUE SUR LES CHIFFRES : tu n'utilises QUE les valeurs présentes dans le contexte JSON",
  "fourni (prix, dates, mois, distance, durée, écarts). Tu n'en inventes aucun autre. Tu n'affirmes",
  "jamais d'horaires de vol, de fréquences hebdomadaires, de durées de trajet en ville, ni de tarifs",
  "que le contexte ne contient pas. Si une information manque, tu ne la mentionnes pas.",
  "",
  "NE RÉPÈTE PAS la page : le prix plancher, la distance et la durée théorique y sont déjà affichés.",
  "Explique-les et mets-les en perspective au lieu de les redonner tels quels.",
  "",
  "Cherche l'angle propre à CE trajet : particularités des deux villes et de leurs aéroports, profil",
  "réel des voyageurs de cette liaison (diaspora, tourisme, affaires) sans stéréotype ni généralité",
  "sur un peuple, conseils concrets liés aux compagnies listées (bagages), à l'aéroport d'arrivée et",
  "à son éloignement quand il est indiqué, lecture de la saisonnalité quand elle est fournie.",
  "",
  "LONGUEUR IMPOSÉE — c'est la contrainte la plus importante :",
  "  metaDescription : 120 à 160 caractères ;",
  "  intro : 200 à 350 caractères ;",
  "  exactement 2 sections, exactement 2 paragraphes chacune ;",
  "  chaque paragraphe : 200 à 400 caractères.",
  "Un texte plus long est rejeté, pas raccourci. Sois dense plutôt qu'exhaustif.",
  "",
  "Tu réponds uniquement en JSON valide. Aucun texte avant ou après, aucune balise de code,",
  "aucun commentaire. Le premier caractère de ta réponse est { et le dernier est }.",
].join("\n");

function promptPour(contexte: EditorialContext): string {
  return [
    "Voici les données relevées sur ce trajet :",
    "",
    JSON.stringify(contexte, null, 2),
    "",
    "Rédige le texte éditorial de cette page, en respectant exactement ce schéma :",
    '{"metaDescription": string de 120 à 160 caractères,',
    ' "intro": string de 250 à 500 caractères,',
    ' "sections": [{"heading": string, "paragraphs": [string, ...]}]}',
    "",
    "Exactement 2 sections, exactement 2 paragraphes chacune, 200 à 400 caractères par",
    "paragraphe. Intro de 200 à 350 caractères. Ces bornes ne sont pas indicatives.",
    "Les titres de section doivent être propres à ce trajet, pas des intitulés génériques.",
  ].join("\n");
}

/**
 * Coupe au dernier espace, en signalant la coupe.
 *
 * Couper au caractère près laisserait un mot tranché au milieu, visible tel quel
 * dans les résultats de recherche. On recule donc jusqu'à l'espace précédent,
 * sauf s'il est si tôt qu'il ne resterait qu'un fragment.
 */
function couper(texte: string, maxTotal: number): string {
  if (texte.length <= maxTotal) return texte;
  const brut = texte.slice(0, maxTotal - 1);
  const espace = brut.lastIndexOf(" ");
  const base = espace > maxTotal / 2 ? brut.slice(0, espace) : brut;
  return base.trimEnd() + "…";
}

/**
 * Ramène la description meta dans ses bornes plutôt que de jeter tout le texte.
 *
 * Un trajet a été refusé en entier pour quelques caractères de trop sur ce seul
 * champ, alors que le reste était bon et que la génération avait coûté vingt
 * secondes. Trop longue, on la coupe ; trop courte, on la complète par la
 * première phrase de l'intro, qui parle du même trajet. Le rejet par zod ne sert
 * plus qu'aux cas que ça ne rattrape pas.
 */
function normaliserMeta(meta: string, intro: string): string {
  let sortie = meta.trim();
  if (sortie.length > 160) sortie = couper(sortie, 158);
  if (sortie.length < 120) {
    const premierePhrase = (/^[^.!?]+[.!?]/.exec(intro)?.[0] ?? intro).trim();
    sortie = couper((sortie + " " + premierePhrase).trim(), 158);
    // Mesuré : une meta de 34 caractères complétée d’une phrase de 47 en fait 82,
    // toujours sous le seuil. Une seule phrase ne suffit donc pas dans le cas
    // courant ; on puise plus loin dans l’intro plutôt que de laisser zod rejeter
    // un texte par ailleurs correct.
    if (sortie.length < 120) sortie = couper((meta.trim() + " " + intro.trim()).trim(), 158);
  }
  return sortie;
}

/** Longueur de chaque champ reçu, pour le journal d'un échec de validation. */
function longueursRecues(recu: unknown): Record<string, unknown> {
  const objet = (recu ?? {}) as Record<string, unknown>;
  const sections = Array.isArray(objet["sections"]) ? objet["sections"] : [];
  return {
    metaDescription:
      typeof objet["metaDescription"] === "string" ? objet["metaDescription"].length : null,
    intro: typeof objet["intro"] === "string" ? objet["intro"].length : null,
    sections: sections.length,
    paragraphes: sections.flatMap((section) => {
      const paragraphes = (section as Record<string, unknown>)?.["paragraphs"];
      return Array.isArray(paragraphes)
        ? paragraphes.map((p) => (typeof p === "string" ? p.length : null))
        : [];
    }),
  };
}

type Rapport =
  | { ok: true; tokens: number; inputTokens: number; outputTokens: number; dureeMs: number }
  | { ok: false; message: string };

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/**
 * Note l'échec sur la ligne existante, sans jamais écraser un texte déjà publié :
 * un trajet qui avait un bon texte le garde, avec la trace de la tentative ratée.
 * Quand aucune ligne n'existe, il n'y a rien à annoter — les colonnes de texte
 * sont NOT NULL et une ligne vide ne servirait personne. Le journal suffit.
 */
async function noterEchec(slug: string, message: string): Promise<void> {
  try {
    const db = await admin();
    await db.from("route_editorials").update({ error_message: message }).eq("route_slug", slug);
  } catch (error) {
    console.error("[rediger-routes] échec non enregistré", error);
  }
}

/** Rédige le texte d'un trajet et l'enregistre. Ne lève jamais. */
export async function generateRouteEditorial(slug: string): Promise<Rapport> {
  const debut = Date.now();
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    return { ok: false, message: "ANTHROPIC_API_KEY absente côté serveur." };
  }
  const model = process.env["ANTHROPIC_MODEL"] || ANTHROPIC_MODEL_PAR_DEFAUT;

  const contexte = await buildEditorialContext(slug);
  if (!contexte) {
    return { ok: false, message: "Trajet non résolu." };
  }

  const echouer = async (
    message: string,
    diagnostic: Record<string, unknown> = {},
  ): Promise<Rapport> => {
    await noterEchec(slug, message);
    logOps({
      kind: "redaction",
      label: slug,
      ok: false,
      durationMs: Date.now() - debut,
      message,
      context: { model, ...diagnostic },
    });
    return { ok: false, message };
  };

  let response: Response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        // Dimensionné pour le format ci-dessus (~700 tokens de sortie), avec de
        // la marge. Ce n'est pas un garde-fou de longueur — c'est le schéma qui
        // rejette un texte trop long ; une troncature reste détectée par
        // stop_reason et signalée comme telle.
        max_tokens: 2500,
        system: SYSTEME,
        messages: [{ role: "user", content: promptPour(contexte) }],
        tools: [OUTIL_REDACTION],
        // Choix forcé : le modèle ne peut pas répondre autre chose qu'un appel
        // à cet outil, donc pas de texte hors JSON ni de balise de code.
        tool_choice: { type: "tool", name: OUTIL_REDACTION.name },
      }),
    });
  } catch (error) {
    return echouer(error instanceof Error ? error.message : "appel impossible");
  }

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 200);
    console.error("[rediger-routes] Anthropic", response.status, detail);
    return echouer(`HTTP ${response.status} — ${detail}`);
  }

  const payload = (await response.json()) as {
    content?: { type?: string; text?: string; name?: string; input?: unknown }[];
    usage?: { input_tokens?: number; output_tokens?: number };
    stop_reason?: string;
  };

  // Une réponse coupée à max_tokens produit des arguments incomplets : sans ce
  // test, on la confondrait avec un modèle qui répond mal, et on relancerait à
  // l'identique. Le choix forcé devrait rendre le cas très rare — s'il revient,
  // les extraits ci-dessous diront ce que le modèle fabriquait de si long.
  if (payload.stop_reason === "max_tokens") {
    const recu = JSON.stringify(payload.content ?? []);
    return echouer("Réponse tronquée à max_tokens (2500).", {
      longueurBrute: recu.length,
      debut: recu.slice(0, 300),
      fin: recu.slice(-300),
    });
  }

  // Les arguments de l'outil sont déjà un objet : plus de découpe du texte au
  // premier { et au dernier }, qui échouait dès qu'une accolade traînait dans
  // une phrase ou qu'une balise de code encadrait la réponse.
  const appel = (payload.content ?? []).find(
    (bloc) => bloc.type === "tool_use" && bloc.name === OUTIL_REDACTION.name,
  );
  if (!appel || appel.input === undefined) {
    return echouer("Le modèle n'a pas appelé l'outil de rédaction.");
  }

  // La description meta est ramenée dans ses bornes avant validation : un champ
  // trop long ne doit pas faire perdre un texte entier déjà payé.
  const brut = appel.input as Record<string, unknown>;
  const aValider =
    typeof brut["metaDescription"] === "string" && typeof brut["intro"] === "string"
      ? { ...brut, metaDescription: normaliserMeta(brut["metaDescription"], brut["intro"]) }
      : brut;

  const candidat = editorialSchema.safeParse(aValider);
  if (!candidat.success) {
    const souci = candidat.error.issues[0];
    return echouer(
      `Format refusé : ${souci ? `${souci.path.join(".")} — ${souci.message}` : "schéma non respecté"}`,
      // Les longueurs reçues disent tout de suite quel champ a dérapé et de
      // combien — sans elles, il faudrait relancer pour le savoir.
      longueursRecues(aValider),
    );
  }
  const parsed: RouteEditorial = candidat.data;

  const inputTokens = payload.usage?.input_tokens ?? 0;
  const outputTokens = payload.usage?.output_tokens ?? 0;
  const tokens = inputTokens + outputTokens;
  try {
    const db = await admin();
    const { error } = await db.from("route_editorials").upsert(
      {
        route_slug: slug,
        origin: contexte.trajet.origine.codeIata,
        destination: contexte.trajet.destination.codeIata,
        meta_description: parsed.metaDescription,
        intro: parsed.intro,
        sections: parsed.sections as never,
        model,
        input_tokens: payload.usage?.input_tokens ?? null,
        output_tokens: payload.usage?.output_tokens ?? null,
        source_snapshot: contexte as never,
        published: true,
        generated_at: new Date().toISOString(),
        error_message: null,
      },
      { onConflict: "route_slug" },
    );
    if (error) throw error;
  } catch (error) {
    return echouer(error instanceof Error ? error.message : "écriture impossible");
  }

  logOps({
    kind: "redaction",
    label: slug,
    ok: true,
    resultCount: parsed.sections.length,
    durationMs: Date.now() - debut,
    context: {
      model,
      inputTokens: payload.usage?.input_tokens ?? 0,
      outputTokens: payload.usage?.output_tokens ?? 0,
    },
  });
  return { ok: true, tokens, inputTokens, outputTokens, dureeMs: Date.now() - debut };
}

/* -------------------------------------------------------------------------- */
/* Choix des trajets                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Les trajets à rédiger en premier : ceux qui n'ont aucun texte, puis les plus
 * anciens au-delà du seuil de fraîcheur.
 *
 * Même philosophie que `stalestRoutes` de la saisonnalité : aucun curseur n'est
 * tenu, l'ordre se déduit de l'état de la base. Un passage interrompu ne laisse
 * donc rien à réparer, le suivant reprend simplement les plus anciens.
 *
 * Les trajets qui ont une page éditoriale écrite à la main sont écartés : leur
 * texte est déjà propre, le réécrire n'apporterait rien et l'écraserait.
 */
export async function stalestEditorialRoutes(
  limit: number,
): Promise<{ routes: string[]; restantes: number }> {
  const candidats = ROUTE_WHITELIST.map((r) => r.slug).filter((slug) => !getDestination(slug));

  const dates = new Map<string, string>();
  try {
    const db = await admin();
    const { data } = await db
      .from("route_editorials")
      .select("route_slug,generated_at")
      .limit(2000);
    for (const row of data ?? []) dates.set(row.route_slug, String(row.generated_at));
  } catch (error) {
    // Base illisible : on traite quand même, dans l'ordre naturel.
    console.error("[rediger-routes] ordre de fraîcheur indisponible", error);
  }

  const limite = Date.now() - FRAICHEUR_JOURS * 864e5;
  const aFaire = candidats.filter((slug) => {
    const date = dates.get(slug);
    return !date || Date.parse(date) < limite;
  });
  // Jamais rédigés d'abord (chaîne vide), puis du plus ancien au plus récent.
  aFaire.sort((a, b) => (dates.get(a) ?? "").localeCompare(dates.get(b) ?? ""));

  return { routes: aFaire.slice(0, limit), restantes: Math.max(0, aFaire.length - limit) };
}

export type RedactionReport = {
  traitees: number;
  echecs: number;
  restantes: number;
  tokens: number;
  /** Détaillés : c'est la sortie qui coûte cinq fois l'entrée, et qui dérape. */
  inputTokens: number;
  outputTokens: number;
  /** Durée de chaque génération réussie, en ms : c'est elle qui décide du
   *  nombre de trajets tenable par passage. */
  dureesMs: number[];
};

/**
 * Un passage : quelques trajets, en série. La séquence est volontaire — un appel
 * au modèle dure cinq à quinze secondes, et les paralléliser ferait dépasser le
 * budget de trente secondes d'une fonction planifiée sans rien gagner d'utile.
 */
export async function redigerRoutes(params: { routes: number }): Promise<RedactionReport> {
  const { routes, restantes } = await stalestEditorialRoutes(params.routes);
  let traitees = 0;
  let echecs = 0;
  let tokens = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  const dureesMs: number[] = [];

  for (const slug of routes) {
    const rapport = await generateRouteEditorial(slug);
    if (rapport.ok) {
      traitees += 1;
      tokens += rapport.tokens;
      inputTokens += rapport.inputTokens;
      outputTokens += rapport.outputTokens;
      dureesMs.push(rapport.dureeMs);
    } else {
      echecs += 1;
      console.error(`[rediger-routes] ${slug} : ${rapport.message}`);
    }
  }

  // Une fonction planifiée s'arrête dès la réponse rendue : sans cette attente,
  // les écritures de journal partent dans le vide et les échecs n'apparaissent
  // jamais dans /admin/journal — exactement là où on les cherche.
  await flushOpsLogs();

  return { traitees, echecs, restantes, tokens, inputTokens, outputTokens, dureesMs };
}

/* -------------------------------------------------------------------------- */
/* Lecture par la page                                                         */
/* -------------------------------------------------------------------------- */

export type StoredEditorial = {
  metaDescription: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
};

/** Texte publié d'un trajet, ou null. Une lecture qui échoue laisse la page en l'état. */
export async function readRouteEditorial(slug: string): Promise<StoredEditorial | null> {
  try {
    const db = await admin();
    const { data, error } = await db
      .from("route_editorials")
      .select("meta_description,intro,sections")
      .eq("route_slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return null;
    const sections = data.sections as unknown as StoredEditorial["sections"];
    if (!Array.isArray(sections) || sections.length === 0) return null;
    return {
      metaDescription: data.meta_description,
      intro: data.intro,
      sections,
    };
  } catch (error) {
    console.error("Lecture du texte éditorial impossible", error);
    return null;
  }
}
