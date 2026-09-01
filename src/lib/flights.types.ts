export type FlightOffer = {
  id: string;
  origin: string;
  destination: string;
  /**
   * Aéroport RÉEL du vol, distinct du code ville.
   *
   * La moitié des offres annoncées « Paris » partent en fait de Beauvais, à
   * 85 km, avec une navette payante à la clé (mesuré : 156 offres sur 313).
   * Afficher « Paris » sans le préciser masque un coût que le voyageur
   * découvre trop tard. La donnée est renseignée à 100 % par l'API.
   */
  originAirport: string;
  destinationAirport: string;
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
  /**
   * Volontairement absent : l'API ne renvoie aucun champ bagage exploitable
   * (vérifié en direct). Un ancien code affichait "bagage cabine inclus" en
   * dur, ce qui s'est avéré faux (objet personnel seul, pas de vraie valise
   * cabine). L'affichage renvoie désormais vers le vendeur plutôt que
   * d'affirmer un niveau d'inclusion qu'on ne peut pas garantir.
   */
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
  /**
   * Aéroports réels, quand la source les fournit. Le balayage mondial fusionne
   * trois endpoints et seul `prices_for_dates` porte cette information : sur la
   * carte du mode budget, l’absence d’avertissement ne prouve donc pas l’absence
   * d’aéroport secondaire. Sur l’accueil, où cette source est la seule utilisée,
   * la couverture est complète.
   */
  originAirport?: string;
  destinationAirport?: string;
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
  /** Date ISO du relevé, telle qu'enregistrée en base. Absente si inconnue. */
  updatedAt?: string;
};

/** Trace de l'appel API, exposée uniquement en développement. */
export type ApiDebugInfo = {
  endpoint: string;
  params: Record<string, string>;
  status: number;
  body: string;
};
