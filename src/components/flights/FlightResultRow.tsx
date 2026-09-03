/**
 * Une ligne de résultat : la carte, et ce que la carte ne peut pas porter.
 *
 * `FlightResultCard` ne montre que des heures, pas de DATE. Sur une recherche à
 * dates flexibles, la liste contient un vol par jour testé : sans la date
 * au-dessus de chaque carte, deux résultats identiques à 07:15 seraient
 * indiscernables. Trois autres informations restent ici pour la même raison —
 * elles n'ont pas de logement dans la carte, et les taire reviendrait à laisser
 * croire à ce que nous ne savons pas :
 *
 * - l'âge du relevé : au-delà de 24 h le montant n'est plus un prix ferme mais
 *   une estimation, et la carte l'affiche pourtant en gros et en net ;
 * - l'aéroport secondaire (Beauvais vendu comme « Paris », à 85 km) ;
 * - la vente directe par la compagnie, seul cas où aucun frais de service
 *   d'agence ne peut s'ajouter au paiement.
 */

import { AlertTriangle, BadgeCheck, Clock, Leaf, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { FlightResultCard } from "@/components/ui/flight-result-card";
import { secondaryAirport } from "@/data/airports";
import { sellerNature } from "@/data/sellers";
import { trackEvent } from "@/lib/analytics";
import type { CurrencyCode } from "@/lib/currency";
import { formatDateCompact } from "@/lib/dates";
import { offerToResultCard } from "@/lib/flight-result-mapping";
import type { FlightOffer } from "@/lib/flights.types";
import { computeFreshness, type Freshness, type FreshnessTone } from "@/lib/freshness";

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

export function FlightResultRow({
  offer,
  currency,
  best = false,
  greenest = false,
}: {
  offer: FlightOffer;
  currency: CurrencyCode;
  /** Prix total le plus bas de la liste. Une seule ligne peut le porter. */
  best?: boolean;
  greenest?: boolean;
}) {
  // La date de relevé vient du VENDEUR (le paramètre `search_date` du lien),
  // pas de notre propre rafraîchissement : nous constatons l'âge du prix, nous
  // ne le maîtrisons pas.
  const freshness = useFreshness(offer.observedAt);
  const vendeur = sellerNature(offer.seller, offer.airline);
  const departSecondaire = secondaryAirport(offer.originAirport);
  const arriveeSecondaire = secondaryAirport(offer.destinationAirport);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {/* La carte n'affiche que des heures : la date de départ n'existe nulle
            part ailleurs, et elle change d'une ligne à l'autre en dates flexibles. */}
        <Badge variant="outline">
          Départ {formatDateCompact(offer.departureAt.slice(0, 10))}
          {offer.returnAt ? ` · retour ${formatDateCompact(offer.returnAt.slice(0, 10))}` : ""}
        </Badge>

        {vendeur.kind === "compagnie" && (
          <Badge className="bg-success text-success-foreground">
            <BadgeCheck className="mr-1 size-3" aria-hidden />
            Vente directe compagnie
          </Badge>
        )}

        {greenest && (
          <Badge className="bg-success text-success-foreground">
            <Leaf className="mr-1 size-3" aria-hidden />
            Vol plus écologique
          </Badge>
        )}

        {/* Un prix de plus de 24 h reste affiché en gros sur la carte : c'est ici
            qu'il est dit qu'il n'est plus ferme. */}
        {freshness && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${TONE_CLASS[freshness.tone]}`}
          >
            {freshness.tone === "ancien" ? (
              <AlertTriangle className="size-3 shrink-0" aria-hidden />
            ) : (
              <Clock className="size-3 shrink-0" aria-hidden />
            )}
            {freshness.label}
            {freshness.estimate ? " — prix à confirmer chez le vendeur" : ""}
          </span>
        )}
      </div>

      {/*
        L'aéroport réel, pas le code ville : la moitié des offres « Paris »
        partent de Beauvais, à 85 km, avec une navette payante à la clé. Le
        trajet vers le centre est un coût que le voyageur doit voir avant de
        cliquer, pas découvrir en arrivant.
      */}
      {(departSecondaire || arriveeSecondaire) && (
        <ul className="mb-2 space-y-0.5">
          {[departSecondaire, arriveeSecondaire].filter(Boolean).map((a) => (
            <li
              key={a!.code}
              className="inline-flex items-start gap-1 text-xs text-warning-foreground"
            >
              <TriangleAlert className="mt-0.5 size-3 shrink-0" aria-hidden />
              <span className="rounded bg-warning px-1.5 py-0.5">
                {a!.code} est à {a!.distanceKm} km de {a!.city} — {a!.access} à prévoir
              </span>
            </li>
          ))}
        </ul>
      )}

      <FlightResultCard
        {...offerToResultCard(offer, {
          currency,
          best,
          /*
           * Le seul point du site où l'on quitte TrouveMonVol pour un vol.
           * On mesure quel VENDEUR est choisi et sur quel trajet : c'est ce
           * qui dit si l'ordre des résultats correspond à ce que les gens
           * retiennent. Aucun prix n'est envoyé — il change d'une minute à
           * l'autre et rendrait la donnée illisible plutôt qu'utile.
           */
          onSelect: () =>
            trackEvent("clic_vol_sortant", {
              vendeur: offer.seller,
              trajet: `${offer.originAirport}-${offer.destinationAirport}`,
            }),
        })}
      />
    </div>
  );
}
