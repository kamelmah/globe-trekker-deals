/**
 * Email « voici vos alertes », envoyé à la demande depuis /alertes.
 *
 * Même charte et mêmes contraintes que alerte-prix.ts : tableaux imbriqués,
 * styles en ligne, largeur fixe de 600 px, version texte en parallèle. Voir
 * l'en-tête de ce fichier pour le pourquoi.
 *
 * La liste est la seule façon de gérer ses alertes sans compte : chaque ligne
 * porte son propre lien de suppression, avec le jeton déjà utilisé par les
 * emails de baisse de prix. Aucun jeton n'apparaît donc dans le navigateur ni
 * dans les journaux du site — seulement dans la boîte du propriétaire.
 */
import { cityLabel } from "@/data/airports";
import { formatPrice } from "@/lib/currency";
import { formatDateLong } from "@/lib/dates";

export type AlerteListee = {
  origin: string;
  destination: string;
  departDate?: string | null | undefined;
  returnDate?: string | null | undefined;
  lastPrice: number;
  lastCheckedAt?: string | null | undefined;
  unsubscribeToken: string;
};

export type MesAlertesInput = {
  alertes: AlerteListee[];
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
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** « Aller-retour du 3 mai au 12 mai », ou ce qu'on en sait. */
function periodeLabel(alerte: AlerteListee): string {
  const depart = formatDateLong(alerte.departDate?.slice(0, 10));
  const retour = formatDateLong(alerte.returnDate?.slice(0, 10));
  if (depart && retour) return `Aller-retour du ${depart} au ${retour}`;
  if (depart) return `Aller simple le ${depart}`;
  return "Toutes dates";
}

/**
 * « vérifié il y a 2 heures », ou rien.
 *
 * Une alerte créée à l'instant n'a pas encore été vérifiée : afficher une date
 * vide serait plus inquiétant que de ne rien dire.
 */
function verifieLabel(iso: string | null | undefined): string {
  if (!iso) return "Pas encore vérifiée";
  const quand = new Date(iso);
  if (Number.isNaN(quand.getTime())) return "Pas encore vérifiée";
  const heures = Math.floor((Date.now() - quand.getTime()) / 3_600_000);
  if (heures < 1) return "Vérifiée il y a moins d'une heure";
  if (heures < 24) return `Vérifiée il y a ${heures} h`;
  const jours = Math.floor(heures / 24);
  return jours === 1 ? "Vérifiée hier" : `Vérifiée il y a ${jours} jours`;
}

export function buildMesAlertesEmail(input: MesAlertesInput): {
  subject: string;
  html: string;
  text: string;
} {
  const nombre = input.alertes.length;
  const siteUrl = input.siteUrl.replace(/\/$/, "");
  const subject = nombre === 1 ? "Votre alerte prix" : `Vos ${nombre} alertes prix`;
  const logoUrl = `${siteUrl}/email/logo-160.png`;

  const lignes = input.alertes
    .map((alerte) => {
      const route = `${cityLabel(alerte.origin)} → ${cityLabel(alerte.destination)}`;
      const suppression = `${siteUrl}/alertes/desinscription?token=${encodeURIComponent(alerte.unsubscribeToken)}`;
      return `
        <tr><td style="padding:18px 0;border-top:1px solid #e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <div style="font-size:17px;font-weight:700;color:${ENCRE};">${escapeHtml(route)}</div>
          <div style="font-size:13px;color:${GRIS};margin-top:4px;">${escapeHtml(periodeLabel(alerte))}</div>
          <div style="font-size:14px;color:${ENCRE};margin-top:8px;">
            Dernier prix connu : <strong>${escapeHtml(formatPrice(alerte.lastPrice))}</strong>
            <span style="color:${GRIS};">— ${escapeHtml(verifieLabel(alerte.lastCheckedAt))}</span>
          </div>
          <div style="margin-top:10px;">
            <a href="${escapeHtml(suppression)}" style="font-size:13px;color:${GRIS};">Supprimer cette alerte</a>
          </div>
        </td></tr>`;
    })
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
  ${nombre === 1 ? "Une alerte active" : `${nombre} alertes actives`} sur votre adresse.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${FOND};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

    <!-- En-tête : logo + nom, hébergés sur le domaine d'envoi -->
    <tr><td style="padding:0 8px 16px;">
      <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;">
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

        <tr><td style="background:${BLEU};padding:28px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <div style="font-size:13px;font-weight:600;color:#cfe3fb;text-transform:uppercase;letter-spacing:1px;">Vos alertes</div>
          <div style="font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;margin-top:6px;">${nombre === 1 ? "1 alerte active" : `${nombre} alertes actives`}</div>
          <div style="font-size:15px;color:#e3effd;margin-top:6px;">Nous vérifions ces trajets chaque heure et vous écrivons dès qu'un prix baisse.</div>
        </td></tr>

        <tr><td style="padding:10px 32px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${lignes}
          </table>
        </td></tr>

        <tr><td style="padding:0 32px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <div style="font-size:12px;line-height:1.5;color:${GRIS};">
            Les prix affichés datent de la dernière vérification et peuvent évoluer. La réservation se fait chez le vendeur, sans commission ajoutée par TrouveMonVol.
          </div>
        </td></tr>

      </table>
    </td></tr>

    <!-- Pied -->
    <tr><td style="padding:20px 8px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${GRIS};">
      Vous recevez cet email parce que la liste de vos alertes a été demandée depuis
      <a href="${escapeHtml(siteUrl)}/alertes" style="color:${GRIS};">trouvemonvol.fr/alertes</a>.
      Si ce n'était pas vous, ignorez ce message : il ne permet à personne d'autre de savoir que cette adresse existe.
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    "TrouveMonVol — Vos alertes prix",
    "",
    nombre === 1 ? "1 alerte active :" : `${nombre} alertes actives :`,
    "",
    ...input.alertes.flatMap((alerte) => [
      `${cityLabel(alerte.origin)} → ${cityLabel(alerte.destination)}`,
      `  ${periodeLabel(alerte)}`,
      `  Dernier prix connu : ${formatPrice(alerte.lastPrice)} — ${verifieLabel(alerte.lastCheckedAt)}`,
      `  Supprimer : ${siteUrl}/alertes/desinscription?token=${encodeURIComponent(alerte.unsubscribeToken)}`,
      "",
    ]),
    "Les prix affichés datent de la dernière vérification et peuvent évoluer.",
    "",
    `Liste demandée depuis ${siteUrl}/alertes. Si ce n'était pas vous, ignorez ce message.`,
  ].join("\n");

  return { subject, html, text };
}
