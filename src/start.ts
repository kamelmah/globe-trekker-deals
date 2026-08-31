import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { describeError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

/** Les routes /lovable/* s'authentifient elles-mêmes : aucun middleware ne doit les intercepter. */
function isLovableRoute(request: Request): boolean {
  return new URL(request.url).pathname.startsWith("/lovable/");
}

const errorMiddleware = createMiddleware().server(async ({ next, request }) => {
  if (isLovableRoute(request)) {
    return next();
  }
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(describeError(error)), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) =>
    ctx.handlerType === "serverFn" && !isLovableRoute(ctx.request),
});

// attachSupabaseAuth (scaffold Lovable, voir integrations/supabase/auth-attacher.ts)
// retiré : aucune fonction serveur ne consomme le jeton qu'il attache (aucune
// n'utilise requireSupabaseAuth, le site n'a pas de compte visiteur), mais il
// s'exécutait quand même sur CHAQUE appel de fonction serveur déclenché
// côté client. Il accède au client Supabase public (integrations/supabase/client.ts)
// qui lève une exception si VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY
// ne sont pas présents dans le bundle — ce qui plantait alors TOUTE navigation
// SPA vers une page appelant une fonction serveur (dont chaque page destination).
export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
