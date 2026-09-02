export type Airport = {
  code: string;
  city: string;
  country: string;
  name: string;
  lat: number;
  lng: number;
};

/** Aéroports / villes couverts par la recherche et la carte du mode budget. */
export const AIRPORTS: Airport[] = [
  {
    code: "PAR",
    city: "Paris",
    country: "France",
    name: "Paris (tous aéroports)",
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    code: "LYS",
    city: "Lyon",
    country: "France",
    name: "Lyon Saint-Exupéry",
    lat: 45.7256,
    lng: 5.0811,
  },
  {
    code: "MRS",
    city: "Marseille",
    country: "France",
    name: "Marseille Provence",
    lat: 43.4393,
    lng: 5.2214,
  },
  {
    code: "BOD",
    city: "Bordeaux",
    country: "France",
    name: "Bordeaux-Mérignac",
    lat: 44.8283,
    lng: -0.7156,
  },
  {
    code: "NCE",
    city: "Nice",
    country: "France",
    name: "Nice Côte d'Azur",
    lat: 43.6584,
    lng: 7.2159,
  },
  {
    code: "TLS",
    city: "Toulouse",
    country: "France",
    name: "Toulouse-Blagnac",
    lat: 43.6293,
    lng: 1.3638,
  },
  {
    code: "NTE",
    city: "Nantes",
    country: "France",
    name: "Nantes Atlantique",
    lat: 47.1532,
    lng: -1.6107,
  },
  {
    code: "BRU",
    city: "Bruxelles",
    country: "Belgique",
    name: "Bruxelles",
    lat: 50.9014,
    lng: 4.4844,
  },
  {
    code: "GVA",
    city: "Genève",
    country: "Suisse",
    name: "Genève Cointrin",
    lat: 46.2381,
    lng: 6.1089,
  },
  {
    code: "RAK",
    city: "Marrakech",
    country: "Maroc",
    name: "Marrakech Ménara",
    lat: 31.6069,
    lng: -8.0363,
  },
  {
    code: "BKK",
    city: "Bangkok",
    country: "Thaïlande",
    name: "Bangkok Suvarnabhumi",
    lat: 13.6899,
    lng: 100.7501,
  },
  {
    code: "NYC",
    city: "New York",
    country: "États-Unis",
    name: "New York (tous aéroports)",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    code: "LIS",
    city: "Lisbonne",
    country: "Portugal",
    name: "Lisbonne Humberto Delgado",
    lat: 38.7742,
    lng: -9.1342,
  },
  {
    code: "BCN",
    city: "Barcelone",
    country: "Espagne",
    name: "Barcelone El Prat",
    lat: 41.2971,
    lng: 2.0785,
  },
  {
    code: "IST",
    city: "Istanbul",
    country: "Turquie",
    name: "Istanbul Airport",
    lat: 41.2753,
    lng: 28.7519,
  },
  {
    code: "DXB",
    city: "Dubaï",
    country: "Émirats arabes unis",
    name: "Dubaï International",
    lat: 25.2532,
    lng: 55.3657,
  },
  {
    code: "TYO",
    city: "Tokyo",
    country: "Japon",
    name: "Tokyo (Narita / Haneda)",
    lat: 35.6762,
    lng: 139.6503,
  },
  {
    code: "ALG",
    city: "Alger",
    country: "Algérie",
    name: "Alger Houari Boumédiène",
    lat: 36.691,
    lng: 3.2154,
  },
  {
    code: "ROM",
    city: "Rome",
    country: "Italie",
    name: "Rome (Fiumicino / Ciampino)",
    lat: 41.9028,
    lng: 12.4964,
  },
  {
    code: "ATH",
    city: "Athènes",
    country: "Grèce",
    name: "Athènes Elefthérios-Venizélos",
    lat: 37.9838,
    lng: 23.7275,
  },
  {
    code: "MAD",
    city: "Madrid",
    country: "Espagne",
    name: "Madrid Barajas",
    lat: 40.4168,
    lng: -3.7038,
  },
  {
    code: "LON",
    city: "Londres",
    country: "Royaume-Uni",
    name: "Londres (tous aéroports)",
    lat: 51.5072,
    lng: -0.1276,
  },
  {
    code: "BER",
    city: "Berlin",
    country: "Allemagne",
    name: "Berlin Brandebourg",
    lat: 52.52,
    lng: 13.405,
  },
  {
    code: "PRG",
    city: "Prague",
    country: "Tchéquie",
    name: "Prague Václav-Havel",
    lat: 50.0755,
    lng: 14.4378,
  },
  {
    code: "BUD",
    city: "Budapest",
    country: "Hongrie",
    name: "Budapest Ferenc-Liszt",
    lat: 47.4979,
    lng: 19.0402,
  },
  {
    code: "OPO",
    city: "Porto",
    country: "Portugal",
    name: "Porto Francisco-Sá-Carneiro",
    lat: 41.1579,
    lng: -8.6291,
  },
  {
    code: "AGP",
    city: "Malaga",
    country: "Espagne",
    name: "Malaga Costa del Sol",
    lat: 36.7213,
    lng: -4.4213,
  },
  {
    code: "PMI",
    city: "Palma",
    country: "Espagne",
    name: "Palma de Majorque",
    lat: 39.5696,
    lng: 2.6502,
  },
  {
    code: "CMN",
    city: "Casablanca",
    country: "Maroc",
    name: "Casablanca Mohammed-V",
    lat: 33.5731,
    lng: -7.5898,
  },
  {
    code: "TUN",
    city: "Tunis",
    country: "Tunisie",
    name: "Tunis-Carthage",
    lat: 36.8065,
    lng: 10.1815,
  },
  {
    code: "CAI",
    city: "Le Caire",
    country: "Égypte",
    name: "Le Caire International",
    lat: 30.0444,
    lng: 31.2357,
  },
  {
    code: "DSS",
    city: "Dakar",
    country: "Sénégal",
    name: "Dakar Blaise-Diagne",
    lat: 14.6708,
    lng: -17.0731,
  },
  {
    code: "DEL",
    city: "Delhi",
    country: "Inde",
    name: "Delhi Indira-Gandhi",
    lat: 28.6139,
    lng: 77.209,
  },
  {
    code: "DPS",
    city: "Bali",
    country: "Indonésie",
    name: "Denpasar Ngurah-Rai",
    lat: -8.7467,
    lng: 115.1668,
  },
  {
    code: "SGN",
    city: "Hô Chi Minh-Ville",
    country: "Vietnam",
    name: "Tân Sơn Nhất",
    lat: 10.8231,
    lng: 106.6297,
  },
  {
    code: "MEX",
    city: "Mexico",
    country: "Mexique",
    name: "Mexico Benito-Juárez",
    lat: 19.4326,
    lng: -99.1332,
  },
  {
    code: "YUL",
    city: "Montréal",
    country: "Canada",
    name: "Montréal-Trudeau",
    lat: 45.5019,
    lng: -73.5674,
  },
  {
    code: "GRU",
    city: "São Paulo",
    country: "Brésil",
    name: "São Paulo Guarulhos",
    lat: -23.5505,
    lng: -46.6333,
  },
  {
    code: "EZE",
    city: "Buenos Aires",
    country: "Argentine",
    name: "Buenos Aires Ezeiza",
    lat: -34.6037,
    lng: -58.3816,
  },
  {
    code: "JNB",
    city: "Johannesburg",
    country: "Afrique du Sud",
    name: "Johannesburg OR-Tambo",
    lat: -26.2041,
    lng: 28.0473,
  },
  {
    code: "RUN",
    city: "Saint-Denis",
    country: "La Réunion",
    name: "La Réunion Roland-Garros",
    lat: -20.8823,
    lng: 55.4504,
  },
  {
    code: "PTP",
    city: "Pointe-à-Pitre",
    country: "Guadeloupe",
    name: "Pointe-à-Pitre Le Raizet",
    lat: 16.2415,
    lng: -61.5331,
  },
  {
    code: "FDF",
    city: "Fort-de-France",
    country: "Martinique",
    name: "Martinique Aimé-Césaire",
    lat: 14.6042,
    lng: -61.0672,
  },
  {
    code: "SIN",
    city: "Singapour",
    country: "Singapour",
    name: "Singapour Changi",
    lat: 1.3521,
    lng: 103.8198,
  },
  {
    code: "REK",
    city: "Reykjavik",
    country: "Islande",
    name: "Reykjavik Keflavik",
    lat: 64.1466,
    lng: -21.9426,
  },
  {
    code: "OSL",
    city: "Oslo",
    country: "Norvège",
    name: "Oslo Gardermoen",
    lat: 59.9139,
    lng: 10.7522,
  },
  {
    code: "CPH",
    city: "Copenhague",
    country: "Danemark",
    name: "Copenhague Kastrup",
    lat: 55.6761,
    lng: 12.5683,
  },
  {
    code: "DUB",
    city: "Dublin",
    country: "Irlande",
    name: "Dublin Airport",
    lat: 53.3498,
    lng: -6.2603,
  },
  {
    code: "VIE",
    city: "Vienne",
    country: "Autriche",
    name: "Vienne Schwechat",
    lat: 48.2082,
    lng: 16.3738,
  },
  {
    code: "AMS",
    city: "Amsterdam",
    country: "Pays-Bas",
    name: "Amsterdam Schiphol",
    lat: 52.3676,
    lng: 4.9041,
  },
  /*
   * Maghreb secondaire : ces onze destinations sont dans la liste blanche des
   * trajets vérifiés mais manquaient ici, si bien que cityLabel() retombait sur
   * le code IATA — les emails d'alerte annonçaient « Marseille → ORN » au lieu
   * de « Marseille → Oran », sur nos trajets les plus utilisés. Les noms de
   * ville reprennent `destinationCity` de la liste blanche, coordonnées de
   * l'aéroport lui-même (elles servent aussi au calcul de distance et de CO2).
   */
  {
    code: "ORN",
    city: "Oran",
    country: "Algérie",
    name: "Oran Ahmed Ben Bella",
    lat: 35.6239,
    lng: -0.6214,
  },
  {
    code: "AAE",
    city: "Annaba",
    country: "Algérie",
    name: "Annaba Rabah Bitat",
    lat: 36.8221,
    lng: 7.8092,
  },
  {
    code: "CZL",
    city: "Constantine",
    country: "Algérie",
    name: "Constantine Mohamed Boudiaf",
    lat: 36.2794,
    lng: 6.6203,
  },
  {
    code: "BJA",
    city: "Béjaïa",
    country: "Algérie",
    name: "Béjaïa Soummam — Abane Ramdane",
    lat: 36.7119,
    lng: 5.0692,
  },
  {
    code: "TLM",
    city: "Tlemcen",
    country: "Algérie",
    name: "Tlemcen Zenata — Messali El Hadj",
    lat: 35.0164,
    lng: -1.45,
  },
  {
    code: "QSF",
    city: "Sétif",
    country: "Algérie",
    name: "Sétif Aïn Arnat",
    lat: 36.1781,
    lng: 5.3244,
  },
  {
    code: "TNG",
    city: "Tanger",
    country: "Maroc",
    name: "Tanger Ibn Battouta",
    lat: 35.7267,
    lng: -5.9169,
  },
  {
    code: "FEZ",
    city: "Fès",
    country: "Maroc",
    name: "Fès Saïss",
    lat: 33.9272,
    lng: -4.9778,
  },
  {
    code: "AGA",
    city: "Agadir",
    country: "Maroc",
    name: "Agadir Al Massira",
    lat: 30.325,
    lng: -9.4131,
  },
  {
    code: "DJE",
    city: "Djerba",
    country: "Tunisie",
    name: "Djerba-Zarzis",
    lat: 33.875,
    lng: 10.7753,
  },
  {
    code: "MIR",
    city: "Monastir",
    country: "Tunisie",
    name: "Monastir Habib Bourguiba",
    lat: 35.7581,
    lng: 10.7547,
  },
];

const BY_CODE = new Map(AIRPORTS.map((a) => [a.code, a]));

export function getAirport(code: string): Airport | undefined {
  return BY_CODE.get(code.toUpperCase());
}

export function cityLabel(code: string): string {
  return getAirport(code)?.city ?? code;
}

/* -------------------------------------------------------------------------- */
/* Aéroports secondaires                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Aéroports vendus sous le nom d'une grande ville dont ils sont en réalité
 * éloignés.
 *
 * C'est un coût caché de premier ordre, et l'un des plus fréquents : sur nos
 * résultats, la moitié des offres annoncées « Paris » partent de Beauvais
 * (156 sur 313), et 29 arrivées « Milan » sur 71 se posent à Bergame. Un billet
 * annoncé moins cher que celui de Roissy peut revenir plus cher une fois la
 * navette payée, dans les deux sens.
 *
 * Le PRIX de la navette n'est volontairement pas stocké : il change selon
 * l'opérateur, l'horaire et l'anticipation. Une mention qualitative vieillit
 * bien, un chiffre faux discrédite tout le reste.
 *
 * Table extensible : une ligne par aéroport.
 */
export type SecondaryAirport = {
  /** Code IATA de l'aéroport réel. */
  code: string;
  /** Nom complet tel qu'affiché, ex. « Paris Beauvais ». */
  name: string;
  /** Ville sous le nom de laquelle il est commercialisé. */
  city: string;
  /** Distance routière approximative jusqu'au centre-ville, en km. */
  distanceKm: number;
  /** Mode d'accès dominant, sans tarif : « navette payante », « train »… */
  access: string;
};

export const SECONDARY_AIRPORTS: readonly SecondaryAirport[] = [
  { code: "BVA", name: "Paris Beauvais", city: "Paris", distanceKm: 85, access: "navette payante" },
  { code: "BGY", name: "Milan Bergame", city: "Milan", distanceKm: 50, access: "navette payante" },
  {
    code: "CRL",
    name: "Bruxelles Charleroi",
    city: "Bruxelles",
    distanceKm: 55,
    access: "navette payante",
  },
  {
    code: "HHN",
    name: "Francfort-Hahn",
    city: "Francfort",
    distanceKm: 120,
    access: "navette payante",
  },
  { code: "GRO", name: "Gérone", city: "Barcelone", distanceKm: 100, access: "navette payante" },
  { code: "REU", name: "Reus", city: "Barcelone", distanceKm: 100, access: "navette payante" },
  {
    code: "NYO",
    name: "Stockholm Skavsta",
    city: "Stockholm",
    distanceKm: 100,
    access: "navette payante",
  },
  { code: "TRF", name: "Oslo Torp", city: "Oslo", distanceKm: 110, access: "train ou navette" },
  { code: "NRN", name: "Weeze", city: "Düsseldorf", distanceKm: 80, access: "navette payante" },
];

const SECONDARY_BY_CODE = new Map(SECONDARY_AIRPORTS.map((a) => [a.code, a]));

/** L'aéroport est-il un secondaire éloigné de la ville qu'il annonce ? */
export function secondaryAirport(code: string | null | undefined): SecondaryAirport | undefined {
  return code ? SECONDARY_BY_CODE.get(code.toUpperCase()) : undefined;
}

/**
 * Libellé d'un aéroport pour l'affichage : « Paris Beauvais (BVA) ».
 *
 * `cityFallback` sert quand l'aéroport n'est ni dans la liste principale ni
 * dans celle des secondaires : on affiche alors la ville connue et le code,
 * plutôt que d'inventer un nom.
 */
export function airportLabel(code: string, cityFallback?: string): string {
  const upper = code.toUpperCase();
  const nom = secondaryAirport(upper)?.name ?? getAirport(upper)?.name ?? cityFallback ?? upper;
  return `${nom} (${upper})`;
}

/** Aéroports parisiens considérés comme principaux, au sens du filtre. */
export const PARIS_MAIN_AIRPORTS = ["CDG", "ORY"];

/** Destinations proposées sur la carte du mode budget. */
export const BUDGET_DESTINATION_CODES = [
  "RAK",
  "BKK",
  "NYC",
  "LIS",
  "BCN",
  "IST",
  "DXB",
  "TYO",
  "ALG",
  "ROM",
  "ATH",
  "MAD",
  "LON",
  "BER",
  "PRG",
  "BUD",
  "OPO",
  "AGP",
  "PMI",
  "CMN",
  "TUN",
  "CAI",
  "DSS",
  "DEL",
  "DPS",
  "SGN",
  "MEX",
  "YUL",
  "GRU",
  "EZE",
  "JNB",
  "RUN",
  "PTP",
  "FDF",
  "SIN",
  "REK",
  "OSL",
  "CPH",
  "DUB",
  "VIE",
  "AMS",
];

/** Distance en km entre deux aéroports (formule de haversine). */
export function distanceKm(originCode: string, destinationCode: string): number {
  const a = getAirport(originCode);
  const b = getAirport(destinationCode);
  if (!a || !b) return 1000;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}
