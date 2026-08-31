import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { AlertForm } from "@/components/alerts/AlertForm";
import { ApiDebugPanel } from "@/components/debug/ApiDebugPanel";
import { FlightCard } from "@/components/flights/FlightCard";
import { ResultsPriceCalendar } from "@/components/flights/ResultsPriceCalendar";
import { passengersSummary } from "@/components/search/PassengerSelector";
import { SearchForm } from "@/components/search/SearchForm";
import { Stay22Map } from "@/components/stay/Stay22Map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cityLabel } from "@/data/airports";
import { useCurrency } from "@/lib/currency-context";
import { searchFlights } from "@/lib/flights.functions";
import { dateOr, iataOr, numberOr, todayPlus } from "@/lib/search-params";
import { addDaysIso, nightsBetween, tripDurationLabel } from "@/lib/trip-duration";

type SearchParams = {
  origin: string;
  destination: string;
  depart: string;
  retour: string;
  duree: number;
  flexible: number;
  budget: number;
  adultes: number;
  enfants: number;
  bebes: number;
};

export const Route = createFileRoute("/recherche")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const duree = Math.min(30, Math.max(0, Math.round(numberOr(search["duree"], 0))));
    const depart = dateOr(search["depart"], todayPlus(30));
    return {
      origin: iataOr(search["origin"], "PAR"),
      destination: iataOr(search["destination"], "RAK"),
      depart,
      retour: duree > 0 ? addDaysIso(depart, duree) : dateOr(search["retour"], ""),
      duree,
      flexible: numberOr(search["flexible"], 1) ? 1 : 0,
      budget: Math.max(0, numberOr(search["budget"], 0)),
      adultes: Math.min(9, Math.max(1, Math.round(numberOr(search["adultes"], 1)))),
      enfants: Math.min(8, Math.max(0, Math.round(numberOr(search["enfants"], 0)))),
      // Un bébé par adulte maximum (règle des compagnies aériennes).
      bebes: Math.min(
        Math.min(9, Math.max(1, Math.round(numberOr(search["adultes"], 1)))),
        Math.max(0, Math.round(numberOr(search["bebes"], 0))),
      ),
    };
  },

  head: ({ match }) => {
    const from = cityLabel(match.search["origin"]);
    const to = cityLabel(match.search["destination"]);
    const title = `Vols ${from} — ${to} : comparer les prix totaux | TrouveMonVol`;
    const description = `Résultats de vols ${from} — ${to} triés par prix total taxes incluses, avec le vendeur réel de chaque billet et une vue calendrier des prix du mois.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SearchResultsPage,
});

function SearchResultsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const runSearch = useServerFn(searchFlights);
  const { currency } = useCurrency();

  const [directOnly, setDirectOnly] = useState(false);
  const [airline, setAirline] = useState("");
  const [morningOnly, setMorningOnly] = useState(false);
  const [maxDuration, setMaxDuration] = useState(0);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);


  const from = cityLabel(search["origin"]);
  const to = cityLabel(search["destination"]);

  const offersQuery = useQuery({
    queryKey: [
      "offers",
      search["origin"],
      search["destination"],
      search["depart"],
      search["retour"],
      search.flexible,
      search["adultes"],
      search["enfants"],
      search["bebes"],
      search["duree"],
      currency,
    ],
    queryFn: () =>
      runSearch({
        data: {
          origin: search["origin"],
          destination: search["destination"],
          departureAt: search["depart"],
          returnAt: search["retour"] || null,
          tripDuration: search["duree"],
          flexible: search["flexible"] === 1,
          adults: search["adultes"],
          children: search["enfants"],
          infants: search["bebes"],
          currency,
        },

      }),
  });

  const offers = offersQuery.data?.offers ?? [];
  const airlines = useMemo(
    () => Array.from(new Set(offers.map((o) => o.airline))).sort(),
    [offers],
  );

  const filtered = offers.filter((offer) => {
    if (directOnly && offer.stops > 0) return false;
    if (airline && offer.airline !== airline) return false;
    if (search["budget"] && offer.priceEur > search["budget"]) return false;
    if (maxDuration && offer.durationMinutes > maxDuration * 60) return false;
    if (morningOnly) {
      const hour = new Date(offer.departureAt).getHours();
      if (hour >= 12) return false;
    }
    return true;
  });

  const cheapest = filtered[0] ?? offers[0];
  const greenestId = filtered.length
    ? filtered.reduce((best, o) => (o.co2Kg < best.co2Kg ? o : best), filtered[0]!).id
    : undefined;

  const filtersPanel = (
    <div className="space-y-4 text-sm">
      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox checked={directOnly} onCheckedChange={(v) => setDirectOnly(v === true)} />
        Vols directs uniquement
      </label>
      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox checked={morningOnly} onCheckedChange={(v) => setMorningOnly(v === true)} />
        Départ le matin (avant 12 h)
      </label>
      <div className="space-y-1.5">
        <Label htmlFor="airline-filter">Compagnie</Label>
        <select
          id="airline-filter"
          value={airline}
          onChange={(e) => setAirline(e.target.value)}
          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
        >
          <option value="">Toutes les compagnies</option>
          {airlines.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="duration-filter">Durée maximale</Label>
        <select
          id="duration-filter"
          value={maxDuration}
          onChange={(e) => setMaxDuration(Number(e.target.value))}
          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
        >
          <option value={0}>Peu importe</option>
          <option value={4}>Moins de 4 h</option>
          <option value={8}>Moins de 8 h</option>
          <option value={14}>Moins de 14 h</option>
        </select>
      </div>
    </div>
  );

  const searchFormBlock = (
    <SearchForm
      initialOrigin={search.origin}
      initialDestination={search.destination}
      initialDepart={search.depart}
      initialRetour={search.retour}
      initialFlexible={search.flexible === 1}
      initialDuree={search.duree}
      initialPassengers={{
        adults: search.adultes,
        children: search.enfants,
        infants: search.bebes,
      }}
      compact
    />
  );

  const alertBlock = (
    <AlertForm
      origin={search.origin}
      destination={search.destination}
      departDate={search.depart}
      {...(search["retour"] ? { returnDate: search["retour"] } : {})}
      referencePrice={cheapest?.priceEur ?? null}
    />
  );

  const resultsBlock = (
    <div className="mt-5 space-y-4">
      {offersQuery.isPending &&
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}

      {!offersQuery.isPending && !offersQuery.data?.error && offers.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            Aucun vol trouvé pour ces dates, essayez d'élargir votre recherche.
          </p>
          {(offersQuery.data?.alternatives?.length ?? 0) > 0 ? (
            <p className="mt-2">
              Notre source de prix (mise à jour périodiquement) n'a pas de vol enregistré pour le{" "}
              {search["depart"]} sur {from} — {to}. Cela ne veut pas dire qu'aucun vol n'existe —
              voici les dates proches où nous avons trouvé des prix réels.
            </p>
          ) : (
            <p className="mt-2">
              Notre source de prix n'a aucun vol enregistré sur {from} — {to} pour l'ensemble du
              mois du {search["depart"]}. Essayez les dates flexibles ± 3 jours, un autre mois, ou
              un autre aéroport de départ.
            </p>
          )}

          {(offersQuery.data?.alternatives?.length ?? 0) > 0 && (
            <div className="mt-4">
              <p className="font-medium text-foreground">
                Dates réellement disponibles ce mois-ci :
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {offersQuery.data?.alternatives.map((alt) => (
                  <Button
                    key={alt.date}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Décale le retour de la vraie durée du séjour (raccourci ou
                      // dates précises), sinon un aller-retour de plus de 30 jours
                      // écarte l'écart max accepté par l'API et provoque une erreur.
                      const nights =
                        search["duree"] > 0
                          ? search["duree"]
                          : nightsBetween(search["depart"], search["retour"]);
                      navigate({
                        search: (prev) => ({
                          ...prev,
                          depart: alt.date,
                          retour: nights > 0 ? addDaysIso(alt.date, nights) : prev["retour"],
                        }),
                      });
                    }}
                  >
                    {alt.date} · {alt.priceEur} €
                  </Button>
                ))}
              </div>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={() => setView("calendar")}
          >
            Voir le calendrier des prix
          </Button>
        </div>
      )}


      {!offersQuery.isPending && offersQuery.data?.nearDateOnly && filtered.length > 0 && (
        <p className="rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
          Notre source de prix (mise à jour périodiquement) n'a pas de vol enregistré pour le{" "}
          {search["depart"]}. Cela ne veut pas dire qu'aucun vol n'existe — voici les dates proches
          (± 3 jours) où nous avons trouvé des prix réels. La date de chaque vol est indiquée sur son
          résultat.
        </p>
      )}

      {!offersQuery.isPending && offers.length > 0 && filtered.length === 0 && (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Aucun vol ne correspond à ces filtres. Essayez d'élargir les dates ou de retirer un
          filtre.
        </p>
      )}

      {filtered.map((offer, index) => (
        <div key={offer.id}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {index === 0 && (
              <Badge className="bg-success text-success-foreground">
                Prix le plus bas trouvé
              </Badge>
            )}
            {offer.departureAt.slice(0, 10) !== search["depart"] && (
              <Badge variant="outline">
                Départ le {offer.departureAt.slice(0, 10).split("-").reverse().join("/")}
              </Badge>
            )}
          </div>
          <FlightCard offer={offer} greenest={offer.id === greenestId} />
        </div>
      ))}

    </div>
  );

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">
        Vols {from} — {to}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Départ le {search.depart}
        {search["retour"] ? `, retour le ${search.retour}` : " (aller simple)"}
        {search["duree"] > 0 ? ` · ${tripDurationLabel(search.duree)} (${search.duree} nuits)` : ""}
        {search["flexible"] === 1 ? " · dates flexibles ± 3 jours" : ""}. Les prix affichés sont des prix
        totaux, taxes incluses pour{" "}
        {passengersSummary({
          adults: search["adultes"],
          children: search["enfants"],
          infants: search["bebes"],
        })}
        .
      </p>

      <p className="mt-4 inline-flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        Prix garanti sans frais cachés — vous payez ce qui est affiché ici.
      </p>

      <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
        Notre source tarifaire renvoie le meilleur prix trouvé par date de départ, pas la liste
        complète des vols du jour. Avec les dates flexibles ± 3 jours, vous obtenez un prix par date
        testée pour comparer les jours entre eux.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Colonne latérale : uniquement sur grand écran. Sur mobile, tout passe par le bouton Filtres. */}
        <aside className="hidden space-y-6 lg:block">
          {searchFormBlock}

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-base font-semibold">Filtres</h2>
            <div className="mt-4">{filtersPanel}</div>
          </div>

          {alertBlock}
        </aside>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {offersQuery.isPending
                ? "Recherche des meilleurs prix…"
                : filtered.length === 0
                  ? "Aucun prix réel disponible pour ces critères"
                  : filtered.length === 1
                    ? "Meilleur prix trouvé pour ce trajet"
                    : `${filtered.length} meilleurs prix trouvés (un par date testée)`}
            </p>
            <div className="inline-flex rounded-lg border border-border p-0.5">
              <Button
                type="button"
                size="sm"
                variant={view === "list" ? "default" : "ghost"}
                onClick={() => setView("list")}
              >
                Liste
              </Button>
              <Button
                type="button"
                size="sm"
                variant={view === "calendar" ? "default" : "ghost"}
                onClick={() => setView("calendar")}
              >
                <CalendarDays className="size-4" aria-hidden />
                Calendrier des prix
              </Button>
            </div>
          </div>

          {offersQuery.isError && (
            <p className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              La recherche n'a pas abouti. Rechargez la page ou essayez d'autres dates.
            </p>
          )}

          {offersQuery.data?.error && (
            <p className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {offersQuery.data.error}
            </p>
          )}

          <ApiDebugPanel debug={offersQuery.data?.debug} label="Recherche de vols" />

          {view === "list" ? (
            resultsBlock
          ) : (
            <div className="mt-5">
              <ResultsPriceCalendar
                origin={search.origin}
                destination={search.destination}
                departureAt={search.depart}
                tripDuration={search.duree}
                onSelectDate={(date) => {
                  void navigate({
                    search: (prev) => ({ ...prev, depart: date }),
                  });
                  setView("list");
                }}
              />
            </div>
          )}

          {/* Mobile : accès discret aux filtres, à la recherche et à l'alerte prix. */}
          <div className="mt-6 lg:hidden">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto">
                  <SlidersHorizontal className="size-4" aria-hidden />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtres et recherche</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-4 pb-8">
                  {filtersPanel}
                  <Button type="button" className="w-full" onClick={() => setFiltersOpen(false)}>
                    Voir les prix trouvés
                  </Button>
                  {searchFormBlock}
                  {alertBlock}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </section>
      </div>

      <Stay22Map
        className="mt-12 border-t border-border pt-8"
        city={to}
        {...(search.depart ? { checkin: search.depart } : {})}
        {...(search.retour ? { checkout: search.retour } : {})}
        title="Et pour dormir sur place ?"
        description={`Hébergements disponibles à ${to}${search.depart ? ` pour votre séjour du ${search.depart}${search.retour ? ` au ${search.retour}` : ""}` : ""}, affichés sur une carte.`}
      />
    </div>
  );
}
