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
    slug: "istanbul-ou-le-caire",
    title: "Istanbul ou Le Caire : laquelle choisir pour vos vacances ?",
    metaTitle: "Istanbul ou Le Caire : quelle destination choisir ? | TrouveMonVol",
    metaDescription:
      "Istanbul ou Le Caire pour votre prochain city-break dépaysant ? Vol, budget, climat et sites antiques comparés entre les deux mégapoles chargées d'histoire.",
    intro:
      "Istanbul et Le Caire partagent un statut de mégapole millénaire où l'Antiquité se mêle au chaos urbain contemporain. Le choix se joue moins sur le budget, très proche, que sur le type de dépaysement recherché : pont entre deux continents pour l'une, portail vers l'Égypte pharaonique pour l'autre.",
    updated: "2026-09-01",
    cityA: { guideSlug: "istanbul", destinationSlug: "paris-istanbul" },
    cityB: { guideSlug: "le-caire", destinationSlug: "paris-le-caire" },
    table: {
      climat: [
        "Étés chauds et secs (28 à 32 °C), hivers frais et pluvieux (8 à 12 °C), printemps et automne doux (18 à 24 °C) — le climat le plus tempéré des deux.",
        "Climat désertique : étés torrides (35 à 40 °C, difficiles pour les visites en journée), hivers doux et agréables (18 à 28 °C en journée), quasiment aucune pluie.",
      ],
      ambiance: [
        "Mégapole à cheval sur deux continents, mosquées impériales, grand bazar et croisière sur le Bosphore ; tourisme dense mais infrastructures modernes et rodées à l'accueil occidental.",
        "Chaos urbain assumé, klaxons permanents et négociation omniprésente ; moins confortable au quotidien qu'Istanbul, mais un accès direct aux pyramides de Gizeh à moins d'une heure du centre.",
      ],
      activites: [
        [
          "Sainte-Sophie et Mosquée bleue",
          "Grand Bazar et bazar égyptien aux épices",
          "Croisière sur le Bosphore",
          "Palais de Topkapi",
        ],
        [
          "Pyramides de Gizeh et le Sphinx",
          "Musée égyptien (trésor de Toutânkhamon)",
          "Khan el-Khalili et Le Caire islamique",
          "Croisière sur le Nil",
        ],
      ],
    },
    sections: [
      {
        heading: "Le vol : deux liaisons directes, une différence d'une heure",
        paragraphs: [
          "Istanbul se rejoint en vol direct depuis Paris en 3 h 30, Le Caire en 4 h 30 — un écart d'une heure qui ne change pas fondamentalement l'organisation du séjour, les deux restant accessibles sur un long week-end.",
          "Sur les deux liaisons, la concurrence entre compagnies nationales (Turkish Airlines, EgyptAir) et Air France maintient une offre régulière toute l'année, avec des tarifs qui dépendent surtout du jour de départ plutôt que d'une saison touristique marquée.",
        ],
      },
      {
        heading: "Budget sur place : Le Caire nettement plus abordable",
        paragraphs: [
          "Le Caire reste l'une des capitales les moins chères accessibles depuis la France en moins de cinq heures de vol : repas, transport et hébergement y coûtent sensiblement moins qu'à Istanbul, ville plus développée touristiquement et donc plus chère sur l'hébergement de standard occidental.",
          "Un poste à anticiper au Caire : les entrées de sites (pyramides, musées, éventuellement un guide ou chauffeur privé) représentent une part significative du budget total, alors qu'à Istanbul, mosquées et bazars restent en grande partie gratuits ou à faible coût.",
        ],
      },
      {
        heading: "Deux formes de dépaysement très différentes",
        paragraphs: [
          "Istanbul offre un dépaysement maîtrisé : la ville est immense mais les quartiers touristiques (Sultanahmet, Beyoğlu) sont bien rodés à l'accueil des visiteurs occidentaux, avec un bon niveau de confort général.",
          "Le Caire demande davantage d'adaptation — circulation dense, sollicitation touristique fréquente autour des sites majeurs — en échange d'un accès direct à l'un des sites les plus emblématiques au monde, les pyramides de Gizeh, visibles depuis certains hôtels du centre.",
        ],
      },
    ],
    verdict: {
      forCityA:
        "Choisissez Istanbul pour un dépaysement confortable, une ville qui se visite facilement à pied et une vraie diversité (bazars, mosquées, Bosphore) sur un format de 3 à 5 jours.",
      forCityB:
        "Choisissez Le Caire pour l'accès direct aux pyramides et à l'Égypte antique, un budget plus serré, et si vous acceptez une ville plus dense et moins aménagée pour le tourisme occidental.",
    },
  },
  {
    slug: "lisbonne-ou-porto",
    title: "Lisbonne ou Porto : laquelle choisir pour vos vacances ?",
    metaTitle: "Lisbonne ou Porto : quelle ville portugaise choisir ? | TrouveMonVol",
    metaDescription:
      "Lisbonne ou Porto pour votre prochain city-break au Portugal ? Vol, budget, ambiance et activités comparés entre la capitale et la ville du vin de Porto.",
    intro:
      "Contrairement aux autres comparatifs de ce site, Lisbonne et Porto ne mettent pas deux pays en balance mais deux visages d'un même pays : la capitale animée et vallonnée d'un côté, la ville plus posée du vin de Porto de l'autre. Le choix dépend surtout du rythme de séjour recherché.",
    updated: "2026-09-01",
    cityA: { guideSlug: "lisbonne", destinationSlug: "paris-lisbonne" },
    cityB: { guideSlug: "porto", destinationSlug: "paris-porto" },
    table: {
      climat: [
        "Climat atlantique doux : étés chauds et secs (24 à 28 °C), hivers doux et pluvieux (10 à 15 °C) — légèrement plus chaud et sec que Porto toute l'année.",
        "Climat atlantique plus frais et humide que Lisbonne : étés agréables sans excès (20 à 25 °C), hivers doux mais nettement plus pluvieux (8 à 13 °C).",
      ],
      ambiance: [
        "Capitale vallonnée aux tramways jaunes, quartiers d'Alfama et de Bairro Alto, vie nocturne dense et forte fréquentation touristique et de travailleurs à distance depuis quelques années.",
        "Ville plus modeste et plus authentique, organisée autour du Douro et des caves de vin de Porto, rythme plus lent et moins de foule qu'à Lisbonne sur les mêmes dates.",
      ],
      activites: [
        [
          "Tour de Belém et monastère des Jerónimos",
          "Alfama et fado en soirée",
          "Tramway 28 à travers la vieille ville",
          "Excursion à Sintra",
        ],
        [
          "Quartier de la Ribeira (UNESCO)",
          "Caves de vin de Porto à Vila Nova de Gaia",
          "Librairie Lello",
          "Excursion dans la vallée du Douro",
        ],
      ],
    },
    sections: [
      {
        heading: "Le vol : Porto légèrement plus rapide et souvent moins cher",
        paragraphs: [
          "Porto se rejoint en 2 h 15 de vol direct depuis Paris, Lisbonne en 2 h 30 — un écart minime, mais qui s'accompagne souvent d'une différence de prix plus nette : la forte demande touristique sur Lisbonne pousse ses tarifs vers le haut plus tôt dans l'année que sur Porto.",
          "Les deux villes sont desservies par TAP Air Portugal, Transavia et Ryanair depuis plusieurs aéroports parisiens, avec une offre dense toute l'année sur Lisbonne et plus resserrée en basse saison sur Porto.",
        ],
      },
      {
        heading: "Budget sur place : Porto nettement plus économique",
        paragraphs: [
          "Porto reste l'une des capitales les plus abordables d'Europe de l'Ouest, avec des prix de repas et d'hébergement sensiblement inférieurs à Lisbonne, dont le boom touristique des dix dernières années a fait grimper les tarifs, en particulier dans les quartiers centraux comme Alfama ou Chiado.",
          "Sur les deux villes, réserver un logement en dehors des quartiers les plus centraux (Alfama à Lisbonne, Ribeira à Porto) permet de réduire sensiblement la facture sans s'éloigner beaucoup à pied.",
        ],
      },
      {
        heading: "Ambiance : capitale animée contre ville à taille humaine",
        paragraphs: [
          "Lisbonne, plus grande et plus vallonnée, offre davantage de quartiers à explorer et une vie nocturne plus développée, au prix d'une affluence touristique désormais comparable aux grandes capitales européennes en haute saison.",
          "Porto se parcourt presque entièrement à pied en quelques jours, centrée sur le Douro et ses ponts : c'est une destination qui convient bien à un format court et dense, avec les caves de vin de Porto comme activité signature difficile à trouver ailleurs.",
        ],
      },
    ],
    verdict: {
      forCityA:
        "Choisissez Lisbonne pour une capitale plus vaste, une vie nocturne plus riche et davantage de quartiers à explorer sur un séjour de 4 jours ou plus.",
      forCityB:
        "Choisissez Porto pour un budget plus serré, un format plus compact et l'expérience unique des caves de vin le long du Douro.",
    },
  },
  {
    slug: "dubai-ou-doha",
    title: "Dubaï ou Doha : laquelle choisir pour vos vacances ?",
    metaTitle: "Dubaï ou Doha : quelle destination du Golfe choisir ? | TrouveMonVol",
    metaDescription:
      "Dubaï ou Doha pour votre prochain voyage dans le Golfe ? Vol, budget, ambiance et activités comparés entre les deux mégapoles futuristes du désert.",
    intro:
      "Dubaï et Doha partagent le même désert, le même goût pour l'architecture spectaculaire et le même climat extrême, mais offrent deux ambiances assez différentes : démesure touristique assumée d'un côté, ville plus curatée et plus discrète de l'autre.",
    updated: "2026-09-01",
    cityA: { guideSlug: "dubai", destinationSlug: "paris-dubai" },
    cityB: { guideSlug: "doha", destinationSlug: "paris-doha" },
    table: {
      climat: [
        "Climat désertique extrême : étés torrides et humides (40 à 45 °C, quasiment invivables en extérieur), hivers doux et agréables (20 à 28 °C), la seule vraie saison de visite.",
        "Climat très proche de Dubaï : étés au-delà de 40 °C avec forte humidité, hivers doux (18 à 28 °C), là aussi la période à privilégier pour toute activité extérieure.",
      ],
      ambiance: [
        "Mégapole tournée vers le shopping, le luxe et le spectaculaire (plus haute tour du monde, îles artificielles), très touristique, alcool disponible dans les hôtels et zones licenciées.",
        "Ville plus petite et plus récente dans son développement touristique, davantage axée sur les musées et la culture, ambiance plus conservatrice, alcool très restreint aux hôtels internationaux.",
      ],
      activites: [
        [
          "Burj Khalifa et Dubai Mall",
          "Safari dans le désert",
          "Palm Jumeirah",
          "Vieux Dubaï : souks de l'or et des épices",
        ],
        [
          "Museum of Islamic Art",
          "Souq Waqif",
          "La Corniche et vue sur la skyline",
          "The Pearl-Qatar",
        ],
      ],
    },
    sections: [
      {
        heading: "Le vol : deux liaisons directes de durée proche",
        paragraphs: [
          "Dubaï se rejoint en 6 h 45 de vol direct depuis Paris, Doha en 6 h 30 — une différence négligeable. Les deux profitent d'une offre dense portée par leurs compagnies nationales (Emirates pour Dubaï, Qatar Airways pour Doha), toutes deux réputées pour leur flotte récente.",
          "Doha sert aussi couramment de point d'escale vers l'Asie ou l'Océanie : un voyageur qui transite déjà par le Qatar peut facilement y ajouter une étape de un ou deux jours sans détour majeur.",
        ],
      },
      {
        heading: "Budget sur place : deux villes chères, Doha un peu plus modulable",
        paragraphs: [
          "Dubaï et Doha comptent parmi les destinations les plus chères de ce comparatif sur l'hébergement haut de gamme, mais Doha permet de mieux moduler son budget grâce à des options plus abordables hors quartiers centraux, quand Dubaï pousse davantage vers une offre orientée luxe et shopping.",
          "Sur les deux villes, la restauration dans les souks traditionnels (Souq Waqif à Doha, vieux Dubaï) reste nettement plus abordable que dans les grands hôtels ou centres commerciaux.",
        ],
      },
      {
        heading: "Ambiance : démesure assumée contre ville plus curatée",
        paragraphs: [
          "Dubaï mise sur le spectaculaire et le divertissement : plus haute tour du monde, centres commerciaux immenses, îles artificielles — une destination pensée pour impressionner, avec une forte dimension shopping et loisirs.",
          "Doha, plus récente dans son développement touristique et marquée par les infrastructures héritées de la Coupe du monde 2022, mise davantage sur les musées et l'architecture culturelle, dans une ambiance plus conservatrice et moins tournée vers la vie nocturne.",
        ],
      },
    ],
    verdict: {
      forCityA:
        "Choisissez Dubaï pour le spectaculaire, le shopping et une offre de loisirs (parcs, plages, vie nocturne dans les zones licenciées) plus étendue.",
      forCityB:
        "Choisissez Doha pour une ambiance plus posée, une offre culturelle et muséale plus riche, et si vous êtes déjà en escale vers l'Asie ou l'Océanie.",
    },
  },
  {
    slug: "new-york-ou-miami",
    title: "New York ou Miami : laquelle choisir pour vos vacances ?",
    metaTitle: "New York ou Miami : quelle destination américaine choisir ? | TrouveMonVol",
    metaDescription:
      "New York ou Miami pour votre prochain voyage aux États-Unis ? Vol, budget, climat et ambiance comparés entre la ville qui ne dort jamais et la Floride du Sud.",
    intro:
      "New York et Miami incarnent deux visages opposés des États-Unis côte est : mégapole verticale aux quatre saisons marquées d'un côté, ville balnéaire au climat chaud toute l'année de l'autre. Le choix dépend avant tout de la période de voyage et du type de séjour recherché.",
    updated: "2026-09-01",
    cityA: { guideSlug: "new-york", destinationSlug: "paris-new-york" },
    cityB: { guideSlug: "miami", destinationSlug: "paris-miami" },
    table: {
      climat: [
        "Quatre saisons marquées : étés chauds et humides (28 à 32 °C), hivers froids avec neige possible (0 °C et moins), printemps et automne agréables — le choix de la saison change radicalement l'expérience.",
        "Climat subtropical chaud toute l'année : hiver doux et sec (22 à 28 °C, la meilleure période), été lourd et humide avec risque d'ouragans de juin à novembre.",
      ],
      ambiance: [
        "Mégapole verticale et dense, mélange de quartiers très différents (Manhattan, Brooklyn, Queens), forte offre culturelle (musées, Broadway), rythme intense toute l'année.",
        "Ville étalée et tournée vers la plage, architecture Art déco, forte influence latino-américaine (Little Havana), rythme plus décontracté et vie nocturne concentrée le soir.",
      ],
      activites: [
        [
          "Central Park et Statue de la Liberté",
          "Musées (MET, MoMA)",
          "Comédie musicale à Broadway",
          "Brooklyn et son pont",
        ],
        [
          "South Beach et Ocean Drive",
          "Street art de Wynwood",
          "Little Havana",
          "Excursion aux Everglades",
        ],
      ],
    },
    sections: [
      {
        heading: "Le vol : New York plus rapide, Miami plus long",
        paragraphs: [
          "New York se rejoint en 8 h 15 de vol direct depuis Paris, Miami en 9 h 30 — un écart d'un peu plus d'une heure qui s'explique par la distance géographique plus importante vers la Floride.",
          "Les deux villes bénéficient d'une offre dense (Air France, Delta, United, French Bee selon la destination), avec des tarifs qui varient surtout selon la saison plutôt que le jour de départ.",
        ],
      },
      {
        heading: "Budget sur place : New York globalement plus chère",
        paragraphs: [
          "New York affiche un budget quotidien plus élevé que Miami une fois logement, repas et sorties cumulés — la densité de l'offre culturelle (musées, Broadway) et le coût de l'hébergement à Manhattan pèsent sur la note. Miami reste plus abordable en moyenne, à l'exception de l'hébergement en bord de mer à South Beach, où les prix rivalisent avec les meilleurs quartiers new-yorkais.",
          "Sur les deux villes, la street food et les food trucks permettent de limiter la facture repas, alors que les musées et spectacles (Broadway à New York, excursions en bateau à Miami) représentent un poste à part entière.",
        ],
      },
      {
        heading: "Ambiance : ville verticale contre ville balnéaire",
        paragraphs: [
          "New York impose son rythme : dense, verticale, avec une offre culturelle difficile à épuiser même sur plusieurs séjours. L'hiver y est un vrai hiver, avec parfois de la neige, ce qui change complètement l'expérience par rapport à un séjour d'été.",
          "Miami se vit à un rythme plus lent, tournée vers la plage et la vie en extérieur toute l'année, avec une forte identité latino-américaine qui la distingue nettement du reste des États-Unis.",
        ],
      },
    ],
    verdict: {
      forCityA:
        "Choisissez New York pour la densité culturelle, l'expérience urbaine verticale, et si vous acceptez un climat qui varie fortement selon la saison.",
      forCityB:
        "Choisissez Miami pour un climat chaud garanti en hiver, une vie balnéaire et une identité latino-américaine marquée, en évitant la saison des ouragans (juin à novembre).",
    },
  },
  {
    slug: "alger-ou-casablanca",
    title: "Alger ou Casablanca : laquelle choisir pour vos vacances ?",
    metaTitle: "Alger ou Casablanca : quelle destination choisir ? | TrouveMonVol",
    metaDescription:
      "Alger ou Casablanca pour votre prochain voyage au Maghreb ? Vol, budget, ambiance et activités comparés entre les deux capitales économiques d'Algérie et du Maroc.",
    intro:
      "Alger et Casablanca sont toutes deux les capitales économiques de leur pays, avec un accès direct depuis Paris en un peu plus de trois heures. Le choix dépend surtout du niveau d'infrastructure touristique recherché : le Maroc, plus développé sur ce plan, contraste avec une Algérie moins tournée vers l'accueil des visiteurs étrangers.",
    updated: "2026-09-01",
    cityA: { guideSlug: "alger", destinationSlug: "paris-alger" },
    cityB: { guideSlug: "casablanca", destinationSlug: "paris-casablanca" },
    table: {
      climat: [
        "Climat méditerranéen proche du sud de la France : étés chauds et secs (28 à 32 °C), hivers doux et pluvieux (10 à 15 °C), printemps et automne agréables.",
        "Climat atlantique plus tempéré : étés modérés grâce à la proximité de l'océan (24 à 28 °C), hivers doux en journée (16 à 20 °C) mais parfois pluvieux et venteux.",
      ],
      ambiance: [
        "« Alger la Blanche » vue depuis la baie, ville administrative et résidentielle avant d'être touristique, infrastructure d'accueil moins développée que dans les grandes villes marocaines.",
        "Ville d'affaires atlantique à l'architecture Art déco, infrastructure touristique nettement plus mature grâce au tourisme marocain déjà bien installé, accès direct en train depuis l'aéroport.",
      ],
      activites: [
        [
          "Casbah d'Alger (UNESCO)",
          "Jardin d'essai du Hamma",
          "Notre-Dame d'Afrique",
          "Front de mer et Grande Poste",
        ],
        [
          "Mosquée Hassan II",
          "Ancienne médina et quartier des Habous",
          "Corniche d'Ain Diab",
          "Excursion à Rabat",
        ],
      ],
    },
    sections: [
      {
        heading: "Le vol : deux liaisons directes proches en durée",
        paragraphs: [
          "Alger se rejoint en 2 h 20 de vol direct depuis Paris, Casablanca en 3 h 20 — un écart d'une heure lié à la distance géographique plus importante vers le Maroc. Les deux liaisons sont portées par une forte demande de la diaspora, avec des pics de prix marqués autour des vacances scolaires et des grandes fêtes religieuses.",
          "Casablanca bénéficie d'une offre légèrement plus large, avec Royal Air Maroc, Air France et Transavia en concurrence directe, quand Alger reste davantage desservie par Air Algérie et Air France.",
        ],
      },
      {
        heading: "Budget et infrastructure : un écart de maturité touristique",
        paragraphs: [
          "Casablanca profite d'une infrastructure touristique nettement plus développée que Alger, avec davantage d'hôtels internationaux, un accès direct en train depuis l'aéroport, et une offre organisée pour les visiteurs étrangers. Alger reste moins équipée sur ce plan, ce qui peut demander plus d'anticipation dans l'organisation du séjour.",
          "Sur le plan tarifaire, les deux villes restent abordables au quotidien, avec un léger avantage pour Alger sur la restauration locale.",
        ],
      },
      {
        heading: "Ambiance : deux capitales économiques, deux rapports au tourisme",
        paragraphs: [
          "Alger se visite comme une ville encore peu façonnée par le tourisme de masse : la Casbah, classée à l'UNESCO, et le front de mer offrent une expérience authentique, mais avec moins de services pensés pour les visiteurs étrangers qu'au Maroc.",
          "Casablanca, portée par des décennies de développement touristique national, propose une expérience plus balisée, entre mosquée Hassan II, médina et corniche animée, avec Rabat et Marrakech facilement accessibles en complément.",
        ],
      },
    ],
    verdict: {
      forCityA:
        "Choisissez Alger pour un dépaysement plus authentique, un vol plus court, et si vous ne recherchez pas une infrastructure touristique aussi développée qu'ailleurs au Maghreb.",
      forCityB:
        "Choisissez Casablanca pour une infrastructure touristique plus mature, un accès facile à Rabat ou Marrakech, et un transfert aéroport-centre plus simple.",
    },
  },
  {
    slug: "athenes-ou-istanbul",
    title: "Athènes ou Istanbul : laquelle choisir pour vos vacances ?",
    metaTitle: "Athènes ou Istanbul : quelle destination méditerranéenne choisir ? | TrouveMonVol",
    metaDescription:
      "Athènes ou Istanbul pour votre prochain city-break méditerranéen ? Vol, budget, ambiance et sites antiques comparés entre les deux mégapoles chargées d'histoire.",
    intro:
      "Athènes et Istanbul se disputent le titre de capitale historique de la Méditerranée orientale, chacune héritière d'un empire différent. Le choix dépend surtout du type de patrimoine recherché : Antiquité grecque concentrée dans un centre compact, ou strates ottomane et byzantine disséminées dans une mégapole à cheval sur deux continents.",
    updated: "2026-09-01",
    cityA: { guideSlug: "athenes", destinationSlug: "paris-athenes" },
    cityB: { guideSlug: "istanbul", destinationSlug: "paris-istanbul" },
    table: {
      climat: [
        "Climat méditerranéen classique : étés très chauds et secs (30 à 35 °C), hivers doux (10 à 15 °C), printemps et automne particulièrement agréables pour visiter à pied.",
        "Climat de transition entre méditerranéen et continental : étés chauds et secs (28 à 32 °C), hivers plus frais et pluvieux qu'Athènes (8 à 12 °C).",
      ],
      ambiance: [
        "Centre historique compact organisé autour de l'Acropole, ville à taille humaine pour un city-break, porte d'entrée naturelle vers les îles grecques.",
        "Mégapole tentaculaire de plus de 15 millions d'habitants, à cheval sur l'Europe et l'Asie, superposition de couches byzantine, ottomane et moderne.",
      ],
      activites: [
        [
          "Acropole et Parthénon",
          "Quartier de Plaka",
          "Agora antique et musée de l'Acropole",
          "Excursion vers les îles (Hydra, Égine)",
        ],
        [
          "Sainte-Sophie et Mosquée bleue",
          "Grand Bazar",
          "Croisière sur le Bosphore",
          "Palais de Topkapi",
        ],
      ],
    },
    sections: [
      {
        heading: "Le vol : deux liaisons directes de durée identique",
        paragraphs: [
          "Athènes et Istanbul se rejoignent toutes deux en 3 h 30 de vol direct depuis Paris — aucune différence de durée entre les deux, la décision ne se joue donc pas sur ce critère.",
          "Les deux liaisons sont bien desservies (Aegean Airlines et Air France pour Athènes, Turkish Airlines, Pegasus et Air France pour Istanbul), avec une offre dense qui maintient des tarifs compétitifs hors juillet-août.",
        ],
      },
      {
        heading: "Budget sur place : deux villes proches, Istanbul souvent plus abordable",
        paragraphs: [
          "Istanbul, grâce à une monnaie locale (la livre turque) souvent favorable au change, affiche généralement des prix de restauration et d'hébergement inférieurs à Athènes, notamment hors des zones les plus touristiques comme Sultanahmet.",
          "Athènes reste plus chère mais offre un compromis intéressant en restant compacte : l'essentiel du patrimoine antique se visite à pied depuis le centre, sans les frais de transport que la taille d'Istanbul peut imposer.",
        ],
      },
      {
        heading: "Ambiance : ville-musée compacte contre mégapole tentaculaire",
        paragraphs: [
          "Athènes se visite en quelques jours denses centrés sur l'Acropole et ses environs immédiats, avec la possibilité d'enchaîner sur une île grecque pour la deuxième partie du séjour — une combinaison ville-mer difficile à égaler sur cette liste.",
          "Istanbul demande d'accepter une échelle différente : la ville est immense, et voir à la fois la rive européenne (Sultanahmet, Beyoğlu) et la rive asiatique demande plus de temps et de déplacements qu'à Athènes.",
        ],
      },
    ],
    verdict: {
      forCityA:
        "Choisissez Athènes pour un format compact à visiter à pied, un budget légèrement plus élevé mais compensé par la possibilité d'enchaîner sur une île grecque.",
      forCityB:
        "Choisissez Istanbul pour une échelle plus vaste et plus diverse (bazars, Bosphore, deux continents), un budget souvent plus favorable, au prix de déplacements plus longs entre les sites.",
    },
  },
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
