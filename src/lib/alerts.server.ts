import { fetchOffers } from "@/lib/travelpayouts.server";
import { logOps } from "@/lib/ops-log.server";
import { buildAlertePrixEmail } from "@/lib/email-templates/alerte-prix";
import { buildMesAlertesEmail } from "@/lib/email-templates/mes-alertes";
import { isEmailConfigured, sendEmail } from "@/lib/resend.server";

export type AlertInput = {
  email: string;
  origin: string;
  destination: string;
  departDate?: string | null;
  returnDate?: string | null;
  /** Prix de référence connu côté page ; résolu via l'API quand il est absent. */
  referencePrice?: number | null;
  /** Canal d'où vient la personne (utm_source), pour les pages de campagne. */
  source?: string | null;
  /** Variante du canal (utm_content) : quelle vidéo, quel lien. */
  sourceContent?: string | null;
};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/**
 * Aucun prix inventé : quand la page n'affiche pas encore de prix, on interroge
 * l'API pour obtenir le tarif réel qui servira de point de comparaison.
 */
async function resolveReferencePrice(input: AlertInput): Promise<number | null> {
  if (typeof input.referencePrice === "number" && input.referencePrice > 0) {
    return input.referencePrice;
  }
  const departureAt =
    input.departDate ?? new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
  try {
    const { offers } = await fetchOffers({
      origin: input.origin.toUpperCase(),
      destination: input.destination.toUpperCase(),
      departureAt,
      returnAt: input.returnDate ?? null,
    });
    return offers[0]?.priceEur ?? null;
  } catch (error) {
    console.error("Prix de référence introuvable pour l'alerte", error);
    return null;
  }
}

export async function createAlert(input: AlertInput): Promise<{ ok: boolean; message: string }> {
  const referencePrice = await resolveReferencePrice(input);
  const logContext = {
    origin: input.origin.toUpperCase(),
    destination: input.destination.toUpperCase(),
    departDate: input.departDate ?? null,
    returnDate: input.returnDate ?? null,
    hasReferencePrice: typeof input.referencePrice === "number",
    source: input.source ?? null,
    sourceContent: input.sourceContent ?? null,
  };
  if (referencePrice === null) {
    logOps({
      kind: "alerte",
      label: "création refusée",
      ok: false,
      resultCount: 0,
      message: "aucun prix de référence réel disponible",
      context: logContext,
    });
    return {
      ok: false,
      message:
        "Aucun prix n'est disponible pour ce trajet en ce moment : impossible de fixer un point de comparaison. Réessayez avec une date de départ.",
    };
  }
  /**
   * Clés absentes plutôt que mises à null quand rien n'est fourni : l'upsert
   * n'écrit que les colonnes présentes dans la charge utile. Une alerte créée
   * depuis /alertes ne doit pas effacer la provenance d'une alerte identique
   * créée la veille depuis une page de campagne.
   */
  const provenance = {
    ...(input.source ? { source: input.source } : {}),
    ...(input.sourceContent ? { source_content: input.sourceContent } : {}),
  };

  try {
    const db = await admin();

    const { error } = await db.from("price_alerts").upsert(
      {
        email: input.email.toLowerCase(),
        origin: input.origin.toUpperCase(),
        destination: input.destination.toUpperCase(),
        depart_date: input.departDate ?? null,
        return_date: input.returnDate ?? null,
        initial_price: referencePrice,
        last_price: referencePrice,
        active: true,
        ...provenance,
      },
      { onConflict: "email,origin,destination,depart_date" },
    );

    if (error) {
      // Le conflit d'unicité partiel peut échouer selon l'index : on retente en insert simple.
      const retry = await db.from("price_alerts").insert({
        email: input.email.toLowerCase(),
        origin: input.origin.toUpperCase(),
        destination: input.destination.toUpperCase(),
        depart_date: input.departDate ?? null,
        return_date: input.returnDate ?? null,
        initial_price: referencePrice,
        last_price: referencePrice,
        ...provenance,
      });
      if (retry.error && !retry.error.message.includes("duplicate")) {
        logOps({
          kind: "alerte",
          label: "création en échec",
          ok: false,
          message: retry.error.message,
          context: logContext,
        });
        return { ok: false, message: "Impossible d'enregistrer l'alerte pour le moment." };
      }
    }
  } catch (error) {
    // Config manquante (ex. Supabase non connecté côté Lovable Cloud) : on ne
    // laisse jamais planter la page, juste un message clair pour l'utilisateur.
    const message = error instanceof Error ? error.message : "erreur inconnue";
    console.error("Base de données indisponible (création alerte)", error);
    logOps({ kind: "alerte", label: "création en échec", ok: false, message, context: logContext });
    return { ok: false, message: "Impossible d'enregistrer l'alerte pour le moment." };
  }

  logOps({
    kind: "alerte",
    label: "création réussie",
    ok: true,
    resultCount: 1,
    context: { ...logContext, referencePrice },
  });

  return {
    ok: true,
    message: "Alerte créée. Vous recevrez un email dès que le prix baisse sur ce trajet.",
  };
}

export async function deactivateAlert(token: string): Promise<boolean> {
  try {
    const db = await admin();
    const { error } = await db
      .from("price_alerts")
      .update({ active: false })
      .eq("unsubscribe_token", token);
    return !error;
  } catch (error) {
    console.error("Base de données indisponible (désinscription alerte)", error);
    return false;
  }
}

/**
 * Réponse unique de `sendAlertsSummary`, quoi qu'il arrive.
 *
 * Répondre « aucune alerte » à une adresse inconnue et « email envoyé » à une
 * adresse connue transformerait le formulaire en oracle : n'importe qui
 * pourrait vérifier si telle personne utilise le site. Le message est donc le
 * même dans les quatre cas — adresse inconnue, alertes trouvées, quota atteint,
 * envoi en échec.
 */
const REPONSE_RESUME = "Si des alertes existent pour cette adresse, un email vient de partir.";

/** Trois envois par heure et par adresse. */
const RESUMES_PAR_HEURE = 3;
const FENETRE_RESUME_MS = 3_600_000;

/**
 * Compteur en mémoire d'isolat, comme la limite par IP de job-auth.server.
 *
 * Il ne survit ni à un redémarrage ni à un second isolat, et ce n'est pas un
 * pare-feu : il empêche seulement qu'un formulaire public serve de robinet à
 * emails. Un vrai plafond vivrait en base, au prix d'un aller-retour sur une
 * page qui n'en fait aucun aujourd'hui.
 */
const resumesParEmail = new Map<string, number[]>();

function quotaResumeDepasse(email: string): boolean {
  const maintenant = Date.now();
  const recents = (resumesParEmail.get(email) ?? []).filter(
    (t) => maintenant - t < FENETRE_RESUME_MS,
  );
  recents.push(maintenant);
  resumesParEmail.set(email, recents);
  // La table ne doit pas grossir indéfiniment sur un isolat de longue vie.
  if (resumesParEmail.size > 5000) {
    for (const [cle, dates] of resumesParEmail) {
      if (dates.every((t) => maintenant - t >= FENETRE_RESUME_MS)) resumesParEmail.delete(cle);
    }
  }
  return recents.length > RESUMES_PAR_HEURE;
}

/**
 * Envoie à une adresse la liste de ses alertes actives.
 *
 * Sans compte ni mot de passe, la boîte mail est la seule preuve de propriété :
 * la liste part par email et n'est jamais rendue au navigateur, et les jetons de
 * suppression ne transitent que par ce message.
 */
export async function sendAlertsSummary(
  email: string,
  siteUrl: string,
): Promise<{ ok: boolean; message: string }> {
  const adresse = email.trim().toLowerCase();
  const debut = Date.now();

  if (quotaResumeDepasse(adresse)) {
    logOps({
      kind: "alerte",
      label: "résumé refusé (quota)",
      ok: false,
      message: `Plus de ${RESUMES_PAR_HEURE} demandes en une heure`,
    });
    return { ok: true, message: REPONSE_RESUME };
  }

  let alertes: Array<Record<string, unknown>> = [];
  try {
    const db = await admin();
    const { data, error } = await db
      .from("price_alerts")
      .select(
        "origin,destination,depart_date,return_date,last_price,last_checked_at,unsubscribe_token",
      )
      .eq("email", adresse)
      .eq("active", true)
      .order("created_at", { ascending: true })
      .limit(50);
    if (error) throw new Error(error.message);
    alertes = (data ?? []) as Array<Record<string, unknown>>;
  } catch (error) {
    logOps({
      kind: "alerte",
      label: "résumé impossible",
      ok: false,
      durationMs: Date.now() - debut,
      message: error instanceof Error ? error.message : "lecture des alertes impossible",
    });
    return { ok: true, message: REPONSE_RESUME };
  }

  // Adresse sans alerte : on s'arrête là, sans le dire.
  if (alertes.length === 0) {
    logOps({ kind: "alerte", label: "résumé sans alerte", durationMs: Date.now() - debut });
    return { ok: true, message: REPONSE_RESUME };
  }

  if (!isEmailConfigured()) {
    logOps({
      kind: "alerte",
      label: "résumé non envoyé",
      ok: false,
      message: "RESEND_API_KEY ou ALERTS_FROM_EMAIL manquante",
      context: { alertes: alertes.length },
    });
    return { ok: true, message: REPONSE_RESUME };
  }

  const { subject, html, text } = buildMesAlertesEmail({
    siteUrl,
    alertes: alertes.map((ligne) => ({
      origin: String(ligne["origin"] ?? ""),
      destination: String(ligne["destination"] ?? ""),
      departDate: (ligne["depart_date"] as string | null) ?? null,
      returnDate: (ligne["return_date"] as string | null) ?? null,
      lastPrice: Number(ligne["last_price"] ?? 0),
      lastCheckedAt: (ligne["last_checked_at"] as string | null) ?? null,
      unsubscribeToken: String(ligne["unsubscribe_token"] ?? ""),
    })),
  });

  try {
    const result = await sendEmail({ to: adresse, subject, html, text });
    // `status` et `message` n'existent que sur la branche en échec, et
    // exactOptionalPropertyTypes interdit de les passer à undefined : on les
    // ajoute seulement quand ils existent.
    logOps({
      kind: "alerte",
      label: result.sent ? "résumé envoyé" : "résumé refusé",
      ok: result.sent,
      ...(result.sent ? {} : { status: result.status, message: result.message }),
      durationMs: Date.now() - debut,
      context: { alertes: alertes.length },
    });
  } catch (error) {
    logOps({
      kind: "alerte",
      label: "résumé en échec",
      ok: false,
      durationMs: Date.now() - debut,
      message: error instanceof Error ? error.message : "envoi impossible",
      context: { alertes: alertes.length },
    });
  }

  return { ok: true, message: REPONSE_RESUME };
}

async function sendDropEmail(params: {
  email: string;
  origin: string;
  destination: string;
  oldPrice: number;
  newPrice: number;
  departureAt?: string | null;
  returnAt?: string | null;
  airline?: string;
  stops?: number;
  durationMinutes?: number;
  unsubscribeToken: string;
  offerUrl: string;
  siteUrl: string;
}): Promise<boolean> {
  const unsubscribeUrl = `${params.siteUrl}/alertes/desinscription?token=${params.unsubscribeToken}`;
  const { subject, html, text } = buildAlertePrixEmail({
    origin: params.origin,
    destination: params.destination,
    oldPrice: params.oldPrice,
    newPrice: params.newPrice,
    departureAt: params.departureAt,
    returnAt: params.returnAt,
    airline: params.airline,
    stops: params.stops,
    durationMinutes: params.durationMinutes,
    offerUrl: params.offerUrl,
    unsubscribeUrl,
    siteUrl: params.siteUrl,
  });

  const logContext = {
    origin: params.origin,
    destination: params.destination,
    oldPrice: params.oldPrice,
    newPrice: params.newPrice,
  };

  if (!isEmailConfigured()) {
    // Sans configuration, on le dit clairement dans les journaux : une alerte
    // « envoyée » qui n'est jamais partie est le pire des silences.
    logOps({
      kind: "alerte",
      label: "envoi impossible",
      ok: false,
      message: "RESEND_API_KEY ou ALERTS_FROM_EMAIL manquante",
      context: logContext,
    });
    return false;
  }

  const debut = Date.now();
  try {
    const result = await sendEmail({
      to: params.email,
      subject,
      html,
      text,
      // Lien de désinscription reconnu par les messageries : affiché à côté de
      // l'expéditeur et pris en compte dans le classement spam / boîte de réception.
      headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
    });
    if (!result.sent) {
      logOps({
        kind: "alerte",
        label: "envoi refusé",
        ok: false,
        status: result.status,
        durationMs: Date.now() - debut,
        message: result.message,
        context: logContext,
      });
      return false;
    }
    logOps({
      kind: "alerte",
      label: "envoi réussi",
      ok: true,
      resultCount: 1,
      durationMs: Date.now() - debut,
      context: { ...logContext, emailId: result.id },
    });
    return true;
  } catch (error) {
    logOps({
      kind: "alerte",
      label: "envoi en échec",
      ok: false,
      durationMs: Date.now() - debut,
      message: error instanceof Error ? error.message : "erreur inconnue",
      context: logContext,
    });
    return false;
  }
}

/** Revérifie toutes les alertes actives et notifie les baisses de prix. */
export async function runAlertCheck(siteUrl: string): Promise<{
  checked: number;
  notified: number;
}> {
  let db;
  try {
    db = await admin();
  } catch (error) {
    console.error("Base de données indisponible (vérification alertes)", error);
    return { checked: 0, notified: 0 };
  }
  const { data: alerts, error } = await db
    .from("price_alerts")
    .select("*")
    .eq("active", true)
    .limit(200);

  if (error) {
    console.error("Lecture des alertes impossible", error);
    return { checked: 0, notified: 0 };
  }

  let notified = 0;
  for (const alert of alerts ?? []) {
    const departureAt = alert.depart_date ?? defaultDepartureDate();
    let offers;
    try {
      ({ offers } = await fetchOffers({
        origin: alert.origin,
        destination: alert.destination,
        departureAt,
        returnAt: alert.return_date,
      }));
    } catch (fetchError) {
      console.error("Vérification d'alerte impossible", fetchError);
      continue;
    }
    const cheapest = offers[0];
    if (!cheapest) continue;

    const previous = Number(alert.last_price);
    let sent = false;
    if (cheapest.priceEur < previous - 1) {
      sent = await sendDropEmail({
        email: alert.email,
        origin: alert.origin,
        destination: alert.destination,
        oldPrice: previous,
        newPrice: cheapest.priceEur,
        departureAt: cheapest.departureAt || alert.depart_date,
        returnAt: cheapest.returnAt ?? alert.return_date,
        airline: cheapest.airline,
        stops: cheapest.stops,
        durationMinutes: cheapest.durationMinutes,
        unsubscribeToken: alert.unsubscribe_token,
        offerUrl: offerPageUrl(
          siteUrl,
          alert.origin,
          alert.destination,
          cheapest.departureAt || departureAt,
          cheapest.returnAt ?? alert.return_date,
        ),
        siteUrl,
      });
      if (sent) notified++;
    }

    // Si l'envoi a échoué, on ne baisse pas le prix de référence : la baisse
    // sera détectée à nouveau au prochain passage et l'email retenté.
    const nextPrice =
      sent || cheapest.priceEur >= previous - 1 ? Math.min(previous, cheapest.priceEur) : previous;
    await db
      .from("price_alerts")
      .update({
        last_price: nextPrice,
        last_checked_at: new Date().toISOString(),
      })
      .eq("id", alert.id);
  }

  return { checked: alerts?.length ?? 0, notified };
}

/**
 * Page de résultats du site pour ce trajet, avec les dates de l'offre.
 *
 * L'email ne pointe volontairement PAS vers le lien de réservation Aviasales :
 * un email dont les liens sortent du domaine d'envoi est un signal de spam
 * classique (c'est le premier point que Resend remonte dans ses « insights »).
 * Le lecteur arrive sur trouvemonvol.fr, voit les offres à jour et clique
 * « Réserver » depuis le site, où l'affiliation est déjà en place.
 */
function offerPageUrl(
  siteUrl: string,
  origin: string,
  destination: string,
  departureAt: string,
  returnAt: string | null,
): string {
  const url = new URL("/recherche", siteUrl);
  url.searchParams.set("origin", origin);
  url.searchParams.set("destination", destination);
  url.searchParams.set("depart", departureAt.slice(0, 10));
  if (returnAt) url.searchParams.set("retour", returnAt.slice(0, 10));
  return url.toString();
}

function defaultDepartureDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 45);
  return d.toISOString().slice(0, 10);
}
