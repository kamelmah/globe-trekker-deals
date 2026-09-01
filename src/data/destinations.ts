import { EUROPE_DESTINATIONS } from "@/data/destinations-europe";

export type DestinationFaq = { question: string; answer: string };

export type DestinationRoute = {
  slug: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  country: string;
  /** Titre H1 de la page. */
  heading: string;
  metaTitle: string;
  metaDescription: string;
  /** Résumé court affiché en tête de page. */
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  bestMonths: string;
  averageDuration: string;
  faq: DestinationFaq[];
  /** Prix d'appel forcé à des fins de démonstration (€). */
  simulatedLowestPrice?: number;
  /** Prix le plus bas réellement relevé (pages générées dynamiquement, €). */
  observedLowestPrice?: number;
  /** Compagnie relevée sur ce prix le plus bas, si connue. */
  observedAirline?: string;
  /** Date/heure de départ relevée (ISO 8601), si connue. */
  observedDepartureAt?: string;
};

const CORE_DESTINATIONS: DestinationRoute[] = [
  {
    slug: "paris-marrakech",
    origin: "PAR",
    originCity: "Paris",
    destination: "RAK",
    destinationCity: "Marrakech",
    country: "Maroc",
    heading: "Billet d'avion Paris - Marrakech pas cher",
    metaTitle: "Vol Paris — Marrakech pas cher : prix, saison idéale, astuces | TrouveMonVol",
    metaDescription:
      "Le vrai prix des vols Paris-Marrakech, taxes incluses et vendeur affiché en clair. Meilleure saison pour partir, historique des tarifs sur un an et alerte gratuite.",
    intro:
      "Marrakech est la destination marocaine la plus desservie depuis Paris, avec plusieurs vols directs par jour toute l'année. Sur ce trajet de 3 h 15, la concurrence entre low-cost et compagnies régulières fait que le prix peut aller du simple au triple selon la date choisie.",
    bestMonths: "Mars-mai et septembre-novembre",
    averageDuration: "3 h 15 en vol direct",
    simulatedLowestPrice: 39,
    sections: [
      {
        heading: "Quand partir à Marrakech au meilleur prix",
        paragraphs: [
          "Mars-mai et septembre-novembre concentrent la demande la plus forte : le climat y est le plus agréable pour visiter la médina et les jardins, avec 22 à 28 °C en journée, et les tarifs suivent cette popularité à la hausse.",
          "Juillet et août affichent des billets moins chers qu'au printemps, car la chaleur — souvent au-delà de 40 °C l'après-midi — décourage une partie des voyageurs de loisir. C'est une bonne fenêtre budget si votre hébergement a une piscine.",
          "Les vacances scolaires de fin d'année et les jours autour du Nouvel An restent les dates les plus chères, malgré des nuits fraîches à Marrakech en cette saison : la demande familiale y reste toujours plus forte que l'offre.",
        ],
      },
      {
        heading: "Compagnies et aéroports pour un vol Paris — Marrakech",
        paragraphs: [
          "Transavia, Ryanair (au départ de Beauvais) et EasyJet se disputent ce trajet toute l'année, ce qui maintient des tarifs d'appel bas hors vacances scolaires. Air France et Royal Air Maroc assurent plusieurs fréquences quotidiennes depuis Roissy et Orly, avec bagage en soute inclus dans la plupart des tarifs.",
          "L'arrivée se fait à l'aéroport de Marrakech-Ménara, à moins de 15 minutes de la médina et de la place Jemaa el-Fna — l'un des trajets aéroport-centre les plus courts parmi les destinations long-courriers de ce comparateur.",
        ],
      },
      {
        heading: "Budget à prévoir",
        paragraphs: [
          "Hors vacances scolaires, un aller-retour se trouve régulièrement entre 90 et 150 euros. Pendant les fêtes de fin d'année et les vacances de février, comptez plutôt 220 à 320 euros pour les mêmes compagnies.",
          "Réserver deux à trois mois à l'avance suffit sur cette ligne à forte fréquence : contrairement aux long-courriers, l'ouverture des vols très en avance n'apporte pas ici d'avantage tarifaire net.",
        ],
      },
    ],
    faq: [
      {
        question: "Quelle est la compagnie aérienne la moins chère pour un vol Paris Marrakech ?",
        answer:
          "Les compagnies low-cost Ryanair et Transavia proposent généralement les tarifs les plus bas, avec des billets réguliers dès 39€ l'aller simple hors options.",
      },
      {
        question: "Quel est le meilleur moment pour réserver un billet d'avion vers Marrakech ?",
        answer:
          "Il est recommandé de réserver votre vol entre 2 et 3 mois à l'avance pour obtenir les meilleurs tarifs.",
      },
      {
        question: "Quel aéroport de Paris propose les vols les plus directs ?",
        answer:
          "L'aéroport d'Orly (ORY) offre le plus grand nombre de vols directs low-cost via Transavia, tandis que CDG accueille principalement Air France et Royal Air Maroc.",
      },
    ],
  },
  {
    slug: "paris-bangkok",
    origin: "PAR",
    originCity: "Paris",
    destination: "BKK",
    destinationCity: "Bangkok",
    country: "Thaïlande",
    heading: "Vols pas chers Paris — Bangkok",
    metaTitle: "Paris — Bangkok pas cher : direct ou escale, quand réserver | TrouveMonVol",
    metaDescription:
      "Vols directs et avec escale vers Bangkok comparés au prix total, sans frais cachés. Bons mois pour partir, courbe tarifaire sur 12 mois, alerte prix gratuite.",
    intro:
      "Bangkok est la porte d'entrée de l'Asie du Sud-Est et l'un des long-courriers les plus disputés au départ de Paris. Entre vols directs et escales au Moyen-Orient, l'écart de prix sur un même mois dépasse souvent 300 euros.",
    bestMonths: "Mai, juin et septembre",
    averageDuration: "11 h 20 en vol direct",
    sections: [
      {
        heading: "Quand partir à Bangkok au meilleur prix",
        paragraphs: [
          "La haute saison touristique thaïlandaise court de novembre à février : temps sec, températures supportables, et donc demande maximale. Les billets sont alors au plus haut, surtout autour de Noël et du Nouvel An.",
          "La saison des pluies, de mai à octobre, fait chuter les prix. Contrairement à une idée reçue, il ne pleut pas toute la journée : les averses sont intenses mais courtes, souvent en fin d'après-midi. Les mois de mai, juin et septembre offrent régulièrement les meilleurs tarifs de l'année, parfois 40 % sous le prix de décembre.",
          "Le mois d'avril, marqué par le Songkran et une chaleur très forte, reste demandé par la clientèle asiatique et n'est pas la meilleure fenêtre budget malgré le climat difficile.",
        ],
      },
      {
        heading: "Vol direct ou escale",
        paragraphs: [
          "Thai Airways et Air France proposent des vols directs depuis Roissy, en 11 h 20 environ. Les billets avec escale, via Istanbul, Doha, Dubaï ou Abou Dabi, ajoutent en général trois à sept heures de trajet mais coûtent souvent 100 à 250 euros de moins sur l'aller-retour.",
          "Une escale longue n'est pas toujours une mauvaise nouvelle : plusieurs compagnies proposent des programmes de stopover permettant de passer une nuit sur place sans surcoût de billet. À l'inverse, une correspondance de moins de deux heures dans un grand hub augmente le risque de rater le second vol.",
        ],
      },
      {
        heading: "Budget à prévoir",
        paragraphs: [
          "Hors haute saison, un aller-retour Paris — Bangkok avec une escale se trouve souvent entre 480 et 620 euros. En vol direct, comptez 650 à 850 euros. Pendant les fêtes de fin d'année, les mêmes billets dépassent facilement 1 000 euros.",
          "Sur ce type de trajet, la courbe de prix commence à descendre environ cinq mois avant le départ et remonte fortement dans les six dernières semaines. C'est le cas typique où une alerte prix est plus efficace qu'une vérification manuelle.",
        ],
      },
    ],
    faq: [
      {
        question: "Quel est le meilleur mois pour aller à Bangkok pas cher ?",
        answer:
          "Mai, juin et septembre sont les mois les moins chers, en pleine saison des pluies. Les averses sont courtes et les prix parfois inférieurs de 30 à 40 % à ceux de décembre.",
      },
      {
        question: "Combien coûte un vol Paris — Bangkok ?",
        answer:
          "Entre 480 et 620 euros l'aller-retour avec escale hors haute saison, et 650 à 850 euros en vol direct. Comptez plus de 1 000 euros pendant les fêtes de fin d'année.",
      },
      {
        question: "Combien de temps à l'avance réserver un vol pour Bangkok ?",
        answer:
          "Idéalement entre 2 et 5 mois avant le départ. Au-delà, les tarifs d'ouverture sont rarement les meilleurs ; en dessous de six semaines, les prix remontent nettement.",
      },
      {
        question: "Le vol direct vaut-il son surcoût ?",
        answer:
          "Il fait gagner trois à sept heures de trajet pour 100 à 250 euros de plus. Sur un séjour court, le gain de temps est réel ; sur un long voyage, l'escale reste souvent le meilleur choix budget.",
      },
    ],
  },
  {
    slug: "paris-new-york",
    origin: "PAR",
    originCity: "Paris",
    destination: "NYC",
    destinationCity: "New York",
    country: "États-Unis",
    heading: "Vols pas chers Paris — New York",
    metaTitle: "Vol Paris New York pas cher : JFK, Newark et bon moment | TrouveMonVol",
    metaDescription:
      "Cinq compagnies en concurrence sur Paris-New York : le prix total taxes incluses, vendeur affiché. Historique 12 mois, meilleure fenêtre tarifaire, alerte gratuite.",
    intro:
      "Paris — New York est la liaison transatlantique la plus fréquentée d'Europe, avec plus de vingt vols directs par jour en été. Cette concurrence tire les prix vers le bas dès que l'on sort des périodes de vacances.",
    bestMonths: "Janvier à mars, et novembre",
    averageDuration: "8 h 15 à l'aller",
    sections: [
      {
        heading: "Quand partir à New York au meilleur prix",
        paragraphs: [
          "Le creux tarifaire de l'année se situe entre mi-janvier et mi-mars. La ville est froide, parfois enneigée, mais les billets tombent régulièrement sous les 350 euros aller-retour et les hôtels suivent la même tendance.",
          "Novembre, hors semaine de Thanksgiving, est l'autre bonne fenêtre : températures encore acceptables, ambiance de début de saison des fêtes, et tarifs nettement inférieurs à ceux de décembre.",
          "L'été, de juin à août, ainsi que la dernière quinzaine de décembre, concentrent la demande. Sur ces périodes, un aller-retour direct dépasse fréquemment 700 euros et les meilleures offres partent très tôt.",
        ],
      },
      {
        heading: "Trois aéroports, trois réalités",
        paragraphs: [
          "New York est desservie par JFK, Newark et, plus rarement depuis l'Europe, LaGuardia. JFK et Newark sont tous deux bien reliés à Manhattan, en 45 à 70 minutes selon le mode de transport. Comparer les trois codes plutôt qu'un seul fait souvent apparaître un écart de 40 à 100 euros.",
          "Air France, Delta, United, American Airlines et French Bee opèrent la liaison en direct depuis Roissy ou Orly. Les compagnies à coût réduit sur le transatlantique proposent des tarifs bas mais facturent bagages, repas et sièges séparément : intégrez ces options avant de comparer.",
        ],
      },
      {
        heading: "Formalités et coûts annexes",
        paragraphs: [
          "L'entrée aux États-Unis nécessite une autorisation ESTA payante pour les ressortissants français, valable deux ans. Ce coût, modeste mais réel, fait partie du budget du voyage au même titre que le bagage.",
          "Pensez également au décalage horaire de six heures : un vol retour de nuit permet souvent d'économiser une nuit d'hôtel, ce qui pèse plus lourd que quelques dizaines d'euros sur le billet.",
        ],
      },
    ],
    faq: [
      {
        question: "Quel est le meilleur mois pour aller à New York pas cher ?",
        answer:
          "Février est généralement le mois le moins cher de l'année, suivi de janvier et de mars. Novembre, hors Thanksgiving, offre aussi de très bons tarifs.",
      },
      {
        question: "Combien de temps dure le vol Paris — New York ?",
        answer:
          "Environ 8 h 15 à l'aller et 7 h 15 au retour, grâce aux vents dominants. Les vols avec escale durent en général 11 à 15 heures.",
      },
      {
        question: "Faut-il un ESTA pour aller à New York ?",
        answer:
          "Oui, une autorisation ESTA payante est obligatoire pour les voyageurs français se rendant aux États-Unis sans visa. Elle se demande en ligne avant le départ et reste valable deux ans.",
      },
      {
        question: "JFK ou Newark : quel aéroport choisir ?",
        answer:
          "Les deux sont bien reliés à Manhattan. Comparez systématiquement les deux : l'écart de prix atteint souvent 40 à 100 euros sur un même aller-retour.",
      },
    ],
  },
  {
    slug: "paris-lisbonne",
    origin: "PAR",
    originCity: "Paris",
    destination: "LIS",
    destinationCity: "Lisbonne",
    country: "Portugal",
    heading: "Vol Paris - Lisbonne au meilleur prix",
    metaTitle: "Paris — Lisbonne pas cher : vols dès 29 €, meilleure saison | TrouveMonVol",
    metaDescription:
      "Comparateur de vols Paris-Lisbonne, prix total sans surprise et vendeur affiché. Saison la moins chère, courbe de prix sur un an, alerte gratuite.",
    intro:
      "Lisbonne est l'une des capitales européennes les mieux desservies depuis Paris, avec une quinzaine de rotations quotidiennes sur un vol direct de 2 h 30. Cette forte concurrence en fait l'un des city-breaks les moins chers d'Europe au départ de la France, à condition d'éviter les dates les plus demandées.",
    bestMonths: "Janvier, février et novembre",
    averageDuration: "2 h 30 en vol direct",
    simulatedLowestPrice: 29,
    sections: [
      {
        heading: "Quand partir à Lisbonne au meilleur prix",
        paragraphs: [
          "Janvier, février et novembre restent les mois les moins chers : la ville profite d'un climat doux pour un hiver européen (13 à 16 °C en journée) qui n'a rien à voir avec le nord du continent, alors que la demande touristique reste basse.",
          "Le printemps et le début de l'automne concentrent l'essentiel des visites — journées longues, chaleur modérée — et les tarifs grimpent en conséquence, en particulier autour des Festas de Lisboa mi-juin, quand la ville entière fête Saint-Antoine dans les rues de l'Alfama.",
          "L'été, de juillet à septembre, cumule la haute saison touristique européenne et les retours de la diaspora portugaise de France pour les vacances : c'est la période la plus chère de l'année sur cette ligne, malgré son extrême fréquence.",
        ],
      },
      {
        heading: "Compagnies et aéroports pour un vol Paris — Lisbonne",
        paragraphs: [
          "EasyJet, Ryanair (depuis Beauvais) et Transavia (depuis Orly) se livrent une concurrence continue sur cette ligne, avec des allers simples sous les 30 € en période creuse. TAP Air Portugal et Air France opèrent plusieurs vols quotidiens depuis Roissy, avec bagage en soute généralement inclus.",
          "L'arrivée se fait à l'aéroport Humberto Delgado, relié au centre-ville en une vingtaine de minutes par la ligne rouge du métro — l'une des liaisons aéroport-centre les plus simples parmi les destinations européennes de ce comparateur.",
        ],
      },
      {
        heading: "Budget à prévoir",
        paragraphs: [
          "Hors haute saison, un aller-retour se négocie fréquemment entre 60 et 100 euros. En juillet-août et à Noël, les mêmes billets dépassent souvent 180 à 250 euros sur les compagnies régulières comme low-cost.",
          "Voyager un mardi ou un mercredi plutôt qu'un vendredi ou un dimanche fait souvent une vraie différence sur cette ligne à haute fréquence, où le prix varie plus selon le jour de la semaine que sur la plupart des autres destinations.",
        ],
      },
    ],
    faq: [
      {
        question: "Quelle est la durée d'un vol direct Paris Lisbonne ?",
        answer:
          "Le temps de vol direct moyen est de 2 heures et 30 minutes entre les aéroports parisiens et Lisbonne.",
      },
      {
        question: "Comment aller de l'aéroport de Lisbonne au centre-ville ?",
        answer:
          "L'aéroport est directement relié au centre-ville par la ligne rouge du métro, pour un trajet d'environ 20 minutes seulement.",
      },
      {
        question: "Quand les billets d'avion pour Lisbonne sont-ils les moins chers ?",
        answer:
          "Les prix sont au plus bas durant l'hiver (hors fêtes de fin d'année), notamment en janvier et février.",
      },
    ],
  },
  {
    slug: "paris-barcelone",
    origin: "PAR",
    originCity: "Paris",
    destination: "BCN",
    destinationCity: "Barcelone",
    country: "Espagne",
    heading: "Vols pas chers Paris — Barcelone",
    metaTitle: "Vol Paris Barcelone pas cher : prix selon le jour de départ | TrouveMonVol",
    metaDescription:
      "Sur cette ligne, le prix dépend surtout de la date : comparez au prix total, taxes incluses, vendeur affiché. Meilleure période, historique tarifaire, alerte gratuite.",
    intro:
      "Barcelone est à une heure quarante de vol de Paris, avec une quinzaine de rotations quotidiennes. C'est une ligne où le prix dépend presque uniquement du jour choisi.",
    bestMonths: "Janvier, février et novembre",
    averageDuration: "1 h 45 en vol direct",
    sections: [
      {
        heading: "Quand partir à Barcelone au meilleur prix",
        paragraphs: [
          "L'hiver, hors vacances scolaires, est la période la moins chère : les billets descendent souvent sous 60 euros l'aller-retour. La ville reste agréable, avec des journées ensoleillées et peu de files d'attente devant les grands sites.",
          "Le printemps et l'automne offrent le meilleur compromis météo / prix, avec des tarifs intermédiaires. L'été concentre à la fois la demande touristique européenne et les congés espagnols : c'est la période la plus chère, doublée d'une forte affluence.",
          "Les grands salons professionnels barcelonais font également grimper les prix sur quelques jours précis, indépendamment de la saison. Si votre date tombe sur l'un d'eux, décaler de 48 heures change tout.",
        ],
      },
      {
        heading: "Train ou avion",
        paragraphs: [
          "La liaison ferroviaire directe met environ six heures trente depuis Paris. Sur ce trajet, le train est une vraie alternative : porte à porte, l'écart de temps réel avec l'avion se réduit fortement une fois pris en compte les transferts aéroportuaires et l'enregistrement.",
          "Comparer les deux a du sens si votre billet d'avion dépasse 120 euros ou si vous voyagez avec des bagages volumineux.",
        ],
      },
      {
        heading: "Aéroport et transferts",
        paragraphs: [
          "Barcelone-El Prat se situe à quinze kilomètres du centre, relié en trente minutes par navette ou métro. Certaines compagnies à bas coût affichent des vols vers Gérone ou Reus : ces aéroports sont à plus d'une heure de route de Barcelone, ce qui annule souvent l'économie réalisée sur le billet.",
          "Vérifiez toujours le code de l'aéroport avant de réserver — c'est l'un des pièges les plus courants sur cette destination.",
        ],
      },
    ],
    faq: [
      {
        question: "Quel est le meilleur mois pour aller à Barcelone pas cher ?",
        answer:
          "Janvier et février sont les mois les moins chers, hors vacances scolaires. Novembre offre également de très bons tarifs.",
      },
      {
        question: "Combien de temps dure le vol Paris — Barcelone ?",
        answer: "Environ 1 h 45 en vol direct.",
      },
      {
        question: "Vaut-il mieux prendre le train ou l'avion pour Barcelone ?",
        answer:
          "Le train direct met environ 6 h 30 mais évite les transferts aéroportuaires. Au-delà de 120 euros le billet d'avion, la comparaison porte-à-porte devient serrée.",
      },
      {
        question: "Attention aux aéroports de Gérone et Reus ?",
        answer:
          "Oui : ils sont situés à plus d'une heure de Barcelone. Le transfert coûte du temps et de l'argent et annule souvent l'économie faite sur le billet.",
      },
    ],
  },
  {
    slug: "paris-istanbul",
    origin: "PAR",
    originCity: "Paris",
    destination: "IST",
    destinationCity: "Istanbul",
    country: "Turquie",
    heading: "Vols pas chers Paris — Istanbul",
    metaTitle: "Paris — Istanbul pas cher : Istanbul Airport ou Sabiha Gökçen | TrouveMonVol",
    metaDescription:
      "Vols Paris-Istanbul au prix total, vendeur clairement affiché, deux aéroports comparés. Bonne saison pour partir, courbe de prix 12 mois, alerte gratuite.",
    intro:
      "Istanbul combine city-break et hub international. La ligne est desservie plusieurs fois par jour, ce qui laisse une vraie marge de négociation sur les dates.",
    bestMonths: "Novembre à mars, hors fêtes",
    averageDuration: "3 h 30 en vol direct",
    sections: [
      {
        heading: "Quand partir à Istanbul au meilleur prix",
        paragraphs: [
          "Les mois d'hiver, de novembre à mars, sont les moins chers. Il fait frais et humide, parfois neigeux, mais la ville est bien moins fréquentée et les tarifs aériens comme hôteliers descendent nettement.",
          "Le printemps, en particulier avril avec la floraison des tulipes, et l'automne sont les périodes les plus agréables — et donc plus demandées. L'été est chaud, très touristique, et correspond au pic tarifaire.",
          "Les dates des fêtes religieuses turques provoquent des pointes de demande liées aux voyages familiaux. Elles se décalent chaque année : vérifiez le calendrier avant de fixer vos dates.",
        ],
      },
      {
        heading: "Deux aéroports à distinguer",
        paragraphs: [
          "Istanbul Airport, côté européen, accueille Turkish Airlines et la plupart des vols internationaux. Sabiha Gökçen, côté asiatique, est la base des compagnies à bas coût et se trouve nettement plus loin du centre historique.",
          "Un billet moins cher vers Sabiha Gökçen peut être un bon plan, à condition d'ajouter environ 1 h 30 de transfert et le coût de la navette dans votre calcul.",
        ],
      },
      {
        heading: "Budget et durée",
        paragraphs: [
          "Un aller-retour hors saison se trouve régulièrement entre 130 et 200 euros. En haute saison ou pendant les vacances scolaires, comptez 250 à 400 euros.",
          "Le vol direct dure environ 3 h 30. Les correspondances via l'Europe centrale allongent le trajet sans faire baisser suffisamment le prix pour être systématiquement intéressantes sur ce trajet.",
        ],
      },
    ],
    faq: [
      {
        question: "Quel est le meilleur mois pour aller à Istanbul pas cher ?",
        answer:
          "Janvier et février affichent les prix les plus bas. Novembre et mars offrent un bon compromis entre tarif et confort de visite.",
      },
      {
        question: "Combien de temps dure le vol Paris — Istanbul ?",
        answer: "Environ 3 h 30 en vol direct.",
      },
      {
        question: "Istanbul Airport ou Sabiha Gökçen ?",
        answer:
          "Istanbul Airport est plus proche du centre historique. Sabiha Gökçen, côté asiatique, propose des billets moins chers mais demande environ 1 h 30 de transfert supplémentaire.",
      },
      {
        question: "Faut-il un visa pour la Turquie ?",
        answer:
          "Pour un séjour touristique court, les ressortissants français n'ont pas besoin de visa. Vérifiez la durée autorisée et la validité de votre passeport avant le départ.",
      },
    ],
  },
  {
    slug: "paris-dubai",
    origin: "PAR",
    originCity: "Paris",
    destination: "DXB",
    destinationCity: "Dubaï",
    country: "Émirats arabes unis",
    heading: "Vols pas chers Paris — Dubaï",
    metaTitle: "Vol Paris Dubaï pas cher : direct, escale et bonne saison | TrouveMonVol",
    metaDescription:
      "Comparez vols directs et stopovers vers Dubaï au prix total, taxes incluses, vendeur affiché. Meilleure saison pour partir, évolution des prix, alerte gratuite.",
    intro:
      "Dubaï est à la fois une destination de séjour et l'un des plus grands hubs mondiaux. Résultat : une offre abondante toute l'année et de fortes variations selon la saison.",
    bestMonths: "Mai, juin et septembre",
    averageDuration: "6 h 45 en vol direct",
    sections: [
      {
        heading: "Quand partir à Dubaï au meilleur prix",
        paragraphs: [
          "La haute saison va de novembre à mars, quand les températures deviennent agréables, entre 22 et 28 degrés. C'est la période la plus chère, avec des pointes très marquées pendant les vacances de Noël et de février.",
          "L'été, de mai à septembre, la chaleur dépasse largement 40 degrés et la fréquentation touristique chute. Les billets et les hôtels baissent fortement : c'est la fenêtre budget, à condition d'accepter une vie très largement climatisée.",
          "Mai et septembre représentent le meilleur compromis : la chaleur est déjà ou encore forte, mais les tarifs restent bas par rapport à la haute saison.",
        ],
      },
      {
        heading: "Compagnies et bagages",
        paragraphs: [
          "Emirates et Air France assurent des vols directs depuis Roissy, en 6 h 45 environ. Flydubai et plusieurs compagnies européennes proposent des trajets avec escale, souvent moins chers.",
          "Un point positif sur cette ligne : les franchises bagages des compagnies du Golfe sont généreuses, souvent 25 à 30 kg en soute inclus. Comparé à un billet à bas coût où tout est en option, l'écart réel est plus faible qu'il n'y paraît.",
        ],
      },
      {
        heading: "Escale ou séjour",
        paragraphs: [
          "Si Dubaï n'est qu'une escale vers l'Asie, vérifiez les offres de stopover : plusieurs compagnies permettent de rester une à quatre nuits sans surcoût sur le billet, parfois avec un hôtel partenaire à tarif réduit.",
          "Pour un séjour, un aller-retour hors saison se trouve fréquemment entre 350 et 480 euros. En décembre et février, comptez 600 à 900 euros.",
        ],
      },
    ],
    faq: [
      {
        question: "Quel est le meilleur mois pour aller à Dubaï pas cher ?",
        answer:
          "Juin, juillet et août sont les moins chers, mais très chauds. Mai et septembre offrent le meilleur équilibre entre prix et conditions de séjour.",
      },
      {
        question: "Combien de temps dure le vol Paris — Dubaï ?",
        answer: "Environ 6 h 45 en vol direct depuis Roissy.",
      },
      {
        question: "Combien coûte un aller-retour Paris — Dubaï ?",
        answer:
          "Entre 350 et 480 euros hors saison, et 600 à 900 euros pendant la haute saison hivernale et les vacances scolaires.",
      },
      {
        question: "Le bagage en soute est-il inclus ?",
        answer:
          "Sur les compagnies du Golfe, une franchise de 25 à 30 kg est généralement incluse. Sur les billets les plus économiques d'autres compagnies, vérifiez avant de comparer.",
      },
    ],
  },
  {
    slug: "paris-tokyo",
    origin: "PAR",
    originCity: "Paris",
    destination: "TYO",
    destinationCity: "Tokyo",
    country: "Japon",
    heading: "Vols pas chers Paris — Tokyo",
    metaTitle: "Paris — Tokyo pas cher : Narita, Haneda et bon moment | TrouveMonVol",
    metaDescription:
      "Vols Paris-Tokyo au prix total taxes incluses, vendeur affiché. Bons mois hors saison des cerisiers, courbe de prix sur 12 mois, alertes gratuites.",
    intro:
      "Tokyo est l'un des long-courriers les plus recherchés au départ de Paris. Les prix y sont très saisonniers, avec un rapport du simple au double entre les meilleures et les pires dates.",
    bestMonths: "Janvier, février et juin",
    averageDuration: "12 à 14 h selon la route",
    sections: [
      {
        heading: "Quand partir à Tokyo au meilleur prix",
        paragraphs: [
          "Deux périodes tirent les prix vers le haut : la floraison des cerisiers, fin mars et début avril, et les feuillages d'automne en novembre. Ce sont les moments les plus photogéniques, donc les plus demandés.",
          "Les tarifs les plus bas se trouvent en janvier et février, hors Nouvel An japonais, ainsi qu'en juin pendant la saison des pluies. Le mois de juin est souvent sous-estimé : les averses sont irrégulières et la ville reste parfaitement praticable.",
          "Évitez la Golden Week japonaise, fin avril et début mai, et la semaine d'Obon en août : ces périodes de congés nationaux font grimper les vols intérieurs comme internationaux.",
        ],
      },
      {
        heading: "Narita ou Haneda",
        paragraphs: [
          "Tokyo dispose de deux aéroports internationaux. Haneda est bien plus proche du centre, à une vingtaine de minutes en train, tandis que Narita demande environ une heure de trajet et un billet de train plus cher.",
          "Sur un billet à peu près équivalent, Haneda fait gagner du temps et un peu d'argent sur le transfert. Nos résultats comparent les deux automatiquement.",
        ],
      },
      {
        heading: "Budget réaliste",
        paragraphs: [
          "Hors haute saison, un aller-retour avec escale se trouve souvent entre 620 et 780 euros. En vol direct, comptez 800 à 1 100 euros. Pendant la floraison des cerisiers, les mêmes billets dépassent régulièrement 1 300 euros.",
          "Sur cette destination, réserver quatre à six mois à l'avance est presque toujours payant, en particulier si vos dates sont imposées.",
        ],
      },
    ],
    faq: [
      {
        question: "Quel est le meilleur mois pour aller à Tokyo pas cher ?",
        answer:
          "Janvier et février sont les moins chers, suivis de juin. Évitez fin mars et début avril, période des cerisiers, ainsi que la Golden Week.",
      },
      {
        question: "Combien de temps dure le vol Paris — Tokyo ?",
        answer:
          "Entre 12 et 14 heures selon la route empruntée en vol direct, et 16 à 20 heures avec une escale.",
      },
      {
        question: "Combien coûte un aller-retour Paris — Tokyo ?",
        answer:
          "Entre 620 et 780 euros avec escale hors haute saison, 800 à 1 100 euros en direct, et plus de 1 300 euros pendant la floraison des cerisiers.",
      },
      {
        question: "Faut-il un visa pour le Japon ?",
        answer:
          "Pour un séjour touristique court, les ressortissants français sont exemptés de visa. Vérifiez les formalités d'entrée en vigueur avant votre départ.",
      },
    ],
  },
  {
    slug: "paris-alger",
    origin: "PAR",
    originCity: "Paris",
    destination: "ALG",
    destinationCity: "Alger",
    country: "Algérie",
    heading: "Vols pas chers Paris — Alger",
    metaTitle: "Vol Paris Alger pas cher : bagages, saison et vrai prix | TrouveMonVol",
    metaDescription:
      "Vols Paris-Alger comparés au prix total, franchises bagages incluses dans le calcul, vendeur affiché. Meilleures périodes, historique de prix, alerte gratuite.",
    intro:
      "Paris — Alger est une ligne à forte demande familiale, avec une saisonnalité très marquée par les congés d'été et les fêtes. Anticiper y compte davantage que sur la plupart des autres destinations.",
    bestMonths: "Février, mars et octobre",
    averageDuration: "2 h 20 en vol direct",
    sections: [
      {
        heading: "Quand partir à Alger au meilleur prix",
        paragraphs: [
          "Les mois de février, mars et octobre sont les plus favorables côté budget. Le climat méditerranéen y reste doux et la demande est basse entre deux périodes de congés.",
          "L'été, de fin juin à début septembre, correspond au pic de trafic. Les billets partent très tôt et les prix montent fortement dès le printemps. Sur ces dates, réserver trois à cinq mois à l'avance n'est pas un excès de prudence.",
          "Les périodes de fêtes religieuses génèrent également de fortes pointes. Comme leur date se décale chaque année, vérifiez le calendrier avant de bloquer vos dates.",
        ],
      },
      {
        heading: "Compagnies et bagages",
        paragraphs: [
          "Air Algérie, Air France, Transavia et ASL Airlines desservent la ligne depuis Orly et Roissy. Les franchises bagages varient beaucoup d'une compagnie à l'autre sur ce trajet : c'est le premier point à vérifier, avant même le prix.",
          "Un billet un peu plus cher incluant 30 kg en soute revient souvent moins cher qu'un billet d'appel auquel il faut ajouter deux valises.",
        ],
      },
      {
        heading: "Formalités et durée",
        paragraphs: [
          "Le vol direct dure environ 2 h 20. Les formalités d'entrée en Algérie dépendent de votre nationalité et du motif du voyage : renseignez-vous auprès des autorités consulaires avant l'achat, surtout pour un premier voyage.",
          "Prévoyez également un peu de marge à l'arrivée : les contrôles peuvent être longs en période de forte affluence estivale.",
        ],
      },
    ],
    faq: [
      {
        question: "Quel est le meilleur mois pour aller à Alger pas cher ?",
        answer:
          "Février, mars et octobre affichent les tarifs les plus bas. L'été et les périodes de fêtes sont nettement plus chers.",
      },
      {
        question: "Combien de temps dure le vol Paris — Alger ?",
        answer: "Environ 2 h 20 en vol direct.",
      },
      {
        question: "Combien de temps à l'avance réserver un vol Paris — Alger ?",
        answer:
          "Deux mois suffisent hors saison. Pour un départ en juillet ou en août, réservez trois à cinq mois à l'avance.",
      },
      {
        question: "Quelle franchise bagages sur cette ligne ?",
        answer:
          "Elle varie fortement selon la compagnie. Comparez le prix incluant vos bagages réels : un billet plus cher avec 30 kg inclus est souvent l'option la moins chère au total.",
      },
    ],
  },
  {
    slug: "paris-rome",
    origin: "PAR",
    originCity: "Paris",
    destination: "ROM",
    destinationCity: "Rome",
    country: "Italie",
    heading: "Vols pas chers Paris — Rome",
    metaTitle: "Paris — Rome pas cher : prix, saison et réservation Vatican | TrouveMonVol",
    metaDescription:
      "Vols Paris-Rome au prix total, sans frais cachés, vendeur affiché. Meilleure saison pour visiter, courbe de prix sur 12 mois, alerte prix gratuite.",
    intro:
      "Rome est desservie une dizaine de fois par jour depuis Paris, en deux heures de vol. La ligne est très concurrentielle, ce qui laisse de belles opportunités hors vacances scolaires.",
    bestMonths: "Janvier, février et novembre",
    averageDuration: "2 h 05 en vol direct",
    sections: [
      {
        heading: "Quand partir à Rome au meilleur prix",
        paragraphs: [
          "L'hiver, hors fêtes de fin d'année, est la période la moins chère. La ville est agréable à visiter, les files d'attente sont raisonnables et les billets descendent souvent sous 80 euros l'aller-retour.",
          "Le printemps et le début de l'automne offrent la meilleure météo, avec des tarifs intermédiaires. L'été est chaud, très fréquenté et cher : c'est la période à éviter si le budget prime.",
          "Les grands événements religieux et les jours fériés italiens créent des pointes ponctuelles. Décaler d'un ou deux jours suffit souvent à revenir à un tarif normal.",
        ],
      },
      {
        heading: "Fiumicino ou Ciampino",
        paragraphs: [
          "Fiumicino est le principal aéroport, relié au centre en trente minutes par le train direct. Ciampino, utilisé par les compagnies à bas coût, demande un transfert en bus d'environ quarante minutes.",
          "L'écart de prix entre les deux existe, mais il se réduit une fois le transfert intégré. Nos résultats affichent les deux pour que la comparaison soit honnête.",
        ],
      },
      {
        heading: "Astuces spécifiques à cette ligne",
        paragraphs: [
          "Les départs en milieu de semaine sont nettement moins chers que les départs du vendredi soir, écart classique sur les city-breaks. Sur un week-end de trois jours, partir le jeudi soir et rentrer le dimanche matin coûte souvent moins cher que le schéma inverse.",
          "Si vous prévoyez de visiter également Naples ou Florence, comparez les prix d'arrivée sur ces villes : le train italien est rapide et le billet d'avion parfois bien moins cher.",
        ],
      },
    ],
    faq: [
      {
        question: "Quel est le meilleur mois pour aller à Rome pas cher ?",
        answer:
          "Janvier et février sont les moins chers, suivis de novembre. Évitez juillet, août et les jours fériés italiens.",
      },
      {
        question: "Combien de temps dure le vol Paris — Rome ?",
        answer: "Environ 2 h 05 en vol direct.",
      },
      {
        question: "Fiumicino ou Ciampino : quel aéroport choisir ?",
        answer:
          "Fiumicino est relié au centre en trente minutes par train direct. Ciampino est utilisé par les compagnies à bas coût et demande environ quarante minutes de bus.",
      },
      {
        question: "Combien coûte un aller-retour Paris — Rome ?",
        answer:
          "Entre 70 et 120 euros hors saison avec des dates flexibles, et 180 à 280 euros en été ou sur un week-end prolongé.",
      },
    ],
  },
  {
    slug: "lyon-tunis",
    origin: "LYS",
    originCity: "Lyon",
    destination: "TUN",
    destinationCity: "Tunis",
    country: "Tunisie",
    heading: "Vols pas chers Lyon — Tunis",
    metaTitle: "Vol Lyon Tunis pas cher : compagnies et meilleure période | TrouveMonVol",
    metaDescription:
      "Vols Lyon-Tunis comparés au prix total, taxes incluses, vendeur affiché en clair. Compagnies sur la ligne, durée du trajet, meilleure période, alerte gratuite.",
    intro:
      "Environ deux heures de vol séparent Lyon-Saint-Exupéry de Tunis-Carthage. La liaison est desservie toute l'année, avec une offre qui s'étoffe nettement au printemps et en été, période où les écarts de prix d'un jour à l'autre deviennent les plus marqués.",
    bestMonths: "Mars-avril et octobre-novembre",
    averageDuration: "Environ 2 h en vol direct",
    sections: [
      {
        heading: "Quand partir à Tunis au meilleur prix",
        paragraphs: [
          "La demande sur Lyon — Tunis suit deux logiques qui se superposent : le tourisme balnéaire, concentré de juin à septembre, et les voyages familiaux, qui explosent pendant les vacances scolaires françaises et autour des fêtes. Quand ces deux courbes se croisent, en juillet et en août, les billets atteignent leurs sommets de l'année et les vols directs se remplissent plusieurs semaines à l'avance.",
          "Les meilleures fenêtres budget se situent au printemps, en mars et avril hors vacances de Pâques, puis à l'automne, en octobre et novembre. Le climat y reste doux, autour de 20 à 25 degrés en journée à Tunis, et les tarifs redescendent souvent d'un tiers par rapport au plein été. Janvier et février, hors vacances, offrent également des prix bas, avec des journées plus fraîches et un peu de pluie.",
          "Sur cette liaison, le jour de la semaine compte beaucoup : un départ en milieu de semaine, mardi ou mercredi, est régulièrement moins cher qu'un départ le vendredi soir ou le samedi matin, très demandés. Décaler son vol d'un ou deux jours suffit souvent à faire baisser la facture, ce que l'option « dates flexibles ± 3 jours » permet de vérifier en une seule recherche.",
        ],
      },
      {
        heading: "Quelles compagnies et quels aéroports",
        paragraphs: [
          "Le trajet est opéré en direct depuis Lyon-Saint-Exupéry vers Tunis-Carthage, principalement par Tunisair, Nouvelair et Transavia France selon les saisons. On trouve aussi des billets avec une escale, souvent via Paris, Marseille, Rome ou Istanbul : ils sont parfois moins chers, mais ajoutent trois à huit heures de trajet, ce qui a peu de sens sur une distance aussi courte sauf en cas de vraie économie.",
          "Tunis-Carthage se trouve à moins de dix kilomètres du centre-ville, ce qui évite un transfert long et coûteux à l'arrivée. Si votre séjour se déroule dans le sud du pays, comparez aussi les arrivées sur Djerba ou Monastir : selon la saison, elles peuvent revenir moins cher que Tunis plus un trajet intérieur.",
          "Attention aux bagages sur les tarifs les plus bas : un aller-retour avec valise en soute peut ajouter 50 à 80 euros au prix d'appel. Sur TrouveMonVol, le prix affiché est le prix total taxes incluses, et le vendeur réel du billet est nommé sous chaque résultat.",
        ],
      },
      {
        heading: "Quel budget prévoir et quand réserver",
        paragraphs: [
          "Hors haute saison et avec des dates souples, un aller-retour Lyon — Tunis se trouve régulièrement entre 120 et 190 euros. En juillet et août, ou pendant les vacances scolaires, comptez plutôt 280 à 400 euros, davantage encore si vous réservez dans les trois dernières semaines.",
          "La règle qui fonctionne le mieux sur ce trajet est simple : six à dix semaines d'anticipation pour un voyage en période normale, et trois à quatre mois pour l'été et les fêtes. Passé ce délai, les classes tarifaires les moins chères disparaissent et le prix ne redescend presque jamais.",
          "Le graphique d'évolution ci-dessous sert de repère : si le tarif que vous voyez aujourd'hui est nettement au-dessus du plancher observé les mois précédents, une alerte prix est plus efficace que de vérifier manuellement chaque jour.",
        ],
      },
    ],
    faq: [
      {
        question: "Quand réserver un vol Lyon — Tunis pour payer moins cher ?",
        answer:
          "Six à dix semaines avant le départ en période normale, et trois à quatre mois à l'avance pour l'été, les vacances scolaires et les fêtes. Les départs en milieu de semaine sont souvent moins chers que ceux du vendredi ou du samedi.",
      },
      {
        question: "Quelle compagnie choisir sur Lyon — Tunis ?",
        answer:
          "Tunisair, Nouvelair et Transavia France assurent l'essentiel des vols directs selon les saisons. Comparez toujours bagage inclus : sur les tarifs les plus bas, la valise en soute peut ajouter 50 à 80 euros à l'aller-retour.",
      },
      {
        question: "Combien de temps dure le vol Lyon — Tunis ?",
        answer:
          "Environ 2 heures en vol direct. Avec une escale, comptez généralement entre 5 et 9 heures selon la correspondance.",
      },
    ],
  },
  {
    slug: "paris-seoul",
    origin: "PAR",
    originCity: "Paris",
    destination: "ICN",
    destinationCity: "Séoul",
    country: "Corée du Sud",
    heading: "Vols pas chers Paris — Séoul",
    metaTitle: "Paris — Séoul pas cher : compagnies et accès depuis Incheon | TrouveMonVol",
    metaDescription:
      "Vols Paris-Séoul comparés au prix total, vendeur affiché. Liaison depuis l'aéroport d'Incheon, meilleure période pour réserver, alerte prix gratuite.",
    intro:
      "Un vol direct Paris — Séoul dure environ onze heures et demie. La demande varie fortement selon la saison : les cerisiers en fleurs au printemps et les couleurs d'automne concentrent l'essentiel de l'affluence touristique française sur cette destination.",
    bestMonths: "Avril-mai et septembre-novembre",
    averageDuration: "11 h 30 en vol direct",
    sections: [
      {
        heading: "Compagnies et accès depuis Incheon",
        paragraphs: [
          "Air France et Korean Air opèrent la ligne en direct depuis Charles-de-Gaulle, avec un partage de code qui permet de comparer les deux sur les mêmes vols. Les tarifs les plus bas se trouvent généralement en réservant trois à quatre mois à l'avance.",
          "L'aéroport international d'Incheon est excentré, à une cinquantaine de kilomètres de Séoul. L'AREX (Airport Railroad Express) rejoint la gare de Séoul en train direct en 43 minutes pour environ 9 euros, ou en train omnibus desservant plus d'arrêts en 56 minutes pour moins cher.",
          "Séoul se parcourt très bien en métro : le réseau est dense, ponctuel et signalé en anglais, avec des tickets à l'unité ou une carte rechargeable T-money largement plus pratique.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Avril-mai (floraison des cerisiers) et septembre-novembre (couleurs d'automne) offrent le meilleur compromis météo, mais concentrent aussi la plus forte demande : réservez tôt pour ces fenêtres. L'été (juillet-août) est chaud et humide, avec une saison des pluies (mangma) à prévoir.",
          "L'hiver reste froid mais sec, avec des tarifs de vol souvent plus bas hors période du Nouvel An lunaire (fin janvier ou février selon les années), où toute l'Asie de l'Est voyage en même temps.",
          "Séoul reste une capitale abordable une fois sur place : un repas de rue ou dans un petit restaurant local revient à 5-10 euros, une chambre correcte à 50-90 euros la nuit hors période de forte affluence.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Séoul ?",
        answer: "Environ 11 h 30 en vol direct.",
      },
      {
        question: "Faut-il un visa pour aller en Corée du Sud ?",
        answer:
          "Non pour un séjour touristique de moins de 90 jours, mais une autorisation électronique K-ETA est à demander en ligne avant le départ.",
      },
      {
        question: "Comment rejoindre Séoul depuis l'aéroport d'Incheon ?",
        answer:
          "Le train AREX direct rejoint la gare de Séoul en 43 minutes pour environ 9 euros ; une version omnibus, plus lente, coûte moins cher.",
      },
    ],
  },
  {
    slug: "paris-hong-kong",
    origin: "PAR",
    originCity: "Paris",
    destination: "HKG",
    destinationCity: "Hong Kong",
    country: "Hong Kong",
    heading: "Vols pas chers Paris — Hong Kong",
    metaTitle: "Vol Paris Hong Kong pas cher : compagnies et bon moment | TrouveMonVol",
    metaDescription:
      "Vols Paris-Hong Kong au prix total, taxes incluses, vendeur affiché. Trajet depuis Chek Lap Kok, meilleure saison pour réserver, alerte prix gratuite.",
    intro:
      "Environ onze heures et demie de vol direct séparent Paris de Hong Kong. La ville reste accessible toute l'année, avec une nette préférence pour l'automne et le début d'hiver, quand l'humidité tombe et que le ciel se dégage.",
    bestMonths: "Octobre-décembre",
    averageDuration: "11 h 30 en vol direct",
    sections: [
      {
        heading: "Compagnies et accès depuis l'aéroport",
        paragraphs: [
          "Air France et Cathay Pacific desservent la ligne en direct depuis Charles-de-Gaulle. Cathay Pacific, compagnie locale, propose souvent une offre plus large de classes tarifaires sur cette destination longue distance.",
          "L'Airport Express relie Hong Kong International à la gare Central en 24 minutes, l'un des transferts aéroport les plus rapides d'Asie pour une si grande ville, pour environ 12 euros. Un service gratuit de navette hôtel existe aussi pour de nombreux établissements.",
          "Le réseau MTR (métro) est extrêmement efficace pour se déplacer entre Hong Kong Island, Kowloon et les Nouveaux Territoires ; la carte Octopus rechargeable fonctionne aussi dans les bus, trams et même certains commerces.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Octobre à décembre offre le climat le plus agréable : température modérée, faible humidité et ciel généralement dégagé. Juin à septembre concentre chaleur, humidité extrême et risque de typhons, qui peuvent perturber les vols.",
          "Le Nouvel An chinois (fin janvier ou février selon les années) fait grimper fortement les prix, avec de nombreux commerces locaux fermés pendant plusieurs jours — à connaître avant de fixer vos dates.",
          "Hong Kong varie énormément niveau budget : un repas de rue ou en cantine locale (cha chaan teng) revient à 4-8 euros, tandis que l'hébergement reste l'un des plus chers d'Asie, à partir de 80-120 euros la nuit pour un hôtel correct.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Hong Kong ?",
        answer: "Environ 11 h 30 en vol direct.",
      },
      {
        question: "Faut-il un visa pour aller à Hong Kong ?",
        answer:
          "Non, les citoyens français peuvent entrer sans visa pour un séjour touristique de moins de 90 jours, passeport valide requis.",
      },
      {
        question: "Comment rejoindre le centre depuis l'aéroport de Hong Kong ?",
        answer:
          "L'Airport Express relie l'aéroport à la gare Central en 24 minutes, pour environ 12 euros.",
      },
    ],
  },
  {
    slug: "paris-montreal",
    origin: "PAR",
    originCity: "Paris",
    destination: "YUL",
    destinationCity: "Montréal",
    country: "Canada",
    heading: "Vols pas chers Paris — Montréal",
    metaTitle: "Paris — Montréal pas cher : compagnies et bonne saison | TrouveMonVol",
    metaDescription:
      "Vols Paris-Montréal au prix total, taxes incluses, vendeur affiché. Accès depuis Trudeau, meilleure période pour réserver, alerte prix gratuite.",
    intro:
      "Un vol direct Paris — Montréal dure environ sept heures et demie. C'est l'une des liaisons transatlantiques les plus fréquentées au départ de Paris, avec une offre dense qui laisse une vraie marge de négociation sur le prix selon la période choisie.",
    bestMonths: "Mai-juin et septembre-octobre",
    averageDuration: "7 h 30 en vol direct",
    sections: [
      {
        heading: "Compagnies et accès depuis l'aéroport",
        paragraphs: [
          "Air France, Air Canada, Air Transat et French Bee desservent la ligne, avec des tarifs souvent plus bas chez Air Transat et French Bee en basse saison. La concurrence dense sur cette liaison joue en faveur du voyageur qui compare ses dates.",
          "L'aéroport Montréal-Trudeau n'a pas de liaison ferrée directe : le bus 747 rejoint le centre-ville en quarante-cinq à soixante minutes pour environ 7 euros, disponible 24 h/24.",
          "Montréal se visite bien à pied l'été et via son réseau souterrain (la « ville souterraine ») l'hiver, complété par un métro simple à quatre lignes.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Mai-juin et septembre-octobre (couleurs d'automne) offrent le meilleur compromis météo et prix. L'été (juillet-août) est agréable mais plus cher et plus fréquenté, notamment pendant les nombreux festivals.",
          "L'hiver descend régulièrement sous -10 °C, ce qui fait baisser nettement les prix des vols hors période des fêtes de fin d'année, très demandée par la diaspora franco-canadienne.",
          "Le Canada n'utilise pas l'euro : les prix affichés en dollars canadiens (CAD) demandent une conversion, mais le coût de la vie reste globalement comparable à la France sur la restauration, un peu plus élevé sur l'hébergement en centre-ville.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Montréal ?",
        answer: "Environ 7 h 30 en vol direct.",
      },
      {
        question: "Faut-il un visa pour aller au Canada ?",
        answer:
          "Non pour un séjour touristique de moins de 6 mois, mais une autorisation de voyage électronique (AVE / eTA) est obligatoire avant l'embarquement.",
      },
      {
        question: "Comment rejoindre le centre depuis l'aéroport de Montréal ?",
        answer:
          "Le bus 747, disponible 24 h/24, relie l'aéroport Trudeau au centre-ville en quarante-cinq à soixante minutes pour environ 7 euros.",
      },
    ],
  },
  {
    slug: "paris-los-angeles",
    origin: "PAR",
    originCity: "Paris",
    destination: "LAX",
    destinationCity: "Los Angeles",
    country: "États-Unis",
    heading: "Vols pas chers Paris — Los Angeles",
    metaTitle: "Vol Paris Los Angeles pas cher : ESTA et bonne période | TrouveMonVol",
    metaDescription:
      "Vols Paris-Los Angeles au prix total, taxes incluses, vendeur affiché. Formalités ESTA à prévoir, meilleure saison pour réserver, alerte gratuite.",
    intro:
      "Un vol direct Paris — Los Angeles dure environ onze heures. La Californie du Sud se visite agréablement toute l'année grâce à un climat doux, ce qui rend le choix des dates plus dépendant du prix du billet que de la météo sur place.",
    bestMonths: "Avril-mai et septembre-novembre",
    averageDuration: "11 h en vol direct",
    sections: [
      {
        heading: "Compagnies et organisation sur place",
        paragraphs: [
          "Air France, Delta, United et French Bee desservent la ligne depuis Charles-de-Gaulle. French Bee, compagnie à bas coût long-courrier, propose des tarifs d'appel nettement inférieurs, avec des options payantes à ajouter (bagage, repas) à comparer au prix total.",
          "L'aéroport LAX n'a pas de liaison directe par rail vers la plupart des quartiers ; les navettes FlyAway rejoignent Union Station et Van Nuys, et la location de voiture reste la solution la plus pratique tant Los Angeles est étalée et dépendante de la voiture.",
          "Comptez large sur les distances : Santa Monica, Hollywood et Downtown LA sont chacun à trente à soixante minutes de route les uns des autres selon le trafic, qui peut être dense aux heures de pointe.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Avril-mai et septembre-novembre évitent la foule et la chaleur du cœur de l'été tout en gardant un climat agréable, quasi constant toute l'année sur la côte (moins vrai dans les vallées intérieures, plus chaudes en été).",
          "Les tarifs de vol suivent surtout les vacances scolaires françaises et américaines plutôt que la météo locale : réserver hors ces périodes fait souvent plus de différence que le choix du mois.",
          "Los Angeles reste chère sur l'hébergement (100-180 euros la nuit en zone touristique) mais abordable sur la restauration de rue et les food trucks, autour de 10-15 euros le repas.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Los Angeles ?",
        answer: "Environ 11 heures en vol direct.",
      },
      {
        question: "Faut-il un visa pour aller à Los Angeles ?",
        answer:
          "Non pour un séjour touristique de moins de 90 jours, mais une autorisation ESTA est obligatoire, à demander en ligne avant le départ.",
      },
      {
        question: "Comment se déplacer à Los Angeles sans voiture ?",
        answer:
          "C'est possible mais contraignant : les navettes FlyAway et quelques lignes de métro existent, mais la location de voiture reste la solution la plus pratique vu l'étalement de la ville.",
      },
    ],
  },
  {
    slug: "paris-le-caire",
    origin: "PAR",
    originCity: "Paris",
    destination: "CAI",
    destinationCity: "Le Caire",
    country: "Égypte",
    heading: "Vols pas chers Paris — Le Caire",
    metaTitle: "Paris — Le Caire pas cher : visa et meilleure saison | TrouveMonVol",
    metaDescription:
      "Vols Paris-Le Caire au prix total, taxes incluses, vendeur affiché. Formalités visa à connaître, meilleure période pour visiter, alerte prix gratuite.",
    intro:
      "Un vol direct Paris — Le Caire dure environ quatre heures et demie, ce qui en fait l'une des destinations dépaysantes les plus rapides à atteindre depuis Paris. La chaleur estivale, souvent au-dessus de 35 °C, pousse la plupart des voyageurs vers l'automne, l'hiver ou le printemps.",
    bestMonths: "Octobre-avril",
    averageDuration: "4 h 30 en vol direct",
    sections: [
      {
        heading: "Compagnies et formalités avant de partir",
        paragraphs: [
          "Air France et EgyptAir opèrent la ligne en direct depuis Charles-de-Gaulle. EgyptAir propose souvent des tarifs légèrement inférieurs, avec un choix d'horaires plus large sur certaines périodes.",
          "Un visa est nécessaire pour les citoyens français : il peut s'obtenir en ligne avant le départ (e-visa) ou à l'arrivée à l'aéroport contre paiement, selon la formule choisie. Vérifiez la validité de votre passeport, qui doit dépasser six mois après la date de retour.",
          "Le Caire n'a pas de liaison ferrée directe entre l'aéroport et le centre-ville : le trajet se fait en taxi ou VTC, à négocier ou réserver à l'avance pour éviter les tarifs gonflés à la sortie du terminal.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Octobre à avril offre des températures nettement plus vivables (18-28 °C en journée) pour visiter les pyramides de Gizeh et le musée égyptien sans la chaleur écrasante de l'été, qui dépasse régulièrement les 35-40 °C de juin à août.",
          "Les tarifs de vol restent globalement modérés toute l'année, avec une légère hausse autour des fêtes de fin d'année et de Pâques, périodes de forte demande touristique.",
          "Le Caire reste une destination très abordable sur place : un repas dans un restaurant local revient à 5-10 euros, une chambre correcte en hôtel à 30-60 euros la nuit — le vol représente souvent l'essentiel du budget total du voyage.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Le Caire ?",
        answer: "Environ 4 h 30 en vol direct.",
      },
      {
        question: "Faut-il un visa pour aller en Égypte ?",
        answer:
          "Oui, les citoyens français ont besoin d'un visa, obtenable en ligne avant le départ (e-visa) ou à l'arrivée à l'aéroport.",
      },
      {
        question: "Quelle est la meilleure période pour visiter Le Caire et les pyramides ?",
        answer:
          "D'octobre à avril, pour éviter la chaleur estivale qui dépasse souvent 35-40 °C entre juin et août.",
      },
    ],
  },
  {
    slug: "paris-dakar",
    origin: "PAR",
    originCity: "Paris",
    destination: "DKR",
    destinationCity: "Dakar",
    country: "Sénégal",
    heading: "Vols pas chers Paris — Dakar",
    metaTitle: "Vol Paris Dakar pas cher : saison sèche et formalités | TrouveMonVol",
    metaDescription:
      "Vols Paris-Dakar au prix total, taxes incluses, vendeur affiché. Repères sur la saison sèche, formalités d'entrée, alerte prix gratuite.",
    intro:
      "Un vol direct Paris — Dakar dure un peu moins de six heures. La demande suit un rythme saisonnier marqué par la saison sèche, mais aussi par les vacances scolaires et les grandes fêtes, très suivies par une importante diaspora sénégalaise en France.",
    bestMonths: "Novembre-mai",
    averageDuration: "5 h 45 en vol direct",
    sections: [
      {
        heading: "Compagnies et accès depuis l'aéroport",
        paragraphs: [
          "Air France, Air Sénégal, Corsair et Transavia desservent la ligne depuis Charles-de-Gaulle et Orly. Air Sénégal, compagnie nationale, complète bien l'offre historique d'Air France sur cette liaison.",
          "L'aéroport international Blaise-Diagne se trouve à une quarantaine de kilomètres de Dakar, sans liaison ferrée : comptez 45 minutes à 1 heure de route selon la circulation, en taxi ou navette.",
          "L'île de Gorée, classée à l'UNESCO pour son passé lié à la traite négrière, se visite en vingt minutes de bateau depuis le port de Dakar — une étape quasi incontournable du séjour.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "La saison sèche, de novembre à mai, offre le climat le plus agréable, avec des températures modérées par l'harmattan. La saison des pluies (hivernage), de juin à octobre, apporte chaleur et humidité plus marquées.",
          "Les vacances scolaires françaises et les grandes fêtes (Tabaski notamment) concentrent une forte demande de la diaspora : les prix montent alors plus tôt et plus fort qu'en période normale, un mécanisme comparable à ce qu'on observe sur les liaisons vers le Maghreb.",
          "Le Sénégal utilise le franc CFA, indexé sur l'euro à taux fixe, ce qui simplifie les comparaisons de prix sur place par rapport à une monnaie flottante.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Dakar ?",
        answer: "Environ 5 h 45 en vol direct.",
      },
      {
        question: "Faut-il un visa pour aller au Sénégal ?",
        answer:
          "Non : le Sénégal a supprimé l'obligation de visa touristique pour l'ensemble des nationalités, dont les citoyens français. Un passeport valide reste nécessaire.",
      },
      {
        question: "Quand les vols vers Dakar sont-ils les plus chers ?",
        answer:
          "Pendant les vacances scolaires françaises et les grandes fêtes (comme la Tabaski), très suivies par la diaspora sénégalaise — réservez tôt sur ces périodes.",
      },
    ],
  },
  {
    slug: "paris-reykjavik",
    origin: "PAR",
    originCity: "Paris",
    destination: "KEF",
    destinationCity: "Reykjavik",
    country: "Islande",
    heading: "Vols pas chers Paris — Reykjavik",
    metaTitle: "Paris — Reykjavik pas cher : aurores boréales et bon prix | TrouveMonVol",
    metaDescription:
      "Vols Paris-Reykjavik au prix total, taxes incluses, vendeur affiché. Saison des aurores boréales, meilleure période pour réserver, alerte gratuite.",
    intro:
      "Un peu moins de quatre heures de vol séparent Paris de Reykjavik. La destination attire toute l'année pour des raisons différentes : soleil de minuit et randonnées en été, aurores boréales et paysages enneigés en hiver.",
    bestMonths: "Juin-août (nature) ou septembre-mars (aurores boréales)",
    averageDuration: "3 h 40 en vol direct",
    sections: [
      {
        heading: "Compagnies et accès depuis l'aéroport",
        paragraphs: [
          "Icelandair et Air France assurent la liaison directe depuis Charles-de-Gaulle. Icelandair, compagnie locale, propose souvent une offre tarifaire plus large sur les créneaux hors saison.",
          "L'aéroport de Keflavik est à une cinquantaine de kilomètres de Reykjavik : le Flybus rejoint le centre en 45 minutes environ, synchronisé avec les vols, pour environ 25 euros.",
          "Louer une voiture reste la meilleure option pour explorer au-delà de la capitale : le Cercle d'or (geysers, chutes de Gullfoss, parc national de Thingvellir) se visite en une journée depuis Reykjavik.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Juin à août offre le soleil de minuit et l'accès le plus large aux routes et sentiers de randonnée, souvent fermés le reste de l'année. C'est aussi la période la plus chère et la plus fréquentée.",
          "De septembre à mars, les nuits longues et le ciel souvent dégagé offrent de bonnes chances d'observer les aurores boréales, avec des tarifs de vol et d'hôtel plus doux qu'en été.",
          "L'Islande reste un pays cher : un repas simple revient à 20-25 euros, une nuit d'hôtel correcte à 120-180 euros. Le vol représente souvent une part modeste du budget total du voyage.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Reykjavik ?",
        answer: "Environ 3 h 40 en vol direct.",
      },
      {
        question: "Quand voir les aurores boréales en Islande ?",
        answer:
          "De septembre à mars, quand les nuits sont longues et le ciel dégagé. Aucune garantie n'existe, l'activité solaire et la météo restant déterminantes.",
      },
      {
        question: "Faut-il un visa pour aller en Islande ?",
        answer:
          "Non, l'Islande fait partie de l'espace Schengen : une carte d'identité valide suffit pour les citoyens français.",
      },
    ],
  },
  {
    slug: "paris-stockholm",
    origin: "PAR",
    originCity: "Paris",
    destination: "ARN",
    destinationCity: "Stockholm",
    country: "Suède",
    heading: "Vols pas chers Paris — Stockholm",
    metaTitle: "Vol Paris Stockholm pas cher : accès depuis Arlanda | TrouveMonVol",
    metaDescription:
      "Vols Paris-Stockholm au prix total, taxes incluses, vendeur affiché. Liaison depuis Arlanda, meilleure saison pour partir, alerte prix gratuite.",
    intro:
      "Stockholm est à moins de trois heures de vol de Paris. La ville, bâtie sur quatorze îles, se visite dans des conditions radicalement différentes selon la saison : journées interminables et douces en été, nuits longues et froides en hiver.",
    bestMonths: "Mai-août",
    averageDuration: "2 h 40 en vol direct",
    sections: [
      {
        heading: "Compagnies et accès depuis Arlanda",
        paragraphs: [
          "Air France, SAS et Transavia desservent la ligne depuis Charles-de-Gaulle et Orly. SAS, compagnie scandinave historique, propose une bonne fréquence de vols en semaine.",
          "L'Arlanda Express relie l'aéroport à la gare centrale en dix-huit minutes, mais coûte cher (environ 30 euros l'aller) ; le bus Flygbussarna, plus lent (45 minutes), revient nettement moins cher.",
          "Stockholm se visite très bien à pied et en ferry entre les îles : un pass transport de plusieurs jours couvre bus, métro et plusieurs liaisons maritimes urbaines.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Mai à août profite de journées très longues (le soleil se couche après 22 h en juin) et d'un climat doux, à l'inverse d'un hiver rigoureux où la nuit tombe dès le milieu de l'après-midi.",
          "Les tarifs de vol restent globalement modérés toute l'année, avec une hausse sensible en juin-juillet, période de plus forte fréquentation touristique et de la fête de la Saint-Jean (Midsommar).",
          "La Suède n'utilise pas l'euro : les prix s'affichent en couronnes suédoises (SEK). Le pays reste cher pour la restauration (15-25 euros pour un repas simple) mais les musées d'histoire et d'art sont nombreux et souvent gratuits ou à prix modéré.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Stockholm ?",
        answer: "Environ 2 h 40 en vol direct.",
      },
      {
        question: "Stockholm utilise-t-elle l'euro ?",
        answer:
          "Non, la Suède a sa propre monnaie, la couronne suédoise (SEK). Les cartes bancaires sont acceptées presque partout, y compris pour de petits montants.",
      },
      {
        question: "Comment rejoindre le centre depuis l'aéroport d'Arlanda ?",
        answer:
          "L'Arlanda Express relie la gare centrale en 18 minutes pour environ 30 euros ; le bus Flygbussarna est plus lent (45 minutes) mais nettement moins cher.",
      },
    ],
  },
  {
    slug: "paris-mexico",
    origin: "PAR",
    originCity: "Paris",
    destination: "MEX",
    destinationCity: "Mexico",
    country: "Mexique",
    heading: "Vols pas chers Paris — Mexico",
    metaTitle: "Paris — Mexico pas cher : altitude et meilleure saison | TrouveMonVol",
    metaDescription:
      "Vols Paris-Mexico au prix total, taxes incluses, vendeur affiché. Climat tempéré par l'altitude, bonne période pour réserver, alerte prix gratuite.",
    intro:
      "Un vol direct Paris — Mexico dure environ onze heures. Perchée à plus de 2 200 mètres d'altitude, la capitale mexicaine profite d'un climat étonnamment tempéré toute l'année, bien loin de l'image de chaleur tropicale qu'on prête souvent au pays.",
    bestMonths: "Novembre-avril",
    averageDuration: "11 h en vol direct",
    sections: [
      {
        heading: "Compagnies et organisation sur place",
        paragraphs: [
          "Air France assure la liaison directe depuis Charles-de-Gaulle, en partage de code avec Aeroméxico. Les tarifs les plus intéressants se trouvent en réservant deux à trois mois à l'avance.",
          "L'aéroport Benito-Juárez dispose d'une ligne de métro (ligne 5, station Terminal Aérea), mais un taxi officiel ou un VTC réservé à l'avance reste la solution recommandée pour un premier trajet avec bagages.",
          "Mexico est une mégapole étendue : le centre historique, Roma-Condesa et Coyoacán se visitent bien à pied chacun, mais nécessitent un trajet en métro, taxi ou VTC pour passer de l'un à l'autre.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Grâce à l'altitude, Mexico reste tempérée toute l'année (rarement au-dessus de 25 °C en journée). La saison sèche, de novembre à avril, offre un ciel plus dégagé ; la saison des pluies (mai-octobre) apporte des averses généralement brèves en fin d'après-midi.",
          "Les tarifs de vol suivent surtout les vacances scolaires françaises et mexicaines plutôt que la météo locale, la ville se visitant agréablement toute l'année.",
          "Mexico reste abordable une fois sur place : un repas de rue (tacos, marché) revient à 3-6 euros, un dîner au restaurant à 15-25 euros par personne, une chambre correcte à 40-70 euros la nuit.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Mexico ?",
        answer: "Environ 11 heures en vol direct.",
      },
      {
        question: "Faut-il un visa pour aller au Mexique ?",
        answer:
          "Non pour un séjour touristique de moins de 180 jours, passeport valide requis.",
      },
      {
        question: "Fait-il très chaud à Mexico ?",
        answer:
          "Non : la ville est perchée à plus de 2 200 mètres d'altitude et reste tempérée toute l'année, rarement au-dessus de 25 °C en journée.",
      },
    ],
  },
  {
    slug: "paris-doha",
    origin: "PAR",
    originCity: "Paris",
    destination: "DOH",
    destinationCity: "Doha",
    country: "Qatar",
    heading: "Vols pas chers Paris — Doha",
    metaTitle: "Vol Paris Doha pas cher : escale ou séjour, quand partir | TrouveMonVol",
    metaDescription:
      "Vols Paris-Doha au prix total, taxes incluses, vendeur affiché. Trajet depuis Hamad International, meilleure période pour réserver, alerte gratuite.",
    intro:
      "Un vol direct Paris — Doha dure environ six heures et demie. La ville sert aussi de porte d'entrée pratique vers l'Asie et l'Océanie via une escale courte, mais mérite un arrêt à part entière pour ses musées et son front de mer.",
    bestMonths: "Novembre-mars",
    averageDuration: "6 h 30 en vol direct",
    sections: [
      {
        heading: "Compagnies et accès depuis l'aéroport",
        paragraphs: [
          "Qatar Airways opère la ligne en direct depuis Charles-de-Gaulle, avec une flotte récente et une offre de classes tarifaires étendue, y compris sur les billets les moins chers.",
          "L'aéroport international Hamad se trouve à une quinzaine de kilomètres du centre : le métro de Doha (ligne rouge) rejoint le centre-ville en une trentaine de minutes, alternative pratique et bon marché au taxi.",
          "Doha se parcourt en taxi, VTC ou métro selon les quartiers : le souk Waqif et la corniche se visitent bien à pied, mais les distances entre quartiers restent importantes comme dans la plupart des villes du Golfe.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Novembre à mars offre des températures agréables (18-28 °C), idéales pour profiter de la corniche et des activités extérieures. L'été (juin-septembre) dépasse régulièrement les 40 °C, rendant les sorties diurnes difficiles.",
          "Les tarifs de vol restent globalement stables toute l'année sur cette liaison, avec une légère hausse pendant les grands événements sportifs ou culturels organisés dans le pays.",
          "Doha peut être visitée avec des budgets très variables : le Museum of Islamic Art est gratuit, un repas dans le souk Waqif revient à 10-15 euros, mais l'hébergement dans les grandes enseignes internationales reste cher (100-200 euros la nuit).",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Doha ?",
        answer: "Environ 6 h 30 en vol direct.",
      },
      {
        question: "Faut-il un visa pour aller au Qatar ?",
        answer:
          "Non, le Qatar accorde l'entrée sans visa aux citoyens français pour un séjour touristique de courte durée, passeport valide requis.",
      },
      {
        question: "Comment rejoindre le centre depuis l'aéroport de Doha ?",
        answer:
          "La ligne rouge du métro de Doha relie l'aéroport Hamad au centre-ville en une trentaine de minutes.",
      },
    ],
  },
  {
    slug: "paris-bali",
    origin: "PAR",
    originCity: "Paris",
    destination: "DPS",
    destinationCity: "Bali",
    country: "Indonésie",
    heading: "Vols pas chers Paris — Bali",
    metaTitle: "Paris — Bali pas cher : escale, saison sèche et bon prix | TrouveMonVol",
    metaDescription:
      "Vols Paris-Bali au prix total, taxes incluses, vendeur affiché. Aucun direct : comparez les escales, meilleure saison pour partir, alerte prix gratuite.",
    intro:
      "Aucune compagnie n'opère de vol direct entre Paris et Bali : le trajet passe systématiquement par une escale, le plus souvent à Doha, Singapour ou Dubaï, pour un total de 17 à 20 heures de voyage.",
    bestMonths: "Mai à septembre, hors juillet-août",
    averageDuration: "17 à 20 h avec une escale (aucun vol direct)",
    sections: [
      {
        heading: "Quand partir à Bali au meilleur prix",
        paragraphs: [
          "La saison sèche, de mai à septembre, concentre la demande européenne : ciel dégagé, mer calme côté Uluwatu et Nusa Dua, mais tarifs aériens et hôteliers au plus haut, surtout en juillet-août pendant les vacances scolaires occidentales.",
          "La saison des pluies, de novembre à mars, fait baisser sensiblement les prix : les averses sont généralement courtes et concentrées en fin de journée, sans empêcher les visites. Décembre et la première quinzaine de janvier restent chers malgré la pluie, portés par la demande des fêtes de fin d'année.",
          "Avril et octobre, mois de transition entre les deux saisons, offrent souvent le meilleur rapport prix-climat : la mousson s'est calmée ou n'a pas encore commencé, et la demande touristique est plus faible qu'en plein été.",
        ],
      },
      {
        heading: "Escale à Doha, Singapour ou Dubaï",
        paragraphs: [
          "Qatar Airways (via Doha), Singapore Airlines (via Singapour) et Emirates (via Dubaï) proposent les correspondances les plus directes, avec un temps d'escale généralement inférieur à trois heures. D'autres compagnies imposent deux escales ou des correspondances de nuit plus longues, souvent moins chères mais avec sept à dix heures de trajet supplémentaires.",
          "Sur un trajet aussi long, la qualité de l'escale compte autant que le prix du billet : une correspondance de moins de deux heures dans un aéroport aussi vaste que Dubaï ou Singapour laisse peu de marge en cas de retard du premier vol.",
        ],
      },
      {
        heading: "Budget et durée du voyage",
        paragraphs: [
          "Un aller-retour se trouve fréquemment entre 650 et 900 euros hors haute saison, et dépasse souvent 1 100 euros en juillet-août et à Noël. Réserver quatre à six mois à l'avance reste la meilleure stratégie sur cette destination longue et demandée.",
          "Avec le décalage horaire de 5 à 6 heures et un vol total proche de 24 heures porte-à-porte une fois les correspondances comptées, mieux vaut prévoir une nuit de récupération à l'arrivée avant d'enchaîner les visites.",
        ],
      },
    ],
    faq: [
      {
        question: "Existe-t-il un vol direct Paris — Bali ?",
        answer:
          "Non, aucune compagnie n'opère de liaison directe : tous les vols passent par une escale, le plus souvent à Doha, Singapour ou Dubaï.",
      },
      {
        question: "Quel est le meilleur mois pour aller à Bali pas cher ?",
        answer:
          "Avril et octobre offrent le meilleur compromis entre climat sec et tarifs raisonnables. Juillet, août et les fêtes de fin d'année sont les périodes les plus chères.",
      },
      {
        question: "Combien de temps dure le trajet jusqu'à Bali ?",
        answer:
          "Comptez 17 à 20 heures de vol avec une escale, et une journée complète de voyage porte-à-porte une fois les correspondances incluses.",
      },
      {
        question: "Faut-il un visa pour l'Indonésie ?",
        answer:
          "Les Français obtiennent un visa à l'arrivée (VOA) payant, valable 30 jours et prolongeable une fois. Un passeport valide au moins 6 mois est requis.",
      },
    ],
  },
  {
    slug: "paris-casablanca",
    origin: "PAR",
    originCity: "Paris",
    destination: "CMN",
    destinationCity: "Casablanca",
    country: "Maroc",
    heading: "Vols pas chers Paris — Casablanca",
    metaTitle: "Vol pas cher Paris Casablanca : prix, compagnies, quand partir | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Casablanca au prix total taxes incluses, vendeur affiché. Compagnies, accès depuis l'aéroport, meilleure période et alerte prix.",
    intro:
      "Casablanca se rejoint en un peu plus de trois heures de vol direct depuis Paris, sur l'une des liaisons les plus fréquentées entre la France et le Maroc — portée par une forte demande professionnelle en semaine et familiale le week-end.",
    bestMonths: "Mars-mai et septembre-novembre",
    averageDuration: "3 h 20 en vol direct",
    sections: [
      {
        heading: "Compagnies et accès depuis l'aéroport",
        paragraphs: [
          "Royal Air Maroc, Air France et Transavia opèrent la ligne en direct depuis Charles-de-Gaulle et Orly. La forte concurrence entre régulières et low-cost maintient des tarifs bas hors périodes de forte demande.",
          "L'aéroport Mohammed-V dispose d'une gare ferroviaire directe (ligne ONCF) qui rejoint Casa-Voyageurs, la gare centrale, en une trentaine de minutes — un atout rare parmi les grandes destinations du Maghreb, où le taxi reste ailleurs la norme.",
          "Casablanca se parcourt en taxi (petits taxis rouges, à négocier ou au compteur) ou en tramway pour les grands axes ; la ville est plus étendue que Marrakech ou Tunis, avec des distances à anticiper entre quartiers.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Mars-mai et septembre-novembre offrent des températures modérées (18-26 °C), la position côtière de Casablanca limitant les excès de chaleur observés à Marrakech en été. Juillet-août restent chauds et humides sans être extrêmes.",
          "Comme sur les autres liaisons vers le Maghreb, les vacances scolaires françaises et les grandes fêtes religieuses concentrent la demande de la diaspora marocaine : les prix montent alors plus tôt et plus fort qu'en période normale.",
          "Casablanca reste abordable au quotidien : un repas dans une gargote locale revient à 5-8 €, une chambre correcte en hôtel d'affaires à 45-75 € la nuit.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Casablanca ?",
        answer: "Environ 3 h 20 en vol direct.",
      },
      {
        question: "Comment rejoindre le centre depuis l'aéroport de Casablanca ?",
        answer:
          "Le train ONCF relie directement l'aéroport Mohammed-V à la gare de Casa-Voyageurs en une trentaine de minutes.",
      },
      {
        question: "Faut-il un visa pour aller au Maroc ?",
        answer:
          "Non pour un séjour touristique de moins de 90 jours, passeport valide requis (carte d'identité insuffisante).",
      },
    ],
  },
  {
    slug: "paris-miami",
    origin: "PAR",
    originCity: "Paris",
    destination: "MIA",
    destinationCity: "Miami",
    country: "États-Unis",
    heading: "Vols pas chers Paris — Miami",
    metaTitle: "Vol pas cher Paris Miami : prix, compagnies, quand partir | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Miami au prix total taxes incluses, vendeur affiché. Compagnies, ESTA, meilleure période et alerte prix gratuite.",
    intro:
      "Un vol direct Paris — Miami dure environ neuf heures et demie. La Floride du Sud se visite surtout en hiver et au printemps, la saison chaude s'accompagnant d'une humidité marquée et d'un risque d'ouragans à surveiller entre juin et novembre.",
    bestMonths: "Décembre-avril",
    averageDuration: "9 h 30 en vol direct",
    sections: [
      {
        heading: "Compagnies et organisation sur place",
        paragraphs: [
          "Air France, French Bee et Delta desservent la ligne depuis Charles-de-Gaulle. French Bee, compagnie à bas coût long-courrier, propose des tarifs d'appel nettement inférieurs, options payantes (bagage, repas) à comparer au prix total.",
          "L'aéroport de Miami est relié au centre par le Metrorail (ligne Orange) via le Miami Intermodal Center, mais une voiture de location reste la solution la plus pratique pour rayonner entre South Beach, Wynwood et les Keys.",
          "Miami se répartit en quartiers assez éloignés les uns des autres : South Beach (Art déco et plage), Wynwood (street art et galeries), Little Havana (culture cubaine) et Brickell (quartier d'affaires), chacun avec une ambiance distincte.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Décembre à avril offre le climat le plus agréable (22-28 °C, faible humidité), et concentre logiquement la plus forte affluence et les tarifs les plus élevés, notamment autour du Nouvel An.",
          "De juin à novembre, la chaleur devient lourde et humide, avec un risque réel d'ouragans en fin d'été : les tarifs de vol baissent sensiblement, en compensation de ce risque météo à surveiller avant de réserver un hébergement non remboursable.",
          "Miami reste une ville chère pour les États-Unis : hébergement à partir de 90-150 € la nuit à South Beach, repas de rue ou food truck à 10-15 €, taxes et pourboire (environ 25-30 % au total) non inclus dans les prix affichés.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Miami ?",
        answer: "Environ 9 h 30 en vol direct.",
      },
      {
        question: "Faut-il un visa pour aller à Miami ?",
        answer:
          "Non pour un séjour touristique de moins de 90 jours, mais une autorisation ESTA est obligatoire, à demander en ligne avant le départ.",
      },
      {
        question: "Quand éviter Miami à cause des ouragans ?",
        answer:
          "La saison des ouragans s'étend officiellement de juin à novembre, avec un pic en août-septembre. Ce n'est pas rédhibitoire, mais à surveiller avant de réserver un hébergement non remboursable.",
      },
    ],
  },
];

/** Fiches éditoriales : trajets curés + capitales européennes. */
export const DESTINATIONS: DestinationRoute[] = [
  ...CORE_DESTINATIONS,
  ...EUROPE_DESTINATIONS,
];

export function getDestination(slug: string): DestinationRoute | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
