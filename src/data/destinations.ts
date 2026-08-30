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
};

export const DESTINATIONS: DestinationRoute[] = [
  {
    slug: "paris-marrakech",
    origin: "PAR",
    originCity: "Paris",
    destination: "RAK",
    destinationCity: "Marrakech",
    country: "Maroc",
    heading: "Vols pas chers Paris — Marrakech",
    metaTitle: "Vol pas cher Paris Marrakech : prix, meilleure période | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Marrakech au prix total, taxes incluses, avec le vendeur affiché. Meilleure période, évolution des prix sur 12 mois et alertes gratuites.",
    intro:
      "Trois heures et demie de vol séparent Paris de Marrakech, avec des départs quotidiens depuis Orly, Roissy et Beauvais. C'est l'une des liaisons les plus concurrentielles au départ de la France, ce qui la rend très intéressante dès que l'on accepte de bouger ses dates.",
    bestMonths: "Mars-avril et octobre-novembre",
    averageDuration: "3 h 25 en vol direct",
    sections: [
      {
        heading: "Quand partir à Marrakech au meilleur prix",
        paragraphs: [
          "Marrakech connaît deux hautes saisons touristiques : le printemps, de mars à mai, et l'automne, de septembre à novembre. Ce sont aussi les périodes les plus agréables côté météo, avec des journées autour de 24 à 28 degrés et des soirées fraîches. Les tarifs y sont donc plus élevés que la moyenne annuelle, sans atteindre les sommets des vacances scolaires.",
          "Les prix les plus bas se trouvent généralement en juillet et août : la ville dépasse fréquemment 40 degrés et la demande touristique européenne s'effondre. Si la chaleur ne vous fait pas peur, c'est mathématiquement la meilleure fenêtre pour le budget. Le mois de janvier, hors vacances de Noël, offre également des tarifs bas avec un climat doux en journée.",
          "À l'inverse, les deux semaines des vacances de Noël, celles de février et le week-end de Pâques concentrent les billets les plus chers de l'année. Sur ces dates, la seule variable qui compte est l'anticipation.",
        ],
      },
      {
        heading: "Quel aéroport et quelles compagnies",
        paragraphs: [
          "La liaison est opérée principalement par Royal Air Maroc, Transavia, Ryanair et Air Arabia Maroc, avec des vols directs au départ d'Orly, de Roissy-Charles-de-Gaulle et de Beauvais. L'arrivée se fait à l'aéroport Marrakech-Ménara, situé à seulement cinq kilomètres de la médina, ce qui évite un long transfert.",
          "Sur les compagnies à bas coût, pensez à intégrer le bagage dans votre comparaison : un aller-retour avec valise en soute peut ajouter 60 à 90 euros au prix affiché. Sur un trajet aussi court, cet écart change complètement le classement des offres.",
        ],
      },
      {
        heading: "Combien coûte réellement un billet",
        paragraphs: [
          "En basse saison et avec des dates flexibles, un aller simple se trouve régulièrement sous les 60 euros, et un aller-retour autour de 110 à 150 euros. En haute saison, comptez plutôt 220 à 320 euros l'aller-retour, et davantage pendant les vacances scolaires.",
          "Le graphique ci-dessous montre l'évolution du prix le plus bas relevé mois par mois sur les douze derniers mois. Il sert de repère : si le prix que vous voyez aujourd'hui est nettement au-dessus de la courbe, il y a de fortes chances qu'attendre soit rentable.",
        ],
      },
    ],
    faq: [
      {
        question: "Quel est le meilleur mois pour aller à Marrakech pas cher ?",
        answer:
          "Juillet et août affichent les tarifs les plus bas, car la chaleur fait chuter la demande. Hors été, janvier et la première quinzaine de février (hors vacances scolaires) offrent le meilleur rapport prix / météo.",
      },
      {
        question: "Combien de temps dure le vol Paris — Marrakech ?",
        answer:
          "Environ 3 h 25 en vol direct. Avec une escale, comptez généralement entre 6 et 9 heures selon la correspondance.",
      },
      {
        question: "Combien de temps à l'avance réserver un vol Paris — Marrakech ?",
        answer:
          "Entre 5 et 10 semaines avant le départ pour une période normale. Pour les vacances scolaires et les fêtes de fin d'année, réservez 3 à 4 mois à l'avance.",
      },
      {
        question: "Y a-t-il des vols directs Paris — Marrakech ?",
        answer:
          "Oui, plusieurs vols directs quotidiens depuis Orly, Roissy et Beauvais, opérés notamment par Royal Air Maroc, Transavia et Ryanair.",
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
    metaTitle: "Vol pas cher Paris Bangkok : prix et meilleure période | TrouveMonVol",
    metaDescription:
      "Vols Paris — Bangkok comparés au prix total taxes incluses, vendeur affiché. Meilleure saison, courbe des prix sur 12 mois et alerte prix gratuite.",
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
    metaTitle: "Vol pas cher Paris New York : prix et bonne période | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — New York au prix total taxes incluses avec le vendeur affiché. Meilleure période, historique de prix sur 12 mois, alertes gratuites.",
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
    heading: "Vols pas chers Paris — Lisbonne",
    metaTitle: "Vol pas cher Paris Lisbonne : prix et meilleure saison | TrouveMonVol",
    metaDescription:
      "Vols Paris — Lisbonne comparés au prix total, vendeur affiché, sans frais cachés. Meilleure période, courbe de prix 12 mois et alerte prix gratuite.",
    intro:
      "Deux heures trente de vol, une dizaine de rotations quotidiennes et une forte concurrence entre compagnies classiques et à bas coût : Lisbonne est l'une des capitales européennes les plus accessibles depuis Paris.",
    bestMonths: "Février, mars et novembre",
    averageDuration: "2 h 35 en vol direct",
    sections: [
      {
        heading: "Quand partir à Lisbonne au meilleur prix",
        paragraphs: [
          "Lisbonne se visite toute l'année grâce à un climat doux. Les prix suivent donc surtout le calendrier scolaire français et les vacances portugaises plutôt que la météo.",
          "Les meilleurs tarifs se trouvent de janvier à mars, hors vacances de février, ainsi qu'en novembre. Sur ces périodes, un aller-retour sous les 90 euros n'a rien d'exceptionnel si vous partez en semaine.",
          "Juillet, août et les week-ends prolongés du printemps concentrent la demande. La différence de prix entre un départ un mercredi et un départ un vendredi soir peut dépasser 70 euros sur un simple aller-retour.",
        ],
      },
      {
        heading: "Compagnies et aéroports",
        paragraphs: [
          "TAP Air Portugal, Transavia, Ryanair, easyJet et Vueling se partagent la ligne au départ d'Orly, Roissy et Beauvais. L'aéroport Humberto-Delgado se trouve à sept kilomètres du centre, relié par métro en une vingtaine de minutes.",
          "Porto peut être une alternative pertinente : si votre itinéraire prévoit le nord du pays, comparez les deux villes d'arrivée plutôt que d'ajouter un vol intérieur.",
        ],
      },
      {
        heading: "Ce qui fait vraiment varier le prix",
        paragraphs: [
          "Sur un trajet aussi court, le bagage pèse proportionnellement très lourd. Un billet à 39 euros avec un simple sac à dos devient un billet à 95 euros avec une valise en soute aller-retour.",
          "Le second facteur est l'horaire. Les départs très tôt le matin ou tard le soir sont systématiquement moins chers, mais peuvent impliquer un taxi ou une nuit près de l'aéroport. Regardez le coût complet de la porte à porte.",
        ],
      },
    ],
    faq: [
      {
        question: "Quel est le meilleur mois pour aller à Lisbonne pas cher ?",
        answer:
          "Février et novembre offrent les tarifs les plus bas, avec un climat qui reste doux. Évitez les vacances scolaires françaises et les longs week-ends de printemps.",
      },
      {
        question: "Combien de temps dure le vol Paris — Lisbonne ?",
        answer: "Environ 2 h 35 en vol direct depuis Paris.",
      },
      {
        question: "Combien coûte un aller-retour Paris — Lisbonne ?",
        answer:
          "Entre 80 et 130 euros hors saison avec des dates flexibles, et 180 à 260 euros en juillet-août ou sur un week-end prolongé.",
      },
      {
        question: "Quel aéroport parisien choisir pour Lisbonne ?",
        answer:
          "Orly et Roissy proposent le plus de fréquences, Beauvais les prix d'appel les plus bas. Intégrez le coût et la durée du transfert avant de trancher.",
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
    metaTitle: "Vol pas cher Paris Barcelone : prix et bonne période | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Barcelone au prix total taxes incluses, vendeur affiché. Meilleure période, historique de prix et alerte prix gratuite.",
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
    metaTitle: "Vol pas cher Paris Istanbul : prix et meilleure saison | TrouveMonVol",
    metaDescription:
      "Vols Paris — Istanbul au prix total taxes incluses, vendeur clairement affiché. Meilleure période, courbe de prix sur 12 mois, alerte prix gratuite.",
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
    metaTitle: "Vol pas cher Paris Dubaï : prix et meilleure période | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Dubaï au prix total, taxes incluses, avec le vendeur affiché. Meilleure saison, évolution des prix et alerte prix gratuite.",
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
    metaTitle: "Vol pas cher Paris Tokyo : prix et meilleure saison | TrouveMonVol",
    metaDescription:
      "Vols Paris — Tokyo comparés au prix total taxes incluses, vendeur affiché. Meilleure période, courbe des prix sur 12 mois et alertes gratuites.",
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
    metaTitle: "Vol pas cher Paris Alger : prix et meilleure période | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Alger au prix total taxes incluses, avec le vendeur affiché. Meilleures périodes, historique de prix et alerte prix gratuite.",
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
    metaTitle: "Vol pas cher Paris Rome : prix et meilleure période | TrouveMonVol",
    metaDescription:
      "Vols Paris — Rome au prix total taxes incluses, vendeur affiché, sans frais cachés. Meilleure saison, courbe de prix 12 mois et alerte prix gratuite.",
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
    metaTitle: "Vol pas cher Lyon Tunis : prix, compagnies, meilleure période | TrouveMonVol",
    metaDescription:
      "Comparez les vols Lyon — Tunis au prix total taxes incluses, avec le vendeur affiché. Compagnies, durée du vol, meilleure période et alerte prix gratuite.",
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
];

export function getDestination(slug: string): DestinationRoute | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
