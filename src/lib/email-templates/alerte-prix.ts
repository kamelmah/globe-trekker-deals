/**
 * Email « le prix a baissé » envoyé par la tâche verifier-alertes.
 *
 * HTML « à l'ancienne » volontairement : tableaux imbriqués, styles en ligne,
 * largeur fixe de 600 px. C'est la seule façon d'avoir un rendu stable dans
 * Mail (iCloud), Gmail et Outlook, qui ignorent une bonne partie du CSS
 * moderne. Une version texte est produite en parallèle : elle sert aux
 * clients qui la préfèrent et améliore la délivrabilité (un email HTML sans
 * texte est un signal de spam classique).
 */
import { cityLabel } from "@/data/airports";
import { formatPrice } from "@/lib/currency";
import { formatDateLong } from "@/lib/dates";

export type AlertePrixInput = {
  origin: string;
  destination: string;
  oldPrice: number;
  newPrice: number;
  departureAt?: string | null | undefined;
  returnAt?: string | null | undefined;
  airline?: string | undefined;
  stops?: number | undefined;
  durationMinutes?: number | undefined;
  /** Page du site pour ce trajet — jamais un lien externe (voir alerts.server). */
  offerUrl: string;
  unsubscribeUrl: string;
  siteUrl: string;
};

const BLEU = "#1B6FD0";
const ENCRE = "#0f172a";
const GRIS = "#64748b";
const FOND = "#f1f5f9";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDuration(minutes: number | undefined): string {
  if (!minutes || minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

function stopsLabel(stops: number | undefined): string {
  if (stops === undefined) return "";
  if (stops === 0) return "Vol direct";
  return stops === 1 ? "1 escale" : `${stops} escales`;
}

export function buildAlertePrixEmail(input: AlertePrixInput): {
  subject: string;
  html: string;
  text: string;
} {
  const from = cityLabel(input.origin);
  const to = cityLabel(input.destination);
  const route = `${from} → ${to}`;
  const oldPrice = formatPrice(input.oldPrice);
  const newPrice = formatPrice(input.newPrice);
  const saving = Math.max(0, input.oldPrice - input.newPrice);
  const savingPct = input.oldPrice > 0 ? Math.round((saving / input.oldPrice) * 100) : 0;
  const savingLabel = `− ${formatPrice(saving)}${savingPct ? ` (−${savingPct} %)` : ""}`;

  const details: Array<[string, string]> = [];
  // L'API renvoie des horodatages complets ; on ne garde que le jour.
  const departure = formatDateLong(input.departureAt?.slice(0, 10));
  if (departure) details.push(["Départ", departure]);
  const retour = formatDateLong(input.returnAt?.slice(0, 10));
  if (retour) details.push(["Retour", retour]);
  if (input.airline) details.push(["Compagnie", input.airline]);
  const trajet = [stopsLabel(input.stops), formatDuration(input.durationMinutes)]
    .filter(Boolean)
    .join(" · ");
  if (trajet) details.push(["Trajet", trajet]);

  const tripLabel = input.returnAt
    ? "Aller-retour par personne, taxes incluses."
    : "Aller simple par personne, taxes incluses.";
  const subject = `${route} à ${newPrice} : le prix a baissé`;
  // Image servie par le site lui-même (public/email/), jamais par un CDN tiers :
  // une image hébergée hors du domaine d'envoi est un signal de spam.
  const logoUrl = `${input.siteUrl.replace(/\/$/, "")}/email/logo-160.png`;

  const detailRows = details
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:6px 0;font-size:14px;color:${GRIS};width:110px;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;font-size:14px;color:${ENCRE};font-weight:600;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${FOND};">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${FOND};">
  ${escapeHtml(route)} : ${escapeHtml(oldPrice)} → ${escapeHtml(newPrice)}, taxes incluses.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${FOND};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

    <!-- En-tête : logo + nom, hébergés sur le domaine d'envoi -->
    <tr><td style="padding:0 8px 16px;">
      <a href="${escapeHtml(input.siteUrl)}" style="text-decoration:none;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="vertical-align:middle;padding-right:10px;">
              <img src="${escapeHtml(logoUrl)}" width="40" height="40" alt="TrouveMonVol" style="display:block;width:40px;height:40px;border:0;">
            </td>
            <td style="vertical-align:middle;">
              <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:20px;font-weight:800;color:${BLEU};letter-spacing:-0.3px;">TrouveMonVol</span>
            </td>
          </tr>
        </table>
      </a>
    </td></tr>

    <!-- Carte -->
    <tr><td style="background:#ffffff;border-radius:14px;overflow:hidden;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

        <!-- Bandeau -->
        <tr><td style="background:${BLEU};padding:28px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <div style="font-size:13px;font-weight:600;color:#cfe3fb;text-transform:uppercase;letter-spacing:1px;">Alerte prix</div>
          <div style="font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;margin-top:6px;">${escapeHtml(route)}</div>
          <div style="font-size:15px;color:#e3effd;margin-top:6px;">Le prix le plus bas vient de baisser sur ce trajet.</div>
        </td></tr>

        <!-- Prix -->
        <tr><td style="padding:28px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="vertical-align:baseline;padding-right:14px;">
                <span style="font-size:40px;font-weight:800;color:${ENCRE};letter-spacing:-1px;">${escapeHtml(newPrice)}</span>
              </td>
              <td style="vertical-align:baseline;">
                <span style="font-size:18px;color:${GRIS};text-decoration:line-through;">${escapeHtml(oldPrice)}</span>
              </td>
            </tr>
          </table>
          <div style="margin-top:10px;">
            <span style="display:inline-block;background:#e8f5ee;color:#15803d;font-size:13px;font-weight:700;padding:5px 10px;border-radius:999px;">${escapeHtml(savingLabel)}</span>
          </div>
          <div style="font-size:13px;color:${GRIS};margin-top:10px;">${escapeHtml(tripLabel)}</div>
        </td></tr>

        ${
          detailRows
            ? `<!-- Détails -->
        <tr><td style="padding:16px 32px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e2e8f0;padding-top:10px;">
            ${detailRows}
          </table>
        </td></tr>`
            : ""
        }

        <!-- Bouton -->
        <tr><td style="padding:24px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background:${BLEU};border-radius:10px;">
              <a href="${escapeHtml(input.offerUrl)}" style="display:inline-block;padding:14px 26px;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;">Voir les vols</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Mention -->
        <tr><td style="padding:8px 32px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <div style="font-size:12px;line-height:1.5;color:${GRIS};">
            Prix relevé au moment de la vérification, il peut évoluer rapidement. La réservation se fait chez le vendeur, sans commission ajoutée par TrouveMonVol.
          </div>
        </td></tr>

      </table>
    </td></tr>

    <!-- Pied -->
    <tr><td style="padding:20px 8px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${GRIS};">
      Vous recevez cet email parce que vous avez créé une alerte prix sur
      <a href="${escapeHtml(input.siteUrl)}" style="color:${GRIS};">trouvemonvol.fr</a> pour le trajet ${escapeHtml(route)}.<br>
      <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:${GRIS};">Ne plus recevoir d'alerte pour ce trajet</a>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    `TrouveMonVol — Alerte prix`,
    ``,
    `${route} : le prix a baissé.`,
    `${newPrice} au lieu de ${oldPrice}, soit ${savingLabel}. ${tripLabel}`,
    ``,
    ...details.map(([label, value]) => `${label} : ${value}`),
    details.length ? `` : null,
    `Voir les vols : ${input.offerUrl}`,
    ``,
    `Prix relevé au moment de la vérification, il peut évoluer rapidement. La réservation se fait chez le vendeur, sans commission ajoutée par TrouveMonVol.`,
    ``,
    `Vous recevez cet email parce que vous avez créé une alerte prix sur trouvemonvol.fr pour ce trajet.`,
    `Ne plus recevoir d'alerte pour ce trajet : ${input.unsubscribeUrl}`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return { subject, html, text };
}
