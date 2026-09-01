/**
 * Authentification des tâches planifiées.
 *
 * Ces endpoints déclenchent des centaines d'appels à la source tarifaire, qui
 * est facturée. Ils étaient protégés, à défaut de secret dédié, par la clé
 * publiable du projet — or celle-ci est injectée dans le bundle client sous
 * `VITE_SUPABASE_PUBLISHABLE_KEY` : n'importe quel visiteur pouvait la lire
 * dans le JavaScript de la page et appeler l'endpoint en boucle. Ce n'était pas
 * une protection, c'était un robinet ouvert sur la facture.
 *
 * Deux verrous désormais, et le second ne remplace pas le premier :
 *
 *  1. Un secret dédié, jamais exposé au client (aucun préfixe VITE_). En son
 *     absence, l'endpoint refuse tout — il échoue fermé. Un déploiement sans la
 *     variable rend la tâche inopérante, ce qui se voit ; l'inverse ne se
 *     verrait pas.
 *
 *  2. Une limitation de débit par IP, volontairement présentée pour ce qu'elle
 *     est : le compteur vit dans la mémoire d'un isolat Cloudflare, et il y a
 *     plusieurs isolats. Elle freine l'abus évident, elle ne le rend pas
 *     impossible. Le secret reste la vraie protection.
 */

/** Variable d'environnement portant le secret des tâches planifiées. */
export const CRON_SECRET_ENV = "CRON_SECRET";

/** En-tête attendu. */
export const CRON_SECRET_HEADER = "x-cron-secret";

const LIMITE_PAR_FENETRE = 6;
const FENETRE_MS = 60_000;

const appelsParIp = new Map<string, number[]>();

/** Comparaison à durée constante : une comparaison naïve fuit le préfixe. */
function memeSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "inconnue"
  );
}

function tropDAppels(ip: string): boolean {
  const maintenant = Date.now();
  const recents = (appelsParIp.get(ip) ?? []).filter((t) => maintenant - t < FENETRE_MS);
  recents.push(maintenant);
  appelsParIp.set(ip, recents);
  // La table ne doit pas croître indéfiniment sur un isolat de longue durée.
  if (appelsParIp.size > 1000) {
    for (const [cle, dates] of appelsParIp) {
      if (dates.every((t) => maintenant - t >= FENETRE_MS)) appelsParIp.delete(cle);
    }
  }
  return recents.length > LIMITE_PAR_FENETRE;
}

const json = (corps: unknown, status: number) =>
  new Response(JSON.stringify(corps), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

/**
 * Renvoie une réponse d'erreur si l'appel doit être refusé, `null` s'il peut
 * continuer.
 *
 * `secretsHerites` permet d'accepter en plus un ancien couple en-tête/variable
 * le temps qu'une tâche déjà planifiée soit basculée, sans laisser de trou :
 * ces couples sont eux aussi de vrais secrets serveur.
 */
export function refuseJobRequest(
  request: Request,
  secretsHerites: { header: string; env: string }[] = [],
): Response | null {
  const attendus = [{ header: CRON_SECRET_HEADER, env: CRON_SECRET_ENV }, ...secretsHerites]
    .map((couple) => ({ header: couple.header, valeur: process.env[couple.env] }))
    .filter((couple): couple is { header: string; valeur: string } => Boolean(couple.valeur));

  if (attendus.length === 0) {
    console.error(
      `[tâche planifiée] ${CRON_SECRET_ENV} n'est pas définie : tout appel est refusé.`,
    );
    return json(
      {
        error: `Tâche non configurée : définir ${CRON_SECRET_ENV} côté serveur.`,
      },
      503,
    );
  }

  const ip = clientIp(request);
  if (tropDAppels(ip)) {
    return json({ error: "Trop d'appels, réessayez dans une minute." }, 429);
  }

  const autorise = attendus.some((couple) => {
    const fourni = request.headers.get(couple.header);
    return typeof fourni === "string" && memeSecret(fourni, couple.valeur);
  });

  if (!autorise) {
    console.error(`[tâche planifiée] secret invalide depuis ${ip}`);
    return json({ error: "Unauthorized" }, 401);
  }

  return null;
}
