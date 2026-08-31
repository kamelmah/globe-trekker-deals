import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentProvider, useMapsConsent } from "@/lib/cookie-consent-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { ThemeProvider } from "@/lib/theme-context";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { STAY22_LMA_ID } from "@/components/stay/Stay22Map";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  // Frontière d'erreur CÔTÉ CLIENT (transition SPA qui échoue) : distincte du
  // fallback serveur dans error-page.ts, mais volontairement le même texte,
  // pour que l'utilisateur voie un seul et même message quel que soit le cas.
  console.error("Erreur de rendu client (ErrorComponent racine)", error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Cette page n'a pas pu se charger
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Une erreur est survenue de notre côté. Essayez de recharger la page ou retournez à
          l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "TrouveMonVol" },
      {
        name: "google-site-verification",
        content: "KKsNIWH1YJpMl4i0VxQsvpNVUQ_j43QbYM3GIkAHD4g",
      },
      { name: "theme-color", content: "#1b6fd0" },
      { name: "apple-mobile-web-app-title", content: "TrouveMonVol" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "application-name", content: "TrouveMonVol" },
      { name: "mobile-web-app-capable", content: "yes" },
      { property: "og:site_name", content: "TrouveMonVol" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/icons/icon-16.png", type: "image/png", sizes: "16x16" },
      { rel: "icon", href: "/icons/icon-48.png", type: "image/png", sizes: "48x48" },
      { rel: "icon", href: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "icon", href: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [
      {
        // Bloquant, avant tout rendu : applique le thème mémorisé (ou la
        // préférence système à défaut) pour éviter un flash clair→sombre.
        children:
          "(function(){try{var t=localStorage.getItem('tmv-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();",
      },
      {

        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: absoluteUrl("/icons/icon-512.png"),
          description:
            "Comparateur de vols transparent : prix total taxes incluses et vendeur réel affiché sur chaque résultat.",
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Stay22AffiliateScript() {
  // Cookie tiers optionnel (voir /cookies) : ce script ne doit jamais être
  // injecté avant un accord explicite pour la catégorie "Cartes Stay22".
  const mapsConsent = useMapsConsent();

  useEffect(() => {
    if (!mapsConsent) return;
    const w = window as typeof window & { Stay22?: { params?: Record<string, string> } };
    if (document.getElementById("stay22-letmeallez")) return;
    w.Stay22 = w.Stay22 || {};
    w.Stay22.params = { lmaID: STAY22_LMA_ID };
    const script = document.createElement("script");
    script.id = "stay22-letmeallez";
    script.async = true;
    script.src = "https://scripts.stay22.com/letmeallez.js";
    document.head.appendChild(script);
  }, [mapsConsent]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CurrencyProvider>
          <CookieConsentProvider>
            <Stay22AffiliateScript />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                <Outlet />
              </main>
              <Footer />
            </div>
            <CookieBanner />
            <Toaster />
          </CookieConsentProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

