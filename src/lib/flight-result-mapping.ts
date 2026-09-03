/**
 * Passage d'une offre de l'API à la carte de résultat.
 *
 * Toute la couche de rendu lit ce module, et lui seul décide ce que la carte a
 * le droit d'affirmer. Trois règles y sont tenues :
 *
 * 1. `totalPrice` est le prix TOTAL taxes incluses renvoyé par la source, pour
 *    le nombre de voyageurs demandé (la multiplication est faite en amont, voir
 *    passenger-price.ts). Jamais un tarif de base, jamais un prix majoré d'un
 *    supplément bagage : celui-ci est annoncé à part, en toutes lettres.
 * 2. Aucun `priceBreakdown` n'est produit. La source ne ventile pas ses prix
 *    (ni taxes, ni frais de service, vérifié endpoint par endpoint) : fabriquer
 *    une ventilation plausible serait une invention. Sans ventilation, la carte
 *    masque d'elle-même le bouton « Détail du prix ».
 * 3. Une puce bagage n'apparaît que si la compagnie est documentée dans
 *    baggage-fees.ts. Un niveau non documenté n'est ni « inclus » ni « non
 *    proposé » : il n'a pas de puce du tout.
 */

import type {
  BaggagePolicy,
  BaggageState,
  FlightResultCardProps,
} from "@/components/ui/flight-result-card";
import { baggageSupplement, type BaggageSupplement } from "@/data/baggage-fees";
import { sellerNature } from "@/data/sellers";
import { convertFromEur, CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { formatTimeOfDay, parisDayKey } from "@/lib/dates";
import type { FlightOffer } from "@/lib/flights.types";

/**
 * Ce qu'on affiche à la place d'un horaire qu'on n'a pas.
 *
 * La source renvoie une durée à 0 sur une partie des offres : sans elle,
 * l'heure d'arrivée n'existe pas. « 08:50 » calculé sur une durée inconnue
 * serait un chiffre inventé au milieu de chiffres exacts.
 */
const HORAIRE_INCONNU = "?";

/** Symbole de la devise choisie, tel que la carte l'accole au montant. */
export function currencySymbol(currency: CurrencyCode): string {
  return CURRENCIES.find((c) => c.code === currency)?.symbol ?? "€";
}

/** « 1 h 35 » — durée de vol telle qu'elle apparaît sous les horaires. */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

/** Une date nue (« 2026-11-12 ») ne porte pas d'heure : rien à en tirer. */
function hasClockTime(iso: string): boolean {
  return /\d{2}:\d{2}/.test(iso);
}

/**
 * Instant d'atterrissage = décollage + durée.
 *
 * `null` dès qu'un des deux manque. Le résultat est un INSTANT juste ; affiché
 * à l'heure de Paris comme tout instant du site, ce n'est donc pas l'heure
 * locale à destination dès qu'on change de fuseau — la source ne fournit ni
 * heure d'arrivée ni fuseau, et la liste le dit au lecteur.
 */
function arrivalIso(departureAt: string, durationMinutes: number): string | null {
  if (!hasClockTime(departureAt) || durationMinutes <= 0) return null;
  const departure = Date.parse(departureAt);
  if (Number.isNaN(departure)) return null;
  return new Date(departure + durationMinutes * 60000).toISOString();
}

/**
 * Traduction d'un supplément publié en état de puce.
 *
 * Le montant est le PLANCHER publié par la compagnie, par voyageur, converti
 * dans la devise affichée avec le même taux indicatif que le reste du site.
 * « inconnu » ne donne rien : pas de puce plutôt qu'une affirmation.
 */
function baggageState(supplement: BaggageSupplement, currency: CurrencyCode): BaggageState | null {
  if (supplement.kind === "inclus") return { included: true };
  if (supplement.kind === "payant") {
    return { included: false, price: Math.round(convertFromEur(supplement.minEur, currency)) };
  }
  return null;
}

function baggageForCard(airlineCode: string, currency: CurrencyCode): BaggagePolicy | null {
  const personalItem = baggageState(baggageSupplement(airlineCode, "personnel"), currency);
  const cabin = baggageState(baggageSupplement(airlineCode, "cabine"), currency);
  const checked = baggageState(baggageSupplement(airlineCode, "soute"), currency);
  if (!personalItem && !cabin && !checked) return null;
  return {
    ...(personalItem ? { personalItem } : {}),
    ...(cabin ? { cabin } : {}),
    ...(checked ? { checked } : {}),
  };
}

export type ResultCardOptions = {
  /** Devise choisie par le visiteur : la source renvoie déjà ses prix dedans. */
  currency: CurrencyCode;
  /** Une seule carte de la liste porte le prix total le plus bas. */
  best: boolean;
  onSelect?: () => void;
};

export function offerToResultCard(
  offer: FlightOffer,
  { currency, best, onSelect }: ResultCardOptions,
): FlightResultCardProps {
  const arrival = arrivalIso(offer.departureAt, offer.durationMinutes);
  const baggage = baggageForCard(offer.airlineCode, currency);
  // Le nom du vendeur porte son groupe propriétaire : quatre marques d'Etraveli
  // ne sont pas quatre options concurrentes. Vendeur vide = dit comme tel.
  const vendeur = sellerNature(offer.seller, offer.airline);

  return {
    airlineName: offer.airline,
    airlineCode: offer.airlineCode,
    // L'aéroport RÉEL, pas le code ville : la moitié des offres « Paris »
    // partent de Beauvais, à 85 km. Le code ville le masquerait.
    fromIata: offer.originAirport,
    toIata: offer.destinationAirport,
    departTime: hasClockTime(offer.departureAt)
      ? formatTimeOfDay(offer.departureAt)
      : HORAIRE_INCONNU,
    arriveTime: arrival ? formatTimeOfDay(arrival) : HORAIRE_INCONNU,
    ...(arrival && parisDayKey(arrival) !== parisDayKey(offer.departureAt)
      ? { arrivesNextDay: true }
      : {}),
    duration:
      offer.durationMinutes > 0 ? formatDuration(offer.durationMinutes) : "durée non communiquée",
    stops: offer.stops,
    totalPrice: offer.priceEur,
    currency: currencySymbol(currency),
    seller: vendeur.label,
    bookingUrl: offer.bookingUrl,
    ...(baggage ? { baggage } : {}),
    ...(offer.observedAt ? { observedAt: offer.observedAt } : {}),
    best,
    ...(onSelect ? { onSelect } : {}),
  };
}
