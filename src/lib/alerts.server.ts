import { fetchOffers } from "@/lib/travelpayouts.server";
import { logOps } from "@/lib/ops-log.server";
import { cityLabel } from "@/data/airports";
import { formatPrice } from "@/lib/currency";
import { isEmailConfigured, sendEmail } from "@/lib/resend.server";

export type AlertInput = {
  email: string;
  origin: string;
  destination: string;
  departDate?: string | null;
  returnDate?: string | null;
  /** Prix de référence connu côté page ; résolu via l'API quand il est absent. */
  referencePrice?: number | null;
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

async function sendDropEmail(params: {
  email: string;
  origin: string;
  destination: string;
  oldPrice: number;
  newPrice: number;
  unsubscribeToken: string;
  bookingUrl: string;
  siteUrl: string;
}): Promise<boolean> {
  const route = `${cityLabel(params.origin)} — ${cityLabel(params.destination)}`;
  const subject = `Le prix baisse sur ${route} : ${formatPrice(params.newPrice)}`;
  const unsubscribeUrl = `${params.siteUrl}/alertes/desinscription?token=${params.unsubscribeToken}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;color:#0f172a;max-width:520px">
      <h1 style="font-size:20px">Bonne nouvelle : le prix a baissé</h1>
      <p>Sur le trajet <strong>${route}</strong>, le prix le plus bas est passé de
        ${formatPrice(params.oldPrice)} à <strong>${formatPrice(params.newPrice)}</strong>.</p>
      <p><a href="${params.bookingUrl}" style="background:#1B6FD0;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Voir l'offre</a></p>
      <p style="font-size:12px;color:#64748b">Prix indicatif au moment de la vérification, taxes incluses.
        Nous ne prenons aucune commission supplémentaire sur votre réservation.</p>
      <p style="font-size:12px;color:#64748b">
        <a href="${unsubscribeUrl}">Ne plus recevoir d'alerte sur ce trajet</a>
      </p>
    </div>`;
  const text =
    `Bonne nouvelle : le prix a baissé sur ${route}.\n` +
    `Le prix le plus bas est passé de ${formatPrice(params.oldPrice)} à ${formatPrice(params.newPrice)}.\n\n` +
    `Voir l'offre : ${params.bookingUrl}\n\n` +
    `Prix indicatif au moment de la vérification, taxes incluses.\n` +
    `Ne plus recevoir d'alerte sur ce trajet : ${unsubscribeUrl}`;

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
    const result = await sendEmail({ to: params.email, subject, html, text });
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
        unsubscribeToken: alert.unsubscribe_token,
        bookingUrl: cheapest.bookingUrl,
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

function defaultDepartureDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 45);
  return d.toISOString().slice(0, 10);
}
