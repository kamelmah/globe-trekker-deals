import { useNavigate } from "@tanstack/react-router";
import { formatDateLong } from "@/lib/dates";
import { Search } from "lucide-react";
import { useState } from "react";

import { DepartureDatePicker, PriceDatePicker } from "@/components/search/DepartureDatePicker";
import { PassengerSelector, type Passengers } from "@/components/search/PassengerSelector";
import { PlaceAutocomplete } from "@/components/search/PlaceAutocomplete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resolvePlace } from "@/lib/places.functions";
import { addDaysIso, nightsBetween, TRIP_DURATIONS } from "@/lib/trip-duration";

function defaultDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export type SearchFormProps = {
  initialOrigin?: string;
  initialDestination?: string;
  initialDepart?: string;
  initialRetour?: string;
  initialBudget?: string;
  initialFlexible?: boolean;
  initialDuree?: number;
  initialPassengers?: Passengers;
  compact?: boolean;
};

export function SearchForm({
  initialOrigin = "PAR",
  initialDestination = "",
  initialDepart,
  initialRetour = "",
  initialBudget = "",
  initialFlexible = true,
  initialDuree,
  initialPassengers,
  compact = false,
}: SearchFormProps) {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [depart, setDepart] = useState(initialDepart ?? defaultDate(30));
  const [retour, setRetour] = useState(initialRetour);
  const [flexible, setFlexible] = useState(initialFlexible);
  const [duree, setDuree] = useState(
    initialDuree ?? (initialRetour ? nightsBetween(initialDepart ?? "", initialRetour) : 0),
  );
  const [passengers, setPassengers] = useState<Passengers>(
    initialPassengers ?? { adults: 1, children: 0, infants: 0 },
  );

  const [budget, setBudget] = useState(initialBudget);
  /** Texte brut du champ destination (saisie libre sans clic sur une suggestion). */
  const [destinationText, setDestinationText] = useState(initialDestination);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);

  const typedDestination = destinationText.trim();
  const hasTypedDestination = typedDestination.length > 0;

  /** Avec un raccourci de durée, le retour est calculé depuis la date de départ. */
  const effectiveRetour = duree > 0 ? addDaysIso(depart, duree) : retour;

  function goToResults(code: string) {
    navigate({
      to: "/recherche",
      search: {
        origin,
        destination: code,
        depart,
        retour: effectiveRetour,
        duree,
        flexible: flexible ? 1 : 0,
        budget: budget ? Number(budget) : 0,
        adultes: passengers.adults,
        enfants: passengers.children,
        bebes: passengers.infants,
      },
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setDestinationError(null);

    if (destination) {
      goToResults(destination);
      return;
    }

    // Saisie libre non validée par un clic : on tente de la résoudre en code IATA.
    if (hasTypedDestination) {
      setResolving(true);
      try {
        const result = await resolvePlace({ data: { term: typedDestination } });
        if (result.place) {
          setDestination(result.place.code);
          setDestinationText(`${result.place.city || result.place.name} (${result.place.code})`);
          goToResults(result.place.code);
          return;
        }
        setDestinationError(
          result.error ??
            "Destination introuvable : sélectionnez une destination dans la liste ou laissez le champ vide pour le mode budget.",
        );
      } catch {
        setDestinationError(
          "Impossible de vérifier cette destination pour le moment. Réessayez dans un instant.",
        );
      } finally {
        setResolving(false);
      }
      return;
    }

    navigate({
      to: "/mode-budget",
      search: {
        origin,
        budget: budget ? Number(budget) : 400,
        month: "",
        adultes: passengers.adults,
        enfants: passengers.children,
        bebes: passengers.infants,
      },
    });
  }

  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
      aria-label="Recherche de vols"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <PlaceAutocomplete
          id="origin"
          label="Ville ou aéroport de départ"
          value={origin}
          onChange={setOrigin}
          placeholder="Ex. Paris, CDG, Marrakech…"
        />

        <PlaceAutocomplete
          id="destination"
          label="Destination (facultatif — laissez vide pour le mode budget)"
          value={destination}
          onChange={(code) => {
            setDestination(code);
            if (code) setDestinationError(null);
          }}
          onTextChange={(value) => {
            setDestinationText(value);
            setDestinationError(null);
          }}
          error={destinationError}
          placeholder="Peu importe — mode budget"
          allowEmpty
        />

        <DepartureDatePicker
          value={depart}
          onChange={setDepart}
          origin={origin}
          destination={destination}
          tripDuration={duree}
          minDate={defaultDate(1)}
        />

        {duree > 0 ? (
          <div className="space-y-1.5">
            <Label>Date de retour (calculée)</Label>
            {/* min-h plutôt que h-9 : une date en toutes lettres est bien plus
                longue qu'une date ISO et débordait de la boîte à hauteur fixe. */}
            <div className="flex min-h-9 items-center rounded-md border border-input bg-muted/40 px-3 py-1.5 text-sm">
              {effectiveRetour
                ? `Retour le ${formatDateLong(effectiveRetour)} · ${duree} nuits`
                : "Choisissez une date de départ"}
            </div>
          </div>
        ) : (
          <PriceDatePicker
            mode="return"
            id="retour"
            label="Date de retour (facultatif)"
            value={retour}
            onChange={setRetour}
            origin={origin}
            destination={destination}
            tripDuration={0}
            departureAt={depart || null}
            minDate={depart || defaultDate(1)}
          />
        )}

        <PassengerSelector value={passengers} onChange={setPassengers} />

        {!compact && (
          <div className="space-y-1.5">
            <Label htmlFor="budget">Budget maximum (facultatif, en €)</Label>
            <Input
              id="budget"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Ex. 300"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={flexible}
              onCheckedChange={(v) => setFlexible(v === true)}
              aria-label="Dates flexibles à plus ou moins trois jours"
            />
            Dates flexibles ± 3 jours
          </label>
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium">Durée du séjour</legend>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Durée du séjour">
          {TRIP_DURATIONS.map((preset) => (
            <Button
              key={preset.days}
              type="button"
              size="sm"
              variant={duree === preset.days ? "default" : "outline"}
              aria-pressed={duree === preset.days}
              onClick={() => setDuree(preset.days)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {duree > 0
            ? `Séjour de ${duree} nuits — choisissez seulement la date de départ${
                flexible ? ", nous testons aussi les départs à ± 3 jours" : ""
              }.`
            : "Choisissez librement vos dates d'aller et de retour."}
        </p>
      </fieldset>

      <Button
        type="submit"
        variant="cta"
        size="lg"
        className="mt-5 w-full sm:w-auto"
        disabled={resolving}
      >
        <Search className="size-4" aria-hidden />
        {resolving
          ? "Vérification de la destination…"
          : destination || hasTypedDestination
            ? "Chercher le meilleur prix"
            : "Voir où partir avec mon budget"}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        Prix total taxes incluses, vendeur affiché sur chaque résultat. Aucun compte à rebours
        artificiel.
      </p>
    </form>
  );
}
