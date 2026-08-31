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
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { DESTINATIONS } from "@/data/destinations";
import { getDestinationImage } from "@/lib/destination-images";
import { cheapestDestinations } from "@/lib/flights.functions";
import { dateOr, iataOr, numberOr } from "@/lib/search-params";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const HOME_CODES = [
  "RAK", "LIS", "BCN", "IST", "ROM", "ATH", "MAD", "PRG", "BUD", "OPO", "CMN", "NYC",
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
    title: "Le prix total, dès la première ligne",
    text: "Taxes et frais obligatoires sont déjà inclus dans le prix affiché. Pas de tarif d'appel qui gonfle au moment de payer.",
  },
  {
    icon: Store,
    title: "Vous savez toujours qui vous vend le billet",
    text: "Chaque résultat indique le vendeur réel — la compagnie ou l'agence nommée — et le bouton ouvre son lien de réservation en un clic, sans comparateur intermédiaire caché ni page de captation.",
  },
  {
    icon: EyeOff,
    title: "Zéro dark pattern",
    text: "Aucun faux compte à rebours, aucun « plus que 2 places à ce prix », aucune mise en avant payante dans le classement. Vous décidez à votre rythme.",
  },
  {
    icon: ShieldCheck,
    title: "Notre rémunération est expliquée",
    text: "Nous touchons une commission d'affiliation si vous réservez, sans surcoût pour vous. C'est écrit noir sur blanc.",
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
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/35 via-background/15 to-background/45" aria-hidden />
        <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-16">
          <div className="rounded-2xl bg-gradient-to-br from-background/95 via-background/90 to-background/70 p-6 lg:p-8 shadow-sm">
            <h1 className="hero-in hero-in-1 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Trouvez un vol pas cher sans mauvaise surprise au moment de payer
            </h1>
            <div className="hero-in hero-in-2">
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                TrouveMonVol compare les prix des vols en affichant le montant total taxes incluses et le
                nom du vendeur réel du billet. Vous pouvez aussi partir de votre budget : indiquez la
                somme que vous voulez dépenser et découvrez toutes les destinations accessibles depuis
                votre ville.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li>• Dates flexibles ± 3 jours pour repérer le jour le moins cher</li>
                <li>• Vue calendrier des prix du mois, en un coup d'œil</li>
                <li>• Alerte email gratuite quand le prix baisse, sans créer de compte</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/mode-budget"
                  search={{ origin: "PAR", budget: 400, month: "" }}
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

      <section className="container-page py-14">
        <h2 className="font-display text-2xl font-semibold">
          Où partir au départ de Paris, du moins cher au plus cher
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Prix les plus bas relevés récemment pour un aller simple, taxes incluses. Cliquez sur une
          destination pour voir les vols et le vendeur de chaque billet.
        </p>
        <div className="mt-6">
          <DestinationPriceGrid prices={prices} origin="PAR" error={error} />
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 py-14">
        <div className="container-page">
          <h2 className="font-display text-2xl font-semibold">Pourquoi passer par nous</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            La plupart des comparateurs vivent de l'urgence artificielle et du classement payant. Nous avons
            fait le choix inverse : une information complète, vérifiable, et un chemin de réservation le
            plus court possible.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {REASONS.map((reason) => (
              <div key={reason.title} className="rounded-xl border border-border bg-card p-5">
                <reason.icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-3 text-base font-semibold">{reason.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{reason.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="font-display text-2xl font-semibold">Nos pages destinations</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Chaque page détaille la meilleure période pour partir, l'évolution des prix sur douze mois et
          les questions les plus fréquentes sur le trajet.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d) => {
            const image = getDestinationImage(d.destination, d.destinationCity, d.country);
            return (
              <li key={d.slug}>
                <Link
                  to="/vols/$slug"
                  params={{ slug: d.slug }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
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
    </div>
  );
}
