import { Link, createFileRoute } from "@tanstack/react-router";
import { BellRing, Compass, Map as MapIcon } from "lucide-react";

import { HomeAlertForm } from "@/components/alerts/HomeAlertForm";
import { SearchForm } from "@/components/search/SearchForm";
import { AvionAnime } from "@/components/site/AvionAnime";
import { Reveal } from "@/components/site/Reveal";
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { Button } from "@/components/ui/button";
import { DestinationGrid } from "@/components/ui/destination-card";
import { TrustBar } from "@/components/ui/trust-bar";
import { CITY_GUIDES, type CityGuide } from "@/data/city-guides";
import { PRUNED_GUIDE_SLUGS, withoutPruned } from "@/data/pruned-pages";
import { routesFrom } from "@/data/route-whitelist";
import { DESTINATIONS } from "@/data/destinations";
import { cityLabel } from "@/data/airports";
import { useCurrency } from "@/lib/currency-context";
import { getDestinationImage, getDestinationPhoto } from "@/lib/destination-images";
import { withPreposition } from "@/lib/french-grammar";
import { hreflangLinks } from "@/lib/hreflang";
import { listPublishedGuides } from "@/lib/published-guides.functions";
import { homeRoutes } from "@/lib/route-pages.functions";
import { dateOr, iataOr, numberOr } from "@/lib/search-params";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

/** Départ proposé par défaut dans les formulaires : le plus recherché. */
const DEFAULT_ORIGIN = "PAR";

/**
 * Nom de la ville d'une origine, pour le titre du bloc.
 *
 * `ROUTES_ORIGIN = "MRS"` et `DEFAULT_ORIGIN = "PAR"` se contredisaient à
 * l'écran : « Les moins chers depuis Marseille » sous un formulaire pré-rempli
 * « Paris ». Une seule origine, détectée, remplace les deux.
 */
function originCityOf(code: string): string {
  const parLaListe = routesFrom(code)[0]?.originCity;
  if (parLaListe) return parLaListe;
  const editoriale = DESTINATIONS.find((d) => d.origin.toUpperCase() === code.toUpperCase());
  return editoriale?.originCity ?? cityLabel(code);
}

/** Paliers de budget proposés en pastilles vers la carte du mode budget. */
const BUDGETS = [50, 100, 150, 250];

/** Search complet attendu par /mode-budget, qui exige ses six clés. */
function budgetSearch(budget: number, origin: string) {
  return { origin, budget, month: "", adultes: 1, enfants: 0, bebes: 0 };
}

const TITLE = "TrouveMonVol — le prix total d'un vol, taxes incluses et vendeur affiché";
const DESCRIPTION =
  "Le prix total avant de cliquer : taxes incluses et nom du vendeur sur chaque offre. Recherche par budget, dates flexibles ± 3 jours, alertes prix gratuites sans compte.";

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
    const origin = search["origin"] ? iataOr(search["origin"], DEFAULT_ORIGIN) : "";
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
  /**
   * Aucun appel à l'API tarifaire : les deux sources sont déjà en base (relevés
   * enregistrés, guides publiés). L'accueil ne consomme plus de quota et ne
   * dépend plus d'un aller-retour Travelpayouts pour s'afficher.
   */
  loader: async ({ context }) => {
    /*
     * L'origine vient de la racine, qui l'a déduite de l'en-tête `x-nf-geo`.
     * Elle remplace les deux constantes qui se contredisaient : « Les moins
     * chers depuis Marseille » sous un formulaire pré-rempli « Paris ».
     */
    const origin = context.origin;
    const [cheapest, publies] = await Promise.all([
      homeRoutes({ data: { origin, limit: 4 } }).catch(() => ({
        routes: [],
      })),
      listPublishedGuides().catch(() => ({ guides: [] as CityGuide[] })),
    ]);
    // Guides rédigés en dur + fiches publiées depuis /destinations-proposes,
    // les plus récemment mis à jour en premier.
    const connus = new Set(CITY_GUIDES.map((guide) => guide.slug));
    const guides = [
      ...withoutPruned(CITY_GUIDES, PRUNED_GUIDE_SLUGS),
      ...publies.guides.filter((guide) => !connus.has(guide.slug)),
    ]
      .sort((a, b) => b.updated.localeCompare(a.updated))
      .slice(0, 3);
    return {
      cheapest: cheapest.routes,
      guides,
      origin,
      // Nom de la ville tel qu'il apparaîtra dans le titre du bloc. Pris sur
      // une route réelle de cette origine, jamais reconstitué depuis le code.
      originCity: originCityOf(origin),
    };
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
    // Le balisage FAQPage a suivi la FAQ elle-même sur /faq : décrire des
    // questions qui ne sont plus visibles ici serait un balisage mensonger.
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
          // L'Organization est déclarée une seule fois, à la racine, donc sur
          // toutes les pages : la redéclarer ici en ferait deux sur l'accueil.
          // Une référence par `@id` suffit à les relier.
          publisher: { "@id": `${SITE_URL}/#organization` },
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { cheapest, guides, origin, originCity } = Route.useLoaderData();
  const prefill = Route.useSearch();
  const { format } = useCurrency();

  return (
    <div>
      {/*
        Héros « recherche d'abord » : pas de photo, un fond entièrement en CSS.
        Le titre et le formulaire restent les deux seuls éléments lourds au
        chargement, donc le LCP est forcément l'un des deux.
      */}
      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <div className="hero-halo pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <AvionAnime />

        <div className="container-page py-12 text-center lg:py-16">
          <h1 className="hero-in hero-in-1 mx-auto max-w-3xl font-display text-[1.875rem] leading-tight sm:text-[2.5rem] lg:text-[3.25rem]">
            Le prix total, avant de cliquer.
          </h1>
          <p className="hero-in hero-in-2 mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Départ, destination, dates : nous comparons les offres réelles des vendeurs et affichons
            le montant taxes incluses, avec le nom du vendeur.
          </p>

          <div
            id="recherche"
            className="hero-in hero-in-3 mx-auto mt-8 max-w-[880px] scroll-mt-24 text-left"
          >
            <SearchForm
              variant="card"
              key={`${prefill.origin}-${prefill.destination}-${prefill.depart}-${prefill.budget}`}
              initialOrigin={prefill.origin || origin}
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

          {/*
            Ces quatre points sont l'argument de vente face aux gros
            comparateurs. Ils tenaient sur une ligne de texte gris, puis en
            pastilles d'un mot : dans les deux cas, la promesse qui différencie
            le site était l'élément le moins lisible du héros. Chacune porte
            désormais sa propre explication.
          */}
          <TrustBar className="mx-auto mt-7 max-w-[880px] text-left" />
        </div>
      </section>

      {/*
        Sur mobile, la bande budget entière serait un mur à faire défiler avant
        d'atteindre les liaisons : elle s'y réduit à cette ligne, sa version
        complète restant aux écrans plus larges.
      */}
      <Link
        to="/mode-budget"
        search={budgetSearch(100, origin)}
        className="flex items-center justify-center gap-2 border-b border-border bg-secondary/40 px-4 py-3 text-sm font-medium sm:hidden"
      >
        <Compass className="size-4 text-highlight" aria-hidden />
        Où partir avec 100 € ?
      </Link>

      {cheapest.length > 0 && (
        <Reveal>
          <section className="container-page py-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display">Envies de départ depuis {originCity}</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Les deux liaisons les moins chères déjà relevées, puis deux idées de séjour
                  relevées cette semaine. Aller simple taxes incluses, chaque montant portant la
                  date de son relevé : ce sont des prix observés, pas des prix garantis.
                </p>
              </div>
              {/* Même destination que « Toutes les destinations depuis
                  Marseille » en pied de page : la carte du mode budget est le
                  seul index complet des liaisons d'un départ. */}
              <Link
                to="/mode-budget"
                search={budgetSearch(400, origin)}
                className="text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                Toutes les liaisons →
              </Link>
            </div>

            <DestinationGrid
              className="mt-6"
              items={cheapest.map((route) => {
                /*
                 * `null` plutôt qu'un visuel générique : sans photo DE CETTE
                 * ville, la carte dessine un dégradé calculé sur son nom. La
                 * grille montrait sinon quatre fois la même image de stock,
                 * une par destination sans photo.
                 */
                const photo = getDestinationPhoto(route.destination, route.city);
                return {
                  city: route.city,
                  country: route.country,
                  price: route.priceEur,
                  priceLabel: format(route.priceEur),
                  seller: route.airline,
                  direct: route.nonstop,
                  // Chaîne vide quand la source n'a pas daté le relevé : la
                  // carte affiche alors « prix observé », jamais une date
                  // inventée.
                  observedAt: route.observedAt ?? "",
                  imageUrl: photo?.thumb ?? null,
                  ...(photo ? { imageAlt: photo.alt } : {}),
                  renderLink: ({ className, children }) => (
                    <Link to="/vols/$slug" params={{ slug: route.slug }} className={className}>
                      {children}
                    </Link>
                  ),
                };
              })}
            />
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="hidden border-y border-border bg-secondary/40 py-14 sm:block">
          <div className="container-page">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-highlight">
              <Compass className="size-4" aria-hidden />
              Pas encore de destination ?
            </p>
            <h2 className="mt-2 font-display">Où partir avec…</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Indiquez seulement un budget : la carte affiche les destinations réellement
              accessibles à ce prix depuis votre ville de départ.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {BUDGETS.map((budget) => (
                <li key={budget}>
                  <Link
                    to="/mode-budget"
                    search={budgetSearch(budget, origin)}
                    className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2 font-display text-base font-semibold transition-colors hover:border-highlight/60 hover:bg-background"
                  >
                    {budget} €
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6">
              <Link to="/mode-budget" search={budgetSearch(400, origin)} className="gap-2">
                <MapIcon className="size-4" aria-hidden />
                Voir la carte des destinations
              </Link>
            </Button>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-b border-border bg-primary/7 py-14">
          <div className="container-page grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <BellRing className="size-4" aria-hidden />
                Alerte prix gratuite
              </p>
              <h2 className="mt-2 font-display">Pas pressé ? On vous prévient quand ça baisse.</h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Votre email suffit, aucun compte à créer. Nous vérifions le prix du trajet et ne
                vous écrivons que s'il passe sous le dernier tarif relevé. Désinscription en un
                clic.
              </p>
              <Link
                to="/alertes"
                className="mt-4 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                Gérer mes alertes →
              </Link>
            </div>
            <HomeAlertForm initialOrigin={origin} />
          </div>
        </section>
      </Reveal>

      {guides.length > 0 && (
        <Reveal>
          <section className="container-page py-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display">Guides destinations</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Quand partir, quels quartiers voir, quel budget prévoir sur place : nos guides les
                  plus récents, ville par ville.
                </p>
              </div>
              <Link
                to="/conseils/destinations"
                className="text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                Tous les guides →
              </Link>
            </div>

            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {guides.map((guide) => {
                const image = getDestinationImage(guide.destination, guide.city);
                return (
                  <li key={guide.slug}>
                    <Link
                      to="/conseils/destinations/$city"
                      params={{ city: guide.slug }}
                      className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:bg-secondary"
                    >
                      <ResponsivePicture
                        src={image.thumb}
                        webp={image.thumbWebp}
                        alt={image.alt}
                        loading="lazy"
                        width={256}
                        height={192}
                        className="h-32 w-full object-cover"
                      />
                      <span className="flex flex-1 flex-col p-5">
                        <span className="font-display text-base font-semibold">
                          Que faire {withPreposition("à", guide.city)}
                        </span>
                        <span className="mt-1 text-xs text-muted-foreground">{guide.country}</span>
                        <span className="mt-2 text-sm text-muted-foreground">
                          {guide.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </Reveal>
      )}
    </div>
  );
}
