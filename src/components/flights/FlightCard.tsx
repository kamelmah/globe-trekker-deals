import { useEffect, useState } from "react";
import { formatDateTimeCompact, formatDateTimeShort } from "@/lib/dates";
import { AlertTriangle, Luggage, Leaf, Plane, Store, Clock } from "lucide-react";

import { co2Label } from "@/lib/co2";
import { useCurrency } from "@/lib/currency-context";
import type { FlightOffer } from "@/lib/flights.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDuration(minutes: number): string {
  if (!minutes) return "Durée non communiquée";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

const formatTime = formatDateTimeCompact;

/**
 * Seuil de fermeté du prix.
 *
 * Au-delà de 24 h, le montant n'est plus présenté comme un prix : il devient
 * explicitement une estimation, et le bouton de réservation perd son style
 * principal. Un tarif de plusieurs jours peut avoir dérivé de 30 % ou plus chez
 * le vendeur au moment du clic — l'annoncer comme ferme serait une pratique
 * commerciale trompeuse.
 *
 * La date de relevé vient du vendeur (`found_at` / `search_date` renvoyés par
 * l'API), pas de notre propre rafraîchissement : nous constatons l'âge du prix,
 * nous ne le maîtrisons pas.
 */
const ESTIMATE_THRESHOLD_MS = 24 * 60 * 60 * 1000;

/** En deçà, le relevé est assez récent pour être signalé en vert. */
const FRESH_THRESHOLD_MS = 60 * 60 * 1000;

type FreshnessTone = "frais" | "neutre" | "ancien";
type Freshness = { label: string; tone: FreshnessTone; estimate: boolean };

/** Fraîcheur du relevé de prix, calculée côté client pour éviter tout écart SSR. */
function computeFreshness(iso: string | null): Freshness {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) {
    // Âge inconnu : on ne peut pas affirmer que le prix est ferme.
    return { label: "date de relevé inconnue", tone: "ancien", estimate: true };
  }
  const ageMs = Date.now() - d.getTime();
  const minutes = Math.max(0, Math.round(ageMs / 60000));
  let label: string;
  if (minutes < 1) label = "relevé à l'instant";
  else if (minutes < 60) label = `relevé il y a ${minutes} min`;
  else {
    const hours = Math.round(minutes / 60);
    label =
      hours < 24 ? `relevé il y a ${hours} h` : `relevé le ${formatDateTimeShort(d.toISOString())}`;
  }
  const tone: FreshnessTone =
    ageMs < FRESH_THRESHOLD_MS ? "frais" : ageMs <= ESTIMATE_THRESHOLD_MS ? "neutre" : "ancien";
  return { label, tone, estimate: ageMs > ESTIMATE_THRESHOLD_MS };
}

/**
 * `--warning` seul ne passe en texte dans aucun des deux thèmes : trop clair sur
 * fond clair, et `--warning-foreground` est une couleur prévue POUR un fond
 * warning. Au-delà de 24 h on utilise donc la paire telle qu'elle a été conçue,
 * en pastille — ce qui appuie au passage l'avertissement.
 */
const TONE_CLASS: Record<FreshnessTone, string> = {
  frais: "text-success",
  neutre: "text-muted-foreground",
  ancien: "rounded-md bg-warning px-2 py-0.5 text-warning-foreground",
};

function useFreshness(iso: string | null): Freshness | null {
  // null tant que non monté côté client : évite un écart de rendu SSR, la
  // fraîcheur dépend de l'instant présent (Date.now()) donc jamais fiable côté serveur.
  const [freshness, setFreshness] = useState<Freshness | null>(null);
  useEffect(() => {
    setFreshness(computeFreshness(iso));
    const timer = setInterval(() => setFreshness(computeFreshness(iso)), 60000);
    return () => clearInterval(timer);
  }, [iso]);
  return freshness;
}

function stopsLabel(stops: number): string {
  if (stops === 0) return "Vol direct";
  return stops === 1 ? "1 escale" : `${stops} escales`;
}

export function FlightCard({
  offer,
  greenest = false,
}: {
  offer: FlightOffer;
  greenest?: boolean;
}) {
  const { formatApi: format } = useCurrency();
  const freshness = useFreshness(offer.observedAt);

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <Plane className="size-4 text-primary" aria-hidden />
              {offer.airline}
            </span>
            <Badge variant="secondary">{stopsLabel(offer.stops)}</Badge>
            <Badge variant="outline">{formatDuration(offer.durationMinutes)}</Badge>
            {greenest && (
              <Badge className="bg-success text-success-foreground">
                <Leaf className="mr-1 size-3" aria-hidden />
                Vol plus écologique
              </Badge>
            )}
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Départ {formatTime(offer.departureAt)}
            {offer.returnAt ? ` · retour ${formatTime(offer.returnAt)}` : " · aller simple"} · vol{" "}
            {offer.flightNumber}
          </p>

          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-sm font-medium">
            <Store className="size-4 text-primary" aria-hidden />
            Vendu par {offer.seller}
          </p>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <li className="inline-flex items-center gap-1">
              <Luggage className="size-3.5" aria-hidden />
              Bagages : à vérifier chez le vendeur avant de réserver
            </li>
            <li>Empreinte estimée : {co2Label(offer.co2Kg)}</li>
          </ul>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
          {/*
            Au-delà de 24 h le montant cesse d'être présenté comme un prix : le
            tilde, la mention « estimation » et la typo atténuée disent la même
            chose que le libellé de fraîcheur juste en dessous.
          */}
          {freshness?.estimate ? (
            <p className="font-display text-2xl font-medium text-muted-foreground">
              ~{format(offer.priceEur)} <span className="text-sm font-normal">(estimation)</span>
            </p>
          ) : (
            <p className="font-display text-2xl font-semibold">{format(offer.priceEur)}</p>
          )}

          {/* La fraîcheur est portée par le prix lui-même, pas reléguée à côté. */}
          {freshness && (
            <p
              className={`inline-flex items-center gap-1 text-xs font-medium ${TONE_CLASS[freshness.tone]}`}
            >
              {freshness.tone === "ancien" ? (
                <AlertTriangle className="size-3 shrink-0" aria-hidden />
              ) : (
                <Clock className="size-3 shrink-0" aria-hidden />
              )}
              {freshness.label}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            {freshness?.estimate
              ? "Estimation d'après un relevé ancien — prix à confirmer chez le vendeur"
              : "Prix total, taxes incluses"}
          </p>

          <Button asChild variant={freshness?.estimate ? "outline" : "default"} className="mt-1">
            <a href={offer.bookingUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">
              {freshness?.estimate ? "Vérifier chez" : "Réserver chez"} {offer.seller}
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
