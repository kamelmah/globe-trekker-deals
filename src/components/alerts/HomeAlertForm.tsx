import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { PlaceAutocomplete } from "@/components/search/PlaceAutocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cityLabel } from "@/data/airports";
import { subscribeToAlert } from "@/lib/flights.functions";

/**
 * Création d'une alerte prix depuis la page d'accueil.
 *
 * Version courte du formulaire de /alertes : départ, destination, email — pas
 * de dates, qui y restent facultatives de toute façon. Les messages sont
 * volontairement identiques à ceux de /alertes : c'est la même action, elle ne
 * doit pas se raconter de deux façons selon la page.
 *
 * Le prix de référence est résolu côté serveur par `createAlert` : la page
 * n'affiche aucun tarif ici, elle n'a donc rien à proposer.
 */
export function HomeAlertForm({ initialOrigin }: { initialOrigin: string }) {
  const creer = useServerFn(subscribeToAlert);

  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState("");
  const [email, setEmail] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [retourCreation, setRetourCreation] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const manqueTrajet = !origin || !destination;

  async function soumettre(event: React.FormEvent) {
    event.preventDefault();
    if (manqueTrajet || !email) return;
    setEnvoiEnCours(true);
    setRetourCreation(null);
    try {
      const resultat = await creer({
        data: {
          email,
          origin,
          destination,
          departDate: null,
          returnDate: null,
          referencePrice: null,
        },
      });
      setRetourCreation({
        ok: resultat.ok,
        message: resultat.ok
          ? `Alerte créée. Vous recevrez un email dès que le prix de ${cityLabel(origin)} → ${cityLabel(destination)} baisse.`
          : resultat.message,
      });
      if (resultat.ok) setEmail("");
    } catch {
      setRetourCreation({
        ok: false,
        message: "Impossible d'enregistrer l'alerte pour le moment.",
      });
    } finally {
      setEnvoiEnCours(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void soumettre(event)}
      className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 [&_input]:h-11"
      aria-label="Création d'une alerte prix"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <PlaceAutocomplete
          id="accueil-alerte-origin"
          label="Départ"
          value={origin}
          onChange={setOrigin}
          placeholder="Ex. Paris, CDG, Marseille…"
        />
        <PlaceAutocomplete
          id="accueil-alerte-destination"
          label="Destination"
          value={destination}
          onChange={setDestination}
          placeholder="Ex. Alger, Barcelone, Lisbonne…"
        />
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="accueil-alerte-email">Votre email</Label>
          <Input
            id="accueil-alerte-email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" disabled={envoiEnCours || manqueTrajet} className="mt-4 h-11 w-full">
        {envoiEnCours ? "Création…" : "Créer mon alerte"}
      </Button>
      {manqueTrajet && (
        <p className="mt-2 text-xs text-muted-foreground">
          Renseignez un départ et une destination pour créer l'alerte.
        </p>
      )}

      {retourCreation && (
        <p
          role="status"
          aria-live="polite"
          className={
            retourCreation.ok
              ? "mt-4 rounded-md border border-primary/40 bg-primary/10 p-3 text-sm text-foreground"
              : "mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground"
          }
        >
          {retourCreation.message}
        </p>
      )}
    </form>
  );
}
