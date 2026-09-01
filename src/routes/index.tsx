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
import { FaqAccordion, type FaqItem } from "@/components/site/FaqAccordion";
import { Reveal } from "@/components/site/Reveal";
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { DESTINATIONS } from "@/data/destinations";
import { PRUNED_ROUTE_SLUGS, withoutPruned } from "@/data/pruned-pages";
import { routesFrom, type RouteFamily } from "@/data/route-whitelist";
import { getDestinationImage } from "@/lib/destination-images";
import { hreflangLinks } from "@/lib/hreflang";
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

/** Le parcours réel, écrit en clair : ce que fait le site, dans l'ordre. */
const HOME_STEPS = [
  {
    title: "Vous dites ce que vous cherchez",
    text: "Une destination précise, ou seulement un budget et une période. Les dates flexibles à ± 3 jours suffisent souvent à faire varier le prix du simple au double sur un même trajet.",
  },
  {
    title: "Nous interrogeons les vendeurs",
    text: "Compagnies et agences en ligne remontent leurs tarifs. Chaque offre arrive avec son prix total, taxes et frais obligatoires compris, et le nom du vendeur qui la propose.",
  },
  {
    title: "Chaque prix arrive daté",
    text: "Un tarif relevé il y a moins d'une heure est signalé comme tel. Au-delà de 24 h, il est présenté comme une estimation et non comme un prix ferme : c'est le vendeur qui l'a daté, pas nous.",
  },
  {
    title: "Vous réservez chez le vendeur",
    text: "Le bouton ouvre la page du vendeur nommé sur l'offre. Nous ne vendons pas de billets et n'encaissons aucun paiement : notre commission vient du vendeur, sans surcoût pour vous ni effet sur le classement.",
  },
];

/**
 * FAQ de l'accueil.
 *
 * Elle porte sur le fonctionnement du service, là où celle des pages
 * destinations porte sur un trajet : aucune question n'est dupliquée d'une
 * page à l'autre. Le même tableau alimente l'affichage et le balisage JSON-LD,
 * pour qu'ils ne puissent pas diverger.
 */
const HOME_FAQ: FaqItem[] = [
  {
    question: "TrouveMonVol est-il gratuit ?",
    answer:
      "Oui. Nous ne prenons aucun frais de service et n'ajoutons rien au tarif du vendeur. Notre rémunération est une commission d'affiliation versée par le vendeur lorsqu'une réservation aboutit, sans surcoût pour vous. Elle ne modifie jamais l'ordre des résultats, classés par prix.",
  },
  {
    question: "Le prix affiché est-il vraiment le prix final ?",
    answer:
      "C'est le prix total : taxes et frais obligatoires sont déjà inclus, sans tarif d'appel qui gonfle au paiement. Deux réserves que nous préférons écrire plutôt que taire — certains revendeurs ajoutent des frais de service au moment de payer, et le bagage en soute n'est presque jamais compris dans les tarifs les plus bas.",
  },
  {
    question: "À quelle fréquence les prix sont-ils mis à jour ?",
    answer:
      "Environ une fois par heure en journée, avec des intervalles plus longs la nuit ; la cadence réellement mesurée est affichée en bas de la page de résultats. Mais la date qui compte est celle du vendeur : c'est lui qui a daté son tarif, et aucune actualisation de notre côté ne peut la rajeunir. C'est cette date-là que porte chaque prix.",
  },
  {
    question: "Les bagages sont-ils inclus dans le prix ?",
    answer:
      "Rarement sur les tarifs les plus bas. Quand la compagnie publie son barème, nous affichons deux prix : le tarif de base et le tarif avec bagage en soute. Quand elle ne le publie pas, nous le disons au lieu de deviner. Un filtre en tête des résultats permet de ne garder que les offres dont le bagage est documenté.",
  },
  {
    question: "Chez qui est-ce que je réserve ?",
    answer:
      "Jamais chez nous : nous ne vendons pas de billets. Chaque offre porte le nom du vendeur et sa nature — vente directe par la compagnie, ou agence en ligne — avec un lien pour consulter les avis le concernant avant de réserver. Dans les faits, la grande majorité des tarifs les plus bas passent par des agences.",
  },
  {
    question: "Pourquoi certains vols « Paris » partent-ils de Beauvais ?",
    answer:
      "Parce que les compagnies à bas coût vendent Beauvais sous le libellé Paris, alors que l'aéroport est à 85 km du centre et impose une navette, en temps comme en budget. Nous affichons l'aéroport réel sur chaque offre et signalons ces aéroports secondaires, à Paris comme à Milan, Bruxelles ou Barcelone. Un filtre permet de s'en tenir à Roissy et Orly.",
  },
  {
    question: "Puis-je être prévenu quand le prix baisse ?",
    answer:
      "Oui, gratuitement. Vous créez une alerte sur un trajet et une date, et vous recevez un e-mail dès qu'un tarif passe sous celui relevé au moment de la création. Chaque message contient un lien de désinscription en un clic.",
  },
];

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
  /**
   * N'émet QUE les paramètres réellement présents dans l'URL.
   *
   * Renvoyer une valeur par défaut pour chaque clé faisait réécrire l'URL par
   * le routeur : `/` répondait 307 vers
   * `/?origin=&destination=&depart=&retour=&budget=0&flexible=true&…`. Chaque
   * visite de la page d'accueil payait donc un aller-retour réseau complet
   * avant même de recevoir un octet de HTML — et une 307 ne se met pas en cache
   * en edge, ce qui privait la page la plus visitée du site de tout cache CDN.
   *
   * Les valeurs par défaut sont appliquées à la lecture (voir `prefill`), pas
   * écrites dans l'URL.
   */
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const clamp = (v: unknown, min: number, max: number, fallback: number) => {
      const n = Math.round(numberOr(v, fallback));
      return Math.min(max, Math.max(min, n));
    };
    const origin = search["origin"] ? iataOr(search["origin"], "PAR") : "";
    const destination = search["destination"] ? iataOr(search["destination"], "") : "";
    const depart = dateOr(search["depart"], "");
    const retour = dateOr(search["retour"], "");
    const budget = Math.max(0, Math.round(numberOr(search["budget"], 0)));
    return {
      ...(origin ? { origin } : {}),
      ...(destination ? { destination } : {}),
      ...(depart ? { depart } : {}),
      ...(retour ? { retour } : {}),
      ...(budget > 0 ? { budget } : {}),
      ...(search["flexible"] === undefined
        ? {}
        : { flexible: numberOr(search["flexible"], 1) === 1 }),
      ...(search["adultes"] === undefined ? {} : { adultes: clamp(search["adultes"], 1, 9, 1) }),
      ...(search["enfants"] === undefined ? {} : { enfants: clamp(search["enfants"], 0, 8, 0) }),
      ...(search["bebes"] === undefined ? {} : { bebes: clamp(search["bebes"], 0, 8, 0) }),
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
    links: [{ rel: "canonical", href: `${SITE_URL}/` }, ...hreflangLinks(`${SITE_URL}/`)],
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
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: `${SITE_URL}/`,
          inLanguage: "fr",
          mainEntity: HOME_FAQ.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }),
      },
    ],
  }),
  component: HomePage,
});

const REASONS = [
  {
    icon: BadgeEuro,
    // Même raison que pour le H1 : ne pas reformuler ailleurs la garantie de
    // prix qu'on vient de retirer du titre.
    title: "Le montant affiché est le total",
    text: "Taxes et frais obligatoires sont déjà inclus dans le prix affiché : pas de tarif d'appel qui gonfle au moment de payer. Chaque prix porte sa date de relevé, et au-delà de 24 h il est présenté comme une estimation, pas comme un prix ferme.",
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
            {/*
              L'ancien titre — « Le prix que vous voyez est celui que vous
              payez » — promettait une garantie de prix que notre source
              tarifaire ne permet pas de tenir : les tarifs viennent des
              vendeurs et peuvent bouger entre le relevé et le clic. Ce que nous
              pouvons réellement garantir, c'est ce que le titre décrit
              maintenant : le montant affiché est le total taxes comprises, et
              le vendeur est nommé.
            */}
            <h1 className="hero-in hero-in-1 font-display leading-tight">
              Prix total, taxes incluses, vendeur affiché
            </h1>
            <div className="hero-in hero-in-2">
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                Pas de tarif d'appel ni de frais découverts au paiement : le montant que nous
                affichons est le total, et vous savez chez qui vous réservez. Chaque prix porte sa
                date de relevé — ou partez de votre budget et découvrez toutes les destinations
                accessibles depuis votre ville.
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
          <h2 className="font-display">Comment ça marche</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Quatre étapes, sans compte à créer et sans paiement chez nous.
          </p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_STEPS.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-border bg-card p-5">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

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
      <Reveal>
        <section className="container-page pb-14">
          <h2 className="font-display">Questions fréquentes</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Ce qu'on nous demande le plus souvent sur le fonctionnement du comparateur. Les
            questions propres à un trajet sont traitées sur chaque page destination.
          </p>
          <div className="mt-6 max-w-3xl">
            <FaqAccordion items={HOME_FAQ} />
          </div>
        </section>
      </Reveal>
    </div>
  );
}
