//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function escapeHtml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
/**
* `details`, si fourni, s'affiche dans un bloc repliable "Détails techniques" —
* utile pour qu'un visiteur (ou nous) puisse copier/photographier l'erreur
* exacte sans avoir besoin d'un outil de débogage distant.
*/
function renderErrorPage(details) {
	return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Cette page n'a pas pu se charger</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
      .tech { margin-top: 1.5rem; text-align: left; font-size: 0.75rem; color: #6b7280; }
      .tech summary { cursor: pointer; text-align: center; }
      .tech pre { white-space: pre-wrap; word-break: break-word; background: #f3f4f6; border-radius: 0.375rem; padding: 0.75rem; margin-top: 0.5rem; max-height: 40vh; overflow: auto; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Cette page n'a pas pu se charger</h1>
      <p>Une erreur est survenue de notre côté. Essayez de recharger la page ou retournez à l'accueil.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Réessayer</button>
        <a class="secondary" href="/">Retour à l'accueil</a>
      </div>
      ${details ? `<details class="tech">
        <summary>Détails techniques</summary>
        <pre>${escapeHtml(details.slice(0, 1200))}</pre>
      </details>` : ""}
    </div>
  </body>
</html>`;
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-BAs2PgB6.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	const captured = consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`);
	console.error(captured);
	return new Response(renderErrorPage(describeError(captured)), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
/**
* Pages dont le HTML est identique pour tous les visiteurs, donc cachables par
* le CDN.
*
* Ce qui varie d'un lecteur à l'autre — devise, thème — est appliqué côté client
* après hydratation : le document rendu par le serveur ne dépend que de l'URL.
* Sans en-tête explicite, TanStack Start renvoie `no-cache, must-revalidate,
* max-age=0` et chaque visite repart jusqu'à l'origine.
*/
var CACHEABLE_PATHS = [
	/^\/$/,
	/^\/vols\//,
	/^\/conseils(\/|$)/,
	/^\/comparatifs(\/|$)/,
	/^\/mode-budget$/,
	/^\/faq$/,
	/^\/contact$/,
	/^\/indemnisation$/,
	/^\/hebergement$/,
	/^\/mentions-legales$/,
	/^\/cgu$/,
	/^\/confidentialite$/,
	/^\/cookies$/
];
/**
* Fraîcheur côté CDN, volontairement courte : ces pages portent des prix
* relevés. `stale-while-revalidate` sert instantanément la version d'il y a
* quelques minutes pendant que la suivante se régénère en arrière-plan. Le
* navigateur revalide à chaque visite (`max-age=0`) pour ne jamais conserver
* localement une page devenue obsolète.
*/
var EDGE_CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=3600";
function withEdgeCache(request, response) {
	if (request.method !== "GET" || response.status !== 200) return response;
	if (response.headers.has("set-cookie")) return response;
	if (!response.headers.get("content-type")?.includes("text/html")) return response;
	const existant = response.headers.get("cache-control");
	if (existant && !/no-cache|no-store|must-revalidate/.test(existant)) return response;
	const { pathname } = new URL(request.url);
	if (!CACHEABLE_PATHS.some((re) => re.test(pathname))) return response;
	const headers = new Headers(response.headers);
	headers.set("Cache-Control", EDGE_CACHE);
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}
var server_default = { async fetch(request, env, ctx) {
	try {
		return withEdgeCache(request, await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx)));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(describeError(error)), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, describeError as n, renderErrorPage as t };
