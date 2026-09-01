import { Link, createFileRoute } from "@tanstack/react-router";
import { BadgeEuro, EyeOff, Map as MapIcon, ShieldCheck, Store } from "lucide-react";

import heroSky from "@/assets/hero-sky.jpg";
import heroSkyWebp from "@/assets/hero-sky.webp";
import heroSky640 from "@/assets/hero-sky-640.jpg";
import heroSky640Webp from "@/assets/hero-sky-640.webp";
import heroSky960 from "@/assets/hero-sky-960.jpg";
import heroSky960Webp from "@/assets/hero-sky-960.webp";
import heroSky1280 from "@/assets/hero-sky-1280.jpg";
import heroSky1280Webp from "@/assets/hero-sky-1280.webp";

// Le hero occupe toujours 100 % de la largeur d'écran : un mobile ne doit
// jamais télécharger la version 1920px destinée au grand écran.
const HERO_SRCSET = `${heroSky640} 640w, ${heroSky960} 960w, ${heroSky1280} 1280w, ${heroSky} 1920w`;
const HERO_WEBP_SRCSET = `${heroSky640Webp} 640w, ${heroSky960Webp} 960w, ${heroSky1280Webp} 1280w, ${heroSkyWebp} 1920w`;

import { SearchForm } from "@/components/search/SearchForm";
import { DestinationPriceGrid } from "@/components/flights/DestinationPriceGrid";
import { PriceRefreshStatus } from "@/components/flights/PriceRefreshStatus";
import { HOME_DESTINATION_CODES } from "@/lib/price-refresh.shared";
import { Reveal } from "@/components/site/Reveal";
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { DESTINATIONS } from "@/data/destinations";
import { PRUNED_ROUTE_SLUGS, withoutPruned } from "@/data/pruned-pages";
import { routesFrom, type RouteFamily } from "@/data/route-whitelist";
import { getDestinationImage } from "@/lib/destination-images";
import { cheapestDestinations } from "@/lib/flights.functions";
import { dateOr, iataOr, numberOr } from "@/lib/search-params";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const HOME_CODES = HOME_DESTINATION_CODES;

/** Marseille est le départ de référence du site : il est mis en avant sur l'accueil. */
const MARSEILLE_ROUTES = [...routesFrom("MRS")].sort((a, b) =>
  a.destinationCity.localeCompare(b.destinationCity, "fr"),
);

const MARSEILLE_FAMILIES: [RouteFamily, string][] = [
  ["maghreb", "Maghreb"],
  ["europe-sud", "Europe du Sud et îles"],
  ["france-corse", "France et Corse"],
  ["turquie-orient", "Turquie, Égypte et Proche-Orient"],
  ["europe-nord-est", "Europe du Nord et de l'Est"],
];

const TITLE = "TrouveMonVol — comparateur de vols transparent, prix total et vendeur affiché";
const DESCRIPTION =
  "Comparez les vols au prix total taxes incluses, avec le nom du vendeur réel sur chaque résultat. Recherche par budget, dates flexibles ± 3 jours, alertes prix gratuites.";

type HomeSearch = {
  origin?: string;
  destination?: string;
  depart?: string;
  retour?: string;
  budget?: number;
  flexible?: boolean;
  adultes?: number;
  enfants?: number;
  bebes?: number;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const clamp = (v: unknown, min: number, max: number, fallback: number) => {
      const n = Math.round(numberOr(v, fallback));
      return Math.min(max, Math.max(min, n));
    };
    return {
      origin: search["origin"] ? iataOr(search["origin"], "PAR") : "",
      destination: search["destination"] ? iataOr(search["destination"], "") : "",
      depart: dateOr(search["depart"], ""),
      retour: dateOr(search["retour"], ""),
      budget: Math.max(0, Math.round(numberOr(search["budget"], 0))),
      flexible: numberOr(search["flexible"], 1) === 1,
      adultes: clamp(search["adultes"], 1, 9, 1),
      enfants: clamp(search["enfants"], 0, 8, 0),
      bebes: clamp(search["bebes"], 0, 8, 0),
    };
  },
  loader: async () => {
    try {
      const { prices, error } = await cheapestDestinations({
        data: { origin: "PAR", destinations: HOME_CODES },
      });
      return { prices, error };
    } catch {
      return {
        prices: [],
        error: "Les prix ne sont pas disponibles pour le moment. Réessayez dans quelques instants.",
      };
    }
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "TrouveMonVol",
          url: SITE_URL,
          inLanguage: "fr-FR",
          description: DESCRIPTION,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/recherche?origin=PAR&destination={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: HomePage,
});

const REASONS = [
  {
    icon: BadgeEuro,
    title: "Ce que vous voyez, c'est ce que vous payez",
    text: "Taxes et frais obligatoires sont déjà inclus dans le prix affiché. Pas de tarif d'appel qui gonfle au moment de payer.",
  },
  {
    icon: Store,
    title: "Vous savez toujours à qui vous parlez",
    text: "Chaque résultat indique le vendeur réel — la compagnie ou l'agence nommée — et le bouton ouvre son lien de réservation en un clic, sans comparateur intermédiaire caché ni page de captation.",
  },
  {
    icon: EyeOff,
    title: "On ne vous met jamais la pression",
    text: "Aucun faux compte à rebours, aucun « plus que 2 places à ce prix », aucune mise en avant payante dans le classement. Vous décidez à votre rythme.",
  },
  {
    icon: ShieldCheck,
    title: "Notre commission ? Écrite noir sur blanc",
    text: "Nous touchons une commission d'affiliation si vous réservez, sans surcoût pour vous.",
  },
];

function HomePage() {
  const { prices, error } = Route.useLoaderData();
  const prefill = Route.useSearch();

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-border bg-sky-soft">
        <ResponsivePicture
          src={heroSky}
          webp={heroSkyWebp}
          srcSet={HERO_SRCSET}
          webpSrcSet={HERO_WEBP_SRCSET}
          sizes="100vw"
          alt="Aile d'avion au-dessus d'une mer de nuages au lever du soleil"
          width={1920}
          height={1080}
          className="hero-parallax-img absolute inset-0 -z-10 size-full object-cover"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-background/35 via-background/15 to-background/45"
          aria-hidden
        />
        <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-16">
          <div className="rounded-2xl bg-gradient-to-br from-background/95 via-background/90 to-background/70 p-6 lg:p-8 shadow-sm">
            <h1 className="hero-in hero-in-1 font-display leading-tight">
              Le prix que vous voyez est celui que vous payez
            </h1>
            <div className="hero-in hero-in-2">
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                Taxes incluses, vendeur affiché, aucune surprise à la caisse. TrouveMonVol compare
                les vols au prix total réel — ou partez de votre budget : indiquez la somme que vous
                voulez dépenser et découvrez toutes les destinations accessibles depuis votre ville.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li>• Dates flexibles ± 3 jours pour repérer le jour le moins cher</li>
                <li>• Vue calendrier des prix du mois, en un coup d'œil</li>
                <li>• Alerte email gratuite quand le prix baisse, sans créer de compte</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/mode-budget"
                  search={{
                    origin: "PAR",
                    budget: 400,
                    month: "",
                    adultes: 1,
                    enfants: 0,
                    bebes: 0,
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  <MapIcon className="size-4 text-primary" aria-hidden />
                  Explorer la carte du monde par budget
                </Link>
              </div>
            </div>
          </div>

          <div id="recherche" className="hero-in hero-in-3 scroll-mt-24">
            <SearchForm
              key={`${prefill.origin}-${prefill.destination}-${prefill.depart}-${prefill.budget}`}
              initialOrigin={prefill.origin || "PAR"}
              initialDestination={prefill.destination ?? ""}
              {...(prefill.depart ? { initialDepart: prefill.depart } : {})}
              initialRetour={prefill.retour ?? ""}
              initialBudget={prefill.budget ? String(prefill.budget) : ""}
              initialFlexible={prefill.flexible ?? true}
              initialPassengers={{
                adults: prefill.adultes ?? 1,
                children: prefill.enfants ?? 0,
                infants: Math.min(prefill.bebes ?? 0, prefill.adultes ?? 1),
              }}
            />
          </div>
        </div>
      </section>

      <Reveal>
        <section className="container-page py-14">
          <h2 className="font-display">Où partir au départ de Paris, du moins cher au plus cher</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Prix les plus bas relevés récemment pour un aller simple, taxes incluses. Cliquez sur
            une destination pour voir les vols et le vendeur de chaque billet.
          </p>
          <div className="mt-6">
            <DestinationPriceGrid prices={prices} origin="PAR" error={error} />
            <PriceRefreshStatus />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-y border-border bg-secondary/40 py-14">
          <div className="container-page">
            <h2 className="font-display">Pourquoi passer par nous</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              La plupart des comparateurs vivent de l'urgence artificielle et du classement payant.
              Nous avons fait le choix inverse : une information complète, vérifiable, et un chemin
              de réservation le plus court possible.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {REASONS.map((reason) => (
                <div key={reason.title} className="rounded-xl border border-border bg-card p-5">
                  <reason.icon className="size-5 text-primary" aria-hidden />
                  <h3 className="mt-3">{reason.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{reason.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Marseille est l'aéroport de référence du site : il passe avant le reste. */}
      <Reveal>
        <section className="container-page py-14">
          <h2 className="font-display">Vols au départ de Marseille</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {MARSEILLE_ROUTES.length} liaisons au départ de Marseille Provence, toutes vérifiées
            comme réellement desservies — en vol direct, sauf mention d'escale. Prix total taxes
            incluses et vendeur affiché, comme partout sur le site.
          </p>
          {MARSEILLE_FAMILIES.map(([family, label]) => {
            const routes = MARSEILLE_ROUTES.filter((route) => route.family === family);
            if (routes.length === 0) return null;
            return (
              <div key={family} className="mt-6">
                <h3 className="text-sm font-semibold text-muted-foreground">{label}</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {routes.map((route) => (
                    <li key={route.slug}>
                      <Link
                        to="/vols/$slug"
                        params={{ slug: route.slug }}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-secondary"
                      >
                        <span className="font-medium">{route.destinationCity}</span>
                        {!route.nonstop && (
                          <span className="text-xs text-muted-foreground">avec escale</span>
                        )}
                        {route.validation.minPriceEur !== null && (
                          <span className="text-xs text-primary">
                            dès {route.validation.minPriceEur} €
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      </Reveal>

      <Reveal>
        <section className="container-page py-14">
          <h2 className="font-display">Nos pages destinations</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Chaque page détaille la meilleure période pour partir, l'évolution des prix sur douze
            mois et les questions les plus fréquentes sur le trajet.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {withoutPruned(DESTINATIONS, PRUNED_ROUTE_SLUGS).map((d) => {
              const image = getDestinationImage(d.destination, d.destinationCity, d.country);
              return (
                <li key={d.slug}>
                  <Link
                    to="/vols/$slug"
                    params={{ slug: d.slug }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary"
                  >
                    <ResponsivePicture
                      src={image.thumb}
                      webp={image.thumbWebp}
                      alt={image.alt}
                      loading="lazy"
                      width={128}
                      height={96}
                      className="size-16 shrink-0 rounded-lg object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        Vols pas chers {d.originCity} — {d.destinationCity}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {d.country} · {d.bestMonths}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </Reveal>
    </div>
  );
}
