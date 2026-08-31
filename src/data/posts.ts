export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  readingMinutes: number;
  updated: string;
  /** Paragraphes et sous-titres du corps de l'article. */
  body: { heading?: string; paragraphs: string[] }[];
  /** Contenu lié à une période précise (à distinguer des articles évergreens). */
  seasonal?: boolean;
  /**
   * Slugs de destinations (src/data/destinations.ts) réellement pertinentes
   * pour cet article, affichées en fin de page. Sans cette liste, on retombe
   * sur les 4 premières destinations du catalogue — moins pertinent.
   */
  relatedSlugs?: string[];
};

export const POSTS: Post[] = [
  {
    slug: "comment-trouver-un-vol-pas-cher",
    title: "Comment trouver un vol pas cher : la méthode complète",
    metaTitle: "Comment trouver un vol pas cher — méthode simple | TrouveMonVol",
    description:
      "La méthode concrète pour payer son billet d'avion moins cher : flexibilité des dates, aéroports alternatifs, alertes prix et pièges à éviter.",
    readingMinutes: 6,
    updated: "2026-08-01",
    body: [
      {
        paragraphs: [
          "Trouver un vol pas cher n'a rien à voir avec la chance. Les prix des billets d'avion suivent des règles assez simples : plus la demande est forte sur une date, plus le prix monte. Votre marge de manœuvre se situe donc presque toujours sur le calendrier, rarement sur la destination elle-même.",
          "Voici la méthode que nous utilisons nous-mêmes, dans l'ordre, sans astuce magique ni fausse promesse.",
        ],
      },
      {
        heading: "1. Commencez par la date, pas par le prix",
        paragraphs: [
          "Avant même de comparer, regardez un mois entier. Sur un même trajet, l'écart entre le jour le moins cher et le jour le plus cher dépasse souvent 40 %. Un départ un mardi ou un mercredi est presque toujours moins cher qu'un départ un vendredi soir ou un dimanche.",
          "Notre vue calendrier affiche le prix le plus bas pour chaque jour du mois. Si vous pouvez décaler votre départ de 48 heures, vous avez déjà fait le plus gros du travail.",
        ],
      },
      {
        heading: "2. Élargissez la zone de départ et d'arrivée",
        paragraphs: [
          "Beaucoup de voyageurs cherchent uniquement depuis leur aéroport habituel. Pourtant, sur les vols européens, un aéroport secondaire situé à une heure de route peut faire baisser le billet de 30 à 80 euros. Le calcul vaut la peine si le trajet au sol reste raisonnable — et il ne la vaut plus si vous devez payer une nuit d'hôtel supplémentaire.",
          "Même logique à l'arrivée : pour l'Asie du Sud-Est ou l'Amérique du Sud, arriver dans la grande capitale régionale puis reprendre un vol intérieur coûte parfois moins cher qu'un billet direct.",
        ],
      },
      {
        heading: "3. Comparez le prix réel, pas le prix d'appel",
        paragraphs: [
          "Un billet à 19 euros qui devient 74 euros après ajout du bagage cabine n'est pas un billet à 19 euros. Le seul chiffre qui compte est le montant que vous paierez à la fin, taxes et bagages inclus.",
          "C'est exactement pour cette raison que nous affichons le prix total dès la liste des résultats, et que nous précisons qui vend le billet. Un comparateur qui vous cache le vendeur vous cache aussi, souvent, les conditions de modification et d'annulation.",
        ],
      },
      {
        heading: "4. Laissez le prix venir à vous",
        paragraphs: [
          "Vérifier un prix tous les jours à la main est le meilleur moyen d'acheter dans la précipitation. Créez plutôt une alerte sur votre trajet : vous recevez un email seulement si le prix baisse, et vous décidez à ce moment-là.",
          "Sur un trajet moyen-courrier, une baisse de 15 à 25 % apparaît régulièrement dans les six à dix semaines avant le départ. Sur du long-courrier, la fenêtre est plus large et commence plus tôt.",
        ],
      },
      {
        heading: "5. Ignorez les fausses urgences",
        paragraphs: [
          "« Plus que 2 places à ce prix », comptes à rebours, bandeaux rouges : ces éléments existent pour raccourcir votre réflexion, pas pour vous informer. Un vrai stock limité ne s'affiche pas en clignotant.",
          "Notre position est simple : nous n'affichons aucun compteur artificiel. Si un prix bouge, c'est parce qu'il a réellement bougé chez le vendeur.",
        ],
      },
      {
        paragraphs: [
          "En résumé : soyez flexible sur les dates, ouvrez la carte plutôt que de fixer une seule destination, comparez des prix complets, et faites travailler les alertes à votre place. C'est moins spectaculaire qu'une astuce secrète, mais c'est ce qui fonctionne.",
        ],
      },
    ],
  },
  {
    slug: "meilleur-moment-pour-reserver-un-billet-avion",
    title: "Quel est le meilleur moment pour réserver un billet d'avion ?",
    metaTitle: "Meilleur moment pour réserver un billet d'avion | TrouveMonVol",
    description:
      "Combien de semaines avant le départ faut-il acheter son billet d'avion ? Les fenêtres à connaître selon la destination et la saison.",
    readingMinutes: 5,
    updated: "2026-08-05",
    body: [
      {
        paragraphs: [
          "Il n'existe pas de jour magique pour acheter un billet d'avion. En revanche, il existe des fenêtres statistiquement favorables, qui dépendent surtout de la distance et de la saisonnalité de votre trajet.",
        ],
      },
      {
        heading: "Vols courts en Europe : 4 à 10 semaines avant",
        paragraphs: [
          "Sur un vol de deux à trois heures, les prix commencent souvent bas, restent stables, puis grimpent nettement dans les trois dernières semaines. La zone confortable se situe entre un et deux mois et demi avant le départ.",
          "Attention aux exceptions : vacances scolaires, ponts de mai, longs week-ends. Sur ces dates, la hausse commence beaucoup plus tôt et ne redescend presque jamais.",
        ],
      },
      {
        heading: "Long-courrier : 2 à 5 mois avant",
        paragraphs: [
          "Pour l'Asie, l'Amérique ou l'océan Indien, la fenêtre s'ouvre plus tôt. Les compagnies ouvrent leurs vols environ onze mois à l'avance, avec des tarifs d'ouverture souvent moyens, puis un creux fréquent entre cinq et deux mois avant le départ.",
          "Au-delà de cinq mois, vous payez surtout de la tranquillité. En dessous de six semaines, vous payez la rareté.",
        ],
      },
      {
        heading: "Et la dernière minute ?",
        paragraphs: [
          "La bonne affaire de dernière minute existe encore, mais elle concerne surtout les destinations peu demandées et les périodes creuses. Sur un trajet populaire en pleine saison, attendre est un pari perdant dans la grande majorité des cas.",
        ],
      },
      {
        heading: "La seule stratégie robuste",
        paragraphs: [
          "Plutôt que de deviner, fixez une référence. Regardez le prix aujourd'hui, notez-le, puis créez une alerte. Si le prix descend sous votre référence, achetez. S'il monte deux fois de suite, c'est généralement le signe que la fenêtre basse est passée.",
          "Cette approche a un avantage décisif : elle remplace l'anxiété par une décision claire.",
        ],
      },
    ],
  },
  {
    slug: "reserver-a-l-avance-ou-derniere-minute",
    title: "Faut-il réserver longtemps à l'avance ou à la dernière minute ?",
    metaTitle: "Réserver à l'avance ou à la dernière minute ? | TrouveMonVol",
    description:
      "Comparaison honnête entre réservation anticipée et dernière minute, avec les cas où chaque stratégie fonctionne vraiment.",
    readingMinutes: 5,
    updated: "2026-08-08",
    body: [
      {
        paragraphs: [
          "Les deux camps ont leurs convaincus. En réalité, la bonne réponse dépend de trois variables : votre flexibilité, la popularité du trajet et la saison.",
        ],
      },
      {
        heading: "Réserver tôt : pour les dates imposées",
        paragraphs: [
          "Si vos dates sont fixées par le travail, l'école ou un événement, réservez tôt. Vous n'avez aucun levier de flexibilité, donc aucun intérêt à attendre : le risque de hausse est bien supérieur au gain espéré.",
          "C'est particulièrement vrai pour les retours en fin de vacances scolaires, où la demande est concentrée sur deux ou trois jours.",
        ],
      },
      {
        heading: "Attendre : pour les voyageurs vraiment flexibles",
        paragraphs: [
          "Si vous pouvez partir n'importe quelle semaine et changer de destination, la dernière minute peut fonctionner. Les compagnies préfèrent brader un siège que le laisser vide, et les destinations en creux de saison se négocient bien.",
          "Le mode budget est fait pour ça : vous donnez un montant, vous regardez où il vous emmène, et vous laissez la carte décider.",
        ],
      },
      {
        heading: "La zone à éviter",
        paragraphs: [
          "La pire fenêtre est celle des deux à trois semaines avant un départ sur un trajet demandé. Les tarifs bas ont disparu, les tarifs de dernière minute ne sont pas encore là, et il ne reste souvent que les classes tarifaires les plus chères.",
        ],
      },
      {
        heading: "Une règle simple",
        paragraphs: [
          "Dates rigides ? Achetez tôt. Dates souples ? Surveillez et frappez sur une baisse. Dans les deux cas, une alerte prix vous évite de vérifier vingt fois par semaine.",
        ],
      },
    ],
  },
  {
    slug: "comment-fonctionnent-les-prix-des-compagnies-aeriennes",
    title: "Comment les compagnies aériennes fixent-elles leurs prix ?",
    metaTitle: "Comment les compagnies fixent leurs prix de billets | TrouveMonVol",
    description:
      "Classes tarifaires, yield management, remplissage : ce qui se passe réellement derrière le prix affiché de votre billet d'avion.",
    readingMinutes: 6,
    updated: "2026-08-12",
    body: [
      {
        paragraphs: [
          "Le prix d'un billet n'est pas calculé à partir du coût du vol. Il est calculé à partir de ce que la compagnie pense pouvoir obtenir de vous, à un instant donné, pour un siège donné.",
        ],
      },
      {
        heading: "Les classes tarifaires",
        paragraphs: [
          "Chaque avion est découpé en classes de réservation invisibles pour le voyageur. Une même cabine économique peut contenir dix niveaux de prix différents. Quand les sièges les moins chers sont vendus, la classe suivante s'ouvre automatiquement — d'où l'impression que « le prix a augmenté d'un coup ».",
          "Cela explique aussi pourquoi le prix peut baisser : si le remplissage est en retard sur les prévisions, la compagnie réouvre des classes basses.",
        ],
      },
      {
        heading: "Le yield management",
        paragraphs: [
          "Des algorithmes comparent en permanence le remplissage réel au remplissage attendu à la même échéance les années précédentes. En avance sur l'objectif, les prix montent. En retard, ils descendent.",
          "Il n'y a donc pas de « meilleur jour de la semaine pour acheter » universel : il y a des trajets en avance et des trajets en retard sur leur courbe.",
        ],
      },
      {
        heading: "Les frais accessoires",
        paragraphs: [
          "Sur les compagnies à bas coût, une part importante de la marge vient des options : bagage en soute, choix du siège, embarquement prioritaire, modification. Le prix d'appel reste bas volontairement, et le prix réel se construit pendant le tunnel de réservation.",
          "C'est pourquoi comparer des prix d'appel entre compagnies n'a aucun sens. Il faut comparer des billets équivalents, bagages inclus.",
        ],
      },
      {
        heading: "Ce que cela change pour vous",
        paragraphs: [
          "Vous ne pouvez pas battre l'algorithme, mais vous pouvez jouer sur les variables qu'il ne contrôle pas : votre date, votre aéroport, votre destination. C'est là que se trouvent les vraies économies, et c'est là que nous concentrons nos outils.",
        ],
      },
    ],
  },
  {
    slug: "eviter-les-frais-caches-billet-avion",
    title: "Comment éviter les frais cachés sur un billet d'avion",
    metaTitle: "Éviter les frais cachés d'un billet d'avion | TrouveMonVol",
    description:
      "Bagages, sièges, frais de dossier, cartes de paiement : la liste des suppléments qui font grimper un billet, et comment les anticiper.",
    readingMinutes: 5,
    updated: "2026-08-18",
    body: [
      {
        paragraphs: [
          "Entre le prix affiché sur un comparateur et le montant débité sur votre compte, l'écart peut dépasser 50 %. Voici les postes qui expliquent presque toujours la différence.",
        ],
      },
      {
        heading: "Le bagage cabine",
        paragraphs: [
          "Sur plusieurs compagnies à bas coût, seul un petit sac sous le siège est inclus. La valise cabine standard devient une option payante, souvent entre 20 et 45 euros par trajet — donc le double pour un aller-retour.",
          "Vérifiez toujours les dimensions autorisées : payer au comptoir d'embarquement coûte systématiquement plus cher que payer en ligne.",
        ],
      },
      {
        heading: "Le bagage en soute",
        paragraphs: [
          "Le tarif dépend du poids et du moment de l'achat. Ajouté après la réservation, il est presque toujours plus cher. Si vous savez que vous partez avec une valise, intégrez ce coût dès la comparaison.",
        ],
      },
      {
        heading: "Les frais d'agence et de paiement",
        paragraphs: [
          "Certaines agences en ligne appliquent des frais de service, des frais de dossier, ou un supplément selon le moyen de paiement. Ces montants apparaissent parfois à la dernière étape.",
          "C'est l'une des raisons pour lesquelles nous indiquons systématiquement qui vend le billet : vous savez chez qui vous atterrissez avant de cliquer.",
        ],
      },
      {
        heading: "Les assurances pré-cochées",
        paragraphs: [
          "Assurance annulation, garantie de correspondance, options « flexibilité » : elles sont souvent pré-sélectionnées. Elles peuvent être utiles, mais ce doit être un choix, pas un réflexe imposé par une case déjà cochée.",
        ],
      },
      {
        heading: "Notre règle",
        paragraphs: [
          "Un prix comparable est un prix complet. Nous affichons le total taxes incluses et signalons ce qui est inclus côté bagages quand la donnée est disponible. Quand elle ne l'est pas, nous le disons plutôt que de laisser croire à une inclusion.",
        ],
      },
    ],
  },
  {
    slug: "vol-pas-cher-vacances-toussaint",
    title: "Vol pas cher pour la Toussaint : comment ne pas payer le prix fort",
    metaTitle: "Vol pas cher Toussaint : quand réserver et où partir | TrouveMonVol",
    description:
      "Les vacances de la Toussaint concentrent la demande sur une semaine précise, ce qui fait grimper les prix plus tôt que d'habitude. Comment s'y prendre, et vers quelles destinations partir sans se ruiner.",
    readingMinutes: 5,
    updated: "2026-08-31",
    seasonal: true,
    relatedSlugs: ["paris-marrakech", "paris-lisbonne", "paris-rome", "paris-barcelone"],
    body: [
      {
        paragraphs: [
          "La Toussaint est la première vraie coupure après l'été : une semaine de vacances scolaires, souvent le seul moment de l'automne où toute la famille est disponible en même temps. Cette concentration de la demande sur des dates fixes change la donne par rapport à un voyage aux dates libres.",
        ],
      },
      {
        heading: "Pourquoi cette semaine coûte plus cher qu'une semaine normale",
        paragraphs: [
          "Sur un trajet aux dates flexibles, les prix restent stables puis grimpent nettement dans les trois dernières semaines avant le départ. Sur une semaine de vacances scolaires comme la Toussaint, cette hausse démarre beaucoup plus tôt, parce que la demande se concentre sur les mêmes deux ou trois jours de départ et de retour, sans possibilité de décaler pour la plupart des familles.",
          "Ce n'est pas une manipulation du prix : c'est un mécanisme d'offre et de demande classique, mais qui joue contre vous si vous attendez le dernier moment sur ces dates précises.",
        ],
      },
      {
        heading: "Quand réserver pour la Toussaint",
        paragraphs: [
          "Contrairement à un trajet à dates libres, où attendre peut parfois payer, une semaine de vacances scolaires se traite comme une date imposée : réservez dès que vos dates sont arrêtées, sans attendre une hypothétique baisse qui a peu de chances d'arriver sur ce type de période.",
          "Le jour de retour est souvent le point le plus cher de tout le séjour, car c'est là que la demande est la plus concentrée. Si votre emploi du temps le permet, revenir un jour avant ou après la fin officielle des vacances peut faire une vraie différence.",
        ],
      },
      {
        heading: "Où partir une semaine sans finir sa journée dans les avions",
        paragraphs: [
          "Fin octobre, l'Europe du Sud et le Maghreb offrent encore des températures agréables pour un vol de deux à trois heures : Marrakech reste douce et ensoleillée, Lisbonne et Barcelone gardent des journées clémentes pour visiter à pied, Rome se visite bien plus confortablement qu'en plein été.",
          "L'avantage de ces trajets courts : même avec une semaine, vous ne perdez pas une journée entière de vacances dans les transports, et les allers-retours en dates flexibles ± 3 jours laissent une vraie marge pour comparer les jours de départ et de retour entre eux.",
        ],
      },
      {
        heading: "Ce qu'on peut faire pour vous sur ces dates",
        paragraphs: [
          "Si vos dates de vacances sont déjà fixées, activez l'option dates flexibles ± 3 jours sur votre recherche : elle compare automatiquement les jours autour de votre départ et de votre retour prévus, ce qui est justement là où se jouent les plus gros écarts sur une semaine scolaire. Vous pouvez aussi créer une alerte prix gratuite dès maintenant : si un tarif baisse avant que vous réserviez, vous le saurez sans avoir à vérifier chaque jour.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
