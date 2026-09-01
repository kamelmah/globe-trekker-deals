import { Link, createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { AlertForm } from "@/components/alerts/AlertForm";
import { LivePriceButton } from "@/components/flights/LivePriceButton";
import { PriceHistoryChart } from "@/components/flights/PriceHistoryChart";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Reveal } from "@/components/site/Reveal";
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { Stay22Map } from "@/components/stay/Stay22Map";
import { TravelPartnersSection } from "@/components/site/TravelPartners";
import { Button } from "@/components/ui/button";
import { DESTINATIONS, getDestination } from "@/data/destinations";
import { legacyRedirectTarget } from "@/data/route-redirects";
import { routeMetaTitle } from "@/lib/route-title";
import { isIndexableRoute } from "@/data/route-whitelist";
import { monthlyHistory } from "@/lib/flights.functions";
import { dynamicRoutePage, relatedRoutePages } from "@/lib/route-pages.functions";
import { formatPrice } from "@/lib/currency";
import { withPreposition } from "@/lib/french-grammar";
import { getCityGuideForRoute } from "@/data/city-guides";
import { getDestinationImage } from "@/lib/destination-images";
import { todayPlus } from "@/lib/search-params";
import { SITE_URL, absoluteUrl, destinationOgImage } from "@/lib/site";

export const Route = createFileRoute("/vols/$slug")({
  loader: async ({ params }) => {
    // Les routes conservées qui ont changé de slug (« Ville de Madrid » devenu
    // « Madrid ») redirigent en 301 vers leur URL actuelle.
    const renamed = legacyRedirectTarget(params.slug);
    if (renamed) {
      throw redirect({ to: "/vols/$slug", params: { slug: renamed }, statusCode: 301 });
    }
    // Page éditoriale si le trajet est curé, sinon page générée côté serveur
    // pour n'importe quelle destination trouvée en mode budget.
    const route =
      getDestination(params.slug) ??
      (await dynamicRoutePage({ data: { slug: params.slug } })).route;
    if (!route) throw notFound();
    // Aucun appel à l'API de vols ici : seul l'historique déjà enregistré en base
    // est lu, pour que les robots n'entament jamais le quota Travelpayouts.
    const history = await monthlyHistory({
      data: { origin: route.origin, destination: route.destination },
    });
    const historyLowest = history.months.length
      ? Math.min(...history.months.map((m) => m.priceEur))
      : null;
    // Prix d'appel simulé pour la démo, sinon le plancher réellement observé.
    const lowestObserved = route.simulatedLowestPrice ?? route.observedLowestPrice ?? historyLowest;
    // Maillage interne : autres pages SSR disponibles depuis la même origine.
    const { related } = await relatedRoutePages({
      data: {
        origin: route.origin,
        originCity: route.originCity,
        exclude: route.destination,
        limit: 12,
      },
    });
    // Hors liste blanche, la page reste servie mais demande à ne pas être
    // indexée : ces liaisons n'existent pas commercialement et noyaient les
    // pages valables sous un millier de pages creuses.
    const indexable = isIndexableRoute(route.slug, DESTINATIONS);
    return { route, months: history.months, lowestObserved, related, indexable };
  },

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Destination introuvable | TrouveMonVol" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { route, lowestObserved, indexable } = loaderData;
    const pageUrl = `${SITE_URL}/vols/${route.slug}`;
    // Gabarit unique, y compris pour les pages éditoriales : leurs titres
    // avaient été écrits un par un et ne suivaient plus la même forme.
    const metaTitle = routeMetaTitle(route.originCity, route.destinationCity);
    // Visuel dédié /og/<slug>.jpg uniquement pour les destinations éditoriales
    // (fichier réellement présent) ; sinon on réutilise la bannière déjà
    // affichée en page pour ne jamais pointer vers une image inexistante.
    const ogImage = getDestination(route.slug)
      ? destinationOgImage(route.slug)
      : absoluteUrl(
          getDestinationImage(route.destination, route.destinationCity, route.country).src,
        );
    return {
      meta: [
        { title: metaTitle },
        { name: "description", content: route.metaDescription },
        // `follow` et non `nofollow` : on cesse de demander l'évaluation de la
        // page, sans couper la circulation du crawl vers les pages conservées.
        ...(indexable ? [] : [{ name: "robots", content: "noindex, follow" }]),
        { property: "og:title", content: metaTitle },
        { property: "og:description", content: route.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: pageUrl },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        {
          property: "og:image:alt",
          content: `Vols pas chers ${route.originCity} — ${route.destinationCity}`,
        },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: pageUrl },
        { rel: "alternate", hreflang: "fr-FR", href: pageUrl },
        { rel: "alternate", hreflang: "x-default", href: pageUrl },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            name: metaTitle,
            url: pageUrl,
            inLanguage: "fr-FR",
            mainEntity: route.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
              {
                "@type": "ListItem",
                position: 2,
                name: `Vols ${route.originCity} — ${route.destinationCity}`,
                item: pageUrl,
              },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            // Google recommande le type Flight (et non Product/Offer) pour un billet d'avion.
            "@type": "Flight",
            name: `Vol ${route.originCity} — ${route.destinationCity}`,
            description: route.metaDescription,
            url: pageUrl,
            image: ogImage,
            departureAirport: {
              "@type": "Airport",
              iataCode: route.origin,
              name: route.originCity,
            },
            arrivalAirport: {
              "@type": "Airport",
              iataCode: route.destination,
              name: route.destinationCity,
            },
            ...(route.observedDepartureAt
              ? { departureTime: new Date(route.observedDepartureAt).toISOString() }
              : {}),
            ...(route.observedAirline
              ? {
                  airline: {
                    "@type": "Airline",
                    name: route.observedAirline,
                    ...(/^[A-Z0-9]{2}$/.test(route.observedAirline)
                      ? { iataCode: route.observedAirline }
                      : {}),
                  },
                }
              : {}),
            ...(lowestObserved
              ? {
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "EUR",
                    price: lowestObserved,
                    url: pageUrl,
                    availability: "https://schema.org/InStock",
                  },
                }
              : {}),
          }),
        },
      ],
    };
  },
  component: DestinationPage,
});

function DestinationPage() {
  const { route, months, lowestObserved, related } = Route.useLoaderData();
  const banner = getDestinationImage(route.destination, route.destinationCity);
  const guide = getCityGuideForRoute(route.slug);

  return (
    <article className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/" className="hover:text-foreground">
          Accueil
        </Link>{" "}
        / Vols pas chers {route.originCity} — {route.destinationCity}
      </nav>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-border">
        <ResponsivePicture
          src={banner.src}
          webp={banner.webp}
          alt={banner.alt}
          width={1200}
          height={630}
          className="h-44 w-full object-cover sm:h-64 lg:h-80"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
          aria-hidden
        />
        <h1 className="absolute inset-x-0 bottom-0 p-4 font-display text-white drop-shadow sm:p-6">
          {route.heading}
        </h1>
      </div>

      <p className="mt-4 max-w-3xl text-base text-muted-foreground">{route.intro}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Prix de référence</p>
          <p className="mt-1 font-display text-2xl font-semibold text-primary">
            {lowestObserved
              ? route.simulatedLowestPrice
                ? `Dès ${route.simulatedLowestPrice}€`
                : `Dès ${formatPrice(lowestObserved)}`
              : "Historique en constitution"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Repère indicatif taxes incluses, distinct de l'historique mesuré ci-dessous
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Meilleure période</p>
          <p className="mt-1 text-base font-semibold">{route.bestMonths}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Durée de vol</p>
          <p className="mt-1 text-base font-semibold">{route.averageDuration}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <LivePriceButton
          origin={route.origin}
          destination={route.destination}
          originCity={route.originCity}
          destinationCity={route.destinationCity}
        />
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Comparer avec vos dates</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Prix total taxes incluses, vendeur affiché, lien direct vers ce vendeur.
          </p>
          <Button asChild size="lg" className="mt-3">
            <Link
              to="/recherche"
              search={{
                origin: route.origin,
                destination: route.destination,
                depart: todayPlus(30),
                retour: "",
                duree: 0,
                flexible: 1,
                budget: 0,
                adultes: 1,
                enfants: 0,
                bebes: 0,
              }}
            >
              Comparer les vols {route.originCity} — {route.destinationCity}
            </Link>
          </Button>
        </div>
      </div>

      {guide && (
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="font-display text-base font-semibold">
            Découvrez notre guide complet {withPreposition("de", guide.city)}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Meilleure période pour visiter, quartiers à voir, budget moyen sur place, transports,
            monnaie et formalités : tout ce qu'il faut savoir avant de réserver.
          </p>
          <Link
            to="/conseils/destinations/$city"
            params={{ city: guide.slug }}
            className="mt-3 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            Lire le guide « Que faire {withPreposition("à", guide.city)} »
          </Link>
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {route.sections.map((section) => (
            <Reveal key={section.heading} className="mt-8 first:mt-0">
              <section>
                <h2 className="font-display text-xl font-semibold">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            </Reveal>
          ))}

          <Reveal className="mt-10">
            <section>
              <h2 className="font-display text-xl font-semibold">
                Évolution du prix le plus bas sur 12 mois
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {months.length > 0
                  ? `Historique mesuré : le plancher relevé sur les 12 derniers mois est de ${formatPrice(Math.min(...months.map((m) => m.priceEur)))}.`
                  : "Historique mesuré en cours de constitution sur ce trajet."}
              </p>
              <div className="mt-4 rounded-xl border border-border bg-card p-4">
                <PriceHistoryChart months={months} />
              </div>
              {months.length === 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Aucune observation de prix enregistrée pour l'instant sur ce trajet : l'historique
                  se constitue à partir des prix réellement relevés lors des recherches.
                </p>
              )}
            </section>
          </Reveal>

          {related.length > 0 && (
            <Reveal className="mt-10">
              <section>
                <h2 className="font-display text-xl font-semibold">
                  Autres destinations depuis {route.originCity}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Prix les plus bas déjà relevés depuis {route.originCity}, taxes incluses. Chaque
                  lien mène à la fiche complète du trajet.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {related.map((item) => {
                    const thumb = getDestinationImage(null, item.city, item.country);
                    return (
                      <li key={item.slug}>
                        <Link
                          to="/vols/$slug"
                          params={{ slug: item.slug }}
                          className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm transition-colors hover:bg-secondary"
                        >
                          <ResponsivePicture
                            src={thumb.thumb}
                            webp={thumb.thumbWebp}
                            alt={thumb.alt}
                            loading="lazy"
                            width={96}
                            height={72}
                            className="size-12 shrink-0 rounded-md object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">
                              {route.originCity} — {item.city}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {item.country}
                            </span>
                          </span>
                          {item.priceEur !== null && (
                            <span className="font-semibold text-primary">
                              dès {formatPrice(item.priceEur)}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </Reveal>
          )}

          <Reveal className="mt-10">
            <section>
              <h2 className="font-display text-xl font-semibold">Questions fréquentes</h2>
              <div className="mt-4">
                <FaqAccordion items={route.faq} />
              </div>
            </section>
          </Reveal>

          <Stay22Map
            className="mt-12"
            city={route.destinationCity}
            title={`Trouvez aussi votre hébergement à ${route.destinationCity}`}
            description={`Hôtels, appartements et auberges disponibles à ${route.destinationCity}, affichés sur une carte. Les prix proviennent directement des plateformes de réservation.`}
          />

          <TravelPartnersSection className="mt-10" partners={["esim", "assurance", "voiture"]} />
        </div>

        <aside className="space-y-6">
          <AlertForm
            origin={route.origin}
            destination={route.destination}
            referencePrice={lowestObserved}
          />
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <h2 className="font-display text-base font-semibold text-foreground">
              Pas encore décidé sur la destination ?
            </h2>
            <p className="mt-2">
              Le mode budget affiche sur une carte toutes les villes accessibles avec la somme que
              vous voulez dépenser.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link
                to="/mode-budget"
                search={{
                  origin: route.origin,
                  budget: 400,
                  month: "",
                  adultes: 1,
                  enfants: 0,
                  bebes: 0,
                }}
              >
                Explorer par budget
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
}
