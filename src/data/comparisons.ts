/**
 * Comparatifs de destinations (/comparatifs/<slug>) : aide à trancher entre
 * deux villes déjà couvertes par un guide et une page vols. Le prix des vols
 * et le budget quotidien ne sont jamais dupliqués ici — ils sont relus en
 * direct depuis DESTINATIONS et CITY_GUIDES au moment de l'affichage, pour
 * ne jamais entrer en contradiction avec ces pages ou inventer un chiffre.
 */

export type ComparisonSide = {
  /** Clé dans CITY_GUIDES (src/data/city-guides.ts). */
  guideSlug: string;
  /** Clé dans DESTINATIONS, page /vols/<slug> (src/data/destinations.ts). */
  destinationSlug: string;
};

export type Comparison = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  updated: string;
  cityA: ComparisonSide;
  cityB: ComparisonSide;
  table: {
    climat: [string, string];
    ambiance: [string, string];
    activites: [string[], string[]];
  };
  sections: { heading: string; paragraphs: string[] }[];
  verdict: { forCityA: string; forCityB: string };
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "marrakech-ou-tunis",
    title: "Marrakech ou Tunis : laquelle choisir pour vos vacances ?",
    metaTitle: "Marrakech ou Tunis : quelle destination choisir ? | TrouveMonVol",
    metaDescription:
      "Marrakech ou Tunis pour vos prochaines vacances ? Prix des vols, budget sur place, climat et ambiance comparés pour vous aider à trancher.",
    intro:
      "Marrakech et Tunis partagent beaucoup sur le papier — proximité depuis la France, médinas classées, budget accessible — mais offrent deux expériences assez différentes une fois sur place. Voici de quoi trancher selon ce que vous cherchez.",
    updated: "2026-09-01",
    cityA: { guideSlug: "marrakech", destinationSlug: "paris-marrakech" },
    cityB: { guideSlug: "tunis", destinationSlug: "lyon-tunis" },
    table: {
      climat: [
        "Étés très chauds (40 °C et plus en juillet-août), printemps et automne doux (22 à 28 °C), hivers frais la nuit (8 °C) malgré des journées ensoleillées.",
        "Étés chauds mais moins extrêmes (32 à 36 °C), printemps agréable dès mars (20 à 28 °C), hiver doux en journée (12 à 17 °C) avec des épisodes pluvieux.",
      ],
      ambiance: [
        "Ville impériale intense : souks animés, palais et jardins, forte fréquentation touristique européenne toute l'année, marchandage omniprésent.",
        "Capitale plus posée, entre médina classée à l'UNESCO et sites antiques ; ambiance méditerranéenne, moins tournée vers le tourisme de masse que Marrakech.",
      ],
      activites: [
        [
          "Médina et place Jemaa el-Fna",
          "Jardin Majorelle et musée Yves Saint Laurent",
          "Excursion dans l'Atlas ou à Essaouira",
          "Hammams et spas traditionnels",
        ],
        [
          "Médina et mosquée Zitouna",
          "Musée du Bardo (mosaïques romaines)",
          "Sites de Carthage et village de Sidi Bou Saïd",
          "Excursion à Dougga ou El Jem",
        ],
      ],
    },
    sections: [
      {
        heading: "Le vol : deux aéroports de départ différents",
        paragraphs: [
          "Différence à noter avant tout comparatif de prix : la liaison éditoriale suivie sur ce site relie Paris à Marrakech (vol direct de 3 h 15), tandis que celle vers Tunis part de Lyon (environ 2 h de vol direct). Un vol Paris — Tunis existe aussi, avec une offre plus restreinte qu'à Marrakech au départ de la capitale.",
          "Sur les deux destinations, la concurrence entre compagnies low-cost et régulières maintient des tarifs bas hors vacances scolaires. Les deux trajets partagent aussi une même fenêtre à surveiller : les périodes de fêtes religieuses et l'été, où la demande de la diaspora fait grimper les prix plus fort qu'ailleurs.",
        ],
      },
      {
        heading: "Budget sur place : Tunis légèrement plus économique",
        paragraphs: [
          "Tunis affiche des prix de repas et de transport un peu inférieurs à Marrakech au quotidien : un dîner de poisson à Sidi Bou Saïd coûte souvent moins qu'un dîner équivalent à Guéliz, et le TGM reste imbattable pour se déplacer. L'hébergement en riad à Marrakech offre en revanche un rapport charme-prix difficile à égaler, entre 45 et 90 € la nuit avec petit-déjeuner sur une terrasse.",
          "Les deux villes restent parmi les destinations les plus abordables accessibles depuis la France en moins de 3 h 30 de vol.",
        ],
      },
      {
        heading: "Ambiance et activités : deux rythmes différents",
        paragraphs: [
          "Marrakech est plus dense, plus touristique et plus tournée vers l'expérience immédiate : souks, jardins, hammams, excursions vers l'Atlas tout proche. C'est une destination qui se vit intensément sur un format court de trois à quatre jours.",
          "Tunis se prête à un rythme plus posé, avec un fort volet patrimonial (Bardo, Carthage) et un accès direct à la mer via le petit train TGM jusqu'à Sidi Bou Saïd. Elle convient bien à un séjour combinant ville et journées de plage sans quitter la région du Grand Tunis.",
        ],
      },
    ],
    verdict: {
      forCityA:
        "Choisissez Marrakech pour un séjour intense et sensoriel, un accès direct à l'Atlas, et si vous partez de la région parisienne avec un vol direct fréquent.",
      forCityB:
        "Choisissez Tunis pour un budget légèrement plus serré, un fort volet patrimoine antique, et si votre point de départ est Lyon ou le sud-est de la France.",
    },
  },
  {
    slug: "bangkok-ou-bali",
    title: "Bangkok ou Bali : laquelle choisir pour vos vacances ?",
    metaTitle: "Bangkok ou Bali : quelle destination choisir ? | TrouveMonVol",
    metaDescription:
      "Bangkok ou Bali pour votre prochain long-courrier ? Vol, budget, climat et ambiance comparés entre mégapole thaïlandaise et île indonésienne.",
    intro:
      "Bangkok et Bali sont souvent combinées sur un même circuit, mais choisir entre les deux pour un séjour unique dépend surtout du rythme recherché : mégapole frénétique d'un côté, île tournée vers la plage et la nature de l'autre.",
    updated: "2026-09-01",
    cityA: { guideSlug: "bangkok", destinationSlug: "paris-bangkok" },
    cityB: { guideSlug: "bali", destinationSlug: "paris-bali" },
    table: {
      climat: [
        "Saison sèche et fraîche de novembre à février (26 à 32 °C), chaleur lourde de mars à mai (35 °C et plus), mousson courte mais intense de juin à octobre.",
        "Saison sèche de mai à septembre (27 à 31 °C, la plus demandée), saison des pluies de novembre à mars avec des averses brèves en fin de journée.",
      ],
      ambiance: [
        "Mégapole tentaculaire, vie nocturne intense, temples et marchés flottants, base idéale pour rayonner vers le reste de la Thaïlande.",
        "Île tournée vers la nature et la plage, scène surf et travailleurs à distance à Canggu, spiritualité et rizières à Ubud, rythme nettement plus lent.",
      ],
      activites: [
        [
          "Grand Palais et Wat Pho",
          "Marché de Chatuchak",
          "Croisière sur le Chao Phraya",
          "Excursion à Ayutthaya",
        ],
        [
          "Rizières en terrasses de Tegalalang",
          "Temple d'Uluwatu et danse Kecak au coucher du soleil",
          "Plages et spots de surf de Canggu et Uluwatu",
          "Cours de yoga et marché artisanal d'Ubud",
        ],
      ],
    },
    sections: [
      {
        heading: "Le vol : direct pour Bangkok, escale obligatoire pour Bali",
        paragraphs: [
          "Différence majeure entre les deux trajets : Bangkok se rejoint en vol direct depuis Paris, en 11 h 20. Bali n'a aucune liaison directe — comptez 17 à 20 heures avec une escale à Doha, Singapour ou Dubaï, soit près d'une journée complète de voyage porte-à-porte.",
          "Cet écart de temps de trajet pèse directement sur la rentabilité d'un séjour court : Bangkok se prête à un city-break d'une semaine, tandis que Bali demande plutôt dix jours à trois semaines pour amortir le vol.",
        ],
      },
      {
        heading: "Budget sur place : deux destinations très abordables",
        paragraphs: [
          "Bangkok et Bali comptent parmi les destinations long-courriers les moins chères au quotidien accessibles depuis la France. Bangkok a l'avantage d'un réseau de transport public performant (BTS, MRT, bateaux) qui limite les frais de déplacement ; à Bali, l'absence de transport public structuré impose un scooter ou un chauffeur privé, un poste de budget à anticiper.",
          "Le logement suit une logique similaire : hôtels urbains à Bangkok contre villas avec piscine à Bali, où ce type d'hébergement reste étonnamment accessible comparé à d'autres destinations balnéaires.",
        ],
      },
      {
        heading: "Ambiance et rythme de voyage",
        paragraphs: [
          "Bangkok convainc pour son énergie urbaine, sa street food permanente et sa position de porte d'entrée vers le reste de l'Asie du Sud-Est. Le rythme y est rapide, la chaleur souvent moite, et les distractions nocturnes nombreuses.",
          "Bali séduit pour l'inverse : nature, plage, bien-être et une scène de travailleurs à distance très développée à Canggu. C'est une destination qui se prête à un séjour plus long et plus lent, mais qui demande d'accepter un temps de vol nettement supérieur.",
        ],
      },
    ],
    verdict: {
      forCityA:
        "Choisissez Bangkok pour un city-break plus court, un vol direct, une vie urbaine intense et un accès facile au reste de la Thaïlande.",
      forCityB:
        "Choisissez Bali si vous pouvez partir au moins dix jours, que vous cherchez plage et nature plutôt que mégapole, et que le temps de vol ne vous rebute pas.",
    },
  },
  {
    slug: "rome-ou-barcelone",
    title: "Rome ou Barcelone : laquelle choisir pour vos vacances ?",
    metaTitle: "Rome ou Barcelone : quelle destination choisir ? | TrouveMonVol",
    metaDescription:
      "Rome ou Barcelone pour votre prochain city-break ? Vol, budget, climat et ambiance comparés entre les deux capitales méditerranéennes.",
    intro:
      "Rome et Barcelone se disputent le titre de city-break méditerranéen le plus populaire depuis la France. Les deux se visitent très bien à pied en trois-quatre jours, mais l'expérience — patrimoine antique contre art moderniste et plage — diffère nettement.",
    updated: "2026-09-01",
    cityA: { guideSlug: "rome", destinationSlug: "paris-rome" },
    cityB: { guideSlug: "barcelone", destinationSlug: "paris-barcelone" },
    table: {
      climat: [
        "Printemps et automne agréables (20 à 27 °C), étés chauds et secs (33 à 36 °C) avec de nombreux Romains partis en août, hiver doux (10 à 15 °C).",
        "Climat méditerranéen tempéré par la mer : 22 à 27 °C au printemps et à l'automne, étés chauds et humides, hiver doux (13 à 16 °C).",
      ],
      ambiance: [
        "Ville-musée à ciel ouvert, forte densité de sites antiques et religieux, réservations quasi obligatoires en haute saison, pas d'accès direct à la mer.",
        "Ville vivante entre architecture moderniste, plage en centre-ville et vie nocturne tardive ; ambiance plus décontractée, rythme espagnol (dîner après 21 h).",
      ],
      activites: [
        [
          "Colisée, Forum romain et Palatin",
          "Musées du Vatican et basilique Saint-Pierre",
          "Fontaine de Trevi et place Navone",
          "Excursion à Ostie antique ou Tivoli",
        ],
        [
          "Sagrada Familia et œuvres de Gaudí",
          "Quartier gothique et musée Picasso",
          "Plages de la Barceloneta ou Bogatell",
          "Excursion à Montserrat",
        ],
      ],
    },
    sections: [
      {
        heading: "Le vol : deux liaisons courtes et concurrentielles",
        paragraphs: [
          "Rome et Barcelone se rejoignent toutes deux en vol direct depuis Paris en moins de deux heures (2 h pour Rome, 1 h 50 pour Barcelone), sur des liaisons à forte fréquence où plusieurs compagnies se font concurrence. Sur les deux trajets, le prix dépend surtout du jour de départ et de la proximité des vacances scolaires, plutôt que de la saison touristique au sens large.",
          "Barcelone a un atout supplémentaire pour les voyageurs proches d'une gare : la liaison ferroviaire directe (environ 6 h 30) reste une alternative crédible à l'avion, une option qui n'existe pas pour Rome depuis la France.",
        ],
      },
      {
        heading: "Budget sur place : deux villes proches, Rome un peu plus chère",
        paragraphs: [
          "Rome et Barcelone affichent un budget quotidien assez proche, avec un léger avantage pour Rome sur les repas de rue (pizza al taglio, espresso au comptoir). Rome se distingue surtout par des postes de dépense difficiles à éviter : billet combiné Colisée-Forum, entrée aux musées du Vatican, taxe de séjour systématique. Barcelone permet de mieux moduler son budget grâce à une offre de tapas et de menus du jour très étendue.",
          "Sur les deux villes, réserver en ligne les sites les plus demandés (Colisée et Vatican à Rome, Sagrada Familia et parc Güell à Barcelone) est presque obligatoire en haute saison, sous peine de perdre une bonne partie de la journée en file d'attente.",
        ],
      },
      {
        heading: "Ambiance et rythme de visite",
        paragraphs: [
          "Rome se vit comme une accumulation de sites majeurs sur un périmètre resserré : le rythme est plus dense, plus tourné vers l'histoire antique et religieuse, sans réelle coupure balnéaire.",
          "Barcelone alterne plus facilement patrimoine et détente : une matinée à la Sagrada Familia peut se terminer par une après-midi à la plage, ce que Rome ne propose pas de la même manière. L'ambiance y est aussi plus nocturne, avec des dîners qui démarrent rarement avant 21 h.",
        ],
      },
    ],
    verdict: {
      forCityA:
        "Choisissez Rome pour une immersion dans l'Antiquité et le patrimoine religieux, sur un format dense de 3 à 5 jours.",
      forCityB:
        "Choisissez Barcelone si vous voulez combiner ville et plage, profiter d'une alternative train crédible, et d'une vie nocturne plus marquée.",
    },
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
