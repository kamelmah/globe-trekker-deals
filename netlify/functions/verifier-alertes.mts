/**
 * Vérification des alertes prix — tâche planifiée Netlify.
 *
 * Remplace l'endpoint POST /api/public/verifier-alertes, que plus personne
 * n'appelait depuis la migration (il exigeait ALERTS_CRON_SECRET, supprimée).
 * C'est la pièce qui manquait : les prix étaient bien rafraîchis chaque heure,
 * mais aucune alerte n'était jamais comparée ni envoyée.
 *
 * Planifiée à h+37, une demi-heure après `rafraichir-prix` (h+07), pour
 * travailler sur des prix frais sans concurrencer le rafraîchissement.
 *
 * L'envoi passe par Resend (RESEND_API_KEY + ALERTS_FROM_EMAIL), voir
 * src/lib/resend.server.ts.
 */
import { runAlertCheck } from "../../src/lib/alerts.server";

/** URL publique du site, fournie par Netlify (`URL`) ; repli sur le domaine. */
const SITE_URL = (process.env["URL"] ?? "https://trouvemonvol.fr").replace(/\/$/, "");

export default async () => {
  const debut = Date.now();
  try {
    const rapport = await runAlertCheck(SITE_URL);
    console.log(
      `[verifier-alertes] ${rapport.checked} alertes vérifiées · ${rapport.notified} emails envoyés · ` +
        `${Math.round((Date.now() - debut) / 1000)}s`,
    );
    return new Response(JSON.stringify(rapport), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[verifier-alertes] échec", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "échec" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const config = {
  name: "verifier-alertes",
  schedule: "37 * * * *",
};
