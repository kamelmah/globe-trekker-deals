import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { AlertForm } from "@/components/alerts/AlertForm";
import { LivePriceButton } from "@/components/flights/LivePriceButton";
import { PriceHistoryChart } from "@/components/flights/PriceHistoryChart";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Button } from "@/components/ui/button";
import { getDestination } from "@/data/destinations";
import { monthlyHistory } from "@/lib/flights.functions";
import { formatPrice } from "@/lib/currency";
import { todayPlus } from "@/lib/search-params";
import { SITE_URL, destinationOgImage } from "@/lib/site";

export const Route = createFileRoute("/vols/$slug")({
  loader: async ({ params }) => {
    const route = getDestination(params.slug);
    if (!route) throw notFound();
    // Aucun appel à l'API de vols ici : seul l'historique déjà enregistré en base
    // est lu, pour que les robots n'entament jamais le quota Travelpayouts.
    const history = await monthlyHistory({
      data: { origin: route.origin, destination: route.destination },
    });
    const lowestObserved = history.months.length
      ? Math.min(...history.months.map((m) => m.priceEur))
      : null;
    return { route, months: history.months, lowestObserved };
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
    const { route, lowestObserved } = loaderData;
    const pageUrl = `${SITE_URL}/vols/${route.slug}`;
    const ogImage = destinationOgImage(route.slug);
    return {
      meta: [
        { title: route.metaTitle },
        { name: "description", content: route.metaDescription },
        { property: "og:title", content: route.metaTitle },
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
      links: [{ rel: "canonical", href: pageUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            name: route.metaTitle,
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
            "@type": "Product",
            name: `Vol ${route.originCity} — ${route.destinationCity}`,
            description: route.metaDescription,
            image: ogImage,
            url: pageUrl,
            category: "Billet d'avion",
            ...(lowestObserved
              ? {
                  offers: {
                    "@type": "AggregateOffer",
                    priceCurrency: "EUR",
                    lowPrice: lowestObserved,
                    offerCount: 1,
                    availability: "https://schema.org/InStock",
                    url: pageUrl,
                  },
                }
              : {}),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Flight",
            name: `Vol ${route.originCity} — ${route.destinationCity}`,
            departureAirport: { "@type": "Airport", iataCode: route.origin, name: route.originCity },
            arrivalAirport: {
              "@type": "Airport",
              iataCode: route.destination,
              name: route.destinationCity,
            },
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
  const { route, months, lowestObserved } = Route.useLoaderData();

  return (
    <article className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/" className="hover:text-foreground">
          Accueil
        </Link>{" "}
        / Vols pas chers {route.originCity} — {route.destinationCity}
      </nav>

      <h1 className="mt-3 font-display text-3xl font-semibold">
        Billet d'avion {route.originCity} - {route.destinationCity} pas cher
      </h1>
      <p className="mt-3 max-w-3xl text-base text-muted-foreground">{route.intro}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Prix le plus bas déjà relevé</p>
          <p className="mt-1 font-display text-2xl font-semibold text-primary">
            {lowestObserved ? `Dès ${formatPrice(lowestObserved)}` : "Historique en constitution"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Relevé lors de recherches passées, taxes incluses
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

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {route.sections.map((section) => (
            <section key={section.heading} className="mt-8 first:mt-0">
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
          ))}

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">
              Évolution du prix le plus bas sur 12 mois
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {lowestObserved
                ? `Sur la dernière année, le plancher observé sur ce trajet est de ${formatPrice(lowestObserved)}.`
                : "Historique en cours de constitution sur ce trajet."}
            </p>
            <div className="mt-4 rounded-xl border border-border bg-card p-4">
              <PriceHistoryChart months={months} />
            </div>
            {months.length === 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Aucune observation de prix enregistrée pour l'instant sur ce trajet : l'historique se
                constitue à partir des prix réellement relevés lors des recherches.
              </p>
            )}
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">Questions fréquentes</h2>
            <div className="mt-4">
              <FaqAccordion items={route.faq} />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {lowestObserved !== null && (
            <AlertForm
              origin={route.origin}
              destination={route.destination}
              referencePrice={lowestObserved}
            />
          )}
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <h2 className="font-display text-base font-semibold text-foreground">
              Pas encore décidé sur la destination ?
            </h2>
            <p className="mt-2">
              Le mode budget affiche sur une carte toutes les villes accessibles avec la somme que
              vous voulez dépenser.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/mode-budget" search={{ origin: route.origin, budget: 400, month: "" }}>
                Explorer par budget
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
}
