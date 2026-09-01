import "./lib/error-capture";

import { consumeLastCapturedError, describeError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  const captured = consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`);
  console.error(captured);
  return new Response(renderErrorPage(describeError(captured)), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Pages dont le HTML est identique pour tous les visiteurs, donc partageables
 * entre eux.
 *
 * Ce qui varie d'un lecteur à l'autre — devise, thème, consentement — vit dans
 * le stockage local du navigateur et n'est appliqué qu'après hydratation :
 * aucune de ces pages ne lit de cookie ni d'en-tête de requête pour se rendre.
 * Le document produit par le serveur ne dépend donc que de l'URL.
 */
const CACHEABLE_PATHS = [
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
  /^\/cookies$/,
];

function isCacheablePath(pathname: string): boolean {
  return CACHEABLE_PATHS.some((re) => re.test(pathname));
}

/**
 * Fraîcheur volontairement courte : ces pages portent des prix relevés, et
 * chacun est affiché avec sa date de relevé. Le navigateur revalide à chaque
 * visite (`max-age=0`) pour ne jamais garder localement une page obsolète.
 */
const EDGE_CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=3600";

function withEdgeCache(request: Request, response: Response): Response {
  if (request.method !== "GET" && request.method !== "HEAD") return response;
  if (response.status !== 200) return response;
  // Une réponse qui pose un cookie est propre à un visiteur : la partager la
  // servirait à tout le monde.
  if (response.headers.has("set-cookie")) return response;
  if (!response.headers.get("content-type")?.includes("text/html")) return response;
  // Une route ayant déjà choisi sa politique de cache garde la sienne.
  const existant = response.headers.get("cache-control");
  if (existant && !/no-cache|no-store|must-revalidate/.test(existant)) return response;

  if (!isCacheablePath(new URL(request.url).pathname)) return response;

  const headers = new Headers(response.headers);
  headers.set("Cache-Control", EDGE_CACHE);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Cache tenu par le Worker lui-même.
 *
 * Un Worker Cloudflare qui fabrique sa propre réponse n'est pas mis en cache
 * par l'edge : le code repart de zéro à chaque requête, rendu serveur compris.
 * Et l'en-tête `Cache-Control` qu'on pose ne suffit pas à le déclencher — il
 * est même réécrit en aval (mesuré en production : `no-cache, must-revalidate,
 * max-age=0` alors qu'aucune ligne du bundle serveur ne produit cette valeur).
 *
 * On garde donc le HTML nous-mêmes, via l'API Cache. Sur un succès la réponse
 * repart sans refaire le rendu : c'est là qu'est le gain de TTFB, et il ne
 * dépend d'aucun réglage de tableau de bord.
 *
 * `caches.default` n'existe pas hors de Cloudflare (dev local) et reste sans
 * effet sur un domaine *.workers.dev, d'où le repli silencieux.
 */
type EdgeStore = {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
};

function edgeStore(): EdgeStore | undefined {
  const caches = (globalThis as typeof globalThis & { caches?: { default?: EdgeStore } }).caches;
  return caches?.default;
}

/** Prolonge la vie du Worker le temps d'écrire dans le cache, sans retarder la réponse. */
function enArrierePlan(ctx: unknown, travail: Promise<unknown>): void {
  const waitUntil = (ctx as { waitUntil?: (p: Promise<unknown>) => void } | null)?.waitUntil;
  if (typeof waitUntil === "function") waitUntil.call(ctx, travail);
  else void Promise.resolve(travail).catch(() => {});
}

/** Rend l'état du cache observable de l'extérieur (`curl -i`). */
function marquer(response: Response, etat: "HIT" | "MISS"): Response {
  if (response.status !== 200) return response;
  const headers = new Headers(response.headers);
  headers.set("X-Edge-Cache", etat);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const cachable = request.method === "GET" && isCacheablePath(new URL(request.url).pathname);
      const store = cachable ? edgeStore() : undefined;

      if (store) {
        const trouve = await store.match(request);
        if (trouve) return marquer(trouve, "HIT");
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const finale = withEdgeCache(request, await normalizeCatastrophicSsrResponse(response));

      if (!cachable) return finale;

      const marquee = marquer(finale, "MISS");
      if (store && marquee.headers.get("cache-control") === EDGE_CACHE) {
        // L'API Cache refuse certaines reponses (Vary: *, corps partiel) : un echec
        // d'ecriture ne doit jamais faire tomber la requete en cours.
        enArrierePlan(
          ctx,
          store.put(request, marquee.clone()).catch(() => {}),
        );
      }
      return marquee;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(describeError(error)), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
