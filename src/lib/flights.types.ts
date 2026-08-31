export type FlightOffer = {
  id: string;
  origin: string;
  destination: string;
  /** Prix total taxes incluses, en euros, tel que renvoyé par l'API. */
  priceEur: number;
  airline: string;
  airlineCode: string;
  /** Vendeur réel du billet renvoyé par l'API (compagnie ou agence nommée). */
  seller: string;
  flightNumber: string;
  departureAt: string;
  returnAt: string | null;
  durationMinutes: number;
  stops: number;
  cabinBag: boolean;
  checkedBag: boolean;
  co2Kg: number;
  /**
   * Date ISO à laquelle ce prix a été relevé, si connue. L'API ne fournit
   * aucun champ de fraîcheur exploitable directement (`found_at` n'existe
   * pas dans les réponses réelles) : cette date vient du paramètre
   * `search_date` caché dans le lien de réservation, seule donnée fiable.
   * `null` = fraîcheur inconnue — ne jamais l'interpréter comme "à l'instant".
   */
  observedAt: string | null;
  /** Lien de réservation exact renvoyé par l'API, avec le marker d'affiliation. */
  bookingUrl: string;
};

export type DestinationPrice = {
  destination: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  priceEur: number;
  airline: string;
  departureAt: string;
};

export type CalendarDayPrice = {
  date: string;
  priceEur: number;
};

export type MonthlyPrice = {
  month: string;
  priceEur: number;
};

/** Trace de l'appel API, exposée uniquement en développement. */
export type ApiDebugInfo = {
  endpoint: string;
  params: Record<string, string>;
  status: number;
  body: string;
};
