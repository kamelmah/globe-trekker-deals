/**
 * Formalités par pays (/conseils/formalites/<slug>) : visa, passeport, vaccins
 * et particularités pratiques pour les voyageurs français. Complète la ligne
 * "Formalités pour les Français" (une phrase) affichée sur chaque guide
 * destination — ces informations ne remplacent jamais une vérification sur
 * France Diplomatie ou auprès du consulat concerné avant de partir.
 */

export type TravelDocumentCountry = {
  slug: string;
  country: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  updated: string;
  visa: string;
  passport: string;
  vaccines: string;
  specifics: string;
  goodToKnow: string[];
  /** Slugs CITY_GUIDES concernés par ce pays. */
  relatedGuideSlugs: string[];
  /** Slugs DESTINATIONS (/vols/<slug>) concernés par ce pays. */
  relatedDestinationSlugs: string[];
};

export const TRAVEL_DOCUMENTS: TravelDocumentCountry[] = [
  {
    slug: "maroc",
    country: "Maroc",
    metaTitle: "Formalités pour le Maroc : visa, passeport, vaccins | TrouveMonVol",
    metaDescription:
      "Visa, validité du passeport, vaccins recommandés et change du dirham : les formalités à connaître pour les voyageurs français avant de partir au Maroc.",
    intro:
      "Pour un séjour touristique au Maroc, les ressortissants français n'ont besoin d'aucun visa — mais quelques points méritent d'être vérifiés avant de partir, notamment sur le change de devises et les vaccins recommandés.",
    updated: "2026-09-01",
    visa: "Aucun visa n'est requis pour un séjour touristique de moins de 90 jours. Le tampon d'entrée est apposé au poste frontière sur simple présentation du passeport ; aucune démarche préalable n'est nécessaire pour les citoyens français.",
    passport:
      "Passeport en cours de validité à la date d'entrée. Une marge de 6 mois après la date de retour n'est pas exigée par la réglementation marocaine, mais reste une précaution raisonnable en cas de prolongation imprévue du séjour. La carte d'identité seule n'est pas acceptée.",
    vaccines:
      "Aucun vaccin n'est obligatoire pour entrer au Maroc depuis la France. Les vaccinations universelles (DTP, hépatite B) à jour sont recommandées, ainsi que l'hépatite A pour les séjours prolongés ou hors circuits touristiques classiques. Ces recommandations évoluent : vérifiez-les auprès d'un centre de vaccination international avant de partir.",
    specifics:
      "Le dirham marocain (MAD) est une devise non convertible hors du pays : il ne peut ni s'acheter ni se revendre en France. Toute somme en espèces supérieure à 100 000 MAD doit être déclarée à l'entrée comme à la sortie. Conservez les reçus de change si vous comptez reconvertir des dirhams au départ.",
    goodToKnow: [
      "Aucun test sanitaire ni certificat particulier n'est exigé à l'entrée.",
      "Une assurance voyage n'est pas obligatoire mais fortement recommandée, le coût des soins hors système conventionné pouvant être élevé.",
      "Un mineur voyageant sans ses deux parents doit présenter une autorisation de sortie du territoire signée par le parent absent.",
    ],
    relatedGuideSlugs: ["marrakech"],
    relatedDestinationSlugs: ["paris-marrakech"],
  },
  {
    slug: "tunisie",
    country: "Tunisie",
    metaTitle: "Partir en Tunisie : visa, passeport et formalités | TrouveMonVol",
    metaDescription:
      "Ce qu'il faut savoir avant de partir en Tunisie : visa, durée de validité du passeport, vaccins conseillés et règles de change du dinar pour les Français.",
    intro:
      "La Tunisie n'exige pas de visa pour un court séjour touristique français, mais deux points méritent une vérification avant de réserver : la validité de votre passeport et le change du dinar, une devise non exportable.",
    updated: "2026-09-01",
    visa: "Aucun visa n'est requis pour un séjour touristique de moins de 90 jours pour les ressortissants français. L'entrée se fait sur simple présentation du passeport.",
    passport:
      "Passeport en cours de validité à la date d'entrée. La Tunisie n'exige pas de durée de validité minimale au-delà de la date de retour, mais une marge de plusieurs mois reste recommandée pour éviter tout blocage en cas de vol retour modifié sur place.",
    vaccines:
      "Aucun vaccin n'est obligatoire pour un voyage direct depuis la France. Les vaccinations universelles à jour et l'hépatite A sont généralement recommandées pour ce type de destination. Ces recommandations évoluent : vérifiez-les avant le départ.",
    specifics:
      "Le dinar tunisien (TND) n'est pas exportable : il se change uniquement sur place et ne peut pas être acheté à l'avance en France. Comme pour le dirham marocain, conservez vos reçus de change si vous voulez reconvertir une partie de vos dinars au départ. Une déclaration en douane est requise au-delà de l'équivalent de 5 000 TND en espèces à l'entrée.",
    goodToKnow: [
      "Aucun test sanitaire ni certificat de vaccination n'est exigé à l'entrée.",
      "Une assurance voyage n'est pas obligatoire mais recommandée.",
      "Comme au Maroc, une autorisation parentale est demandée pour un mineur voyageant sans ses deux parents.",
    ],
    relatedGuideSlugs: ["tunis"],
    relatedDestinationSlugs: ["lyon-tunis"],
  },
  {
    slug: "egypte",
    country: "Égypte",
    metaTitle: "Visa et formalités pour l'Égypte : le guide complet | TrouveMonVol",
    metaDescription:
      "Visa obligatoire, e-visa ou visa à l'arrivée, validité du passeport, vaccins recommandés : les formalités à anticiper avant un voyage en Égypte.",
    intro:
      "Contrairement au Maroc ou à la Tunisie, l'Égypte exige un visa pour les voyageurs français : le plus simple est de le demander en ligne avant le départ pour éviter la file d'attente à l'aéroport du Caire.",
    updated: "2026-09-01",
    visa: "Un visa est obligatoire pour les ressortissants français. Deux options : le e-visa, à demander en ligne sur le site officiel avant le départ (traitement de quelques jours), ou le visa à l'arrivée, payable en espèces (dollars ou euros) au poste de contrôle de l'aéroport. Le e-visa évite la file d'attente et reste l'option la plus fiable.",
    passport:
      "Passeport valide au moins 6 mois après la date d'entrée en Égypte, avec au moins une page vierge pour l'apposition du visa.",
    vaccines:
      "Aucun vaccin n'est obligatoire pour un voyage direct depuis la France (la fièvre jaune n'est exigée qu'en cas de transit par un pays à risque). Les vaccinations universelles à jour sont recommandées, ainsi que l'hépatite A et la typhoïde pour ce type de destination. Ces recommandations évoluent : vérifiez-les avant de partir.",
    specifics:
      "La livre égyptienne (EGP) se change sur place ; évitez le marché parallèle proposé par des rabatteurs, qui expose à des billets contrefaits. L'eau du robinet n'est pas potable, y compris pour se brosser les dents.",
    goodToKnow: [
      "Conservez votre e-visa (imprimé ou sur votre téléphone) avec votre passeport tout au long du séjour.",
      "Aucun test sanitaire n'est exigé à l'entrée.",
      "Une assurance voyage couvrant le rapatriement est vivement recommandée.",
    ],
    relatedGuideSlugs: ["le-caire"],
    relatedDestinationSlugs: ["paris-le-caire"],
  },
  {
    slug: "turquie",
    country: "Turquie",
    metaTitle: "Formalités pour la Turquie : passeport, visa, vaccins | TrouveMonVol",
    metaDescription:
      "Pas de visa pour un court séjour, mais une validité de passeport plus large qu'ailleurs : les formalités à connaître avant de partir en Turquie.",
    intro:
      "La Turquie n'exige pas de visa pour un séjour touristique court, mais impose une validité de passeport plus large que la plupart des destinations — un point à vérifier en priorité si le vôtre arrive bientôt à expiration.",
    updated: "2026-09-01",
    visa: "Aucun visa n'est requis pour un séjour touristique de moins de 90 jours sur une période de 180 jours, pour les ressortissants français.",
    passport:
      "Passeport valide au moins 150 jours après la date d'entrée en Turquie — une marge nettement plus large que la plupart des destinations de ce site, à vérifier avant de réserver si votre passeport approche de son expiration.",
    vaccines:
      "Aucun vaccin n'est obligatoire pour un voyage direct depuis la France. Les vaccinations universelles à jour suffisent pour la plupart des voyageurs ; aucune recommandation spécifique supplémentaire n'est généralement émise pour la Turquie. Vérifiez malgré tout les recommandations à jour avant de partir.",
    specifics:
      "La livre turque (TRY) se change sur place ; le taux étant très volatile ces dernières années, changez par petites sommes plutôt qu'en une fois. Aucune déclaration de devises n'est requise pour un montant raisonnable de voyage touristique.",
    goodToKnow: [
      "Aucun test sanitaire n'est exigé à l'entrée.",
      "Une assurance voyage n'est pas obligatoire mais recommandée.",
      "La carte Istanbulkart (transports en commun) s'achète sur place, aucune démarche à effectuer avant le départ.",
    ],
    relatedGuideSlugs: ["istanbul"],
    relatedDestinationSlugs: ["paris-istanbul"],
  },
  {
    slug: "thailande",
    country: "Thaïlande",
    metaTitle: "Thaïlande : visa, passeport et formalités d'entrée | TrouveMonVol",
    metaDescription:
      "Exemption de visa, validité du passeport, preuve de sortie du territoire, vaccins conseillés : les formalités à connaître avant de partir en Thaïlande.",
    intro:
      "Les Français bénéficient d'une exemption de visa pour un séjour touristique court en Thaïlande, mais deux justificatifs sont parfois demandés à l'arrivée ou à l'embarquement : la preuve de sortie du territoire et la validité suffisante du passeport.",
    updated: "2026-09-01",
    visa: "Aucun visa n'est requis pour un séjour touristique de moins de 60 jours pour les ressortissants français. Cette exemption a été prolongée ces dernières années : à reconfirmer avant de réserver un séjour long.",
    passport:
      "Passeport valide au moins 6 mois après la date d'entrée en Thaïlande. Un billet de sortie du territoire (aller-retour ou vol vers une destination tierce) peut être demandé à l'embarquement ou à l'arrivée.",
    vaccines:
      "Aucun vaccin n'est obligatoire pour un voyage direct depuis la France. Les vaccinations universelles à jour sont recommandées, ainsi que l'hépatite A pour ce type de destination ; l'encéphalite japonaise ou la rage peuvent être envisagées pour un séjour prolongé ou rural, sur avis médical. Ces recommandations évoluent : vérifiez-les avant de partir.",
    specifics:
      "Le baht thaïlandais (THB) se change facilement sur place, les cartes sont largement acceptées en ville. Une carte d'arrivée (TM6) est parfois encore demandée aux postes-frontières terrestres, plus rarement à l'aéroport. Comme en Égypte, l'eau du robinet n'est pas potable.",
    goodToKnow: [
      "Conservez une preuve de réservation de sortie du territoire : elle peut être demandée à l'embarquement.",
      "Aucun test sanitaire n'est exigé à l'entrée.",
      "Une assurance voyage couvrant les frais médicaux est vivement recommandée : les soins hospitaliers privés y sont coûteux pour un non-résident.",
    ],
    relatedGuideSlugs: ["bangkok"],
    relatedDestinationSlugs: ["paris-bangkok"],
  },
];

/** "au Maroc" mais "en Tunisie/Égypte/Turquie/Thaïlande" : accord fixe, pays connus à l'avance. */
export function countryPreposition(country: string): "au" | "en" {
  return country === "Maroc" ? "au" : "en";
}

export function getTravelDocument(slug: string): TravelDocumentCountry | undefined {
  return TRAVEL_DOCUMENTS.find((d) => d.slug === slug);
}

/** Fiche formalités correspondant au pays d'un guide destination, si elle existe déjà. */
export function getTravelDocumentForGuide(guideSlug: string): TravelDocumentCountry | undefined {
  return TRAVEL_DOCUMENTS.find((d) => d.relatedGuideSlugs.includes(guideSlug));
}
