//#region node_modules/.nitro/vite/services/ssr/assets/job-auth.server-BcztPFAF.js
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
/**
* Variable d'environnement portant le secret des tâches planifiées.
*
* `LOVABLE_CRON_SECRET` est déjà provisionnée et injectée par la plateforme :
* c'est elle qui fait foi. `CRON_SECRET` reste acceptée si elle existe, mais
* elle n'a jamais besoin d'être créée.
*/
var CRON_SECRET_ENV = "LOVABLE_CRON_SECRET";
/** En-tête attendu. */
var CRON_SECRET_HEADER = "x-cron-secret";
var LIMITE_PAR_FENETRE = 6;
var FENETRE_MS = 6e4;
var appelsParIp = /* @__PURE__ */ new Map();
/** Comparaison à durée constante : une comparaison naïve fuit le préfixe. */
function memeSecret(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}
function clientIp(request) {
	return request.headers.get("x-nf-client-connection-ip") ?? request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue";
}
function tropDAppels(ip) {
	const maintenant = Date.now();
	const recents = (appelsParIp.get(ip) ?? []).filter((t) => maintenant - t < FENETRE_MS);
	recents.push(maintenant);
	appelsParIp.set(ip, recents);
	if (appelsParIp.size > 1e3) {
		for (const [cle, dates] of appelsParIp) if (dates.every((t) => maintenant - t >= FENETRE_MS)) appelsParIp.delete(cle);
	}
	return recents.length > LIMITE_PAR_FENETRE;
}
var json = (corps, status) => new Response(JSON.stringify(corps), {
	status,
	headers: {
		"Content-Type": "application/json",
		"Cache-Control": "no-store"
	}
});
/**
* Renvoie une réponse d'erreur si l'appel doit être refusé, `null` s'il peut
* continuer.
*
* `secretsHerites` permet d'accepter en plus un ancien couple en-tête/variable
* le temps qu'une tâche déjà planifiée soit basculée, sans laisser de trou :
* ces couples sont eux aussi de vrais secrets serveur.
*/
function refuseJobRequest(request, secretsHerites = [], repliPublicTemporaire = false) {
	const valeursAcceptees = [
		process.env[CRON_SECRET_ENV],
		process.env["LOVABLE_CRON_SECRET_PREVIOUS"],
		process.env["CRON_SECRET"]
	].filter((v) => Boolean(v));
	const attendus = secretsHerites.map((couple) => ({
		header: couple.header,
		valeur: process.env[couple.env]
	})).filter((couple) => Boolean(couple.valeur));
	if (valeursAcceptees.length === 0 && attendus.length === 0 && !repliPublicTemporaire) {
		console.error(`[tâche planifiée] ${CRON_SECRET_ENV} n'est pas définie : tout appel est refusé.`);
		return json({ error: `Tâche non configurée : définir ${CRON_SECRET_ENV} côté serveur.` }, 503);
	}
	const ip = clientIp(request);
	if (tropDAppels(ip)) return json({ error: "Trop d'appels, réessayez dans une minute." }, 429);
	const bearer = /^Bearer ([^\s,]+)$/.exec(request.headers.get("authorization") ?? "")?.[1];
	const fournis = [request.headers.get(CRON_SECRET_HEADER), bearer].filter((v) => typeof v === "string" && v.length > 0);
	/**
	* REPLI TEMPORAIRE — À SUPPRIMER À LA BASCULE NETLIFY.
	*
	* Le durcissement de l'authentification a mis le rafraîchissement horaire des
	* prix à l'arrêt : aucun des secrets attendus n'est présent à l'exécution sur
	* la plateforme, et l'endpoint refusait donc tout en 503. Le planificateur, lui,
	* n'est pas modifiable depuis le code.
	*
	* On réaccepte donc la clé publiable, en connaissance de cause et pour ce seul
	* endpoint : elle est lisible dans le bundle client, ce n'est pas une
	* protection. C'est une dette assumée le temps de la migration, pas une
	* solution. Sur Netlify, les tâches deviennent des fonctions planifiées non
	* appelables par URL et tout ce mécanisme disparaît.
	*/
	const clePubliable = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"] ?? "";
	const repliAccepte = repliPublicTemporaire && clePubliable.length > 0 && memeSecret(request.headers.get("apikey") ?? "", clePubliable);
	const autorise = fournis.some((fourni) => valeursAcceptees.some((valeur) => memeSecret(fourni, valeur))) || attendus.some((couple) => {
		const fourni = request.headers.get(couple.header);
		return typeof fourni === "string" && memeSecret(fourni, couple.valeur);
	}) || repliAccepte;
	if (repliAccepte) console.warn("[tâche planifiée] autorisée par le repli sur la clé publiable — dette temporaire, à retirer à la bascule Netlify.");
	if (!autorise) {
		console.error(`[tâche planifiée] secret invalide depuis ${ip}`);
		return json({ error: "Unauthorized" }, 401);
	}
	return null;
}
//#endregion
export { refuseJobRequest };
