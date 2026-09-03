import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, Luggage, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AlertForm } from "@/components/alerts/AlertForm";
import { ApiDebugPanel } from "@/components/debug/ApiDebugPanel";
import { FlightResultRow } from "@/components/flights/FlightResultRow";
import { ResultsPriceCalendar } from "@/components/flights/ResultsPriceCalendar";
import { passengersSummary } from "@/components/search/PassengerSelector";
import { SearchForm } from "@/components/search/SearchForm";
import { TravelPartnersSection } from "@/components/site/TravelPartners";
import { LienHotelsCom } from "@/components/stay/LienHotelsCom";
import { Stay22Map } from "@/components/stay/Stay22Map";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cityLabel, PARIS_MAIN_AIRPORTS } from "@/data/airports";
import { KIWI_FALLBACK_URL } from "@/lib/affiliate-partners";
import { useCurrency } from "@/lib/currency-context";
import { searchFlights } from "@/lib/flights.functions";
import { dateOr, iataOr, numberOr, saveLastFlightSearch, todayPlus } from "@/lib/search-params";
import { formatDateCompact, formatDateLong, formatMonthLong } from "@/lib/dates";
import { BAGGAGE_LEVELS, priceWithBaggage, type BaggageLevel } from "@/data/baggage-fees";
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
  /**
   * `validateSearch` ne reçoit que ce que porte l'URL : un paramètre absent
   * prend sa valeur par défaut, jamais celle de la recherche précédente.
   *
   * La destination n'a volontairement PAS de valeur par défaut. Elle valait
   * "RAK" : une URL sans destination affichait donc des résultats Marrakech
   * qu'aucun visiteur n'avait demandés — et ce, quelle que soit la navigation
   * précédente. Sans destination, il n'y a pas de trajet à afficher : la
   * recherche relève du mode budget, et `beforeLoad` y redirige.
   */
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const duree = Math.min(30, Math.max(0, Math.round(numberOr(search["duree"], 0))));
    const depart = dateOr(search["depart"], todayPlus(30));
    return {
      origin: iataOr(search["origin"], "PAR"),
      destination: iataOr(search["destination"], ""),
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

  /**
   * Une recherche sans destination est une recherche par budget : c'est déjà
   * ce que fait le formulaire quand le champ destination est laissé vide. On
   * conserve les critères saisis plutôt que d'inventer une destination.
   */
  beforeLoad: ({ search }) => {
    if (search.destination) return;
    throw redirect({
      to: "/mode-budget",
      search: {
        origin: search.origin,
        // /mode-budget refuse un budget nul : sans budget saisi, on reprend sa
        // propre valeur par défaut plutôt que d'en fabriquer une autre.
        budget: search.budget > 0 ? search.budget : 400,
        month: search.depart ? search.depart.slice(0, 7) : "",
        adultes: search.adultes,
        enfants: search.enfants,
        bebes: search.bebes,
      },
    });
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
  const [baggageLevel, setBaggageLevel] = useState<BaggageLevel>("personnel");
  const [parisMainOnly, setParisMainOnly] = useState(false);

  const from = cityLabel(search["origin"]);
  const to = cityLabel(search["destination"]);

  /**
   * Mémorise la recherche dans le navigateur du visiteur, pour que la page
   * hébergement puisse lui reproposer cette ville et ces dates. Rien ne part au
   * serveur (voir saveLastFlightSearch).
   */
  useEffect(() => {
    saveLastFlightSearch({
      origin: search.origin,
      destination: search.destination,
      depart: search.depart,
      retour: search.retour,
      adultes: search.adultes,
      enfants: search.enfants,
      bebes: search.bebes,
    });
  }, [
    search.origin,
    search.destination,
    search.depart,
    search.retour,
    search.adultes,
    search.enfants,
    search.bebes,
  ]);

  // Durée réelle du séjour recherché : le raccourci "Durée du séjour" la fixe
  // directement, mais un aller-retour saisi avec deux dates précises ne passe
  // jamais par ce raccourci — sans ce calcul, le calendrier et le
  // recalcul de la date de retour retomberaient à tort sur un aller simple.
  const effectiveTripDuration =
    search["duree"] > 0 ? search["duree"] : nightsBetween(search["depart"], search["retour"]);

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

  /**
   * Prix de comparaison : celui du niveau de bagage demandé. Sans barème pour
   * la compagnie, on retombe sur le prix nu — jamais sur un supplément inventé.
   */
  const prixComparaison = (offer: (typeof offers)[number]) =>
    priceWithBaggage(offer.priceEur, offer.airlineCode, baggageLevel) ?? offer.priceEur;

  const filtered = offers
    .filter((offer) => {
      if (directOnly && offer.stops > 0) return false;
      // Beauvais est vendu comme « Paris » : ce filtre permet d écarter les
      // aéroports éloignés sans avoir à les repérer un par un.
      if (parisMainOnly && !PARIS_MAIN_AIRPORTS.includes(offer.originAirport)) return false;
      if (airline && offer.airline !== airline) return false;
      // Le budget s'applique au prix du niveau choisi : filtrer sur le prix nu
      // laisserait passer des offres hors budget une fois la valise ajoutée.
      if (search["budget"] && prixComparaison(offer) > search["budget"]) return false;
      if (maxDuration && offer.durationMinutes > maxDuration * 60) return false;
      if (morningOnly) {
        const hour = new Date(offer.departureAt).getHours();
        if (hour >= 12) return false;
      }
      return true;
    })
    // Retri complet : avec la soute, le moins cher n'est plus le même vol.
    .sort((a, b) => prixComparaison(a) - prixComparaison(b));

  const cheapest = filtered[0] ?? offers[0];

  /**
   * La carte « Meilleur prix total sur cette recherche » marque le plus bas
   * PRIX TOTAL affiché, pas la première ligne de la liste.
   *
   * Les deux diffèrent dès qu'un niveau de bagage est demandé : le tri porte
   * alors sur le prix billet + supplément, et la première carte peut afficher
   * un montant plus élevé que la troisième. Une pastille « meilleur prix » sur
   * un montant qui n'est pas le plus bas de l'écran se lit comme un mensonge,
   * même quand le classement, lui, est juste.
   */
  const bestPriceId = filtered.length
    ? filtered.reduce((best, o) => (o.priceEur < best.priceEur ? o : best), filtered[0]!).id
    : undefined;
  const greenestId = filtered.length
    ? filtered.reduce((best, o) => (o.co2Kg < best.co2Kg ? o : best), filtered[0]!).id
    : undefined;

  const filtersPanel = (
    <div className="space-y-4 text-sm">
      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox checked={directOnly} onCheckedChange={(v) => setDirectOnly(v === true)} />
        Vols directs uniquement
      </label>
      {search["origin"] === "PAR" && (
        <label className="flex cursor-pointer items-start gap-2">
          <Checkbox
            checked={parisMainOnly}
            onCheckedChange={(v) => setParisMainOnly(v === true)}
            className="mt-0.5"
          />
          <span>
            Aéroports parisiens principaux uniquement (CDG, ORY)
            <span className="block text-xs text-muted-foreground">
              Écarte Beauvais, à 85 km de Paris.
            </span>
          </span>
        </label>
      )}
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
              {formatDateLong(search["depart"])} sur {from} — {to}. Cela ne veut pas dire qu'aucun
              vol n'existe — voici les dates proches où nous avons trouvé des prix réels.
            </p>
          ) : (
            <p className="mt-2">
              Notre source de prix n'a aucun vol enregistré sur {from} — {to} pour l'ensemble du
              mois de {formatMonthLong(search["depart"].slice(0, 7))}. Essayez les dates flexibles ±
              3 jours, un autre mois, ou un autre aéroport de départ.
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
                      navigate({
                        search: (prev) => ({
                          ...prev,
                          depart: alt.date,
                          retour:
                            effectiveTripDuration > 0
                              ? addDaysIso(alt.date, effectiveTripDuration)
                              : prev["retour"],
                        }),
                      });
                    }}
                  >
                    {formatDateCompact(alt.date)} · {alt.priceEur} €
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setView("calendar")}>
              Voir le calendrier des prix
            </Button>
            <Button asChild variant="outline">
              <a
                href={KIWI_FALLBACK_URL}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
              >
                Vérifier en temps réel sur Kiwi.com
              </a>
            </Button>
          </div>
        </div>
      )}

      {!offersQuery.isPending && offersQuery.data?.nearDateOnly && filtered.length > 0 && (
        <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
          <p>
            Notre source de prix (mise à jour périodiquement) n'a pas de vol enregistré pour le{" "}
            {formatDateLong(search["depart"])}. Cela ne veut pas dire qu'aucun vol n'existe — voici
            les dates proches (± 3 jours) où nous avons trouvé des prix réels. La date de chaque vol
            est indiquée sur son résultat.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-3">
            <a
              href={KIWI_FALLBACK_URL}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
            >
              Vérifier en temps réel sur Kiwi.com
            </a>
          </Button>
        </div>
      )}

      {!offersQuery.isPending && offers.length > 0 && filtered.length === 0 && (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Aucun vol ne correspond à ces filtres. Essayez d'élargir les dates ou de retirer un
          filtre.
        </p>
      )}

      {filtered.map((offer, index) => (
        <div
          key={offer.id}
          className="card-in"
          style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
        >
          <FlightResultRow
            offer={offer}
            currency={currency}
            best={offer.id === bestPriceId}
            greenest={offer.id === greenestId}
          />
        </div>
      ))}

      {filtered.length > 0 && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Suppléments bagages : tarif le plus bas publié par la compagnie, par voyageur et à l'achat
          en ligne — un bagage payé à l'aéroport coûte souvent le double. Un niveau sans puce est un
          niveau que nous n'avons pas documenté chez cette compagnie, jamais un bagage gratuit ;{" "}
          <Link
            to="/bagages"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            le détail par compagnie est ici
          </Link>
          . Horaires donnés à l'heure de Paris : sur un vol qui change de fuseau, l'heure d'arrivée
          n'est donc pas l'heure locale à destination — notre source ne fournit pas cette heure.
        </p>
      )}
    </div>
  );

  return (
    <div className="container-page py-10">
      <h1 className="font-display">
        Vols {from} — {to}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Départ le {formatDateLong(search.depart)}
        {search["retour"] ? `, retour le ${formatDateLong(search.retour)}` : " (aller simple)"}
        {search["duree"] > 0 ? ` · ${tripDurationLabel(search.duree)} (${search.duree} nuits)` : ""}
        {search["flexible"] === 1 ? " · dates flexibles ± 3 jours" : ""}. Les prix affichés sont des
        prix totaux, taxes incluses pour{" "}
        {passengersSummary({
          adults: search["adultes"],
          children: search["enfants"],
          infants: search["bebes"],
        })}
        .
      </p>

      {/*
        Ce bandeau annonçait « Prix garanti sans frais cachés — vous payez ce
        qui est affiché ici », au-dessus de cartes renvoyant vers des agences
        dont les frais de service sont le premier motif de plainte publique.
        Nous ne maîtrisons pas le tunnel de paiement d'un tiers : promettre son
        absence de frais était une garantie que nous ne pouvons pas tenir.
        Sur 234 offres relevées, 233 passent par une agence — le risque est la
        règle, pas l'exception, et la phrase doit le dire.
      */}
      <p className="mt-4 inline-flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        Prix total taxes incluses. Des frais de service peuvent s'ajouter chez certains revendeurs —
        le vendeur est indiqué sur chaque offre.
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        Vol déjà réservé, retardé ou annulé ?{" "}
        <Link
          to="/indemnisation"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Voir si vous avez droit à une indemnisation
        </Link>
        .
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
          {/*
            Le bagage n'est pas un filtre secondaire : c'est le premier coût
            caché d'un billet low-cost, et il change l'ordre des résultats. Il
            est donc au-dessus de la liste, pas rangé dans le panneau
            « Filtres » avec la durée et les compagnies.
          */}
          <fieldset className="mb-4 rounded-xl border border-border bg-card p-3">
            <legend className="px-1 text-sm font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Luggage className="size-4 text-primary" aria-hidden />
                Je voyage avec
              </span>
            </legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {BAGGAGE_LEVELS.map((niveau) => (
                <Button
                  key={niveau.value}
                  type="button"
                  size="sm"
                  variant={baggageLevel === niveau.value ? "default" : "outline"}
                  aria-pressed={baggageLevel === niveau.value}
                  onClick={() => setBaggageLevel(niveau.value)}
                >
                  {niveau.label}
                </Button>
              ))}
            </div>
            {/*
              Le montant en gros sur une carte est TOUJOURS le prix du billet
              taxes incluses, jamais un prix majoré : c'est ce que le vendeur
              facturera à l'étape suivante. Le niveau choisi ici ne change donc
              pas les montants affichés, il change l'ORDRE des résultats et le
              budget appliqué — et c'est exactement ce que ce texte doit dire.
            */}
            <p className="mt-2 text-xs text-muted-foreground">
              {baggageLevel === "personnel"
                ? "Les résultats sont classés sur le prix du billet, taxes incluses. Le supplément publié par la compagnie pour la cabine et la soute est indiqué sur chaque carte."
                : "Les résultats sont classés — et votre budget appliqué — sur le prix du billet augmenté du supplément publié par la compagnie. Le montant affiché sur chaque carte reste le prix du billet ; le supplément est indiqué juste à côté. Les compagnies dont nous n'avons pas le barème gardent leur prix nu et n'affichent pas de puce pour ce niveau."}
            </p>
          </fieldset>

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
                tripDuration={effectiveTripDuration}
                passengers={{
                  adults: search["adultes"],
                  children: search["enfants"],
                  infants: search["bebes"],
                }}
                onSelectDate={(date) => {
                  void navigate({
                    search: (prev) => ({
                      ...prev,
                      depart: date,
                      // Recalculé sur la même durée que la recherche initiale : sinon
                      // l'ancienne date de retour reste figée et ne correspond plus
                      // au séjour voulu une fois la date de départ changée.
                      retour:
                        effectiveTripDuration > 0
                          ? addDaysIso(date, effectiveTripDuration)
                          : prev["retour"],
                    }),
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

      <TravelPartnersSection
        className="mt-12 border-t border-border pt-8"
        partners={["assurance", "voiture"]}
      />

      <Stay22Map
        className="mt-10"
        city={to}
        {...(search.depart ? { checkin: search.depart } : {})}
        {...(search.retour ? { checkout: search.retour } : {})}
        title="Et pour dormir sur place ?"
        description={`Hébergements disponibles à ${to}${search.depart ? ` pour votre séjour du ${formatDateLong(search.depart)}${search.retour ? ` au ${formatDateLong(search.retour)}` : ""}` : ""}, affichés sur une carte.`}
      />

      {/* Les dates du vol partent telles quelles chez le partenaire, et vers
          notre page hébergement — c'est le seul endroit du site où le séjour a
          une vraie date de début ET de fin. */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <LienHotelsCom
          className="sm:w-auto sm:min-w-72"
          ville={to}
          sid={`recherche-${search.destination.toLowerCase()}`}
          arrivee={search.depart}
          depart={search.retour}
          voyageurs={search.adultes}
          libelle={`Voir les hôtels à ${to}`}
          mention
        />
        <Button asChild variant="outline">
          <Link
            to="/hebergement"
            search={{
              ville: to,
              ...(search.depart ? { arrivee: search.depart } : {}),
              ...(search.retour ? { depart: search.retour } : {}),
              ...(search.adultes > 1 ? { voyageurs: search.adultes } : {}),
            }}
          >
            Comparer les hébergements
          </Link>
        </Button>
      </div>
    </div>
  );
}
