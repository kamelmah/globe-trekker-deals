export type FlightOffer = {
  id: string;
  origin: string;
  destination: string;
  /** Prix total taxes incluses, en euros. */
  priceEur: number;
  airline: string;
  airlineCode: string;
  /** Vendeur réel du billet (compagnie ou agence), jamais anonyme. */
  seller: string;
  flightNumber: string;
  departureAt: string;
  returnAt: string | null;
  durationMinutes: number;
  stops: number;
  cabinBag: boolean;
  checkedBag: boolean;
  co2Kg: number;
  bookingUrl: string;
  isDemo: boolean;
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
  isDemo: boolean;
};

export type CalendarDayPrice = {
  date: string;
  priceEur: number;
};

export type MonthlyPrice = {
  month: string;
  priceEur: number;
};
