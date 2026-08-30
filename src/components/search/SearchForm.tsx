import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { PlaceAutocomplete } from "@/components/search/PlaceAutocomplete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


function defaultDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export type SearchFormProps = {
  initialOrigin?: string;
  initialDestination?: string;
  compact?: boolean;
};

export function SearchForm({
  initialOrigin = "PAR",
  initialDestination = "",
  compact = false,
}: SearchFormProps) {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [depart, setDepart] = useState(defaultDate(30));
  const [retour, setRetour] = useState("");
  const [flexible, setFlexible] = useState(true);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState("");


  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!destination) {
      navigate({
        to: "/mode-budget",
        search: { origin, budget: budget ? Number(budget) : 400, month: "" },
      });
      return;
    }
    navigate({
      to: "/recherche",
      search: {
        origin,
        destination,
        depart,
        retour,
        flexible: flexible ? 1 : 0,
        budget: budget ? Number(budget) : 0,
        adultes: adults,
        enfants: children,
        vue: "liste",
      },
    });
  }

  return (
    <form
      onSubmit={submit}
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
          onChange={setDestination}
          placeholder="Peu importe — mode budget"
          allowEmpty
        />


        <div className="space-y-1.5">
          <Label htmlFor="depart">Date de départ</Label>
          <Input
            id="depart"
            type="date"
            value={depart}
            min={defaultDate(1)}
            onChange={(e) => setDepart(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="retour">Date de retour (facultatif)</Label>
          <Input
            id="retour"
            type="date"
            value={retour}
            min={depart}
            onChange={(e) => setRetour(e.target.value)}
          />
        </div>

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

      <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto">
        <Search className="size-4" aria-hidden />
        {destination ? "Comparer les vols" : "Voir où partir avec mon budget"}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        Prix total taxes incluses, vendeur affiché sur chaque résultat. Aucun compte
        à rebours artificiel.
      </p>
    </form>
  );
}
