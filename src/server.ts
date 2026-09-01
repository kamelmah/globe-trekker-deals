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
 * Pages dont le HTML est identique pour tous les visiteurs, donc cachables par
 * le CDN.
 *
 * Ce qui varie d'un lecteur à l'autre — devise, thème — est appliqué côté client
 * après hydratation : le document rendu par le serveur ne dépend que de l'URL.
 * Sans en-tête explicite, TanStack Start renvoie `no-cache, must-revalidate,
 * max-age=0` et chaque visite repart jusqu'à l'origine.
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

/**
 * Fraîcheur côté CDN, volontairement courte : ces pages portent des prix
 * relevés. `stale-while-revalidate` sert instantanément la version d'il y a
 * quelques minutes pendant que la suivante se régénère en arrière-plan. Le
 * navigateur revalide à chaque visite (`max-age=0`) pour ne jamais conserver
 * localement une page devenue obsolète.
 */
const EDGE_CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=3600";

function withEdgeCache(request: Request, response: Response): Response {
  if (request.method !== "GET" || response.status !== 200) return response;
  // Une réponse qui pose un cookie est propre à un visiteur : la mettre en
  // cache partagé la servirait à tout le monde.
  if (response.headers.has("set-cookie")) return response;
  if (!response.headers.get("content-type")?.includes("text/html")) return response;
  // Une route ayant déjà choisi sa politique de cache garde la sienne.
  const existant = response.headers.get("cache-control");
  if (existant && !/no-cache|no-store|must-revalidate/.test(existant)) return response;

  const { pathname } = new URL(request.url);
  if (!CACHEABLE_PATHS.some((re) => re.test(pathname))) return response;

  const headers = new Headers(response.headers);
  headers.set("Cache-Control", EDGE_CACHE);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withEdgeCache(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(describeError(error)), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
