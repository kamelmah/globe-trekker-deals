import { useQuery } from "@tanstack/react-query";
import { ClientOnly, Link, createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { lazy, Suspense, useCallback, useState } from "react";

import { ApiDebugPanel } from "@/components/debug/ApiDebugPanel";
import { MonthPicker } from "@/components/search/MonthPicker";
import { PassengerSelector, type Passengers } from "@/components/search/PassengerSelector";
import { PlaceAutocomplete } from "@/components/search/PlaceAutocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { routeSlug } from "@/lib/slug";
import { getAirport } from "@/data/airports";
import { WHITELIST_SLUGS } from "@/data/route-whitelist";
import { useCurrency } from "@/lib/currency-context";
import { cheapestDestinations } from "@/lib/flights.functions";
import { iataOr, monthOr, numberOr } from "@/lib/search-params";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const BudgetMap = lazy(() => import("@/components/budget/BudgetMap"));

const TITLE = "Mode budget : où partir avec votre budget | TrouveMonVol";
const DESCRIPTION =
  "Indiquez votre budget et votre ville de départ, puis explorez sur une carte du monde interactive toutes les destinations accessibles à ce prix, taxes incluses.";

type SearchParams = {
  origin: string;
  budget: number;
  month: string;
  adultes: number;
  enfants: number;
  bebes: number;
};

function clampPassengers(search: Record<string, unknown>): Passengers {
  const adults = Math.min(9, Math.max(1, Math.round(numberOr(search["adultes"], 1))));
  return {
    adults,
    children: Math.min(8, Math.max(0, Math.round(numberOr(search["enfants"], 0)))),
    infants: Math.min(adults, Math.max(0, Math.round(numberOr(search["bebes"], 0)))),
  };
}

export const Route = createFileRoute("/mode-budget")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const passengers = clampPassengers(search);
    return {
      origin: iataOr(search["origin"], "PAR"),
      budget: Math.max(20, numberOr(search["budget"], 400)),
      month: monthOr(search["month"], ""),
      adultes: passengers.adults,
      enfants: passengers.children,
      bebes: passengers.infants,
    };
  },
  loader: async ({ location }) => {
    const rawSearch = location.search as Record<string, unknown>;
    const origin = iataOr(rawSearch["origin"], "PAR");
    const month = monthOr(rawSearch["month"], "");
    const passengers = clampPassengers(rawSearch);
    const { prices, error, debug } = await cheapestDestinations({
      data: {
        origin,
        world: true,
        adults: passengers.adults,
        children: passengers.children,
        infants: passengers.infants,
        ...(month ? { month } : {}),
      },
    });
    return { prices, error, debug };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/mode-budget` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/mode-budget` }],
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const search = Route.useSearch();
  const initial = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });
  const runDestinations = useServerFn(cheapestDestinations);
  const { formatApi: format, currency } = useCurrency();
  const router = useRouter();
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [budgetInput, setBudgetInput] = useState(String(search["budget"]));
  const [monthInput, setMonthInput] = useState(search.month);
  const [passengers, setPassengers] = useState<Passengers>({
    adults: search.adultes,
    children: search.enfants,
    infants: search.bebes,
  });

  const query = useQuery({
    queryKey: [
      "budget",
      search["origin"],
      search.month,
      search.adultes,
      search.enfants,
      search.bebes,
      currency,
    ],
    queryFn: () =>
      runDestinations({
        data: {
          origin: search["origin"],
          world: true,
          adults: search.adultes,
          children: search.enfants,
          infants: search.bebes,
          ...(search["month"] ? { month: search["month"] } : {}),
          currency,
        },
      }),
    ...(currency === "EUR" ? { initialData: initial } : {}),
  });

  /** Pré-remplit le formulaire de recherche de l'accueil avec ce trajet. */
  const searchForDestination = useCallback(
    (destination: string, departureAt: string) => ({
      origin: search["origin"],
      destination,
      depart: departureAt.slice(0, 10),
      retour: "",
      budget: search["budget"],
      flexible: true,
      adultes: search.adultes,
      enfants: search.enfants,
      bebes: search.bebes,
    }),
    [search],
  );

  const hrefFor = useCallback(
    (price: { destination: string; departureAt: string }) =>
      router.buildLocation({
        to: "/",
        search: searchForDestination(price.destination, price.departureAt),
      }).href,
    [router, searchForDestination],
  );

  const originAirport = getAirport(search["origin"]);
  const prices = [...(query.data?.prices ?? [])].sort((a, b) => a.priceEur - b.priceEur);
  const affordable = prices.filter((p) => p.priceEur <= search["budget"]);

  return (
    <div>
      <div className="container-page py-10">
        <h1 className="font-display">
          Mode budget : où partir de {originAirport?.city ?? search.origin} avec{" "}
          {format(search["budget"])}
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          Dites-nous votre budget, on vous montre le monde qui rentre dedans. Chaque point de la
          carte correspond à une ville accessible avec le prix le plus bas relevé récemment, taxes
          incluses. Les destinations au-dessus de votre budget restent visibles, simplement
          estompées, pour vous laisser explorer. Aujourd'hui, {affordable.length} destinations sur{" "}
          {prices.length} tiennent dans votre budget.
        </p>

        <form
          className="mt-5 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            navigate({
              search: (prev) => ({
                ...prev,
                budget: Math.max(20, Number(budgetInput) || 400),
                month: monthOr(monthInput, ""),
                adultes: passengers.adults,
                enfants: passengers.children,
                bebes: passengers.infants,
              }),
            });
          }}
        >
          <PlaceAutocomplete
            id="budget-origin"
            label="Ville ou aéroport de départ"
            value={search.origin}
            onChange={(code) => code && navigate({ search: (prev) => ({ ...prev, origin: code }) })}
            placeholder="Ex. Paris, Lyon, CDG…"
          />

          <MonthPicker id="budget-month" value={monthInput} onChange={setMonthInput} />

          <div className="space-y-1.5">
            <Label htmlFor="budget-amount">Budget maximum (€)</Label>
            <Input
              id="budget-amount"
              type="number"
              min={20}
              inputMode="numeric"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
          </div>

          <PassengerSelector value={passengers} onChange={setPassengers} />

          <Button type="submit">Mettre à jour la carte</Button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">
          Le mode budget compare un aller simple sur l'ensemble du mois choisi (ou toute l'année si
          aucun mois n'est précisé) : pas de date de retour ni de dates flexibles ici, contrairement
          à la recherche classique — utile pour repérer une destination avant d'affiner les dates
          exactes.
        </p>
      </div>

      <div className="container-page mt-6 grid gap-4 pb-12 lg:grid-cols-[1fr_360px]">
        {/*
          `isolate` n'est pas décoratif. Sans lui, ce conteneur ne crée aucun
          contexte d'empilement : les calques Leaflet, qui montent jusqu'à
          z-index 400, sont alors comparés directement à l'en-tête du site, à 40,
          et la carte lui passe par-dessus. Isolé, l'empilement interne de la
          carte reste chez elle et le conteneur reprend sa place dans le flux.
        */}
        <div className="isolate h-[520px] overflow-hidden rounded-xl border border-border bg-card lg:h-[640px]">
          <ClientOnly fallback={<Skeleton className="h-full w-full" />}>
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
              <BudgetMap
                prices={prices}
                budget={search.budget}
                currency={currency}
                originLat={originAirport?.lat ?? 48.86}
                originLng={originAirport?.lng ?? 2.35}
                onSelect={setSelected}
                hrefFor={hrefFor}
                {...(selected ? { selected } : {})}
              />
            </Suspense>
          </ClientOnly>
        </div>

        <aside className="max-h-[640px] overflow-y-auto rounded-xl border border-border bg-card p-4">
          <h2 className="font-display text-base font-semibold">
            Destinations, du moins cher au plus cher
          </h2>
          {query.isFetching && (
            <p className="mt-3 text-sm text-muted-foreground">Chargement des prix…</p>
          )}
          {query.data?.error && (
            <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {query.data.error}
            </p>
          )}
          {!query.isFetching && !query.data?.error && prices.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Aucun vol trouvé pour cette recherche, essayez un autre mois ou une autre ville de
              départ.
            </p>
          )}
          <ul className="mt-3 space-y-2">
            {prices.map((price) => {
              const inBudget = price.priceEur <= search.budget;
              // Le balayage budget couvre le monde entier, la liste blanche non :
              // on ne propose la fiche trajet que si la page correspondante est
              // conservée. Lier une page en `noindex` gaspille du budget de crawl.
              const routePage = routeSlug(originAirport?.city ?? search.origin, price.city);
              const hasRoutePage = WHITELIST_SLUGS.has(routePage);
              return (
                <li key={price.destination}>
                  <Link
                    to="/"
                    search={searchForDestination(price.destination, price.departureAt)}
                    onMouseEnter={() => setSelected(price.destination)}
                    onFocus={() => setSelected(price.destination)}
                    className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-secondary ${
                      inBudget ? "border-border" : "border-dashed border-border opacity-55"
                    } ${selected === price.destination ? "ring-2 ring-ring" : ""}`}
                  >
                    <span>
                      <span className="block font-medium">{price.city}</span>
                      <span className="block text-xs text-muted-foreground">{price.country}</span>
                    </span>
                    <span className="font-semibold text-primary">{format(price.priceEur)}</span>
                  </Link>
                  {hasRoutePage && (
                    <Link
                      to="/vols/$slug"
                      params={{ slug: routePage }}
                      className="mt-1 block px-3 text-xs text-muted-foreground underline hover:text-foreground"
                    >
                      Fiche trajet {price.city} — prix, durée, FAQ
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <ApiDebugPanel debug={query.data?.debug} label="Mode budget" />
        </aside>
      </div>
    </div>
  );
}
