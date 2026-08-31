/**
 * Fiches éditoriales « vols pas chers » pour les grandes capitales européennes.
 *
 * Elles complètent DESTINATIONS et alimentent les pages /vols/<slug>. Les prix
 * affichés sur ces pages proviennent uniquement des relevés Travelpayouts
 * enregistrés en base : aucun tarif n'est écrit en dur ici.
 */

import type { DestinationRoute } from "@/data/destinations";

export const EUROPE_DESTINATIONS: DestinationRoute[] = [
  {
    slug: "paris-londres",
    origin: "PAR",
    originCity: "Paris",
    destination: "LON",
    destinationCity: "Londres",
    country: "Royaume-Uni",
    heading: "Vols pas chers Paris — Londres",
    metaTitle: "Vol pas cher Paris Londres : prix, aéroports, meilleure période | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Londres au prix total taxes incluses, vendeur affiché. Aéroports londoniens, compagnies, meilleure période et alerte prix gratuite.",
    intro:
      "Une heure et quart de vol sépare Paris de Londres, sur l'une des liaisons les plus fréquentées d'Europe. L'offre est dense toute la journée, ce qui fait que le prix dépend surtout de l'heure de départ, de l'aéroport d'arrivée et du bagage choisi, bien plus que de la compagnie.",
    bestMonths: "Janvier-mars et octobre-novembre",
    averageDuration: "1 h 15 en vol direct",
    sections: [
      {
        heading: "Quel aéroport londonien choisir",
        paragraphs: [
          "Londres compte six aéroports. Heathrow est le mieux relié au centre (Piccadilly line en cinquante minutes, Elizabeth line en trente), Gatwick demande environ trente minutes de train express, Luton et Stansted entre cinquante minutes et une heure quinze avec un billet de train supplémentaire de 15 à 25 £.",
          "Un billet dix euros moins cher vers Stansted peut donc coûter plus cher au total, une fois le transfert payé, et vous faire perdre plus d'une heure à l'aller comme au retour. Comparez toujours le prix du vol additionné au prix du transfert, surtout pour un séjour de deux nuits.",
          "Côté Paris, Orly et Charles-de-Gaulle concentrent les vols réguliers, Beauvais accueille surtout les vols à bas coût : prévoyez alors la navette et son heure quinze de trajet depuis la porte Maillot.",
        ],
      },
      {
        heading: "Quand réserver un Paris — Londres au meilleur prix",
        paragraphs: [
          "Les tarifs les plus bas se trouvent hors vacances scolaires, de janvier à mars et en novembre, avec des départs en milieu de semaine. Les vendredis soir et les dimanches soir, très demandés par les voyageurs d'affaires et les week-ends, sont systématiquement les créneaux les plus chers.",
          "Trois à six semaines d'anticipation suffisent en général sur cette liaison : l'offre est telle que les prix se dégradent surtout dans les dix derniers jours. En revanche, les week-ends de matchs, de concerts à l'O2 ou de jours fériés britanniques font grimper les tarifs plusieurs mois à l'avance.",
          "Pensez aussi à comparer avec le train : sur un aller-retour réservé tôt, l'Eurostar arrive parfois au même prix, centre à centre. Notre comparateur reste utile pour vérifier, en une recherche, si l'avion garde l'avantage sur vos dates.",
        ],
      },
    ],
    faq: [
      {
        question: "Faut-il un passeport pour aller à Londres ?",
        answer:
          "Oui. Depuis le Brexit, la carte d'identité ne suffit plus pour les Français : un passeport valide est obligatoire, et une autorisation de voyage électronique (ETA) est demandée avant le départ.",
      },
      {
        question: "Quel est l'aéroport le plus pratique à Londres ?",
        answer:
          "Heathrow pour rejoindre le centre rapidement en métro ou Elizabeth line, Gatwick pour un bon compromis prix/transfert. Stansted et Luton sont souvent moins chers mais éloignés d'une heure environ.",
      },
      {
        question: "Combien coûte un aller-retour Paris — Londres ?",
        answer:
          "Entre 60 et 110 euros hors saison avec des dates souples, et 150 à 250 euros sur un week-end ou pendant les vacances scolaires.",
      },
    ],
  },
  {
    slug: "paris-amsterdam",
    origin: "PAR",
    originCity: "Paris",
    destination: "AMS",
    destinationCity: "Amsterdam",
    country: "Pays-Bas",
    heading: "Vols pas chers Paris — Amsterdam",
    metaTitle: "Vol pas cher Paris Amsterdam : prix, compagnies, quand partir | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Amsterdam au prix total taxes incluses, avec le vendeur affiché. Compagnies, durée, meilleure période et alerte prix gratuite.",
    intro:
      "Un peu plus d'une heure de vol relie Paris à Amsterdam-Schiphol, l'un des hubs les mieux connectés d'Europe. La liaison est desservie plusieurs fois par jour toute l'année, avec des écarts de prix marqués entre les départs du matin, très prisés, et ceux de la mi-journée.",
    bestMonths: "Janvier-mars et novembre",
    averageDuration: "1 h 20 en vol direct",
    sections: [
      {
        heading: "Compagnies, aéroport et transfert vers le centre",
        paragraphs: [
          "Air France, KLM, Transavia et easyJet se partagent la liaison depuis Charles-de-Gaulle et Orly. Schiphol est l'unique aéroport d'Amsterdam et l'un des plus simples d'Europe : un train direct rejoint la gare centrale en quinze à vingt minutes pour environ 5 euros, avec plusieurs départs par heure.",
          "Schiphol étant un hub majeur, beaucoup de billets bon marché sont en réalité des vols avec correspondance vers d'autres villes. Vérifiez bien que votre résultat est un direct : sur une telle distance, une escale double au minimum la durée du trajet.",
          "Les tarifs d'appel excluent presque toujours la valise en soute. Sur un aller-retour, l'option ajoute couramment 50 à 70 euros ; le prix affiché sur TrouveMonVol est le prix total taxes incluses, avec le vendeur réel nommé sous chaque résultat.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Amsterdam se visite très bien hors saison : de janvier à mars et en novembre, les billets sont au plus bas et les musées beaucoup moins fréquentés. La contrepartie est un temps frais et humide, avec des journées courtes en décembre et janvier.",
          "La période des tulipes, de fin mars à mi-mai, et le Koningsdag du 27 avril font flamber les prix des vols comme des hôtels. Réservez alors trois mois à l'avance, ou décalez d'une semaine pour retrouver des tarifs raisonnables.",
          "Hors vacances scolaires et avec des dates flexibles, l'aller-retour se trouve régulièrement entre 80 et 140 euros. En été ou sur un week-end prolongé, comptez plutôt 180 à 280 euros.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien de temps dure le vol Paris — Amsterdam ?",
        answer: "Environ 1 h 20 en vol direct, contre 3 h 20 en Thalys entre les deux centres-villes.",
      },
      {
        question: "Comment rejoindre le centre depuis Schiphol ?",
        answer:
          "Un train direct relie l'aéroport à Amsterdam Centraal en 15 à 20 minutes, pour environ 5 euros, avec plusieurs départs par heure jusque tard le soir.",
      },
      {
        question: "Quelle est la période la moins chère pour Amsterdam ?",
        answer:
          "Janvier, février et novembre, hors vacances scolaires. Évitez la saison des tulipes (avril) et le Koningsdag du 27 avril, où les prix doublent souvent.",
      },
    ],
  },
  {
    slug: "paris-milan",
    origin: "PAR",
    originCity: "Paris",
    destination: "MIL",
    destinationCity: "Milan",
    country: "Italie",
    heading: "Vols pas chers Paris — Milan",
    metaTitle: "Vol pas cher Paris Milan : prix, aéroports, meilleure période | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Milan au prix total taxes incluses, vendeur affiché. Malpensa, Linate ou Bergame, compagnies, quand partir et alerte prix gratuite.",
    intro:
      "Une heure trente de vol suffit pour rejoindre Milan depuis Paris. La ville est desservie par trois aéroports très différents en distance et en coût de transfert : c'est le premier arbitrage à faire avant de comparer les prix.",
    bestMonths: "Janvier-mars et novembre",
    averageDuration: "1 h 30 en vol direct",
    sections: [
      {
        heading: "Malpensa, Linate ou Bergame",
        paragraphs: [
          "Linate est le plus proche du centre : quinze minutes en métro M4 jusqu'au Duomo. Malpensa, à cinquante kilomètres, demande cinquante minutes de Malpensa Express pour 13 euros environ. Bergame-Orio al Serio, utilisé par les compagnies à bas coût, est à une heure de bus du centre de Milan pour 10 à 12 euros.",
          "Sur un aller-retour à deux, l'écart de transfert entre Linate et Bergame représente facilement 40 euros et deux heures de trajet. Un billet à bas prix vers Bergame reste intéressant, mais uniquement si l'écart dépasse cette somme.",
          "Milan est aussi une bonne porte d'entrée pour les lacs et pour Turin : dans ce cas, Malpensa ou Bergame peuvent devenir plus pratiques que Linate selon votre destination finale.",
        ],
      },
      {
        heading: "Meilleure période et budget",
        paragraphs: [
          "Les mois les moins chers sont janvier, février, mars et novembre. Le climat y est gris et frais, mais Milan est une ville d'intérieur et de musées, ce qui rend ces périodes très supportables. Les prix montent nettement pendant la Fashion Week, le Salone del Mobile en avril et les ponts italiens.",
          "En été, les tarifs restent moyens mais la ville est chaude et une partie des commerces ferme en août. Beaucoup de voyageurs préfèrent le printemps ou le début de l'automne, plus doux, au prix d'un billet un peu plus cher.",
          "Comptez 70 à 130 euros l'aller-retour hors saison avec des dates souples, et 160 à 260 euros sur un week-end ou pendant les grands salons.",
        ],
      },
    ],
    faq: [
      {
        question: "Quel aéroport choisir pour Milan ?",
        answer:
          "Linate pour la proximité (15 minutes du Duomo en métro), Malpensa pour l'offre de vols, Bergame pour les tarifs les plus bas mais une heure de bus jusqu'au centre.",
      },
      {
        question: "Quand les vols Paris — Milan sont-ils les moins chers ?",
        answer:
          "De janvier à mars et en novembre, en partant en milieu de semaine. Évitez la Fashion Week et le Salone del Mobile en avril.",
      },
      {
        question: "Le train est-il une alternative crédible ?",
        answer:
          "Le trajet ferroviaire direct dure environ sept heures. Il reste intéressant pour éviter l'avion, mais l'avion garde l'avantage sur le temps de porte à porte.",
      },
    ],
  },
  {
    slug: "paris-berlin",
    origin: "PAR",
    originCity: "Paris",
    destination: "BER",
    destinationCity: "Berlin",
    country: "Allemagne",
    heading: "Vols pas chers Paris — Berlin",
    metaTitle: "Vol pas cher Paris Berlin : prix, compagnies, quand partir | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Berlin au prix total taxes incluses, avec le vendeur affiché. Compagnies, aéroport BER, meilleure période et alerte prix gratuite.",
    intro:
      "Un peu moins de deux heures de vol relient Paris à Berlin-Brandebourg. Depuis la fermeture de Tegel et de Schönefeld, tous les vols atterrissent au même endroit, ce qui simplifie la comparaison : seuls le prix, l'horaire et le bagage font la différence.",
    bestMonths: "Janvier-mars et novembre",
    averageDuration: "1 h 50 en vol direct",
    sections: [
      {
        heading: "Compagnies et accès depuis l'aéroport BER",
        paragraphs: [
          "Air France, easyJet, Ryanair, Transavia et Eurowings desservent la ligne depuis Charles-de-Gaulle, Orly ou Beauvais selon les saisons. Les fréquences sont nombreuses, mais l'offre se resserre en janvier et février, où quelques rotations disparaissent.",
          "L'aéroport BER est relié au centre par le train régional FEX ou les S-Bahn S9 et S45 : comptez trente minutes jusqu'à Hauptbahnhof et environ 4 euros avec un billet zones ABC, valable aussi pour la correspondance en métro.",
          "Berlin est une ville très étendue : choisissez votre quartier d'hébergement en fonction des lignes de U-Bahn plutôt que de la distance à vol d'oiseau, sous peine de passer beaucoup de temps dans les transports.",
        ],
      },
      {
        heading: "Quand partir et quel budget",
        paragraphs: [
          "Berlin est l'une des capitales européennes les moins chères à rejoindre hors saison. De janvier à mars et en novembre, les allers-retours descendent régulièrement sous 100 euros avec des dates flexibles, à condition d'accepter le froid et des journées courtes.",
          "Les prix montent pendant la Berlinale en février, autour des grands festivals d'été et pendant les marchés de Noël en décembre. Sur ces périodes, réservez deux à trois mois à l'avance.",
          "Sur place, le budget reste modéré pour une capitale : la ville se parcourt facilement avec un pass transport à la journée, et la restauration y est moins chère qu'à Paris ou Amsterdam.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Berlin ?",
        answer: "Environ 1 h 50 en vol direct depuis Paris.",
      },
      {
        question: "Comment aller de l'aéroport BER au centre de Berlin ?",
        answer:
          "Le train FEX ou les S-Bahn S9/S45 rejoignent le centre en une trentaine de minutes pour environ 4 euros avec un billet zones ABC.",
      },
      {
        question: "Quelle est la période la moins chère pour Berlin ?",
        answer:
          "Janvier, février, mars et novembre, hors vacances scolaires et hors Berlinale. Les départs en milieu de semaine sont les plus avantageux.",
      },
    ],
  },
  {
    slug: "paris-athenes",
    origin: "PAR",
    originCity: "Paris",
    destination: "ATH",
    destinationCity: "Athènes",
    country: "Grèce",
    heading: "Vols pas chers Paris — Athènes",
    metaTitle: "Vol pas cher Paris Athènes : prix, saison, compagnies | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Athènes au prix total taxes incluses, vendeur affiché. Compagnies, durée du vol, meilleure période et alerte prix gratuite.",
    intro:
      "Trois heures et demie de vol séparent Paris d'Athènes. La liaison est marquée par une très forte saisonnalité : le même billet peut tripler de prix entre février et le mois d'août, période où Athènes sert aussi de porte d'entrée vers les îles.",
    bestMonths: "Mars-avril et octobre-novembre",
    averageDuration: "3 h 30 en vol direct",
    sections: [
      {
        heading: "Saisonnalité et correspondances vers les îles",
        paragraphs: [
          "En juillet et août, la demande combine tourisme urbain et transit vers les Cyclades, et les tarifs atteignent leur maximum. Le printemps, de mars à début mai, et l'automne, d'octobre à novembre, offrent des températures agréables pour visiter l'Acropole et des billets souvent moitié moins chers.",
          "Si vous enchaînez avec une île, prévoyez une marge confortable entre l'atterrissage et le ferry du Pirée : comptez une heure de transport depuis l'aéroport, plus l'enregistrement. Un vol du matin sécurise nettement mieux la correspondance qu'un vol du soir.",
          "L'hiver reste la période la moins chère, avec des journées douces mais pluvieuses et une offre de vols réduite : moins de rotations directes, donc moins de choix d'horaires.",
        ],
      },
      {
        heading: "Compagnies, aéroport et budget",
        paragraphs: [
          "Aegean, Air France, Transavia et Ryanair opèrent la ligne selon les saisons, depuis Charles-de-Gaulle, Orly ou Beauvais. Les vols avec escale via Rome, Munich ou Vienne sont parfois moins chers mais ajoutent trois à six heures de trajet.",
          "L'aéroport Elefthérios-Venizélos est relié au centre par le métro ligne 3 en quarante minutes environ, pour 9 euros, ou par le bus X95 pour 5,50 euros. Les taxis appliquent un forfait fixe vers le centre, affiché à la sortie des arrivées.",
          "Hors saison et avec des dates souples, l'aller-retour se trouve régulièrement entre 110 et 190 euros ; en plein été, comptez 280 à 450 euros, davantage encore en réservant tardivement.",
        ],
      },
    ],
    faq: [
      {
        question: "Quand partir à Athènes au meilleur prix ?",
        answer:
          "De mars à début mai et d'octobre à novembre : le climat est agréable et les billets coûtent souvent moitié moins cher qu'en juillet-août.",
      },
      {
        question: "Combien de temps dure le vol Paris — Athènes ?",
        answer: "Environ 3 h 30 en vol direct.",
      },
      {
        question: "Comment rejoindre le centre depuis l'aéroport d'Athènes ?",
        answer:
          "La ligne 3 du métro rejoint Syntagma en une quarantaine de minutes pour 9 euros ; le bus X95 fait le même trajet pour 5,50 euros, 24 h/24.",
      },
    ],
  },
  {
    slug: "paris-vienne",
    origin: "PAR",
    originCity: "Paris",
    destination: "VIE",
    destinationCity: "Vienne",
    country: "Autriche",
    heading: "Vols pas chers Paris — Vienne",
    metaTitle: "Vol pas cher Paris Vienne : prix, compagnies, quand partir | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Vienne au prix total taxes incluses, avec le vendeur affiché. Compagnies, durée, meilleure période et alerte prix gratuite.",
    intro:
      "Deux heures de vol relient Paris à Vienne-Schwechat. La capitale autrichienne se visite toute l'année, mais l'écart de prix entre un départ de février et un week-end de l'Avent en décembre est l'un des plus marqués d'Europe centrale.",
    bestMonths: "Janvier-mars et novembre",
    averageDuration: "2 h en vol direct",
    sections: [
      {
        heading: "Compagnies et accès au centre",
        paragraphs: [
          "Austrian Airlines, Air France, Transavia et Ryanair desservent Vienne depuis Paris selon les saisons. Les vols directs sont quotidiens, avec une offre plus étoffée au printemps et en décembre.",
          "L'aéroport de Schwechat est à seize kilomètres du centre. Le train S7 rejoint Wien Mitte en vingt-cinq minutes pour environ 4,50 euros, une option nettement plus économique que le City Airport Train, deux fois plus cher pour dix minutes gagnées.",
          "Vienne se parcourt très bien à pied dans l'hypercentre, complété par un réseau de tramways et de métros efficace : un pass 48 ou 72 heures est vite rentabilisé.",
        ],
      },
      {
        heading: "Quand réserver et quel budget",
        paragraphs: [
          "Les mois de janvier, février, mars et novembre concentrent les meilleurs prix. Décembre, avec les marchés de Noël, et le printemps, très demandé, coûtent nettement plus cher : sur ces périodes, six à dix semaines d'anticipation font une vraie différence.",
          "Les concerts, opéras et bals de la saison viennoise attirent aussi une clientèle internationale de janvier à mars : les prix des hôtels grimpent sur ces week-ends, même quand les vols restent abordables.",
          "Hors saison et avec des dates flexibles, l'aller-retour se situe souvent entre 90 et 160 euros ; comptez 200 à 300 euros en décembre ou sur un week-end prolongé.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Vienne ?",
        answer: "Environ 2 heures en vol direct.",
      },
      {
        question: "Comment rejoindre le centre depuis l'aéroport de Vienne ?",
        answer:
          "Le train S7 rejoint Wien Mitte en 25 minutes pour environ 4,50 euros. Le City Airport Train est plus rapide de dix minutes mais deux fois plus cher.",
      },
      {
        question: "Quelle est la meilleure période pour un vol pas cher vers Vienne ?",
        answer:
          "Janvier à mars et novembre, hors vacances scolaires. Décembre, avec les marchés de Noël, est la période la plus chère de l'année.",
      },
    ],
  },
  {
    slug: "paris-prague",
    origin: "PAR",
    originCity: "Paris",
    destination: "PRG",
    destinationCity: "Prague",
    country: "Tchéquie",
    heading: "Vols pas chers Paris — Prague",
    metaTitle: "Vol pas cher Paris Prague : prix, compagnies, meilleure période | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Prague au prix total taxes incluses, vendeur affiché. Compagnies, durée du vol, quand partir et alerte prix gratuite.",
    intro:
      "Une heure quarante de vol suffit pour rejoindre Prague depuis Paris. C'est l'une des capitales européennes les plus accessibles en dehors de l'été, avec des allers-retours qui descendent régulièrement sous la barre des 100 euros hors vacances scolaires.",
    bestMonths: "Janvier-mars et novembre",
    averageDuration: "1 h 40 en vol direct",
    sections: [
      {
        heading: "Compagnies, aéroport et transfert",
        paragraphs: [
          "Transavia, easyJet, Ryanair, Air France et Smartwings assurent la liaison depuis Charles-de-Gaulle, Orly ou Beauvais. Les vols du milieu de journée sont presque toujours moins chers que ceux du début de matinée.",
          "L'aéroport Václav-Havel n'a pas de liaison ferroviaire : le bus 119 rejoint le métro Nádraží Veleslavín en vingt minutes, puis la ligne A mène au centre, l'ensemble pour environ 1,60 euro avec un billet de 90 minutes. L'Airport Express dessert directement la gare centrale.",
          "Attention aux taxis non officiels à la sortie des arrivées : privilégiez les compagnies agréées de l'aéroport ou une application, avec un trajet centre-ville autour de 25 à 30 euros.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "De janvier à mars, Prague est glaciale mais très peu chère, en vol comme en hébergement. Novembre offre un bon compromis avant la flambée des marchés de Noël, qui font grimper les prix dès la fin novembre et jusqu'au 1er janvier.",
          "Le printemps et le début de l'automne sont les périodes les plus agréables : les tarifs restent raisonnables si vous réservez six à huit semaines à l'avance et évitez les ponts français.",
          "Le budget sur place reste inférieur à celui d'Europe de l'Ouest : la ville se visite essentiellement à pied, et un pass transport à la journée coûte quelques euros.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien de temps dure le vol Paris — Prague ?",
        answer: "Environ 1 h 40 en vol direct.",
      },
      {
        question: "Quelle monnaie utilise-t-on à Prague ?",
        answer:
          "La couronne tchèque. Évitez les bureaux de change de rue à taux défavorable et privilégiez les retraits en distributeur bancaire ou le paiement par carte.",
      },
      {
        question: "Quand les vols vers Prague sont-ils les moins chers ?",
        answer:
          "De janvier à mars et en novembre, hors vacances scolaires. Décembre, avec les marchés de Noël, est la période la plus chère.",
      },
    ],
  },
  {
    slug: "paris-seville",
    origin: "PAR",
    originCity: "Paris",
    destination: "SVQ",
    destinationCity: "Séville",
    country: "Espagne",
    heading: "Vols pas chers Paris — Séville",
    metaTitle: "Vol pas cher Paris Séville : prix, compagnies, quand partir | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Séville au prix total taxes incluses, vendeur affiché. Compagnies, durée, meilleure période et alerte prix gratuite.",
    intro:
      "Deux heures trente de vol relient Paris à Séville. La capitale andalouse a une saisonnalité inversée par rapport au reste de l'Europe : c'est au printemps et à l'automne qu'elle est la plus agréable, et en plein été qu'elle devient difficile, avec des pointes au-delà de 40 °C.",
    bestMonths: "Mars-mai et octobre-novembre",
    averageDuration: "2 h 30 en vol direct",
    sections: [
      {
        heading: "Saisonnalité : éviter l'été, viser le printemps",
        paragraphs: [
          "Mars à mai et octobre à novembre offrent le meilleur équilibre entre climat et prix, avec 22 à 28 °C en journée. Deux exceptions notables : la Semaine sainte et la Feria d'avril, où vols et hôtels doublent voire triplent, plusieurs mois à l'avance.",
          "En juillet et août, les billets sont paradoxalement moins chers que sur la Costa del Sol, parce que la chaleur décourage les visiteurs. Le séjour reste possible avec des visites matinales et une sieste climatisée, mais ce n'est pas la saison recommandée pour découvrir la ville à pied.",
          "L'hiver est doux, autour de 16 à 18 °C en journée, et les tarifs aériens sont au plancher hors fêtes de fin d'année.",
        ],
      },
      {
        heading: "Compagnies, aéroport et budget",
        paragraphs: [
          "Transavia, Vueling, Ryanair et Iberia opèrent la liaison depuis Orly, Charles-de-Gaulle ou Beauvais, avec une offre plus dense au printemps. Certaines périodes creuses de l'hiver ne conservent que quelques vols directs par semaine : vérifiez la fréquence avant de bloquer vos dates.",
          "L'aéroport de Séville-San Pablo est à dix kilomètres du centre : le bus EA relie la gare de Santa Justa et le centre en trente à trente-cinq minutes pour 4 euros, le taxi applique un tarif forfaitaire d'environ 25 euros.",
          "Hors événements, l'aller-retour se trouve souvent entre 90 et 170 euros ; comptez 250 à 400 euros pendant la Semaine sainte et la Feria.",
        ],
      },
    ],
    faq: [
      {
        question: "Quelle est la meilleure période pour visiter Séville ?",
        answer:
          "Mars à mai et octobre-novembre, pour des températures de 22 à 28 °C. Évitez juillet et août, où la ville dépasse fréquemment 40 °C.",
      },
      {
        question: "Combien dure le vol Paris — Séville ?",
        answer: "Environ 2 h 30 en vol direct.",
      },
      {
        question: "Faut-il éviter la Feria d'avril pour payer moins cher ?",
        answer:
          "Oui si le budget prime : pendant la Semaine sainte et la Feria, les vols et les hôtels doublent au minimum et se remplissent plusieurs mois à l'avance.",
      },
    ],
  },
  {
    slug: "paris-copenhague",
    origin: "PAR",
    originCity: "Paris",
    destination: "CPH",
    destinationCity: "Copenhague",
    country: "Danemark",
    heading: "Vols pas chers Paris — Copenhague",
    metaTitle: "Vol pas cher Paris Copenhague : prix, compagnies, quand partir | TrouveMonVol",
    metaDescription:
      "Comparez les vols Paris — Copenhague au prix total taxes incluses, vendeur affiché. Compagnies, durée du vol, meilleure période et alerte prix gratuite.",
    intro:
      "Un peu moins de deux heures de vol séparent Paris de Copenhague-Kastrup. La liaison est régulière toute l'année, avec un pic de demande entre juin et août, quand les journées scandinaves s'allongent jusque tard le soir.",
    bestMonths: "Janvier-mars et novembre",
    averageDuration: "1 h 55 en vol direct",
    sections: [
      {
        heading: "Compagnies et accès depuis Kastrup",
        paragraphs: [
          "SAS, Air France, Transavia, easyJet et Norwegian desservent la ligne depuis Charles-de-Gaulle, Orly ou Beauvais. L'offre est plus dense en semaine, portée par la clientèle d'affaires : les vols du samedi sont souvent les moins chers.",
          "Kastrup est à huit kilomètres du centre. Le métro M2 rejoint Kongens Nytorv en quinze minutes environ, et le train dessert la gare centrale en treize minutes : c'est l'un des transferts aéroport les plus rapides d'Europe, pour environ 5 euros.",
          "Copenhague se visite très bien à vélo : la location coûte environ 15 à 20 euros la journée et remplace avantageusement les transports en commun sur des distances courtes.",
        ],
      },
      {
        heading: "Quand partir et quel budget prévoir",
        paragraphs: [
          "Les billets les moins chers se trouvent de janvier à mars et en novembre, avec des journées très courtes et un climat froid et venteux. Mai, juin et septembre offrent un bien meilleur compromis météo, à un tarif intermédiaire.",
          "Juillet et août concentrent la demande touristique et les prix les plus élevés, en vol comme en hébergement. Réservez deux à trois mois à l'avance pour ces mois, ou décalez vers la fin septembre.",
          "Le vol reste le poste le plus abordable du voyage : Copenhague est une ville chère sur place, avec un repas simple autour de 20 à 30 euros. Prévoyez ce budget dans votre arbitrage plutôt que de chercher à gagner dix euros sur le billet.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien dure le vol Paris — Copenhague ?",
        answer: "Environ 1 h 55 en vol direct.",
      },
      {
        question: "Comment rejoindre le centre depuis l'aéroport de Copenhague ?",
        answer:
          "Le métro M2 atteint Kongens Nytorv en une quinzaine de minutes et le train la gare centrale en treize minutes, pour environ 5 euros.",
      },
      {
        question: "Quand les vols vers Copenhague sont-ils les moins chers ?",
        answer:
          "De janvier à mars et en novembre. Juillet et août sont les mois les plus chers, en vol comme en hébergement.",
      },
    ],
  },
];
