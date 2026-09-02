import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentProvider } from "@/lib/cookie-consent-context";
import { HabillageProvider, useHabillage } from "@/lib/habillage-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { ThemeProvider } from "@/lib/theme-context";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

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
        {/* Permet de relayer l'erreur exacte sans outil de débogage distant
            (utile notamment sur mobile, où la console n'est pas accessible). */}
        <details className="mt-6 text-left text-xs text-muted-foreground">
          <summary className="cursor-pointer text-center">Détails techniques</summary>
          <pre className="mt-2 max-h-[40vh] overflow-auto whitespace-pre-wrap break-words rounded-md bg-secondary p-3">
            {error.message}
            {error.stack ? `\n\n${error.stack.slice(0, 1200)}` : ""}
          </pre>
        </details>
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
      { name: "theme-color", content: "#0069c8" },
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

// Le script d’affiliation Stay22 (letmeallez.js) ne vit plus ici : injecté
// depuis la racine, il se chargeait sur TOUTES les pages, y compris celles
// sans carte d’hébergement, pour y poser du suivi et réécrire des liens. Il est
// désormais chargé par <Stay22Map>, donc uniquement là où une carte existe et
// seulement quand elle entre dans le champ de vision.

/**
 * Pages servies sans habillage : ni en-tête, ni barre d'onglets, ni pied de page.
 *
 * Une page d'atterrissage payée au clic n'a qu'une action, et chaque élément de
 * navigation autour est une façon de ne pas la faire. Ces pages dessinent donc
 * leur écran en entier, y compris leur logo.
 *
 * Le chemin ne donne que l'état de DÉPART : la page peut redemander l'habillage
 * une fois son action accomplie (voir habillage-context). C'est ce sens-là —
 * défaut masqué, révélation explicite — qui permet au serveur de rendre la page
 * déjà nue, sans en-tête qui clignote à l'hydratation.
 */
const PAGES_NUES = new Set(["/tiktok"]);

/** Insensible au « / » final : /tiktok et /tiktok/ sont la même page. */
function estPageNue(chemin: string): boolean {
  const sansSlash = chemin.length > 1 && chemin.endsWith("/") ? chemin.slice(0, -1) : chemin;
  return PAGES_NUES.has(sansSlash);
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CurrencyProvider>
          <CookieConsentProvider>
            <HabillageProvider>
              <Habillage />
            </HabillageProvider>
          </CookieConsentProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/**
 * L'habillage lui-même. Composant distinct de RootComponent parce qu'un
 * composant ne peut pas lire un contexte qu'il fournit dans le même rendu.
 */
function Habillage() {
  const nueParDefaut = useRouterState({ select: (s) => estPageNue(s.location.pathname) });
  const { revele } = useHabillage();
  const nue = nueParDefaut && !revele;

  return (
    <>
      {nue ? (
        /* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */
        <Outlet />
      ) : (
        /*
                La barre d'onglets du bas est en position fixe sous lg : sans
                cette marge, elle recouvre la fin de page, pied de page compris.
                57px = 56 de zone tactile + 1 de bordure haute. La valeur ronde
                laissait le pied de page passer d'un pixel sous la barre,
                mesure à l'appui.
              */
        <div className="flex min-h-screen flex-col pb-[calc(57px+env(safe-area-inset-bottom))] lg:pb-0">
          <Header />
          <main className="flex-1">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>
          <Footer />
        </div>
      )}
      {/*
              Pas de bandeau cookies sur une page nue : il ne porte que le
              consentement aux cartes Stay22, qui ne s'y chargent pas. Demander
              un accord pour un tiers absent mangerait le seul écran disponible
              sans rien protéger. Le choix reste à faire, et le bandeau
              réapparaît à la première page qui en dépose vraiment.
            */}
      {!nue && <CookieBanner />}
      <Toaster />
    </>
  );
}
