export type CityGuidePractical = {
  monnaie: string;
  langue: string;
  visa: string;
  transport: string;
  budgetJour: string;
};

export type CityGuide = {
  /** Segment d'URL : /conseils/destinations/<slug>. */
  slug: string;
  city: string;
  country: string;
  /** Slug de la page trajet correspondante (/vols/<routeSlug>). */
  routeSlug: string;
  /** Codes IATA utilisés pour le lien de recherche de vols. */
  origin: string;
  destination: string;
  originCity: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  readingMinutes: number;
  updated: string;
  /**
   * Photo de la ville relevée à la génération (guides publiés depuis
   * /destinations-proposes). Absente des guides écrits à la main, qui ont tous
   * un visuel curé dans `destination-images`.
   */
  imageUrl?: string | null;
  practical: CityGuidePractical;
  sections: { heading: string; paragraphs: string[] }[];
};

export const CITY_GUIDES: CityGuide[] = [
  {
    slug: "marrakech",
    city: "Marrakech",
    country: "Maroc",
    routeSlug: "paris-marrakech",
    origin: "PAR",
    destination: "RAK",
    originCity: "Paris",
    title: "Que faire à Marrakech : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Marrakech : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Marrakech : meilleure période, quartiers à voir, budget sur place, transports, monnaie et formalités pour les Français. Tout pour préparer votre voyage.",
    intro:
      "Marrakech se visite très bien en trois ou quatre jours, à condition de savoir où loger et à quelle période venir. Voici les informations concrètes à connaître avant de réserver : climat mois par mois, quartiers, budget réel sur place et déplacements.",
    readingMinutes: 7,
    updated: "2026-08-30",
    practical: {
      monnaie:
        "Dirham marocain (MAD). Environ 1 € = 10,8 MAD. Devise non exportable : changez sur place.",
      langue:
        "Arabe et amazigh. Le français est très largement parlé dans le tourisme et les commerces.",
      visa: "Aucun visa pour les Français pour un séjour touristique de moins de 90 jours. Passeport valide requis.",
      transport:
        "Petits taxis (négociez ou exigez le compteur), bus n°19 depuis l'aéroport, médina uniquement à pied.",
      budgetJour:
        "40 à 70 € par personne et par jour en riad confortable, repas et visites inclus.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Marrakech ?",
        paragraphs: [
          "Les deux fenêtres les plus agréables sont mars-mai et septembre-novembre : entre 22 et 28 °C en journée, des soirées douces et des jardins en pleine forme. C'est aussi la période où les excursions vers l'Atlas ou la vallée de l'Ourika restent confortables.",
          "En juillet et août, la ville dépasse régulièrement 40 °C l'après-midi. Le séjour reste possible si votre hébergement dispose d'une piscine et si vous organisez les visites tôt le matin, mais ce n'est clairement pas la meilleure saison pour marcher dans la médina.",
          "De décembre à février, les journées sont ensoleillées et douces (18 à 20 °C) mais les nuits descendent souvent sous 8 °C, et beaucoup de riads chauffent peu. Prévoyez des vêtements chauds pour le soir. Les tarifs aériens grimpent nettement sur les vacances scolaires et autour du Nouvel An.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "La médina concentre l'essentiel : la place Jemaa el-Fna, les souks, la médersa Ben Youssef, le palais de la Bahia et les tombeaux saadiens. Tout se fait à pied, mais les ruelles ne suivent aucune logique évidente : téléchargez une carte hors ligne avant d'arriver.",
          "Le quartier de la Kasbah, au sud, est plus calme et pratique pour dormir sans subir le bruit nocturne de Jemaa el-Fna. Le Mellah, l'ancien quartier juif, abrite le marché aux épices le plus authentique de la ville.",
          "Guéliz, la ville nouvelle, offre des restaurants contemporains, des galeries et des boutiques à prix fixes. C'est là que se trouvent le jardin Majorelle et le musée Yves Saint Laurent — arrivez à l'ouverture pour éviter la file. L'Hivernage, entre les deux, regroupe les grands hôtels et le Palais des congrès.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Marrakech reste une destination abordable. Comptez 8 à 15 € pour un repas complet dans un restaurant de médina, 25 à 40 € dans une bonne table de Guéliz, et 1 à 2 € pour un jus ou un thé. Une nuit en riad correct se situe entre 45 et 90 €, avec petit-déjeuner sur la terrasse.",
          "Les entrées de sites coûtent entre 7 et 12 € (jardin Majorelle, palais de la Bahia, médersa Ben Youssef). Une excursion à la journée dans l'Atlas ou à Essaouira revient à 25-45 € par personne en groupe partagé.",
          "Prévoyez toujours des espèces en petites coupures : de nombreux commerces de la médina, les petits taxis et les hammams populaires n'acceptent pas la carte. Le marchandage est la norme dans les souks — annoncez environ la moitié du premier prix et restez souriant.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : les Français n'ont pas besoin de visa pour un séjour touristique inférieur à 90 jours ; un passeport en cours de validité suffit. Aucun vaccin n'est obligatoire.",
          "Argent : le dirham ne se change pas hors du Maroc. Retirez au distributeur à l'arrivée ou changez à l'aéroport, et gardez le reçu si vous voulez reconvertir au départ.",
          "Transports : le trajet aéroport Marrakech-Ménara — médina prend 15 minutes ; fixez le prix avant de monter dans un petit taxi (comptez 10 à 15 € de jour). Le bus n°19 relie l'aéroport au centre pour moins de 4 €.",
          "Sur place : buvez de l'eau en bouteille, prévoyez des épaules couvertes pour visiter les lieux religieux, et acceptez qu'on vous propose de l'aide pour vous guider — un pourboire est attendu si vous acceptez.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits suffisent pour la médina, les jardins et une soirée à Jemaa el-Fna. Cinq nuits permettent d'ajouter une excursion dans l'Atlas, la cascade d'Ouzoud ou une journée à Essaouira sur la côte.",
          "Au-delà d'une semaine, Marrakech devient une base pour un circuit plus large : désert d'Agafay, vallée du Draa ou Merzouga. Dans ce cas, réservez le vol retour avec un peu de marge : les retours de désert sont souvent plus longs que prévu.",
        ],
      },
    ],
  },
  {
    slug: "bangkok",
    city: "Bangkok",
    country: "Thaïlande",
    routeSlug: "paris-bangkok",
    origin: "PAR",
    destination: "BKK",
    originCity: "Paris",
    title: "Que faire à Bangkok : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Bangkok : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Bangkok : quand partir, quartiers où loger, budget quotidien, métro et bateaux, monnaie, visa et conseils pratiques pour les voyageurs français.",
    intro:
      "Bangkok se traverse plus vite qu'on ne le croit si l'on comprend son réseau de BTS, de métro et de bateaux. Voici ce qu'il faut savoir avant d'y atterrir : saison, quartiers, budget réel et formalités.",
    readingMinutes: 8,
    updated: "2026-08-30",
    practical: {
      monnaie:
        "Baht thaïlandais (THB). Environ 1 € = 38 THB. Cartes acceptées en centre-ville, espèces ailleurs.",
      langue: "Thaï. L'anglais est courant dans les hôtels, centres commerciaux et transports.",
      visa: "Pas de visa pour les Français jusqu'à 60 jours de tourisme. Passeport valide 6 mois après l'entrée.",
      transport:
        "BTS Skytrain, MRT, bateaux express du Chao Phraya, taxis au compteur et applications VTC.",
      budgetJour:
        "35 à 70 € par jour et par personne, beaucoup moins en voyageant en street food et guesthouse.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Bangkok ?",
        paragraphs: [
          "La saison sèche et fraîche va de novembre à février : 26 à 32 °C, humidité supportable, ciel dégagé. C'est la période idéale pour marcher, mais aussi la plus demandée — les vols long-courriers y sont plus chers, surtout autour de Noël.",
          "De mars à mai, la chaleur devient lourde et dépasse souvent 35 °C. Songkran, le nouvel an thaï mi-avril, transforme la ville en gigantesque bataille d'eau : c'est spectaculaire, mais les transports et les hôtels sont saturés.",
          "De juin à octobre, la mousson apporte des averses courtes et violentes, souvent en fin d'après-midi. La ville reste tout à fait visitable et les prix, aériens comme hôteliers, sont les plus bas de l'année.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Rattanakosin, la vieille ville, concentre le Grand Palais, le Wat Pho et son bouddha couché, et le Wat Arun de l'autre côté du fleuve. Prévoyez la matinée, tenue couvrante obligatoire (épaules et genoux).",
          "Sukhumvit est le quartier moderne : gratte-ciel, rooftops, restaurants internationaux et accès direct au BTS. C'est le meilleur choix si vous voulez du confort et des déplacements simples.",
          "Silom et Sathorn concentrent les affaires le jour et les marchés de nuit le soir. Thonburi, sur la rive ouest, laisse voir un Bangkok plus calme, sillonné de canaux. Enfin, Chatuchak le week-end reste l'un des plus grands marchés du monde — arrivez avant 10 h.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Bangkok est l'une des grandes capitales les plus abordables d'Asie. Un plat de rue coûte 1,50 à 3 €, un repas dans un restaurant climatisé 8 à 15 €, une bière locale 2 à 4 €. Une nuit en hôtel 3 étoiles bien situé se négocie entre 30 et 60 €.",
          "Les transports sont peu chers : 0,50 à 1,60 € par trajet en BTS ou MRT, environ 0,50 € pour un bateau express, 3 à 8 € pour une course en taxi au compteur en ville. Refusez les tuk-tuks à prix forfaitaire pour de longues distances : ils reviennent plus cher qu'un taxi.",
          "L'entrée du Grand Palais avoisine 13 €, la plupart des autres temples 1 à 5 €. Une journée d'excursion vers Ayutthaya revient à 25-40 € par personne.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : exemption de visa pour les Français en séjour touristique jusqu'à 60 jours, avec un passeport valable au moins 6 mois après l'entrée et un billet de sortie du territoire.",
          "Arrivée : depuis Suvarnabhumi, l'Airport Rail Link rejoint Phaya Thai en 30 minutes pour environ 1,20 €. Depuis Don Mueang, privilégiez le bus A1 ou un taxi au compteur — refusez les rabatteurs du hall.",
          "Santé : buvez uniquement de l'eau en bouteille, la nourriture de rue très fréquentée est généralement sûre. Une assurance voyage couvrant l'hospitalisation est vivement recommandée.",
          "Usages : gardez votre calme en toute circonstance, ne touchez jamais la tête de quelqu'un, retirez vos chaussures avant d'entrer dans un temple ou chez l'habitant, et ne manquez jamais de respect à la famille royale.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois jours pleins couvrent les temples, un marché, une balade en bateau et une soirée en rooftop. Cinq jours permettent d'ajouter Ayutthaya, le marché flottant de Damnoen Saduak ou une journée dédiée aux musées et au shopping.",
          "Beaucoup de voyageurs utilisent Bangkok comme point d'entrée avant de rejoindre le sud ou Chiang Mai : dans ce cas, gardez au moins deux nuits sur place en début de séjour pour absorber le décalage horaire (5 heures en été, 6 en hiver).",
        ],
      },
    ],
  },
  {
    slug: "new-york",
    city: "New York",
    country: "États-Unis",
    routeSlug: "paris-new-york",
    origin: "PAR",
    destination: "NYC",
    originCity: "Paris",
    title: "Que faire à New York : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à New York : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide New York : meilleure période, quartiers de Manhattan et Brooklyn, budget réel, métro, ESTA et conseils pratiques pour préparer votre voyage depuis la France.",
    intro:
      "New York se prépare surtout côté budget et formalités : l'ESTA est obligatoire, la ville est chère, mais un séjour bien organisé reste tout à fait accessible. Voici les repères concrets.",
    readingMinutes: 8,
    updated: "2026-08-30",
    practical: {
      monnaie:
        "Dollar américain (USD). Cartes acceptées partout, y compris pour de très petits montants.",
      langue: "Anglais. L'espagnol est très présent dans plusieurs quartiers.",
      visa: "ESTA obligatoire avant l'embarquement (environ 21 $, valable 2 ans) pour les Français, passeport biométrique requis.",
      transport:
        "Métro 24h/24 avec paiement sans contact OMNY, bus, ferry gratuit vers Staten Island.",
      budgetJour: "120 à 220 € par jour et par personne, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter New York ?",
        paragraphs: [
          "Avril-juin et septembre-début novembre offrent les meilleures conditions : températures douces, longues journées et parcs agréables. L'automne, avec les couleurs de Central Park, est souvent considéré comme la plus belle saison.",
          "L'été est chaud et humide, avec des pointes à 33 °C et un métro étouffant, mais la ville vit dehors : concerts gratuits, cinémas en plein air, terrasses. Les vols sont alors à leur maximum tarifaire.",
          "De janvier à mars, il fait froid (souvent sous 0 °C) mais c'est la période la moins chère de l'année, hors vacances de février. Décembre est magnifique et très cher : réservez vol et hôtel au moins trois mois à l'avance.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Midtown concentre l'Empire State Building, Times Square, la Cinquième Avenue et le MoMA. Pratique pour dormir la première fois, mais bruyant et sans vie de quartier.",
          "Le Lower Manhattan réunit le Mémorial du 11-Septembre, Wall Street, l'embarcadère pour la Statue de la Liberté et le pont de Brooklyn. Traversez le pont à pied tôt le matin pour éviter la foule.",
          "Greenwich Village, SoHo et le Lower East Side donnent le New York des rues à échelle humaine : brownstones, librairies, restaurants. À Brooklyn, Williamsburg et DUMBO valent une journée complète, avec la meilleure vue sur la skyline au coucher du soleil.",
          "Enfin, Harlem, le Bronx (Yankee Stadium) et le Queens (Flushing et sa gastronomie asiatique) montrent une ville que la plupart des visiteurs manquent complètement.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "New York est chère, mais prévisible. Une chambre d'hôtel correcte coûte 180 à 300 € la nuit en haute saison, 110 à 180 € en janvier-mars. Un petit-déjeuner en deli revient à 8-12 €, un déjeuner rapide 15-20 €, un dîner assis 35-60 € par personne, boissons comprises.",
          "Attention à deux postes que les voyageurs français oublient : la taxe de vente ajoutée en caisse (environ 8,875 %) et le pourboire, qui s'élève à 18-20 % au restaurant et dans les bars.",
          "Le métro coûte environ 2,90 $ le trajet en payant sans contact, avec plafond hebdomadaire automatique. Les musées oscillent entre 25 et 30 $ ; certains, comme le Met, pratiquent un tarif « pay what you wish » pour les résidents de l'État uniquement.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : l'autorisation ESTA doit être demandée en ligne au moins 72 heures avant le départ, sur le site officiel du gouvernement américain uniquement. Elle coûte environ 21 $ et vaut 2 ans.",
          "Depuis l'aéroport : à JFK, l'AirTrain plus le métro coûte environ 11 $ jusqu'à Manhattan ; à Newark, l'AirTrain plus le train NJ Transit revient à environ 15 $. Le taxi forfaitaire depuis JFK dépasse 70 $ avec péages et pourboire.",
          "Santé : les soins sont extrêmement coûteux aux États-Unis. Une assurance voyage avec plafond médical élevé n'est pas une option.",
          "Décalage horaire : 6 heures de moins qu'en France. Prévoyez une première journée légère et sortez marcher au soleil dès l'arrivée.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Quatre jours pleins constituent le minimum réaliste : un jour à Midtown, un au sud de Manhattan, un à Brooklyn, un pour les musées et Central Park. Une semaine permet d'ajouter Harlem, le Queens et un match ou un spectacle à Broadway.",
          "Comme le vol dure environ 8 heures à l'aller, évitez les séjours de moins de trois nuits : le rapport temps de vol / temps sur place devient défavorable.",
        ],
      },
    ],
  },
  {
    slug: "lisbonne",
    city: "Lisbonne",
    country: "Portugal",
    routeSlug: "paris-lisbonne",
    origin: "PAR",
    destination: "LIS",
    originCity: "Paris",
    title: "Que faire à Lisbonne : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Lisbonne : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Lisbonne : quand partir, quartiers Alfama, Baixa et Belém, budget sur place, tramways et métro, conseils pratiques pour un week-end ou une semaine.",
    intro:
      "Lisbonne est l'une des capitales européennes les plus faciles à visiter en trois ou quatre jours, à condition d'accepter ses collines. Climat, quartiers, budget et transports : voici l'essentiel.",
    readingMinutes: 7,
    updated: "2026-08-30",
    practical: {
      monnaie: "Euro (EUR). Cartes acceptées presque partout, y compris dans les petits cafés.",
      langue:
        "Portugais. L'anglais est largement parlé, le français moins souvent chez les jeunes.",
      visa: "Aucune formalité pour les Français : carte d'identité ou passeport en cours de validité suffit.",
      transport:
        "Métro, tramways historiques (28, 15), funiculaires, train de banlieue vers Cascais et Sintra.",
      budgetJour: "70 à 120 € par jour et par personne, hébergement inclus.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Lisbonne ?",
        paragraphs: [
          "Mars à juin et septembre à octobre sont les périodes les plus agréables : 20 à 26 °C, lumière remarquable et affluence raisonnable. C'est aussi la meilleure fenêtre pour marcher dans les quartiers en pente sans souffrir.",
          "Juillet et août atteignent 30 à 35 °C et la ville se remplit fortement, notamment autour d'Alfama et du Time Out Market. Les Fêtes de Lisbonne, en juin, valent le détour mais saturent les hébergements du centre.",
          "L'hiver reste doux (14 à 17 °C en journée) avec des averses régulières. C'est la période la moins chère pour le vol comme pour l'hôtel, et les musées sont enfin calmes.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Alfama, le plus ancien quartier, s'explore sans itinéraire précis : ruelles, escaliers, miradouros et maisons de fado. Montez jusqu'au château São Jorge en fin d'après-midi pour la lumière.",
          "Baixa et Chiado forment le centre reconstruit après le séisme de 1755 : grandes places, librairies historiques, cafés emblématiques. C'est le quartier le plus pratique pour dormir la première fois.",
          "Belém, à l'ouest, réunit la tour de Belém, le monastère des Hiéronymites et les fameux pastéis. Comptez une demi-journée et arrivez tôt.",
          "Enfin, le Bairro Alto et Príncipe Real concentrent la vie nocturne et les boutiques de créateurs, tandis que le Parque das Nações, à l'est, offre un visage contemporain avec l'Océanarium.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Lisbonne reste moins chère que Paris, mais l'écart s'est réduit. Un café coûte moins de 1 €, un plat du jour 9 à 14 €, un dîner complet 20 à 35 € par personne. Une nuit en hôtel bien situé se situe entre 80 et 140 € en haute saison, 50 à 80 € en hiver.",
          "Les transports sont peu coûteux : environ 1,80 € le trajet en métro avec la carte Viva Viagem rechargeable, 6,80 € pour un pass 24 heures qui inclut tramways et funiculaires. Le train pour Sintra ou Cascais coûte moins de 3 € l'aller.",
          "Les entrées de sites tournent autour de 10-15 € (monastère des Hiéronymites, château São Jorge, tour de Belém). La Lisboa Card devient rentable si vous enchaînez trois sites ou plus dans la même journée.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : aucune, la carte nationale d'identité suffit pour les ressortissants français. La carte européenne d'assurance maladie couvre les soins.",
          "Depuis l'aéroport : le métro ligne rouge rejoint le centre en 20 minutes pour moins de 2 €. L'aéroport est très proche de la ville, un taxi coûte environ 15 €.",
          "Chaussures : les rues sont pavées de calçada glissante quand il pleut, et les pentes sont réelles. Des semelles adhérentes changent tout.",
          "Sécurité : la ville est sûre, mais les pickpockets sont actifs dans le tramway 28 et à la gare de Rossio. Gardez votre téléphone hors des poches arrière.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits couvrent confortablement Alfama, Baixa, Belém et une soirée fado. Quatre à cinq nuits permettent d'ajouter Sintra et ses palais, la plage de Cascais ou une journée à Setúbal.",
          "Pour un simple week-end, privilégiez un vol du vendredi soir et un retour le lundi matin : la liaison est courte (2 h 30) et le décalage horaire d'une heure seulement.",
        ],
      },
    ],
  },
  {
    slug: "barcelone",
    city: "Barcelone",
    country: "Espagne",
    routeSlug: "paris-barcelone",
    origin: "PAR",
    destination: "BCN",
    originCity: "Paris",
    title: "Que faire à Barcelone : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Barcelone : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Barcelone : meilleure période, quartiers Gothique, Eixample et Gràcia, budget quotidien, métro, réservations Sagrada Familia et conseils pratiques.",
    intro:
      "Barcelone se visite bien toute l'année, mais deux détails changent tout : réserver les sites de Gaudí à l'avance et choisir le bon quartier où dormir. Voici les repères concrets avant de partir.",
    readingMinutes: 7,
    updated: "2026-08-30",
    practical: {
      monnaie: "Euro (EUR). Paiement par carte accepté dans la quasi-totalité des commerces.",
      langue: "Catalan et espagnol. L'anglais est courant dans le tourisme.",
      visa: "Aucune formalité pour les Français : carte d'identité ou passeport valide.",
      transport:
        "Métro dense, bus, tramway, vélos en libre-service, aéroport relié par Aerobús et métro L9.",
      budgetJour: "80 à 130 € par jour et par personne, hébergement inclus.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Barcelone ?",
        paragraphs: [
          "Mai-juin et septembre-octobre offrent le meilleur compromis : 22 à 27 °C, mer encore agréable en septembre et files d'attente plus courtes qu'en plein été.",
          "Juillet et août sont chauds, humides et très fréquentés, avec des plages saturées et des tarifs hôteliers au plus haut. Si vous venez à cette période, réservez tout — y compris les restaurants — plusieurs semaines à l'avance.",
          "L'hiver reste doux (13 à 16 °C en journée) et c'est la saison la plus économique. Les grandes attractions restent ouvertes et la ville retrouve un rythme local, en dehors du week-end de La Mercè fin septembre et du Mobile World Congress fin février, où les prix explosent.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Le Barri Gòtic et El Born forment le cœur médiéval : cathédrale, ruelles étroites, musée Picasso et Santa Maria del Mar. Idéal pour marcher sans plan, moins pratique pour dormir si vous êtes sensible au bruit.",
          "L'Eixample, quadrillé et aéré, abrite la Sagrada Familia, la Casa Batlló et la Pedrera. C'est le meilleur quartier pour un séjour familial : logements plus grands, transports partout, restaurants moins touristiques.",
          "Gràcia, plus au nord, garde une ambiance de village avec ses petites places animées, à deux pas du parc Güell. Le Poble-Sec et Montjuïc donnent accès aux musées, aux jardins et à la meilleure vue sur la ville.",
          "La Barceloneta reste la plage la plus accessible, mais la plus fréquentée : préférez Bogatell ou Nova Icària pour vous baigner tranquillement.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Un menu du jour en semaine coûte 13 à 18 €, un dîner de tapas 25 à 40 € par personne, une bière 3 à 5 €. L'hôtel 3 étoiles bien situé se négocie entre 100 et 160 € en haute saison, 60 à 100 € en hiver.",
          "Les visites pèsent vite dans le budget : environ 26 € pour la Sagrada Familia, 18 € pour le parc Güell, 29 € et plus pour la Casa Batlló. Réservez en ligne avec créneau horaire, sous peine de ne pas entrer le jour même en été.",
          "Le métro coûte environ 2,65 € le ticket à l'unité, mais la carte T-casual de 10 trajets revient à moins de 1,30 € par déplacement. Depuis l'aéroport, l'Aerobús coûte environ 7,25 €.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : aucune démarche pour les Français, carte d'identité suffisante, carte européenne d'assurance maladie recommandée.",
          "Rythme local : on déjeune vers 14 h et on dîne rarement avant 21 h. Beaucoup de bonnes adresses n'ouvrent pas avant 20 h 30.",
          "Sécurité : les vols à la tire sont fréquents sur les Ramblas, dans le métro et sur la plage. Ne laissez jamais un sac au sol en terrasse.",
          "Réglementation : la consommation d'alcool dans la rue et les vendeurs à la sauvette sont sanctionnés ; les locations touristiques doivent afficher un numéro de licence, à vérifier avant de réserver.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits suffisent pour Gaudí, le quartier gothique et une soirée de tapas. Quatre à cinq nuits permettent d'ajouter Montjuïc, une plage et une excursion à Montserrat ou Sitges.",
          "Le vol depuis Paris dure environ 1 h 50 : c'est l'une des rares grandes villes européennes où un week-end de deux nuits reste vraiment rentable.",
        ],
      },
    ],
  },
  {
    slug: "istanbul",
    city: "Istanbul",
    country: "Turquie",
    routeSlug: "paris-istanbul",
    origin: "PAR",
    destination: "IST",
    originCity: "Paris",
    title: "Que faire à Istanbul : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Istanbul : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Istanbul : meilleure période, quartiers où loger, budget sur place, transports, monnaie et formalités pour les Français. Tout pour préparer votre séjour.",
    intro:
      "Istanbul se visite bien en quatre jours si l'on accepte de ne pas tout voir. La ville est immense, coupée en deux par le Bosphore, et le choix du quartier où dormir change complètement l'expérience. Voici les informations concrètes à connaître avant de réserver votre vol.",
    readingMinutes: 8,
    updated: "2026-08-30",
    practical: {
      monnaie:
        "Livre turque (TRY). Taux très variable : changez par petites sommes, les bureaux de Grand-Rue offrent de meilleurs taux que l'aéroport.",
      langue: "Turc. L'anglais est courant dans le tourisme, le français beaucoup moins.",
      visa: "Aucun visa pour les Français en séjour touristique de moins de 90 jours. Passeport valide au moins 150 jours après l'entrée.",
      transport:
        "Tramway T1, métro, funiculaires et ferries. Prenez une carte Istanbulkart dès l'arrivée, elle sert sur tous les modes.",
      budgetJour:
        "45 à 80 € par personne et par jour, hébergement en hôtel confortable, repas et visites inclus.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Istanbul ?",
        paragraphs: [
          "Avril-mai et septembre-octobre sont les deux meilleures fenêtres : 18 à 25 °C, ciel souvent dégagé, journées assez longues pour enchaîner deux quartiers. Avril offre en prime la floraison des tulipes dans les parcs d'Emirgan et de Gülhane, un moment très photographié mais rarement bondé en semaine.",
          "L'été (juin à août) est chaud et humide, avec des pointes à 33 °C et une affluence maximale à Sainte-Sophie, à la Citerne Basilique et au palais de Topkapi. Si vous venez à cette période, réservez vos billets d'entrée en ligne et visitez à l'ouverture ou en fin d'après-midi.",
          "L'hiver, de décembre à février, est frais et pluvieux (5 à 10 °C), parfois neigeux quelques jours. C'est la saison la moins chère pour les vols et les hôtels, et l'ambiance des hammams, des cafés à narguilé et des marchés couverts prend alors tout son sens.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Sultanahmet concentre l'héritage byzantin et ottoman : Sainte-Sophie, la Mosquée bleue, Topkapi, la Citerne Basilique et l'Hippodrome, le tout dans un périmètre praticable à pied. C'est pratique pour un premier séjour court, mais le quartier se vide le soir et les restaurants y sont surtout touristiques.",
          "Beyoğlu, de la place Taksim à la tour de Galata en descendant l'İstiklal Caddesi, est le cœur vivant de la ville : cafés, librairies, salles de concert, restaurants de meyhane. C'est le meilleur choix si vous voulez sortir le soir sans dépendre des transports.",
          "Karaköy et Cihangir, en contrebas, offrent une ambiance plus calme et créative. Kadıköy, sur la rive asiatique, vaut largement la traversée en ferry : marché alimentaire, bars de quartier et prix nettement inférieurs à ceux de la rive européenne. Enfin, Balat et Fener, avec leurs maisons colorées et leurs églises orthodoxes, se parcourent tranquillement en une demi-journée.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Istanbul reste abordable pour un voyageur français, malgré une inflation forte ces dernières années. Comptez 6 à 12 € pour un repas dans un lokanta de quartier, 20 à 35 € pour un dîner de poisson avec vue sur le Bosphore, 1 à 2 € pour un thé et 2 à 4 € pour un café de spécialité.",
          "Les entrées de sites vont de 15 à 30 € pour les monuments majeurs, qui appliquent depuis peu des tarifs spécifiques aux visiteurs étrangers. Une croisière publique sur le Bosphore en ferry municipal coûte moins de 2 €, contre 20 à 40 € pour une croisière privée : le ferry est largement suffisant.",
          "L'hébergement se situe entre 50 et 100 € la nuit pour un bon hôtel trois étoiles bien placé. Prévoyez quelques espèces : marchés, taxis courts et petits commerces ne prennent pas toujours la carte, même si le paiement sans contact progresse vite.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : pas de visa pour un séjour touristique de moins de 90 jours sur une période de 180 jours ; votre passeport doit rester valide 150 jours après l'entrée. Aucun vaccin obligatoire.",
          "Transports depuis l'aéroport : depuis Istanbul Airport (IST), la navette Havaist rejoint Taksim en 60 à 90 minutes pour environ 10 €, le métro M11 relie Gayrettepe en 30 minutes. Depuis Sabiha Gökçen (SAW), côté asiatique, comptez au moins 1 h 30 pour rejoindre le centre européen.",
          "Sur place : l'Istanbulkart, achetée dans les bornes des stations, fonctionne sur tramway, métro, bus, funiculaire et ferries, avec des tarifs très bas. Pour les taxis, exigez le compteur ou passez par une application.",
          "Usages : tenue couvrante et foulard pour les femmes dans les mosquées, chaussures retirées à l'entrée. Évitez les visites pendant la prière du vendredi midi. Le marchandage est attendu au Grand Bazar, pas dans les boutiques à prix affichés.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits couvrent Sultanahmet, Beyoğlu et une traversée en ferry. Quatre à cinq nuits permettent d'ajouter Balat, Kadıköy, un hammam historique et une journée aux îles aux Princes, à une heure de bateau du centre.",
          "Au-delà d'une semaine, Istanbul devient une base pour un circuit turc plus large : Cappadoce en vol intérieur d'une heure, Éphèse ou Bursa en bus. Dans ce cas, gardez une nuit tampon avant le vol retour, les correspondances intérieures accusent souvent du retard.",
        ],
      },
    ],
  },
  {
    slug: "dubai",
    city: "Dubaï",
    country: "Émirats arabes unis",
    routeSlug: "paris-dubai",
    origin: "PAR",
    destination: "DXB",
    originCity: "Paris",
    title: "Que faire à Dubaï : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Dubaï : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Dubaï : quand partir, quartiers où loger, budget réel sur place, métro et taxis, monnaie, visa et conseils pratiques pour les voyageurs français.",
    intro:
      "Dubaï se visite très différemment selon la saison et le quartier choisi. Entre la vieille ville de Deira, la Marina et le désert, les distances sont longues : mieux vaut planifier. Voici l'essentiel avant de réserver votre vol.",
    readingMinutes: 8,
    updated: "2026-08-30",
    practical: {
      monnaie:
        "Dirham des Émirats (AED), indexé sur le dollar. Environ 1 € = 4 AED. Carte acceptée quasiment partout.",
      langue: "Arabe officiel, anglais parlé partout, y compris dans les taxis et les commerces.",
      visa: "Aucun visa préalable pour les Français : visa gratuit de 90 jours délivré à l'arrivée. Passeport valide 6 mois.",
      transport:
        "Métro (lignes rouge et verte), tramway de la Marina, taxis abordables et applications VTC.",
      budgetJour:
        "80 à 150 € par personne et par jour hors hôtel de luxe ; beaucoup moins en mangeant local.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Dubaï ?",
        paragraphs: [
          "De novembre à mars, le climat est idéal : 22 à 28 °C, faible humidité, soirées agréables en terrasse. C'est la haute saison touristique, donc la période où les hôtels et les vols sont les plus chers, en particulier autour de Noël et du Nouvel An.",
          "Avril, mai et octobre forment de bons compromis : il fait chaud (30 à 35 °C) mais les plages et les piscines restent très agréables, et les tarifs baissent nettement par rapport à l'hiver.",
          "De juin à septembre, la chaleur devient extrême, souvent au-delà de 42 °C avec une humidité élevée. La ville reste entièrement climatisée et les prix chutent, mais la vie se déroule alors à l'intérieur : centres commerciaux, musées, parcs aquatiques. À éviter si votre programme repose sur la marche ou le désert.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Downtown Dubai regroupe la Burj Khalifa, le Dubai Mall et les fontaines. C'est le quartier le plus pratique pour un premier séjour, bien desservi par le métro, mais aussi l'un des plus chers pour dormir.",
          "Dubai Marina et JBR offrent la plage, la promenade en bord de mer et une grande densité de restaurants. C'est le meilleur choix pour un séjour balnéaire, avec le tramway pour se déplacer localement.",
          "Deira et Bur Dubai, de part et d'autre de la crique, montrent le Dubaï historique : souk de l'or, souk aux épices, quartier restauré d'Al Fahidi et traversée en abra pour quelques centimes. Al Quoz, plus au sud, concentre les galeries d'art dans d'anciens entrepôts. Enfin, le désert, à 45 minutes du centre, se découvre en excursion d'une demi-journée avec dîner sous tente.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Contrairement à sa réputation, Dubaï peut se visiter sans budget démesuré. Un repas dans un restaurant indien ou pakistanais de Deira coûte 5 à 10 €, un déjeuner en food court 10 à 15 €, un dîner dans un restaurant de la Marina 35 à 60 € sans alcool. Les boissons alcoolisées sont taxées et coûtent cher : 10 à 15 € la bière en hôtel.",
          "Les activités structurent le budget : environ 40 € l'accès au sommet de la Burj Khalifa (plus cher au coucher du soleil), 35 à 60 € pour un safari dans le désert, 25 € pour The View at the Palm. Le métro coûte moins de 2 € le trajet et les taxis restent bon marché (5 à 12 € pour la plupart des courses urbaines).",
          "Côté hébergement, comptez 70 à 120 € la nuit pour un bon quatre étoiles hors haute saison, davantage sur la plage en décembre-janvier.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : les ressortissants français reçoivent un visa de visite gratuit à l'arrivée, valable 90 jours sur une période de 180 jours. Le passeport doit être valide six mois après l'entrée.",
          "Transport depuis l'aéroport : le métro dessert directement les terminaux 1 et 3 et rejoint Downtown en une vingtaine de minutes. Un taxi vers la Marina coûte environ 20 à 25 €.",
          "Usages et règles : tenue correcte exigée dans les centres commerciaux et les quartiers traditionnels (épaules et genoux couverts), alcool uniquement dans les établissements licenciés, comportements affectueux discrets en public. Pendant le ramadan, ne mangez pas et ne buvez pas dans la rue en journée.",
          "Pratique : l'eau du robinet est potable mais peu consommée, les distances entre quartiers sont réelles (comptez 30 minutes de trajet de Deira à la Marina), et un abonnement Nol Card facilite tous les transports publics.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Quatre nuits suffisent pour Downtown, la Marina, la vieille ville et une soirée dans le désert. Une semaine permet d'ajouter Abu Dhabi et la mosquée Cheikh Zayed en excursion, ainsi que quelques journées de plage.",
          "Dubaï fonctionne aussi très bien comme escale de deux ou trois nuits sur un trajet vers l'Asie ou l'océan Indien : les vols avec stopover sont souvent moins chers qu'un vol direct, et l'aéroport est l'un des mieux connectés du monde.",
        ],
      },
    ],
  },
  {
    slug: "tokyo",
    city: "Tokyo",
    country: "Japon",
    routeSlug: "paris-tokyo",
    origin: "PAR",
    destination: "TYO",
    originCity: "Paris",
    title: "Que faire à Tokyo : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Tokyo : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Tokyo : meilleure saison, quartiers où loger, budget quotidien, métro et JR, monnaie, formalités et conseils pratiques pour un premier voyage au Japon.",
    intro:
      "Tokyo n'a pas de centre unique : la ville s'organise autour d'une dizaine de pôles reliés par la ligne Yamanote. Comprendre cette géographie évite de perdre des heures dans les transports. Voici l'essentiel avant de réserver.",
    readingMinutes: 9,
    updated: "2026-08-30",
    practical: {
      monnaie:
        "Yen (JPY). Environ 1 € = 165 JPY. Les espèces restent utiles malgré la généralisation du sans contact.",
      langue:
        "Japonais. L'anglais est limité à l'oral mais la signalétique des transports est bilingue.",
      visa: "Aucun visa pour les Français jusqu'à 90 jours de tourisme. Formulaire d'immigration en ligne via Visit Japan Web.",
      transport:
        "Métro Tokyo Metro et Toei, lignes JR dont la Yamanote. Carte Suica ou Pasmo indispensable.",
      budgetJour:
        "70 à 130 € par personne et par jour, hébergement compris en hôtel de catégorie moyenne.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Tokyo ?",
        paragraphs: [
          "Fin mars à début avril, la floraison des cerisiers attire un monde considérable mais offre une expérience unique dans les parcs d'Ueno, de Shinjuku Gyoen et le long de la Meguro. Réservez vols et hôtels plusieurs mois à l'avance : c'est la période la plus chère de l'année avec la Golden Week.",
          "Octobre et novembre sont, pour beaucoup de voyageurs, la meilleure saison : 15 à 22 °C, air sec, ciel clair et érables rouges à partir de mi-novembre. Les tarifs aériens sont plus raisonnables qu'au printemps.",
          "L'été, de juin à septembre, est chaud et très humide, avec la saison des pluies en juin et un risque de typhons en septembre. L'hiver est froid mais sec et ensoleillé : peu de foule, prix bas et vue dégagée sur le mont Fuji depuis les points hauts de la ville.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Shinjuku et Shibuya sont les deux pôles les plus animés : gratte-ciel, ruelles d'izakaya, grands magasins et le fameux carrefour de Shibuya. Loger près de l'une de ces gares simplifie tous les déplacements grâce à la ligne Yamanote.",
          "Asakusa et Yanaka montrent le Tokyo traditionnel : temple Sensō-ji, ruelles commerçantes, maisons basses et petits ateliers. C'est aussi le secteur des hébergements les plus abordables.",
          "Ginza et Nihonbashi concentrent le luxe et la gastronomie, Akihabara l'électronique et la culture otaku, Harajuku et Omotesandō la mode et l'architecture contemporaine. Enfin, Odaiba, sur la baie, et Nakameguro, le long de la rivière, offrent deux ambiances plus calmes pour une demi-journée.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Le Japon coûte moins cher que sa réputation. Un bol de ramen ou un donburi revient à 6 à 10 €, un menu de midi dans un bon restaurant 10 à 15 €, un dîner d'izakaya 20 à 35 € par personne. Les combini (supérettes ouvertes 24 h/24) permettent de manger correctement pour 4 à 6 €.",
          "Les transports urbains coûtent 1,20 à 2,50 € par trajet ; un pass journalier de métro revient à environ 6 €. Le JR Pass national n'est rentable que si vous quittez Tokyo pour Kyoto ou Osaka : pour un séjour uniquement à Tokyo, il ne l'est pas.",
          "L'hébergement va de 40 € la nuit en business hotel ou capsule à 120 € pour un hôtel confortable bien situé. La plupart des temples et des parcs sont gratuits ; les musées coûtent 5 à 15 €, l'observatoire du bâtiment municipal de Shinjuku est gratuit.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : pas de visa pour un séjour touristique de moins de 90 jours. Remplissez à l'avance le formulaire Visit Japan Web (immigration et douane) pour gagner du temps à l'arrivée.",
          "Depuis l'aéroport : de Narita, le Narita Express rejoint Tokyo en 60 minutes (environ 20 €), le Keisei Skyliner Ueno en 45 minutes. De Haneda, plus proche, le monorail ou la ligne Keikyu mettent 20 à 30 minutes pour moins de 5 €.",
          "Sur place : achetez une carte Suica ou Pasmo (physique ou sur smartphone) dès l'arrivée, elle sert dans tous les transports et dans les commerces. Gardez toujours 5 000 à 10 000 yens en espèces : petits restaurants et temples n'acceptent pas la carte.",
          "Usages : on ne mange pas en marchant, on ne parle pas fort dans les transports, on ne laisse pas de pourboire. Les poubelles sont rares : prévoyez un petit sac pour vos déchets.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Quatre à cinq nuits sont un minimum pour Tokyo seule, compte tenu du décalage horaire de sept à huit heures et de la taille de la ville. Prévoyez des journées thématiques par quartier plutôt que des allers-retours.",
          "Dix à quatorze jours permettent d'ajouter Kyoto, Osaka et une étape nature comme Hakone, Nikkō ou Kanazawa, en Shinkansen. Dans ce cas, calculez la rentabilité du JR Pass avant d'acheter : au tarif actuel, deux allers-retours longue distance sont souvent nécessaires pour l'amortir.",
        ],
      },
    ],
  },
  {
    slug: "alger",
    city: "Alger",
    country: "Algérie",
    routeSlug: "paris-alger",
    origin: "PAR",
    destination: "ALG",
    originCity: "Paris",
    title: "Que faire à Alger : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Alger : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Alger : meilleure période, quartiers à visiter, budget sur place, transports, monnaie, visa pour les Français et conseils pratiques avant de partir.",
    intro:
      "Alger la Blanche se découvre à pied, entre les arcades du front de mer, la Casbah et les hauteurs de Notre-Dame d'Afrique. C'est une destination encore peu touristique, ce qui suppose un peu de préparation, notamment côté visa et argent liquide.",
    readingMinutes: 8,
    updated: "2026-08-30",
    practical: {
      monnaie:
        "Dinar algérien (DZD), non exportable et non convertible hors du pays. Prévoyez des espèces en euros.",
      langue: "Arabe et amazigh officiels ; le français est très largement compris et parlé.",
      visa: "Visa obligatoire pour les Français : demande au consulat avec réservation d'hôtel ou attestation d'hébergement.",
      transport:
        "Métro, tramway, téléphériques, taxis et bus ETUSA. Les courses en taxi se négocient souvent au départ.",
      budgetJour: "35 à 60 € par personne et par jour, hébergement en hôtel correct compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Alger ?",
        paragraphs: [
          "Le printemps, d'avril à juin, est la meilleure saison : 20 à 27 °C, végétation verte sur les hauteurs et mer déjà agréable en fin de période. L'automne, de septembre à début novembre, offre des conditions comparables avec une mer encore chaude.",
          "L'été est chaud (30 à 35 °C) et surtout très fréquenté par la diaspora : les vols depuis Paris sont alors nettement plus chers et se remplissent des mois à l'avance, en particulier en juillet-août et autour de l'Aïd.",
          "L'hiver reste doux sur la côte (12 à 17 °C) mais pluvieux. C'est la période la moins chère pour voler, adaptée à un séjour culturel et urbain plutôt que balnéaire.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "La Casbah, classée à l'UNESCO, est le cœur historique : ruelles en escaliers, palais ottomans, mosquée Ketchaoua. Le quartier se visite idéalement accompagné d'un guide local, à la fois pour l'orientation et pour l'histoire des lieux.",
          "Le centre-ville haussmannien, autour de la rue Didouche-Mourad et de la Grande Poste, montre le visage colonial et moderne d'Alger : cafés, librairies, cinémas et arcades du front de mer face au port.",
          "Sur les hauteurs, Notre-Dame d'Afrique offre l'un des plus beaux panoramas sur la baie ; on y accède en téléphérique. Le Jardin d'Essai du Hamma, immense parc botanique, et le Musée national des beaux-arts juste au-dessus, méritent une demi-journée. Enfin, le Mémorial du Martyr (Maqam Echahid) domine la ville et abrite le musée de l'Armée.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Alger est peu chère pour un voyageur venant de France. Un repas complet dans un restaurant populaire coûte 4 à 8 €, un bon dîner de poisson 15 à 25 €, un café 0,50 à 1 €. Les entrées de musées ne dépassent généralement pas 2 à 3 €.",
          "L'hébergement est le poste le plus variable : 30 à 50 € la nuit pour un hôtel simple mais propre, 80 à 130 € pour un établissement international en bord de mer. Les locations d'appartement se développent mais se réservent souvent localement.",
          "Point essentiel : le dinar ne s'achète pas hors d'Algérie et les cartes bancaires étrangères sont très peu acceptées. Emportez des euros en espèces, à changer sur place, et prévoyez une marge : très peu de distributeurs acceptent les cartes internationales.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : le visa est obligatoire pour les Français. Le dossier se dépose au consulat d'Algérie et exige généralement passeport valide six mois, photos, justificatif d'hébergement ou réservation d'hôtel, assurance et attestation de ressources. Prévoyez plusieurs semaines de délai avant le départ, et achetez un billet modifiable tant que le visa n'est pas obtenu.",
          "Depuis l'aéroport Houari-Boumédiène, comptez 20 à 30 minutes jusqu'au centre en taxi (environ 10 à 15 €) ; fixez le tarif avant de monter. La ligne de bus 100 dessert aussi le centre-ville.",
          "Sur place : le métro et le tramway sont modernes, propres et très bon marché. Les transports par taxi collectif restent la norme pour les trajets plus longs.",
          "Bon à savoir : le vendredi, beaucoup de commerces et d'administrations sont fermés. Photographier les bâtiments officiels, les ports et les militaires est interdit. Un usage courant du français facilite énormément les échanges.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits permettent de couvrir la Casbah, le centre, le Jardin d'Essai et Notre-Dame d'Afrique sans se presser. Quatre à cinq nuits ajoutent Tipaza et ses ruines romaines en bord de mer, à une heure à l'ouest, ainsi que les plages de la côte turquoise.",
          "Pour un séjour plus long, Alger sert de porte d'entrée vers Constantine, Oran ou le Sahara (Ghardaïa, Timimoun), accessibles en vols intérieurs peu coûteux mais à réserver tôt en été.",
        ],
      },
    ],
  },
  {
    slug: "rome",
    city: "Rome",
    country: "Italie",
    routeSlug: "paris-rome",
    origin: "PAR",
    destination: "ROM",
    originCity: "Paris",
    title: "Que faire à Rome : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Rome : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Rome : quand partir, quartiers où loger, budget sur place, transports, réservations des sites majeurs et conseils pratiques pour un city-break réussi.",
    intro:
      "Rome se marche : la plupart des sites du centre historique tiennent dans un périmètre de trois kilomètres. Le vrai enjeu d'un séjour réussi, ce sont les réservations et le choix de la saison. Voici les repères concrets avant de réserver votre vol.",
    readingMinutes: 8,
    updated: "2026-08-30",
    practical: {
      monnaie: "Euro. Carte acceptée partout, y compris pour les petits montants.",
      langue: "Italien. L'anglais est courant dans le centre, le français parfois compris.",
      visa: "Aucune formalité pour les Français : carte d'identité ou passeport en cours de validité suffit.",
      transport:
        "Métro (lignes A, B, C), tramways et bus ATAC. Le centre historique se parcourt à pied.",
      budgetJour:
        "70 à 120 € par personne et par jour, hébergement en hôtel de catégorie moyenne compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Rome ?",
        paragraphs: [
          "Avril-juin et septembre-octobre offrent les meilleures conditions : 20 à 27 °C, journées longues et terrasses agréables. Ce sont aussi des périodes fréquentées : réservez le Colisée et les musées du Vatican plusieurs semaines à l'avance.",
          "Juillet et août sont chauds (souvent 33 à 36 °C) et beaucoup de Romains quittent la ville en août ; certains restaurants de quartier ferment. Les visites de sites en plein air comme le Forum ou la Via Appia deviennent éprouvantes en milieu de journée.",
          "De novembre à mars, Rome est douce (10 à 15 °C), moins chère et beaucoup plus calme. Les files d'attente sont raisonnables et les vols depuis Paris tombent régulièrement à des tarifs très bas, sauf pendant les fêtes et Pâques, qui attirent une foule considérable au Vatican.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Le centre antique regroupe le Colisée, le Forum romain et le Palatin, un ensemble qui demande une bonne demi-journée. Le billet combiné se réserve en ligne avec un créneau horaire ; sans réservation, l'accès est devenu difficile en haute saison.",
          "Le centre baroque, du Panthéon à la place Navone et à la fontaine de Trevi, se parcourt à pied. Tôt le matin, avant 8 h, ces places sont quasiment vides : c'est le meilleur moment pour les photos.",
          "Le Vatican mérite une matinée complète pour la basilique Saint-Pierre et les musées ; l'entrée dans la basilique est gratuite mais la file de sécurité est longue. Le Trastevere, de l'autre côté du Tibre, concentre les trattorias et l'ambiance du soir. Monti, à deux pas du Colisée, est un excellent quartier où loger : central, vivant et moins cher que la Piazza di Spagna. Enfin, Testaccio est le quartier de référence pour la cuisine romaine traditionnelle.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Comptez 12 à 18 € pour un plat de pâtes dans une trattoria correcte, 25 à 40 € pour un dîner complet avec vin, 1,20 € pour un espresso au comptoir — mais deux à trois fois plus en terrasse sur une place touristique. Une part de pizza al taglio, à 3 ou 4 €, reste le meilleur déjeuner rapide.",
          "Côté visites : environ 18 € le billet Colisée-Forum-Palatin, 20 € les musées du Vatican, 13 € la galerie Borghèse (réservation obligatoire). Beaucoup d'églises majeures, dont Saint-Pierre-aux-Liens et Santa Maria Maggiore, sont gratuites.",
          "L'hébergement va de 80 à 150 € la nuit dans le centre en saison, sensiblement moins en hiver. La taxe de séjour, de 4 à 7 € par personne et par nuit, se règle souvent sur place en espèces.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : le Leonardo Express relie Fiumicino à Termini en 32 minutes pour 14 € ; les trains régionaux, moins chers, desservent Trastevere. Depuis Ciampino, les navettes rejoignent Termini en 40 minutes pour environ 6 €.",
          "Réservations : Colisée, musées du Vatican et galerie Borghèse se réservent en ligne, avec créneau. Sans cela, vous risquez de perdre deux heures de file ou de ne pas entrer du tout.",
          "Sur place : la Roma Pass (72 h) devient intéressante si vous enchaînez plusieurs sites payants et utilisez les transports. Les fontaines publiques (nasoni) fournissent une eau potable et fraîche : emportez une gourde.",
          "Usages : tenue couvrant épaules et genoux obligatoire dans les basiliques, y compris Saint-Pierre. Attention aux pickpockets dans le métro ligne A et autour de Termini. Le service est inclus, mais un couvert (coperto) de 2 à 3 € est facturé au restaurant.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits constituent le format idéal d'un city-break : une journée antique, une journée Vatican, une journée centre baroque et Trastevere. Quatre à cinq nuits permettent d'ajouter la galerie Borghèse, la Via Appia à vélo et les catacombes.",
          "Pour une semaine, Rome sert de base à des excursions faciles en train : Ostie antique en 40 minutes, Tivoli et ses villas en une heure, Naples et Pompéi en 1 h 10 de train à grande vitesse.",
        ],
      },
    ],
  },
  {
    slug: "tunis",
    city: "Tunis",
    country: "Tunisie",
    routeSlug: "lyon-tunis",
    origin: "LYS",
    destination: "TUN",
    originCity: "Lyon",
    title: "Que faire à Tunis : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Tunis : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Tunis : meilleure période, médina et Sidi Bou Saïd, budget sur place, transports, monnaie, formalités pour les Français et conseils pratiques.",
    intro:
      "Tunis se visite facilement en trois jours, entre la médina classée, les mosaïques du Bardo et les villages côtiers de Carthage et Sidi Bou Saïd, tous accessibles par le petit train TGM. Voici l'essentiel avant de réserver votre vol.",
    readingMinutes: 7,
    updated: "2026-08-30",
    practical: {
      monnaie:
        "Dinar tunisien (TND), non exportable. Environ 1 € = 3,4 TND. Changez sur place et gardez les reçus.",
      langue: "Arabe officiel ; le français est très largement parlé et compris partout.",
      visa: "Aucun visa pour les Français en séjour touristique de moins de 90 jours. Passeport valide requis.",
      transport:
        "Métro léger, train TGM vers Carthage et La Marsa, louages et taxis jaunes au compteur.",
      budgetJour: "30 à 55 € par personne et par jour, hébergement en hôtel confortable compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Tunis ?",
        paragraphs: [
          "Le printemps (mars à juin) est la période la plus agréable : 20 à 28 °C, lumière claire et sites archéologiques praticables toute la journée. L'automne, de septembre à novembre, offre une mer encore chaude et une affluence bien plus faible qu'en été.",
          "Juillet et août sont chauds (32 à 36 °C) et correspondent au pic de fréquentation, avec des vols nettement plus chers depuis la France, en particulier autour des fêtes religieuses et des congés scolaires.",
          "L'hiver reste doux (12 à 17 °C) mais pluvieux par épisodes. C'est la saison la plus économique, adaptée aux visites urbaines et culturelles : la médina et le musée du Bardo se visitent alors sans foule.",
        ],
      },
      {
        heading: "Les quartiers et sites à voir en priorité",
        paragraphs: [
          "La médina de Tunis, inscrite à l'UNESCO, s'organise autour de la mosquée Zitouna : souks couverts, palais, medersas et cafés en terrasse sur les toits. Comptez une demi-journée pour s'y perdre volontairement.",
          "La ville moderne, autour de l'avenue Habib-Bourguiba, offre son architecture coloniale, la cathédrale, le théâtre municipal et les grands cafés. C'est le secteur le plus pratique pour loger.",
          "Le musée national du Bardo abrite l'une des plus belles collections de mosaïques romaines au monde : deux heures minimum. Enfin, la ligne TGM mène en 30 minutes aux sites de Carthage (thermes d'Antonin, ports puniques, colline de Byrsa) puis au village bleu et blanc de Sidi Bou Saïd, à faire en fin de journée pour le coucher de soleil sur le golfe.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Tunis est une des destinations méditerranéennes les moins chères. Comptez 4 à 8 € pour un repas dans un restaurant populaire, 12 à 25 € pour un bon dîner de poisson à La Goulette ou Sidi Bou Saïd, moins d'un euro pour un café.",
          "Les entrées de sites sont modestes : environ 4 € pour le musée du Bardo, 3 à 4 € pour le billet couvrant les sites de Carthage. Le TGM coûte moins d'un euro le trajet, et une course en taxi en ville dépasse rarement 3 à 5 €.",
          "L'hébergement va de 35 à 60 € la nuit pour un hôtel confortable dans la ville moderne, davantage dans les maisons d'hôtes de la médina ou en bord de mer. Prévoyez des espèces : la carte passe dans les grands hôtels mais rarement dans les souks et les petits restaurants.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : pas de visa pour les Français pour un séjour touristique de moins de 90 jours ; un passeport en cours de validité suffit. Aucun vaccin obligatoire.",
          "Depuis l'aéroport Tunis-Carthage, le centre-ville est à 15 minutes en taxi (environ 4 à 7 € au compteur, majoration de 50 % la nuit). Exigez la mise en marche du compteur.",
          "Argent : le dinar ne se change pas hors de Tunisie. Changez à l'arrivée et conservez les justificatifs si vous souhaitez reconvertir une partie au départ.",
          "Sur place : tenue couvrante recommandée dans la médina et obligatoire pour approcher les lieux de culte, marchandage habituel dans les souks, et prudence classique concernant les guides improvisés qui proposent de vous accompagner vers une boutique.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits couvrent confortablement la médina, le Bardo, Carthage et Sidi Bou Saïd. Quatre à cinq nuits permettent d'ajouter Dougga, l'un des sites romains les mieux conservés d'Afrique du Nord, à deux heures de route.",
          "Pour un séjour d'une semaine, Tunis se combine facilement avec Hammamet ou Sousse en train, ou avec Kairouan et El Jem pour un circuit patrimonial. Les louages (taxis collectifs interurbains) rendent ces trajets simples et très bon marché.",
        ],
      },
    ],
  },
  {
    slug: "londres",
    city: "Londres",
    country: "Royaume-Uni",
    routeSlug: "paris-londres",
    origin: "PAR",
    destination: "LON",
    originCity: "Paris",
    title: "Que faire à Londres : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Londres : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Londres : meilleure période, quartiers où loger, budget réel sur place, métro et Oyster, livre sterling et formalités post-Brexit pour les Français.",
    intro:
      "Londres se visite toute l'année, mais le budget change du simple au double selon la saison et le quartier choisi. Voici les repères concrets avant de réserver : climat, quartiers, coût de la vie sur place et formalités depuis le Brexit.",
    readingMinutes: 7,
    updated: "2026-08-31",
    practical: {
      monnaie:
        "Livre sterling (GBP). Environ 1 € = 0,85 £. Paiement par carte accepté quasiment partout, même pour 1 £.",
      langue: "Anglais. Le français est peu parlé hors des grands hôtels.",
      visa: "Pas de visa pour les Français en séjour touristique de moins de 6 mois, mais passeport obligatoire (la carte d'identité n'est plus acceptée) et autorisation électronique ETA à demander avant le départ.",
      transport:
        "Métro (Tube), bus rouges, Overground et Elizabeth Line : payez sans contact avec votre carte bancaire, le plafond journalier s'applique automatiquement.",
      budgetJour: "90 à 150 € par personne et par jour, hébergement compris, hors shopping.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Londres ?",
        paragraphs: [
          "Mai-juin et septembre offrent le meilleur compromis : 18 à 23 °C, journées longues, parcs en pleine forme et affluence encore raisonnable dans les musées. Les tarifs aériens restent modérés hors week-ends prolongés.",
          "Juillet et août sont les mois les plus touristiques : files d'attente à la Tour de Londres, hôtels chers et Tube très chaud. En revanche, la ville vit dehors, avec festivals, concerts dans les parcs et le carnaval de Notting Hill fin août.",
          "De novembre à février, il pleut souvent et la nuit tombe vers 16 h, mais c'est la saison des prix bas — sauf pendant les marchés de Noël et le Nouvel An, où tout remonte fortement.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Westminster et la City rassemblent l'essentiel des symboles : Big Ben, l'abbaye de Westminster, la cathédrale Saint-Paul et la Tour de Londres. Tout se fait à pied le long de la Tamise, en une journée bien remplie.",
          "South Bank, sur la rive sud, concentre le Tate Modern, le Borough Market et le Shakespeare's Globe : c'est la promenade la plus agréable de la ville en fin de journée.",
          "Pour l'ambiance locale, visez Shoreditch et Hackney à l'est (street art, marchés, restaurants), Camden au nord pour les disquaires et la Camden Lock, et Notting Hill ou South Kensington pour les façades colorées et les grands musées gratuits.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Londres est chère sur l'hébergement : comptez 110 à 200 € la nuit pour un hôtel correct en zone 1-2, 45 à 80 € en auberge ou dans un hôtel de chaîne en zone 3. Réserver deux mois à l'avance change réellement le prix.",
          "Côté repas, un déjeuner de pub ou de marché revient à 12-18 €, un dîner au restaurant à 30-45 € par personne, une pinte à 6-8 €. Les grands musées (British Museum, National Gallery, Tate, Natural History Museum) sont gratuits, ce qui allège nettement le budget visites.",
          "Les transports coûtent environ 8 à 10 € par jour grâce au plafond quotidien du paiement sans contact : passez toujours la même carte bancaire ou le même téléphone à l'entrée et à la sortie.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : depuis le Brexit, la carte nationale d'identité ne suffit plus pour la plupart des voyageurs français — prévoyez un passeport valide et l'autorisation électronique de voyage (ETA), à demander en ligne avant le départ.",
          "Argent : inutile de changer des espèces, la quasi-totalité des commerces, bus et taxis acceptent la carte sans contact. Vérifiez simplement les frais de change de votre banque.",
          "Transports depuis les aéroports : l'Elizabeth Line relie Heathrow au centre en 30-40 minutes, le Gatwick Express met 30 minutes depuis Gatwick, et les bus National Express desservent Stansted et Luton à petit prix.",
          "Sur place : on conduit à gauche, regardez donc à droite avant de traverser ; et gardez la droite dans les escalators du métro, la gauche est réservée à ceux qui marchent.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits permettent de couvrir Westminster, la City, South Bank et deux grands musées sans courir. Quatre à cinq nuits ajoutent les quartiers de l'est, Greenwich et une soirée dans le West End.",
          "Au-delà d'une semaine, Londres devient une base idéale pour des excursions à la journée en train : Oxford, Cambridge, Brighton ou Windsor sont tous à moins de deux heures.",
        ],
      },
    ],
  },
  {
    slug: "amsterdam",
    city: "Amsterdam",
    country: "Pays-Bas",
    routeSlug: "paris-amsterdam",
    origin: "PAR",
    destination: "AMS",
    originCity: "Paris",
    title: "Que faire à Amsterdam : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Amsterdam : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Amsterdam : quand partir, quartiers où loger, budget quotidien, vélo et transports, musées à réserver et conseils pratiques pour les voyageurs français.",
    intro:
      "Amsterdam se parcourt à vélo ou à pied en deux ou trois jours, à condition de réserver les musées à l'avance et de bien choisir son quartier. Voici les informations utiles avant de réserver votre vol.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie:
        "Euro (EUR). Attention : de nombreux commerces n'acceptent que les cartes de débit, pas les cartes de crédit.",
      langue: "Néerlandais. L'anglais est parlé partout, y compris dans les petits commerces.",
      visa: "Aucun visa : espace Schengen. Carte d'identité ou passeport en cours de validité suffisent.",
      transport:
        "Vélo, tramways GVB, métro et ferries gratuits vers Amsterdam-Noord. Le train relie Schiphol au centre en 15 minutes.",
      budgetJour: "90 à 140 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Amsterdam ?",
        paragraphs: [
          "Avril et mai sont les mois vedettes : tulipes en fleur, terrasses qui rouvrent et lumière longue en soirée. La Journée du Roi, le 27 avril, transforme la ville entière en fête orange — spectaculaire, mais hôtels complets et prix doublés.",
          "Juin à août offre les journées les plus longues et les canaux les plus animés, avec une affluence forte autour du Rijksmuseum et de la maison d'Anne Frank.",
          "De novembre à février, la ville est froide et humide mais très photogénique, notamment pendant l'Amsterdam Light Festival. C'est la période où les vols et les hôtels sont les plus abordables.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Le Grachtengordel, la ceinture de canaux classée à l'UNESCO, est le cœur de la carte postale : maisons étroites, ponts et péniches. Le Jordaan, juste à côté, ajoute des ruelles calmes, des cafés bruns et des marchés de quartier.",
          "Le Museumkwartier regroupe le Rijksmuseum, le Van Gogh Museum et le Stedelijk autour du Vondelpark : réservez vos créneaux en ligne, les billets sur place partent vite.",
          "De Pijp est le quartier le plus vivant pour manger, avec le marché Albert Cuyp. Amsterdam-Noord, à cinq minutes de ferry gratuit depuis la gare centrale, offre une ambiance industrielle réhabilitée et des hébergements souvent moins chers.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement est le poste le plus lourd : 130 à 200 € la nuit en hôtel de centre-ville, 60 à 100 € en auberge ou en périphérie desservie par le tram. La taxe de séjour, élevée, s'ajoute souvent au tarif affiché.",
          "Un déjeuner simple coûte 12-18 €, un dîner 30-45 €, une bière 5-7 €. Les grands musées se situent entre 20 et 25 € l'entrée, et une croisière sur les canaux entre 18 et 30 €.",
          "La location de vélo revient à 12-15 € par jour et reste le moyen le plus économique et le plus rapide de circuler. Un ticket de tram à l'unité coûte environ 3,40 €, un pass 24 h autour de 9 €.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : aucun visa n'est nécessaire, une carte d'identité valide suffit pour les Français.",
          "Paiements : beaucoup de cafés, supermarchés et boulangeries refusent les cartes de crédit et n'acceptent que le débit (Maestro ou V Pay). Gardez un peu d'espèces en secours.",
          "Vélo : les pistes cyclables sont prioritaires et très fréquentées. Ne marchez jamais sur la piste rouge, signalez vos changements de direction et attachez toujours votre vélo à un point fixe.",
          "Réservations : la maison d'Anne Frank se réserve exclusivement en ligne, plusieurs semaines à l'avance ; le Van Gogh Museum et le Rijksmuseum fonctionnent par créneaux horaires.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Deux à trois nuits suffisent largement pour les canaux, deux grands musées et un quartier hors centre comme De Pijp ou Noord.",
          "Avec quatre ou cinq nuits, ajoutez une journée à Haarlem, Utrecht ou Rotterdam, toutes à moins d'une heure de train, ou le parc floral du Keukenhof entre mi-mars et mi-mai.",
        ],
      },
    ],
  },
  {
    slug: "milan",
    city: "Milan",
    country: "Italie",
    routeSlug: "paris-milan",
    origin: "PAR",
    destination: "MIL",
    originCity: "Paris",
    title: "Que faire à Milan : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Milan : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Milan : meilleure période, quartiers à voir, budget sur place, métro et aéroports, réservation de la Cène et conseils pratiques pour les Français.",
    intro:
      "Milan se visite très bien en deux ou trois jours et sert de porte d'entrée idéale vers les lacs italiens. Voici ce qu'il faut savoir avant de réserver : saison, quartiers, budget réel et transports depuis les trois aéroports.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Euro (EUR). Carte acceptée partout, même pour les petits montants.",
      langue: "Italien. L'anglais est courant dans l'hôtellerie et le centre-ville.",
      visa: "Aucun visa : espace Schengen. Carte d'identité ou passeport valide suffisent.",
      transport:
        "Métro ATM (4 lignes), trams historiques, Malpensa Express depuis l'aéroport principal.",
      budgetJour: "80 à 130 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Milan ?",
        paragraphs: [
          "Avril-juin et septembre-octobre sont les meilleures fenêtres : 18 à 26 °C, terrasses ouvertes et lumière idéale pour les toits du Duomo. Attention aux grandes foires (Salone del Mobile en avril, Fashion Weeks en février et septembre), où les hôtels triplent parfois leurs tarifs.",
          "Juillet et août sont chauds et lourds (30 à 35 °C), et une partie des commerces ferme à la mi-août. En revanche les vols et les hôtels y sont nettement moins chers.",
          "L'hiver est froid et souvent brumeux, mais c'est la saison de la Scala, des marchés de Noël et des prix les plus bas de l'année.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Le Centro Storico rassemble le Duomo, ses terrasses panoramiques, la galerie Vittorio Emanuele II et la Scala. Comptez une demi-journée, en réservant l'accès aux toits en ligne pour éviter la file.",
          "Brera est le quartier le plus charmant pour flâner : ruelles pavées, pinacothèque, boutiques d'artisans et restaurants. Juste au nord, le Quadrilatero della Moda concentre la haute couture.",
          "Navigli, le long des canaux, est le centre de la vie nocturne et de l'aperitivo. Isola et Porta Nuova montrent le Milan contemporain, avec le Bosco Verticale et la piazza Gae Aulenti. Santa Maria delle Grazie, à l'ouest, abrite la Cène de Léonard de Vinci.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Comptez 90 à 160 € la nuit pour un hôtel confortable en centre-ville, 50 à 80 € un peu plus loin sur une ligne de métro. Les prix explosent pendant les semaines de foire, à vérifier avant de fixer vos dates.",
          "L'aperitivo est la meilleure affaire de la ville : 10 à 15 € pour un verre accompagné d'un buffet, souvent suffisant comme dîner léger. Un repas complet au restaurant revient à 25-40 €, une pizza à 9-14 €.",
          "Le billet de métro coûte environ 2,20 €, le pass journalier 7,60 €. L'entrée du Duomo avec les terrasses se situe autour de 20-30 €, la Cène autour de 15 € plus frais de réservation.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : rien de particulier, une carte d'identité valide suffit pour les Français.",
          "Aéroports : Malpensa est relié au centre par le Malpensa Express (50 minutes, environ 13 €), Linate par la ligne de métro M4 (15 minutes), Bergame-Orio al Serio par des bus directs (1 heure). Vérifiez bien l'aéroport indiqué sur votre billet, ils sont très éloignés les uns des autres.",
          "La Cène de Léonard de Vinci se réserve impérativement en ligne, souvent deux à trois mois à l'avance : les créneaux de 15 minutes partent dès leur mise en vente.",
          "Milan est la meilleure base pour les lacs : Côme est à 40 minutes de train, le lac Majeur à une heure, Bergame à 50 minutes.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Deux nuits suffisent pour le Duomo, Brera, les Navigli et un musée. Trois à quatre nuits permettent d'ajouter la Cène, le château des Sforza et une journée sur un lac.",
          "Pour une semaine, Milan se combine facilement avec Turin, Vérone ou Venise, toutes accessibles en train à grande vitesse en 1 à 2 h 30.",
        ],
      },
    ],
  },
  {
    slug: "berlin",
    city: "Berlin",
    country: "Allemagne",
    routeSlug: "paris-berlin",
    origin: "PAR",
    destination: "BER",
    originCity: "Paris",
    title: "Que faire à Berlin : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Berlin : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Berlin : quand partir, quartiers où loger, budget quotidien, U-Bahn et S-Bahn, musées à réserver et conseils pratiques pour les voyageurs français.",
    intro:
      "Berlin est une capitale étendue où tout se joue sur le choix du quartier et la maîtrise du réseau U-Bahn / S-Bahn. Voici les repères concrets avant de réserver : saison, quartiers, budget réel et formalités.",
    readingMinutes: 7,
    updated: "2026-08-31",
    practical: {
      monnaie: "Euro (EUR). Beaucoup de bars, snacks et clubs restent uniquement en espèces.",
      langue: "Allemand. L'anglais est très largement parlé, surtout dans les quartiers centraux.",
      visa: "Aucun visa : espace Schengen. Carte d'identité ou passeport valide suffisent.",
      transport:
        "U-Bahn, S-Bahn, trams et bus (réseau BVG). Un ticket AB couvre l'essentiel de la ville.",
      budgetJour: "70 à 120 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Berlin ?",
        paragraphs: [
          "De mai à septembre, la ville vit dehors : biergartens, lacs de baignade, marchés aux puces et festivals. Les températures oscillent entre 20 et 27 °C et les journées sont très longues en juin.",
          "Avril et octobre offrent des tarifs plus doux et des musées moins fréquentés, avec un temps changeant : prévoyez une veste imperméable.",
          "L'hiver est froid (souvent autour de 0 °C) et gris, mais c'est la période la moins chère, animée par les marchés de Noël et une vie culturelle intense en intérieur.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Mitte concentre l'histoire : porte de Brandebourg, Reichstag, mémorial de l'Holocauste, Unter den Linden et l'Île aux Musées. L'accès à la coupole du Reichstag est gratuit mais se réserve en ligne à l'avance.",
          "Kreuzberg et Neukölln sont les quartiers les plus vivants pour manger, sortir et voir le street art, avec l'East Side Gallery le long de la Spree.",
          "Prenzlauer Berg, au nord, est calme et familial, avec de belles rues d'immeubles rénovés et le marché du Mauerpark le dimanche. Charlottenburg, à l'ouest, offre le château, le Kurfürstendamm et des hôtels souvent moins chers.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Berlin reste l'une des capitales les plus abordables d'Europe de l'Ouest : 70 à 130 € la nuit en hôtel confortable, 30 à 60 € en auberge ou en studio hors du centre.",
          "Un currywurst ou un döner coûte 4 à 7 €, un repas au restaurant 15 à 30 €, une bière 4 à 6 €. Beaucoup de mémoriaux et de sites historiques sont gratuits.",
          "Le pass journalier BVG zone AB coûte environ 10 € ; le billet à l'unité 3,80 €. L'Île aux Musées propose un billet combiné autour de 24 € pour cinq musées.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : aucune démarche particulière, une carte d'identité valide suffit pour les Français.",
          "Espèces : gardez toujours 30 à 50 € en liquide, de nombreux établissements berlinois refusent encore la carte.",
          "Aéroport : BER est relié au centre par le S-Bahn S9 et les trains régionaux FEX en 30 à 40 minutes, avec un ticket ABC (environ 4,70 €).",
          "Transports : validez votre ticket avant de monter, les contrôles sont fréquents et l'amende s'élève à 60 €. Le réseau fonctionne toute la nuit les vendredis et samedis.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits sont un bon minimum pour Mitte, l'Île aux Musées, l'East Side Gallery et un quartier alternatif.",
          "Quatre à cinq nuits permettent d'ajouter Potsdam et le château de Sanssouci (30 minutes de S-Bahn), le mémorial de Sachsenhausen ou une journée dans les lacs du Wannsee.",
        ],
      },
    ],
  },
  {
    slug: "athenes",
    city: "Athènes",
    country: "Grèce",
    routeSlug: "paris-athenes",
    origin: "PAR",
    destination: "ATH",
    originCity: "Paris",
    title: "Que faire à Athènes : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Athènes : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Athènes : meilleure période, quartiers à voir, budget sur place, métro et ferries vers les îles, billet combiné Acropole et conseils pour les Français.",
    intro:
      "Athènes se visite en deux ou trois jours et sert de point de départ vers les îles. Voici les informations concrètes à connaître : quelle saison éviter, où loger, quel budget prévoir et comment enchaîner avec une île.",
    readingMinutes: 7,
    updated: "2026-08-31",
    practical: {
      monnaie:
        "Euro (EUR). Carte largement acceptée ; espèces utiles dans les tavernes de quartier.",
      langue: "Grec. L'anglais est très répandu dans le tourisme.",
      visa: "Aucun visa : espace Schengen. Carte d'identité ou passeport valide suffisent.",
      transport:
        "Métro (3 lignes), tram vers la côte, bus X95 depuis l'aéroport, ferries au Pirée.",
      budgetJour: "60 à 100 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Athènes ?",
        paragraphs: [
          "Avril-mai et septembre-octobre sont les meilleures périodes : 22 à 28 °C, sites archéologiques praticables toute la journée et affluence encore contenue. C'est aussi la saison où les liaisons vers les îles reprennent sans être saturées.",
          "En juillet et août, la ville dépasse souvent 35 °C et l'Acropole devient éprouvante après 11 h. Si vous venez en été, visitez à l'ouverture ou en fin d'après-midi et prévoyez de l'eau en abondance.",
          "L'hiver est doux (12 à 16 °C) et pluvieux par périodes, avec des sites quasiment vides et des tarifs très bas — mais beaucoup de ferries et d'hôtels d'îles sont fermés.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Plaka, au pied de l'Acropole, est le quartier historique le plus agréable pour loger et se promener, prolongé par Anafiotika et ses maisons blanches d'allure cycladique.",
          "Monastiraki et Psyrri concentrent le marché aux puces, les rooftops avec vue sur le Parthénon et la vie nocturne. Thissio offre la plus belle promenade piétonne au coucher du soleil.",
          "Koukaki, près du musée de l'Acropole, est résidentiel et bien situé. Pour respirer, montez sur la colline du Lycabette au coucher du soleil ou descendez en tram vers la côte, à Glyfada et Vouliagmeni.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Athènes reste abordable : 60 à 110 € la nuit pour un hôtel bien situé, 30 à 50 € en studio ou en auberge. Les hôtels avec vue sur l'Acropole se paient nettement plus cher.",
          "Un repas en taverne coûte 12 à 20 €, un souvláki 3 à 5 €, un café freddo 3 à 4 €. Le billet combiné pour l'Acropole et six sites antiques revient à environ 30 € et reste valable cinq jours.",
          "Le métro coûte 1,20 € le trajet, et le billet aéroport 9 € l'aller. Le bus X95 relie l'aéroport à Syntagma pour environ 5,50 €, jour et nuit.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : aucune démarche pour les Français, une carte d'identité valide suffit.",
          "Chaussures : les marbres de l'Acropole et les ruelles de Plaka sont glissants, privilégiez des semelles adhérentes plutôt que des sandales lisses.",
          "Ferries : les départs se font au Pirée (métro ligne 1), parfois à Rafina pour les Cyclades du nord. Prévoyez au moins 3 h 30 entre l'arrivée d'un vol et un départ de ferry.",
          "Réservations : achetez le billet de l'Acropole en ligne et présentez-vous à l'ouverture (8 h) ou après 17 h pour éviter la chaleur et les groupes de croisiéristes.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Deux nuits couvrent l'Acropole, son musée, l'Agora antique et Plaka. Trois à quatre nuits ajoutent le cap Sounion, le monastère de Dafni ou une journée de plage sur la riviera athénienne.",
          "Pour une semaine, combinez Athènes avec une ou deux îles proches accessibles en ferry rapide : Égine, Hydra et Poros sont à moins de deux heures du Pirée.",
        ],
      },
    ],
  },
  {
    slug: "vienne",
    city: "Vienne",
    country: "Autriche",
    routeSlug: "paris-vienne",
    origin: "PAR",
    destination: "VIE",
    originCity: "Paris",
    title: "Que faire à Vienne : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Vienne : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Vienne : meilleure période, quartiers à voir, budget sur place, U-Bahn, cafés historiques, opéra et conseils pratiques pour les voyageurs français.",
    intro:
      "Vienne est une capitale compacte, très bien desservie et étonnamment abordable une fois sur place. Voici les repères utiles avant de réserver : saison, quartiers, budget réel et bons réflexes pour l'opéra et les musées.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie:
        "Euro (EUR). Carte acceptée dans la plupart des commerces ; espèces encore utiles dans les cafés traditionnels.",
      langue: "Allemand. L'anglais est parlé dans le tourisme et le centre.",
      visa: "Aucun visa : espace Schengen. Carte d'identité ou passeport valide suffisent.",
      transport:
        "U-Bahn, trams (dont le Ring), bus. Le City Airport Train et le S7 relient l'aéroport au centre.",
      budgetJour: "75 à 120 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Vienne ?",
        paragraphs: [
          "Mai-juin et septembre offrent 20 à 26 °C, des parcs impeccables et une saison culturelle encore active. C'est le meilleur compromis entre météo et affluence.",
          "L'été est chaud mais agréable au bord du Danube, avec les plages urbaines de la Donauinsel ; l'opéra d'État, lui, fait relâche en juillet et août.",
          "De fin novembre à décembre, les marchés de Noël font partie des plus beaux d'Europe et les hôtels affichent complet les week-ends. Janvier et février sont froids mais très bon marché, et c'est la saison des bals.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "L'Innere Stadt, le centre historique classé, réunit la cathédrale Saint-Étienne, la Hofburg, l'Opéra et les grands cafés viennois. Le tram qui suit le Ring permet d'en faire le tour en 30 minutes pour le prix d'un ticket.",
          "Le MuseumsQuartier et la Ringstrasse concentrent le Kunsthistorisches Museum, le Leopold et l'Albertina : trois collections majeures à moins de dix minutes à pied les unes des autres.",
          "Neubau et Mariahilf sont les quartiers les plus vivants pour les boutiques et la restauration. Schönbrunn, à l'ouest, mérite une demi-journée pour le palais et ses jardins ; le Belvédère abrite Le Baiser de Klimt.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Comptez 80 à 140 € la nuit pour un hôtel confortable dans ou près du Ring, 45 à 75 € un peu plus loin sur une ligne d'U-Bahn.",
          "Un déjeuner au Gasthaus revient à 12-18 €, un dîner à 25-40 €, une Sachertorte avec un café à 10-12 €. Les musées se situent entre 15 et 20 €.",
          "Le pass transports 24 h coûte environ 8 €, la semaine 17,10 € : c'est l'un des meilleurs rapports qualité-prix d'Europe. Les places debout à l'Opéra d'État partent à 13-18 € le soir même.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : rien de spécifique pour les Français, une carte d'identité valide suffit.",
          "Aéroport : le S-Bahn S7 rejoint le centre en 25 minutes pour environ 4,30 €, le City Airport Train en 16 minutes pour 14 €. Le train est presque toujours plus rapide qu'un taxi aux heures de pointe.",
          "Cafés : dans les cafés historiques, on s'installe soi-même, on commande un Melange et l'on peut rester des heures — la note se règle au serveur, souvent en espèces.",
          "Eau : l'eau du robinet vient des Alpes et se boit sans réserve, des fontaines publiques sont réparties dans toute la ville.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits permettent de voir le centre, deux grands musées, Schönbrunn et le Belvédère sans se presser.",
          "Quatre à cinq nuits ouvrent la porte à une journée à Bratislava (1 heure de train), dans la vallée de la Wachau ou à Melk et son abbaye baroque.",
        ],
      },
    ],
  },
  {
    slug: "prague",
    city: "Prague",
    country: "Tchéquie",
    routeSlug: "paris-prague",
    origin: "PAR",
    destination: "PRG",
    originCity: "Paris",
    title: "Que faire à Prague : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Prague : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Prague : quand partir, quartiers à voir, budget sur place, couronne tchèque, tramways, pièges à touristes à éviter et conseils pour les Français.",
    intro:
      "Prague se parcourt à pied et reste l'une des capitales les moins chères d'Europe, à condition d'éviter quelques pièges classiques sur le change et les restaurants du centre. Voici l'essentiel avant de réserver.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie:
        "Couronne tchèque (CZK). Environ 1 € = 25 CZK. Refusez le change de rue et les bureaux affichant « 0 % commission ».",
      langue: "Tchèque. L'anglais est courant dans le centre, l'allemand souvent compris.",
      visa: "Aucun visa : espace Schengen. Carte d'identité ou passeport valide suffisent.",
      transport:
        "Métro (3 lignes), tramways très denses dont le 22 panoramique, bus AE depuis l'aéroport.",
      budgetJour: "50 à 90 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Prague ?",
        paragraphs: [
          "Mai-juin et septembre offrent 20 à 25 °C, des terrasses ouvertes et une lumière parfaite sur les toits de Malá Strana. C'est la meilleure période, mais aussi la plus fréquentée sur le pont Charles.",
          "Juillet et août sont chauds et très touristiques ; visitez le pont Charles avant 8 h pour l'avoir presque pour vous.",
          "De novembre à mars, il fait froid (souvent sous 0 °C) mais la ville est magnifique sous la neige, et les prix chutent en dehors de la période des marchés de Noël.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Staré Město, la vieille ville, réunit la place de la Vieille-Ville, l'horloge astronomique et le quartier juif Josefov, avec son cimetière et ses synagogues.",
          "Malá Strana et Hradčany, sur l'autre rive, mènent au château de Prague, à la cathédrale Saint-Guy et à la ruelle d'Or. Montez par les jardins plutôt que par les escaliers principaux, c'est plus calme et plus joli.",
          "Vinohrady et Žižkov sont les quartiers où mangent et sortent les Praguois, avec des prix bien plus bas qu'au centre. Le parc de Letná offre la meilleure vue d'ensemble sur les ponts de la Vltava.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Prague reste très abordable : 55 à 100 € la nuit pour un bon hôtel central, 25 à 50 € en auberge ou en appartement à Vinohrady.",
          "Un plat de brasserie coûte 8 à 14 €, une bière pression 2 à 3,50 € (moins encore hors du centre), un café 3 €. Le circuit du château de Prague se situe autour de 18 €.",
          "Les transports sont bon marché : billet 30 minutes à environ 1,20 €, pass 24 h à 4,80 €. Le bus AE relie l'aéroport à la gare centrale pour environ 4 €.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : aucune démarche pour les Français, une carte d'identité valide suffit. La Tchéquie n'a pas adopté l'euro.",
          "Change : retirez des couronnes au distributeur d'une banque et refusez systématiquement la conversion proposée par le terminal (« dynamic currency conversion »), toujours défavorable. Évitez les bureaux de change de la vieille ville.",
          "Restaurants : dans le centre, vérifiez le prix des amuse-bouches apportés spontanément à table, ils sont facturés. Le pourboire usuel est de 5 à 10 %.",
          "Transports : validez votre ticket dans la machine jaune en entrant, les contrôles sont fréquents dans le métro et les trams.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits suffisent pour la vieille ville, le château, Josefov et une soirée dans un quartier local.",
          "Quatre à cinq nuits permettent d'ajouter Kutná Hora et son ossuaire, le château de Karlštejn ou Český Krumlov, à trois heures de bus au sud.",
        ],
      },
    ],
  },
  {
    slug: "seville",
    city: "Séville",
    country: "Espagne",
    routeSlug: "paris-seville",
    origin: "PAR",
    destination: "SVQ",
    originCity: "Paris",
    title: "Que faire à Séville : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Séville : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Séville : meilleure période, quartiers à voir, budget sur place, Alcazar à réserver, tapas, flamenco et conseils pratiques pour les voyageurs français.",
    intro:
      "Séville se visite à pied, mais tout dépend de la saison : l'été andalou dépasse régulièrement 40 °C. Voici les informations concrètes avant de réserver votre vol : quand partir, où loger et quel budget prévoir.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Euro (EUR). Carte acceptée partout ; petites espèces utiles dans les bars à tapas.",
      langue: "Espagnol. L'anglais est inégalement parlé hors des sites touristiques.",
      visa: "Aucun visa : espace Schengen. Carte d'identité ou passeport valide suffisent.",
      transport: "Tout à pied dans le centre, tram T1, vélos Sevici, bus EA depuis l'aéroport.",
      budgetJour: "60 à 100 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Séville ?",
        paragraphs: [
          "Mars-mai et octobre-novembre sont les périodes idéales : 20 à 28 °C, orangers en fleur au printemps et soirées douces en terrasse.",
          "Attention aux deux grandes fêtes : la Semaine sainte et la Feria d'Abril, spectaculaires mais avec des hôtels complets et des tarifs multipliés par deux ou trois. Réservez plusieurs mois à l'avance si vous visez ces dates.",
          "De juin à septembre, la chaleur dépasse souvent 38-42 °C l'après-midi : les visites se font tôt le matin et en soirée, et une piscine devient un vrai critère de choix d'hôtel. En contrepartie, les prix baissent nettement en août.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Santa Cruz, l'ancien quartier juif, est le cœur touristique : ruelles blanches, patios fleuris, et l'accès direct à la cathédrale, à la Giralda et au Real Alcázar.",
          "Triana, de l'autre côté du Guadalquivir, est le berceau du flamenco et de la céramique, avec un marché couvert et des bars à tapas nettement moins chers.",
          "Alameda de Hércules et Macarena sont les quartiers les plus jeunes et les plus animés le soir. Le parc de María Luisa et la Plaza de España, au sud, méritent une fin d'après-midi entière.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Séville est l'une des grandes villes espagnoles les plus abordables : 60 à 110 € la nuit pour un bon hôtel de centre-ville, 35 à 60 € en appartement ou en auberge.",
          "Une tapa coûte 2,50 à 4 €, un repas complet 15 à 25 €, une caña de bière 1,50 à 2,50 €. Un spectacle de flamenco en tablao revient à 20-40 € selon la formule.",
          "Le Real Alcázar coûte environ 15 € et se réserve en ligne, la cathédrale et la Giralda 12 €. Le bus EA depuis l'aéroport coûte environ 4 € et met 35 minutes.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : aucune démarche pour les Français, une carte d'identité valide suffit.",
          "Réservations : le Real Alcázar affiche complet plusieurs jours à l'avance en haute saison ; achetez vos billets horodatés en ligne dès que vos dates sont fixées.",
          "Rythme : les restaurants servent tard (déjeuner vers 14 h, dîner à partir de 21 h) et beaucoup de commerces ferment l'après-midi en été. Adaptez votre programme à la sieste.",
          "Chaleur : en été, planifiez les visites extérieures avant 11 h et après 19 h, et gardez les musées et l'Alcázar pour l'après-midi.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits couvrent l'Alcázar, la cathédrale, Santa Cruz, Triana et une soirée flamenco.",
          "Quatre à cinq nuits permettent d'ajouter Cordoue (45 minutes en train à grande vitesse), Cadix ou Jerez. Une semaine autorise une boucle andalouse complète avec Grenade.",
        ],
      },
    ],
  },
  {
    slug: "copenhague",
    city: "Copenhague",
    country: "Danemark",
    routeSlug: "paris-copenhague",
    origin: "PAR",
    destination: "CPH",
    originCity: "Paris",
    title: "Que faire à Copenhague : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Copenhague : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Copenhague : quand partir, quartiers à voir, budget réel sur place, couronne danoise, vélo et métro, et conseils pratiques pour les voyageurs français.",
    intro:
      "Copenhague est compacte, entièrement cyclable et l'une des capitales les plus chères d'Europe : bien préparer son budget change tout. Voici les repères concrets avant de réserver votre vol.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie:
        "Couronne danoise (DKK). Environ 1 € = 7,45 DKK. Paiement par carte accepté partout, espèces quasiment inutiles.",
      langue: "Danois. L'anglais est parlé couramment par presque tout le monde.",
      visa: "Aucun visa : espace Schengen. Carte d'identité ou passeport valide suffisent.",
      transport:
        "Métro automatique 24 h/24, trains S-tog, bus et surtout vélo : la ville compte plus de pistes cyclables que de voies automobiles.",
      budgetJour: "110 à 170 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Copenhague ?",
        paragraphs: [
          "De mai à août, les journées sont très longues (jusqu'à 17 h de lumière en juin), les terrasses de Nyhavn pleines et les bains de port ouverts. C'est la meilleure saison, avec 18 à 24 °C.",
          "Avril et septembre restent agréables et moins chers, avec un temps changeant et venteux : prévoyez un coupe-vent même en été.",
          "De novembre à février, il fait froid, humide et sombre vers 16 h, mais c'est la saison du hygge, des marchés de Noël de Tivoli et des tarifs les plus bas de l'année.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Indre By, le centre, regroupe Nyhavn et ses façades colorées, la rue piétonne Strøget, le château de Rosenborg et les jardins de Tivoli.",
          "Christianshavn, sur l'eau, mêle canaux, la spirale de l'église de Notre-Sauveur et la ville libre de Christiania. Refshaleøen, juste à côté, accueille le street food market de Reffen dans d'anciens chantiers navals.",
          "Nørrebro et Vesterbro sont les quartiers les plus créatifs : cafés de spécialité, friperies, le parc Superkilen et le Meatpacking District pour les sorties du soir.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement pèse lourd : 130 à 220 € la nuit pour un hôtel correct en centre-ville, 55 à 95 € en auberge de bon niveau ou en périphérie desservie par le métro.",
          "Un smørrebrød coûte 8 à 14 €, un repas de street food 12 à 18 €, un dîner au restaurant 40 à 60 €, une bière 7 à 9 €. Les marchés couverts (Torvehallerne, Reffen) sont la meilleure façon de manger bien sans exploser le budget.",
          "La location de vélo revient à 15-20 € par jour et remplace avantageusement les transports. Un billet de métro coûte environ 3,60 €, un pass 24 h autour de 11 €. Tivoli demande environ 20 € d'entrée, hors attractions.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : aucune démarche pour les Français, une carte d'identité valide suffit. Le Danemark n'utilise pas l'euro.",
          "Paiements : tout se règle par carte, y compris les toilettes publiques et les food trucks ; inutile de retirer beaucoup d'espèces.",
          "Aéroport : le métro M2 relie Kastrup au centre en 15 minutes, pour environ 4,50 €. C'est l'un des accès aéroportuaires les plus simples d'Europe.",
          "Vélo : respectez les feux cyclistes et tendez le bras pour signaler vos intentions ; la circulation à vélo est rapide et strictement codifiée.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Deux à trois nuits suffisent pour le centre, Christianshavn, un musée et une soirée à Nørrebro ou Vesterbro.",
          "Quatre nuits permettent d'ajouter le musée d'art moderne Louisiana au bord du Sund, le château de Kronborg à Helsingør, ou une journée à Malmö en Suède, à 35 minutes de train.",
        ],
      },
    ],
  },
  {
    slug: "madrid",
    city: "Madrid",
    country: "Espagne",
    routeSlug: "paris-madrid",
    origin: "PAR",
    destination: "MAD",
    originCity: "Paris",
    title: "Que faire à Madrid : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Madrid : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Madrid : meilleure période, quartiers où loger, budget réel sur place, musées gratuits et accès depuis l'aéroport pour les voyageurs français.",
    intro:
      "Madrid se visite toute l'année, mais la chaleur de juillet-août change radicalement l'expérience. Voici les repères concrets avant de réserver : climat, quartiers, budget réel et accès depuis Barajas.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Euro (EUR).",
      langue: "Espagnol. L'anglais est répandu dans le centre et les lieux touristiques.",
      visa: "Aucun visa pour un séjour touristique, carte d'identité valide suffisante (espace Schengen).",
      transport:
        "Métro dense (13 lignes) et bus ; un abonnement touristique pluri-jours revient souvent moins cher qu'un ticket à l'unité au-delà de deux jours.",
      budgetJour: "60 à 100 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Madrid ?",
        paragraphs: [
          "Avril-mai et septembre-octobre offrent le meilleur compromis : températures autour de 20-25 °C, ciel dégagé, et une ville qui a retrouvé son rythme après l'exode estival des Madrilènes vers la côte.",
          "Juillet et août dépassent régulièrement les 35 °C en journée : la ville tourne au ralenti l'après-midi, beaucoup de commerces ferment plus tôt, et la vie se déplace vers le soir. Un vrai choix de voyage, pas seulement une question de tarif.",
          "Décembre-janvier hors fêtes de fin d'année reste une période abordable, avec des journées fraîches mais rarement froides pour une capitale européenne.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Sol, Austrias et Palacio concentrent l'essentiel du Madrid historique : la Plaza Mayor, le Palais royal et les ruelles pavées du vieux Madrid se couvrent aisément à pied en une journée.",
          "Le triangle de l'art (Prado, Reina Sofía, Thyssen-Bornemisza) mérite une journée à lui seul ; les trois musées offrent des créneaux gratuits en fin de journée, plusieurs jours par semaine.",
          "Pour l'ambiance locale, Malasaña et Chueca rassemblent bars et boutiques indépendantes, La Latina est le rendez-vous du tapeo dominical, et Retiro offre le grand parc où les Madrilènes eux-mêmes passent leurs après-midi.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement reste abordable pour une capitale européenne : 60-100 € la nuit pour un hôtel correct en centre-ville, 25-40 € en auberge. Les prix grimpent nettement pendant la Semaine sainte et les grands événements sportifs.",
          "Un menu du jour dans une taverne de quartier revient à 12-15 € boisson comprise, un dîner de tapas partagées à 20-30 € par personne. Les trois grands musées d'art proposent des horaires d'entrée gratuite plusieurs soirs par semaine.",
          "Les transports coûtent environ 1,50 à 2 € le trajet en métro, ou 8 € pour un abonnement touristique d'une journée si vous multipliez les déplacements.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Horaires : beaucoup de commerces ferment entre 14 h et 17 h, notamment en été. Les dîners commencent tard, souvent après 21 h — inutile de chercher un restaurant plein à 19 h30.",
          "Depuis l'aéroport : la ligne 8 du métro rejoint Nuevos Ministerios en une vingtaine de minutes, le bus express Aeropuerto dessert le centre toute la nuit pour un tarif équivalent.",
          "Sécurité : le vol à la tire existe dans les zones très touristiques (Sol, Plaza Mayor, transports bondés) — rien d'alarmant avec les précautions habituelles.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits couvrent le centre historique, le triangle de l'art et un quartier plus local comme Malasaña ou La Latina.",
          "Cinq nuits laissent le temps d'ajouter une excursion à la journée : Tolède ou Ségovie sont à moins d'une heure en train à grande vitesse.",
        ],
      },
    ],
  },
  {
    slug: "dublin",
    city: "Dublin",
    country: "Irlande",
    routeSlug: "paris-dublin",
    origin: "PAR",
    destination: "DUB",
    originCity: "Paris",
    title: "Que faire à Dublin : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Dublin : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Dublin : meilleure période, quartiers où loger, budget réel sur place, accès depuis l'aéroport et formalités pour les voyageurs français.",
    intro:
      "Dublin se visite toute l'année sous un climat changeant, mais le budget sur place varie moins selon la saison que dans la plupart des capitales : c'est une ville chère toute l'année. Voici les repères concrets avant de réserver.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Euro (EUR).",
      langue: "Anglais (et irlandais, langue officielle mais peu utilisée au quotidien).",
      visa: "Pas de visa pour un séjour touristique ; carte d'identité valide suffisante malgré l'absence de l'Irlande dans l'espace Schengen.",
      transport:
        "Pas de métro : bus, tram Luas et trains DART pour la côte. Le centre se parcourt largement à pied.",
      budgetJour:
        "70 à 120 € par personne et par jour, hébergement compris — l'Irlande est plus chère que la moyenne européenne.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Dublin ?",
        paragraphs: [
          "Mai à septembre offre les journées les plus longues et les meilleures chances de temps sec, sans que la pluie soit jamais totalement exclue — c'est une réalité du climat irlandais à intégrer plutôt qu'à espérer éviter.",
          "La mi-mars, autour de la Saint-Patrick, concentre une forte affluence et des prix élevés sur les vols comme sur les hôtels : à réserver bien à l'avance si vous visez spécifiquement cette période, ou à éviter si vous cherchez un tarif bas.",
          "L'hiver reste doux pour une latitude nordique (rarement sous 0 °C) mais avec des journées très courtes dès décembre — compensé par des tarifs de vol et d'hôtel nettement plus bas.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Temple Bar et le Trinity College concentrent l'image touristique de Dublin — à voir, mais pas à y baser tout son séjour : les pubs y sont plus chers qu'ailleurs en ville.",
          "Georgian Dublin (autour de Merrion Square et St Stephen's Green) offre l'architecture géorgienne caractéristique et plusieurs musées gratuits, dont la National Gallery.",
          "Pour l'ambiance locale, le quartier de Stoneybatter et le marché de Smithfield attirent une clientèle plus dublinoise, et une balade côtière vers Howth ou Dún Laoghaire (accessible en DART) change agréablement du centre.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement est le poste qui surprend le plus les visiteurs français : comptez 100-160 € la nuit pour un hôtel correct en centre-ville, 35-50 € en auberge — sensiblement plus qu'à Paris sur des standards équivalents.",
          "Une pinte de bière revient à 6-7 €, un repas simple au pub à 15-20 €, un dîner au restaurant à 30-40 € par personne. La visite de la Guinness Storehouse ou de la distillerie Jameson coûte 25-30 € mais inclut une dégustation.",
          "Les transports en bus ou Luas coûtent 2-3 € le trajet ; une carte Leap (rechargeable) réduit sensiblement le tarif par rapport à un ticket papier.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : aucune liaison ferrée directe. Les navettes Aircoach et Airlink Express rejoignent le centre en trente à quarante-cinq minutes pour 7 à 10 € l'aller.",
          "Argent : la carte bancaire est acceptée quasiment partout, y compris pour de très petits montants ; peu d'intérêt à retirer beaucoup d'espèces.",
          "Météo : un vêtement de pluie léger et une veste chaude sont utiles toute l'année, même en plein été.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Deux à trois nuits suffisent pour le centre historique, Temple Bar, Trinity College et un musée.",
          "Quatre à cinq nuits permettent d'ajouter une excursion à la journée vers les falaises de Howth, le comté de Wicklow, ou une location de voiture vers la côte ouest et la Chaussée des Géants (plus loin, à prévoir sur plusieurs jours).",
        ],
      },
    ],
  },
  {
    slug: "munich",
    city: "Munich",
    country: "Allemagne",
    routeSlug: "paris-munich",
    origin: "PAR",
    destination: "MUC",
    originCity: "Paris",
    title: "Que faire à Munich : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Munich : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Munich : meilleure période, quartiers où loger, budget réel sur place, Oktoberfest et accès depuis l'aéroport pour les voyageurs français.",
    intro:
      "Munich se visite agréablement une bonne partie de l'année, mais un seul événement bouleverse le calendrier des prix : l'Oktoberfest. Voici les repères concrets avant de réserver, que vous visiez la fête ou que vous préfériez l'éviter.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Euro (EUR).",
      langue: "Allemand. L'anglais est bien maîtrisé, notamment par les jeunes générations.",
      visa: "Aucun visa pour un séjour touristique, carte d'identité valide suffisante (espace Schengen).",
      transport:
        "S-Bahn, U-Bahn, tram et bus formant un réseau dense ; un billet de zone unique est valable sur tous les modes.",
      budgetJour: "70 à 110 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Munich ?",
        paragraphs: [
          "Mai-juin et la première quinzaine de septembre offrent le meilleur compromis météo : journées douces, jardins et biergartens en pleine activité, sans les prix de l'Oktoberfest.",
          "De la mi-septembre à début octobre, l'Oktoberfest transforme la ville : ambiance unique, mais hôtels complets des mois à l'avance et prix des vols nettement plus élevés. À prévoir tôt si vous visez cette période.",
          "L'hiver est froid mais les marchés de Noël (fin novembre à fin décembre) offrent une ambiance particulière pour un budget de vol souvent plus bas qu'en saison touristique classique.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "L'Altstadt (vieille ville), autour de Marienplatz et de son hôtel de ville néogothique, concentre l'essentiel des sites historiques et se visite entièrement à pied.",
          "Schwabing, quartier étudiant et bohème, et l'Englischer Garten (l'un des plus grands parcs urbains d'Europe, plus vaste que Central Park) offrent une respiration verte à quelques minutes du centre.",
          "Le quartier de Glockenbachviertel, au sud du centre, rassemble une scène de bars et restaurants plus locale, loin des adresses les plus touristiques.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement est cher pour l'Allemagne, surtout à l'approche de l'Oktoberfest où les prix peuvent tripler : hors cette période, comptez 90-140 € la nuit pour un hôtel correct en centre-ville, 30-45 € en auberge.",
          "Un repas dans une brasserie traditionnelle revient à 15-20 €, une chope de bière à 5-6 €. Les biergartens permettent souvent d'apporter son propre pique-nique tant qu'on y achète une boisson — une habitude locale à connaître.",
          "Les transports coûtent environ 3,60 € le trajet simple en zone centrale, ou autour de 8,80 € pour un billet journée valable sur tout le réseau.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : les S-Bahn S1 et S8 rejoignent la gare centrale en quarante à quarante-cinq minutes pour environ 13 € avec le billet de zone adapté.",
          "Horaires : les commerces ferment tôt le dimanche (souvent fermés) et vers 20 h en semaine — les restaurants restent ouverts plus tard.",
          "Validation des titres de transport : les tickets s'oblitèrent soi-même avant le trajet ; un contrôle sans titre valide entraîne une amende, même par mégarde.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Deux à trois nuits couvrent l'Altstadt, l'Englischer Garten et un musée (la Pinacothèque ou le Deutsches Museum).",
          "Quatre nuits ou plus permettent une excursion à la journée vers le château de Neuschwanstein ou les Alpes bavaroises, à environ deux heures de train.",
        ],
      },
    ],
  },
  {
    slug: "porto",
    city: "Porto",
    country: "Portugal",
    routeSlug: "paris-porto",
    origin: "PAR",
    destination: "OPO",
    originCity: "Paris",
    title: "Que faire à Porto : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Porto : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Porto : meilleure période, quartiers où loger, budget réel sur place, caves de vin de Porto et accès depuis l'aéroport pour les voyageurs français.",
    intro:
      "Porto reste l'une des capitales les plus abordables d'Europe de l'Ouest, avec un climat plus doux que Lisbonne l'été et un accès aéroport particulièrement simple. Voici les repères concrets avant de réserver.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Euro (EUR).",
      langue: "Portugais. L'anglais est courant dans les zones touristiques.",
      visa: "Aucun visa pour un séjour touristique, carte d'identité valide suffisante (espace Schengen).",
      transport:
        "Métro léger, bus et le tram historique (ligne 1) le long du Douro ; centre historique vallonné, à parcourir à pied avec de bonnes chaussures.",
      budgetJour: "45 à 75 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Porto ?",
        paragraphs: [
          "Mai-juin et septembre-octobre offrent des températures agréables (20-25 °C) sans la chaleur ni l'affluence du cœur de l'été, avec des tarifs de vol et d'hôtel encore raisonnables.",
          "Juillet-août restent plus chauds et plus chers, mais nettement moins que Lisbonne à la même période — une bonne alternative si vos dates sont fixées sur l'été.",
          "L'hiver est doux comparé au reste de l'Europe (rarement sous 8-10 °C en journée) et propose les tarifs les plus bas de l'année, avec un risque de pluie plus élevé qu'en saison sèche.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "La Ribeira, classée à l'UNESCO, longe le Douro avec ses maisons colorées superposées : c'est le cœur touristique, à voir tôt le matin ou en fin de journée pour éviter l'affluence.",
          "Vila Nova de Gaia, sur l'autre rive, rassemble les grandes caves de vin de Porto (Sandeman, Graham's, Taylor's) qui proposent des visites avec dégustation.",
          "Le quartier de Bonfim et la rue de Cedofeita offrent une scène plus locale, boutiques indépendantes et cafés, à dix minutes à pied du centre historique.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement reste très abordable pour l'Europe de l'Ouest : 50-80 € la nuit pour un hôtel correct en centre-ville, 20-30 € en auberge, avec une hausse sensible en juillet-août.",
          "Un repas complet avec vin de Porto revient à 15-20 € dans une taverne de quartier, un menu de fruits de mer plus soigné à 25-35 €. Les visites de caves avec dégustation coûtent généralement 15-20 €.",
          "Les transports coûtent environ 2 € le trajet en métro ou tram, ou 7 € pour un abonnement touristique d'une journée.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : la ligne violette (E) du métro relie directement l'aéroport Francisco-Sá-Carneiro au centre en une quarantaine de minutes pour environ 2 € — l'un des transferts aéroport les moins chers d'Europe.",
          "Terrain : le centre historique est très vallonné, avec des pavés parfois glissants par temps humide — prévoyez des chaussures adaptées plutôt qu'un plan de métro.",
          "Vin de Porto : les caves de Vila Nova de Gaia offrent souvent une vue sur la Ribeira aussi belle que le vin lui-même — réservez la visite en fin d'après-midi pour le coucher de soleil sur le fleuve.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Deux à trois nuits couvrent la Ribeira, Vila Nova de Gaia et une visite de cave.",
          "Quatre à cinq nuits permettent une excursion à la journée vers la vallée du Douro (vignobles en terrasses) ou vers Braga et Guimarães, toutes deux à moins d'une heure de train.",
        ],
      },
    ],
  },
  {
    slug: "budapest",
    city: "Budapest",
    country: "Hongrie",
    routeSlug: "paris-budapest",
    origin: "PAR",
    destination: "BUD",
    originCity: "Paris",
    title: "Que faire à Budapest : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Budapest : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Budapest : meilleure période, quartiers où loger, budget réel sur place, bains thermaux et accès depuis l'aéroport pour les voyageurs français.",
    intro:
      "Budapest reste l'une des capitales les moins chères d'Europe, avec un patrimoine architectural dense des deux côtés du Danube. Voici les repères concrets avant de réserver : climat, quartiers, budget réel et devise locale.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie:
        "Forint hongrois (HUF), pas l'euro. Environ 1 € = 400 HUF. Cartes bancaires largement acceptées.",
      langue:
        "Hongrois. L'anglais et l'allemand sont répandus dans le centre et les lieux touristiques.",
      visa: "Aucun visa pour un séjour touristique, carte d'identité valide suffisante (espace Schengen).",
      transport:
        "Métro (4 lignes, dont la ligne 1 historique classée UNESCO), tram et bus ; ticket à la journée très abordable.",
      budgetJour: "35 à 60 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Budapest ?",
        paragraphs: [
          "Mai-juin et septembre offrent le meilleur compromis météo, entre chaleur estivale parfois écrasante (30 °C et plus en juillet-août) et froid marqué en hiver (souvent sous 0 °C en janvier).",
          "Les bains thermaux extérieurs comme Széchenyi se visitent toute l'année, y compris en hiver où l'eau chaude sous la neige offre une expérience particulière.",
          "Les prix des vols restent globalement modérés toute l'année, avec une hausse sensible autour du Nouvel An et pendant les grands marchés de Noël (décembre).",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Buda, côté colline, concentre le château, le quartier du Château et Fisherman's Bastion avec vue panoramique sur le Danube et le Parlement.",
          "Pest, côté plat, rassemble le Parlement néogothique, la grande synagogue et le quartier juif (Jewish Quarter), devenu le cœur de la vie nocturne avec ses fameux « ruin bars » installés dans des bâtiments à l'abandon réaménagés.",
          "Le pont des Chaînes (Széchenyi Lánchíd), illuminé le soir, relie les deux rives et offre l'une des plus belles vues de la ville, à traverser à pied au coucher du soleil.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement est l'un des moins chers des grandes capitales européennes : 40-70 € la nuit pour un hôtel correct en centre-ville, 15-25 € en auberge.",
          "Un repas au restaurant revient à 8-12 €, une entrée aux bains thermaux (Széchenyi, Gellért, Rudas) à 15-20 € avec accès à la journée. Un « ruin bar » propose des boissons à des tarifs nettement inférieurs à l'Europe de l'Ouest.",
          "Les transports coûtent environ 1,50 € le trajet unique, ou 5-6 € pour un billet journée valable sur tout le réseau.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : le bus express 100E relie l'aéroport Ferenc-Liszt au centre (Deák Ferenc tér) en trente à quarante minutes pour environ 6 € ; il n'y a pas de liaison ferrée directe.",
          "Monnaie : pensez à vérifier le taux de change du forint avant de comparer les prix affichés sur place — les cartes bancaires françaises fonctionnent sans souci, avec des frais variables selon les banques.",
          "Bains thermaux : prévoyez maillot de bain et bonnet de bain (parfois obligatoire ou en location sur place) pour les grands bains historiques.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits couvrent Buda, Pest, une session de bains thermaux et le quartier juif.",
          "Quatre à cinq nuits permettent d'ajouter une croisière sur le Danube au coucher du soleil ou une excursion à la journée vers le lac Balaton ou la ville de Szentendre.",
        ],
      },
    ],
  },
  {
    slug: "seoul",
    city: "Séoul",
    country: "Corée du Sud",
    routeSlug: "paris-seoul",
    origin: "PAR",
    destination: "ICN",
    originCity: "Paris",
    title: "Que faire à Séoul : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Séoul : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Séoul : meilleure période, quartiers à voir, budget réel sur place, K-ETA et accès depuis l'aéroport d'Incheon pour les voyageurs français.",
    intro:
      "Séoul mélange palais historiques et modernité vertigineuse, avec un budget sur place étonnamment raisonnable pour une capitale asiatique. Voici les repères concrets avant de réserver : climat, quartiers, formalités et budget réel.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie:
        "Won sud-coréen (KRW). Cartes bancaires largement acceptées, y compris dans le métro.",
      langue:
        "Coréen. L'anglais est limité hors zones touristiques ; les applications de traduction sont très utiles.",
      visa: "Aucun visa pour un séjour touristique de moins de 90 jours, mais autorisation électronique K-ETA obligatoire avant le départ.",
      transport:
        "Métro dense et ponctuel, signalé en anglais ; carte T-money rechargeable utilisable aussi en bus et taxi.",
      budgetJour: "50 à 90 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Séoul ?",
        paragraphs: [
          "Avril-mai (floraison des cerisiers) et septembre-novembre (couleurs d'automne) offrent le meilleur compromis météo, avec des températures douces et un ciel généralement dégagé — mais aussi la plus forte affluence touristique.",
          "L'été (juillet-août) est chaud et humide, avec une saison des pluies (mangma) qui peut gâcher plusieurs jours de visite. L'hiver est froid et sec, avec des tarifs de vol et d'hôtel plus intéressants hors Nouvel An lunaire.",
          "Le Nouvel An lunaire (fin janvier ou février selon les années) voit de nombreux commerces et restaurants fermer plusieurs jours : à vérifier avant de caler un séjour court sur cette période.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Bukchon Hanok Village et Insadong concentrent le Séoul historique : maisons traditionnelles, palais Gyeongbokgung et boutiques d'artisanat, à parcourir tôt le matin pour éviter les groupes.",
          "Myeongdong et Hongdae offrent le Séoul commerçant et étudiant : cosmétique coréenne, street food et vie nocturne animée, particulièrement le week-end.",
          "Gangnam, au sud de la rivière Han, montre la face la plus moderne de la ville : gratte-ciels, boutiques de luxe et scène de la K-pop, à quinze minutes de métro du centre historique.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement reste abordable : 50-90 € la nuit pour un hôtel correct, 20-30 € en guesthouse. Les prix grimpent nettement pendant les vacances scolaires coréennes et le Nouvel An lunaire.",
          "La street food et les petits restaurants locaux permettent de manger pour 5-10 € par repas ; un dîner de barbecue coréen (gogigui) revient à 15-25 € par personne, souvent partagé.",
          "Les transports coûtent environ 1 à 1,50 € le trajet en métro avec la carte T-money, qui offre aussi des correspondances gratuites entre métro et bus dans un délai donné.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : le train AREX direct rejoint la gare de Séoul en 43 minutes pour environ 9 €, avec une version omnibus plus lente et moins chère desservant plus d'arrêts.",
          "Connexion : une carte SIM ou un boîtier wifi portable à louer à l'aéroport facilite grandement la navigation, les applications de plan locales (Naver Map, KakaoMap) étant plus fiables que Google Maps sur place.",
          "Paiement : les cartes bancaires internationales fonctionnent presque partout, y compris pour de très petits montants.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois à quatre nuits couvrent les palais, Bukchon, Myeongdong et Gangnam sans courir.",
          "Une semaine permet d'ajouter une excursion à la zone démilitarisée (DMZ) ou un aller-retour à Busan en train à grande vitesse (environ 2 h 30).",
        ],
      },
    ],
  },
  {
    slug: "hong-kong",
    city: "Hong Kong",
    country: "Hong Kong",
    routeSlug: "paris-hong-kong",
    origin: "PAR",
    destination: "HKG",
    originCity: "Paris",
    title: "Que faire à Hong Kong : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Hong Kong : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Hong Kong : meilleure période, quartiers à voir, budget réel sur place, accès depuis l'aéroport et formalités pour les voyageurs français.",
    intro:
      "Hong Kong compresse gratte-ciels, marchés traditionnels et nature environnante sur un territoire réduit, avec l'un des réseaux de transport les plus efficaces d'Asie. Voici les repères concrets avant de réserver.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Dollar de Hong Kong (HKD).",
      langue:
        "Cantonais et anglais, tous deux langues officielles ; l'anglais est largement compris dans le tourisme et les affaires.",
      visa: "Aucun visa pour un séjour touristique de moins de 90 jours, passeport valide suffisant.",
      transport:
        "Métro MTR très dense, ferries Star Ferry entre Hong Kong Island et Kowloon ; carte Octopus rechargeable pour tous les modes.",
      budgetJour:
        "60 à 100 € par personne et par jour, hébergement compris — l'une des villes les plus chères d'Asie côté logement.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Hong Kong ?",
        paragraphs: [
          "Octobre à décembre offre le climat le plus agréable : températures modérées, faible humidité et ciel généralement dégagé, la meilleure fenêtre pour marcher en ville et randonner sur les sentiers environnants.",
          "Juin à septembre concentre chaleur, humidité extrême et risque de typhons, qui peuvent perturber vols et ferries à court préavis.",
          "Le Nouvel An chinois (fin janvier ou février selon les années) fait grimper les prix et ferme de nombreux commerces locaux plusieurs jours — à connaître avant de fixer un court séjour sur cette période.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Central et Victoria Peak, côté île de Hong Kong, offrent gratte-ciels, marchés nocturnes et la vue panoramique la plus connue de la ville, accessible en tram à crémaillère.",
          "Tsim Sha Tsui, côté Kowloon, longe la baie avec sa promenade et sa vue sur la skyline de Central, particulièrement spectaculaire au coucher du soleil et lors du spectacle lumineux nocturne.",
          "Mong Kok et ses marchés (marché de nuit de Temple Street, marché aux oiseaux, marché aux fleurs) offrent l'ambiance la plus locale, loin des zones les plus touristiques.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement est l'un des postes les plus chers d'Asie : comptez 80-130 € la nuit pour un hôtel correct, rarement moins de 50 € même en formule simple.",
          "En revanche, la restauration de rue et les cha chaan teng (cantines locales) permettent de manger pour 4-8 € le repas, un vrai contraste avec le prix de l'hébergement.",
          "Les transports sont très abordables : 1 à 2 € le trajet en MTR avec la carte Octopus, qui fonctionne aussi dans les bus, trams et certains commerces.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : l'Airport Express relie Hong Kong International à la gare Central en 24 minutes pour environ 12 €, l'un des transferts les plus rapides d'Asie.",
          "Le Star Ferry, entre Hong Kong Island et Kowloon, reste l'un des trajets les moins chers et les plus pittoresques de la ville pour moins d'un euro.",
          "Randonnée : malgré son image urbaine, Hong Kong compte de nombreux sentiers bien balisés (Dragon's Back notamment) accessibles en moins d'une heure de transport depuis le centre.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits couvrent Central, Victoria Peak, Tsim Sha Tsui et un marché nocturne.",
          "Quatre à cinq nuits permettent d'ajouter une randonnée, une île extérieure (Lamma ou Cheung Chau) ou une excursion à Macao, à environ une heure de ferry.",
        ],
      },
    ],
  },
  {
    slug: "montreal",
    city: "Montréal",
    country: "Canada",
    routeSlug: "paris-montreal",
    origin: "PAR",
    destination: "YUL",
    originCity: "Paris",
    title: "Que faire à Montréal : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Montréal : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Montréal : meilleure période, quartiers à voir, budget réel sur place, accès depuis l'aéroport et formalités pour les voyageurs français.",
    intro:
      "Montréal offre un dépaysement nord-américain à seulement sept heures et demie de vol, sans barrière de langue. Le climat change radicalement selon la saison : voici les repères concrets avant de réserver.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Dollar canadien (CAD).",
      langue:
        "Français (majoritaire) et anglais. La quasi-totalité des Montréalais parlent les deux.",
      visa: "Aucun visa pour un séjour touristique de moins de 6 mois, mais autorisation de voyage électronique (AVE) obligatoire avant l'embarquement.",
      transport:
        "Métro à 4 lignes, bus et réseau piéton souterrain (la « ville souterraine ») utile en hiver.",
      budgetJour: "60 à 100 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Montréal ?",
        paragraphs: [
          "Mai-juin et septembre-octobre (couleurs d'automne, l'un des plus beaux spectacles naturels de la région) offrent le meilleur compromis météo et prix, avec des températures douces et une ville en pleine activité.",
          "L'été (juillet-août) est agréable, autour de 25 °C, mais concentre la haute saison touristique et de nombreux festivals qui font grimper les prix d'hébergement.",
          "L'hiver descend régulièrement sous -10 °C, avec de la neige de décembre à mars : une expérience à part entière si elle est anticipée (vêtements adaptés), mais qui n'est pas pour tout le monde.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Le Vieux-Montréal, pavés et architecture du 17e siècle au bord du Saint-Laurent, concentre l'essentiel du patrimoine historique et se visite bien à pied.",
          "Le Plateau Mont-Royal et le Mile End offrent l'ambiance la plus locale : maisons en rangée avec escaliers extérieurs caractéristiques, cafés indépendants et bagels montréalais.",
          "Le parc du Mont-Royal, accessible à pied ou en bus depuis le centre, offre la meilleure vue panoramique sur la ville, particulièrement recherchée à l'automne pour les couleurs.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement en centre-ville revient à 90-140 € la nuit pour un hôtel correct, 30-45 € en auberge, avec une forte hausse pendant les festivals d'été.",
          "Un repas simple (poutine, smoked meat) coûte 10-15 €, un dîner au restaurant 25-40 € par personne. Les taxes ne sont pas incluses dans les prix affichés au Canada — pensez à ajouter environ 15 % à l'addition finale.",
          "Les transports coûtent environ 2,50 € le trajet unique en métro ou bus, avec des forfaits journée ou plusieurs jours plus avantageux pour un séjour de quelques jours.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : le bus 747, disponible 24 h/24, relie Montréal-Trudeau au centre-ville en quarante-cinq à soixante minutes pour environ 7 €.",
          "Pourboire : contrairement à la France, le pourboire (15-20 % de l'addition) est attendu au restaurant et dans les bars, en plus des taxes ajoutées à la caisse.",
          "Hiver : prévoyez des vêtements réellement adaptés au froid (pas seulement une veste parisienne) si vous voyagez de décembre à mars — le réseau souterrain permet néanmoins d'éviter une grande partie du froid en ville.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits couvrent le Vieux-Montréal, le Plateau et le Mont-Royal.",
          "Cinq nuits ou plus permettent une excursion à Québec (environ 3 h de route ou de train) ou dans les Laurentides pour la nature environnante.",
        ],
      },
    ],
  },
  {
    slug: "los-angeles",
    city: "Los Angeles",
    country: "États-Unis",
    routeSlug: "paris-los-angeles",
    origin: "PAR",
    destination: "LAX",
    originCity: "Paris",
    title: "Que faire à Los Angeles : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Los Angeles : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Los Angeles : meilleure période, quartiers à voir, budget réel sur place, ESTA et déplacements pour les voyageurs français.",
    intro:
      "Los Angeles s'étend sur une surface immense, ce qui change fondamentalement la façon d'organiser un séjour par rapport à une capitale européenne compacte. Voici les repères concrets avant de réserver : climat, quartiers, déplacements et budget réel.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Dollar américain (USD).",
      langue: "Anglais. L'espagnol est également très répandu.",
      visa: "Aucun visa pour un séjour touristique de moins de 90 jours, mais autorisation ESTA obligatoire avant le départ.",
      transport:
        "Métro léger et bus limités ; la location de voiture reste la solution la plus pratique vu l'étalement de la ville.",
      budgetJour: "80 à 130 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Los Angeles ?",
        paragraphs: [
          "Le climat reste doux presque toute l'année sur la côte, ce qui rend le choix des dates moins critique que dans la plupart des destinations. Avril-mai et septembre-novembre évitent la foule et la chaleur des vallées intérieures en plein été.",
          "L'été (juin-août) reste agréable en bord de mer mais peut être étouffant à l'intérieur des terres (Hollywood, Downtown), avec une brume matinale fréquente sur la côte (le « June gloom »).",
          "L'hiver (décembre-février) est la saison des pluies occasionnelles, rares mais parfois intenses, sans jamais approcher le froid européen.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Santa Monica et Venice Beach offrent l'image balnéaire de Los Angeles : plage, jetée historique et promenade animée, à privilégier pour se loger si vous voulez marcher sans voiture.",
          "Hollywood et les studios (Universal, Warner Bros) concentrent l'attrait cinéma, à trente minutes de route de la côte selon le trafic.",
          "Downtown LA, en pleine transformation, mélange gratte-ciels, marché couvert historique (Grand Central Market) et scène artistique émergente, moins touristique que les autres quartiers.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement varie énormément selon le quartier : 100-180 € la nuit en zone touristique côtière, parfois moins en s'éloignant légèrement du bord de mer.",
          "La restauration de rue et les food trucks, très présents à Los Angeles, permettent de manger pour 10-15 € ; un repas au restaurant classique revient à 25-40 € par personne, taxes et pourboire (15-20 %) non inclus dans le prix affiché.",
          "La location de voiture est quasiment indispensable : comptez 40-70 € par jour selon la catégorie, en plus du carburant et du stationnement souvent payant en ville.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : les navettes FlyAway rejoignent Union Station (centre) et Van Nuys ; sans voiture de location, prévoyez un VTC pour la plupart des trajets.",
          "Distances : ne sous-estimez pas les temps de trajet en voiture, qui peuvent doubler aux heures de pointe (7 h-9 h et 16 h-19 h) même sur de courtes distances.",
          "Pourboire et taxes : comme dans le reste des États-Unis, les prix affichés n'incluent ni taxe ni pourboire, à ajouter mentalement (environ 25-30 % au total) à chaque addition.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Quatre nuits permettent de couvrir Santa Monica, Hollywood et Downtown sans excès de route chaque jour.",
          "Une semaine ou plus laisse le temps d'ajouter une excursion à San Diego ou dans le désert (Joshua Tree, Palm Springs), à deux à trois heures de route.",
        ],
      },
    ],
  },
  {
    slug: "le-caire",
    city: "Le Caire",
    country: "Égypte",
    routeSlug: "paris-le-caire",
    origin: "PAR",
    destination: "CAI",
    originCity: "Paris",
    title: "Que faire au Caire : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire au Caire : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Le Caire : meilleure période, pyramides de Gizeh, budget réel sur place, visa et conseils pratiques pour les voyageurs français.",
    intro:
      "Le Caire est l'une des destinations dépaysantes les plus rapides à atteindre depuis Paris, à quatre heures et demie de vol. La chaleur estivale extrême pousse la plupart des visiteurs vers l'automne, l'hiver ou le printemps. Voici les repères concrets avant de réserver.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Livre égyptienne (EGP).",
      langue: "Arabe. L'anglais est répandu dans le tourisme.",
      visa: "Visa obligatoire pour les Français, à obtenir en ligne avant le départ (e-visa) ou à l'arrivée à l'aéroport contre paiement.",
      transport:
        "Pas de liaison ferrée directe depuis l'aéroport : taxi ou VTC. Le Caire dispose d'un métro utile pour se déplacer en ville.",
      budgetJour: "30 à 55 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Le Caire ?",
        paragraphs: [
          "Octobre à avril offre des températures nettement plus vivables, entre 18 et 28 °C en journée, idéales pour visiter les pyramides de Gizeh et marcher en ville sans souffrir de la chaleur.",
          "L'été (juin-août) dépasse régulièrement les 35-40 °C, rendant les visites extérieures difficiles en milieu de journée. Si vous voyagez à cette période, prévoyez les sorties tôt le matin ou en fin d'après-midi.",
          "Le Ramadan change le rythme de la ville (horaires de restaurants et de commerces modifiés, ambiance particulière le soir à la rupture du jeûne) : une expérience culturelle en soi, mais à anticiper dans l'organisation des repas en journée.",
        ],
      },
      {
        heading: "Que voir en priorité",
        paragraphs: [
          "Les pyramides de Gizeh et le Sphinx, à la périphérie de la ville, restent l'incontournable absolu — prévoyez une matinée entière et un guide ou un chauffeur fiable pour éviter le rabattage insistant fréquent sur le site.",
          "Le musée égyptien de la place Tahrir (ou le nouveau Grand Egyptian Museum, à proximité des pyramides) rassemble les collections pharaoniques, dont le trésor de Toutânkhamon.",
          "Le Caire islamique et le quartier de Khan el-Khalili offrent mosquées historiques, ruelles animées et le grand souk traditionnel, à explorer à pied avec de la prudence sur ses effets personnels.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Le Caire est l'une des destinations les plus abordables au départ de Paris : un repas dans un restaurant local revient à 5-10 €, une chambre correcte en hôtel à 30-60 € la nuit.",
          "Les entrées de sites (pyramides, musées) représentent un poste à part entière : comptez 15-30 € par site majeur, davantage pour les accès spéciaux (intérieur d'une pyramide, par exemple).",
          "Un guide ou chauffeur privé à la journée, courant et recommandé pour les pyramides et Le Caire islamique, coûte généralement 30-50 € — souvent rentable pour éviter les arnaques touristiques les plus fréquentes.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Visa : demandez l'e-visa en ligne avant le départ plutôt qu'à l'arrivée, pour éviter la file et avoir une trace écrite de votre autorisation d'entrée.",
          "Négociation : les prix ne sont pas toujours fixes, notamment dans les souks et pour les taxis non officiels — convenir du prix avant de monter dans un taxi reste la règle de base.",
          "Tenue vestimentaire : des épaules et jambes couvertes sont recommandées, en particulier pour visiter les mosquées, où un foulard peut être demandé aux femmes.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits suffisent pour les pyramides, le musée égyptien et Le Caire islamique.",
          "Cinq nuits ou plus permettent d'ajouter une extension vers Louxor et la vallée des Rois, généralement en vol intérieur court depuis Le Caire.",
        ],
      },
    ],
  },
  {
    slug: "dakar",
    city: "Dakar",
    country: "Sénégal",
    routeSlug: "paris-dakar",
    origin: "PAR",
    destination: "DKR",
    originCity: "Paris",
    title: "Que faire à Dakar : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Dakar : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Dakar : meilleure période, île de Gorée, budget réel sur place, formalités et accès depuis l'aéroport pour les voyageurs français.",
    intro:
      "Dakar mélange front de mer atlantique, marchés animés et un passé historique dense, à moins de six heures de vol de Paris. Voici les repères concrets avant de réserver : climat, incontournables et budget réel.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Franc CFA (XOF), indexé sur l'euro à taux fixe.",
      langue: "Français (langue officielle) et wolof, très parlé au quotidien.",
      visa: "Aucun visa pour un séjour touristique, le Sénégal ayant supprimé cette obligation pour toutes les nationalités. Passeport valide requis.",
      transport:
        "Pas de métro : taxis (à négocier ou via application) et cars rapides locaux. Le centre se visite en partie à pied.",
      budgetJour: "40 à 70 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Dakar ?",
        paragraphs: [
          "La saison sèche, de novembre à mai, offre le climat le plus agréable, tempéré par l'harmattan, avec un ciel généralement dégagé.",
          "La saison des pluies (hivernage), de juin à octobre, apporte une chaleur plus humide et des averses parfois intenses, sans empêcher le voyage mais à anticiper dans le programme.",
          "Les grandes fêtes religieuses (Tabaski notamment) concentrent une forte affluence de la diaspora sénégalaise de France : les prix des vols grimpent alors nettement, à réserver bien à l'avance si vous visez ces dates.",
        ],
      },
      {
        heading: "Les incontournables à voir en priorité",
        paragraphs: [
          "L'île de Gorée, classée à l'UNESCO pour son passé lié à la traite négrière, se visite en vingt minutes de bateau depuis le port de Dakar — comptez une demi-journée pour la Maison des Esclaves et les ruelles colorées.",
          "Le Plateau, cœur administratif et commerçant de Dakar, et le marché Sandaga offrent l'ambiance urbaine la plus dense de la ville, tissus, artisanat et vie de rue.",
          "Les Almadies et N'Gor, à la pointe la plus occidentale d'Afrique continentale, rassemblent plages, restaurants en bord de mer et le départ de bateau vers l'île de N'Gor.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement varie largement : 30-60 € la nuit pour un hôtel correct, davantage dans les établissements de bord de mer aux Almadies.",
          "Un repas dans un restaurant local (thiéboudienne, plat national) revient à 5-10 €, un dîner plus soigné en bord de mer à 15-25 € par personne.",
          "Les taxis se négocient avant le trajet, hors application : comptez 3-6 € pour un déplacement en ville, davantage pour rejoindre l'aéroport.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : Blaise-Diagne est à une quarantaine de kilomètres de Dakar, sans liaison ferrée — comptez 45 minutes à 1 heure de route selon la circulation.",
          "Négociation : les prix ne sont pas toujours fixes dans les marchés et pour les taxis non officiels — convenir du tarif avant le trajet ou l'achat reste la règle de base.",
          "Santé : vérifiez les recommandations vaccinales (fièvre jaune notamment, parfois exigée à l'entrée) et le traitement antipaludique auprès d'un médecin avant le départ.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits couvrent Dakar, l'île de Gorée et les Almadies.",
          "Cinq nuits ou plus permettent une extension vers la Petite Côte (Saly, Toubab Dialaw) ou le lac Rose, à une à deux heures de route de la capitale.",
        ],
      },
    ],
  },
  {
    slug: "reykjavik",
    city: "Reykjavik",
    country: "Islande",
    routeSlug: "paris-reykjavik",
    origin: "PAR",
    destination: "KEF",
    originCity: "Paris",
    title: "Que faire à Reykjavik : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Reykjavik : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Reykjavik : meilleure période, Cercle d'or, aurores boréales, budget réel sur place pour les voyageurs français.",
    intro:
      "Reykjavik sert de base idéale pour explorer les paysages islandais, entre geysers, chutes d'eau et côtes volcaniques. Voici les repères concrets avant de réserver : quand partir, que voir et combien prévoir, dans un pays réputé cher.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie:
        "Couronne islandaise (ISK). Cartes bancaires acceptées presque partout, y compris pour de très petits montants.",
      langue: "Islandais. L'anglais est parlé couramment par la quasi-totalité de la population.",
      visa: "Aucun visa pour un séjour touristique, l'Islande faisant partie de l'espace Schengen. Carte d'identité valide suffisante.",
      transport:
        "Pas de métro ni de train urbain : bus locaux et location de voiture, quasi indispensable pour sortir de Reykjavik.",
      budgetJour:
        "110 à 170 € par personne et par jour, hébergement compris — l'un des pays les plus chers d'Europe.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Reykjavik ?",
        paragraphs: [
          "Juin à août offre le soleil de minuit et l'accès le plus large aux routes et sentiers, souvent fermés ou difficiles d'accès le reste de l'année. C'est aussi la période la plus chère et la plus fréquentée.",
          "De septembre à mars, les nuits longues et un ciel souvent dégagé offrent de bonnes chances d'observer les aurores boréales, sans aucune garantie : l'activité solaire et la météo restent déterminantes.",
          "L'hiver islandais reste rude et les journées très courtes en décembre-janvier ; le printemps et l'automne (avril-mai, septembre) offrent un compromis intéressant entre lumière, météo et prix.",
        ],
      },
      {
        heading: "Le Cercle d'or et les incontournables",
        paragraphs: [
          "Le Cercle d'or, circuit d'une journée depuis Reykjavik, réunit le parc national de Thingvellir (faille entre deux plaques tectoniques), les geysers de Geysir et Strokkur, et les chutes de Gullfoss.",
          "Le Blue Lagoon, bassin géothermal à ciel ouvert près de l'aéroport de Keflavik, se réserve à l'avance : c'est une étape appréciée à l'arrivée ou au départ plutôt qu'un détour supplémentaire.",
          "Reykjavik elle-même se visite en une demi-journée : l'église Hallgrímskirkja, le port et le centre culturel Harpa suffisent à occuper une soirée ou une matinée entre deux excursions.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'Islande reste l'un des pays les plus chers d'Europe : un repas simple revient à 20-25 €, un dîner au restaurant à 35-50 € par personne.",
          "L'hébergement suit la même logique : 120-180 € la nuit pour un hôtel correct, 40-60 € en auberge — réservez tôt en été, période de forte demande.",
          "La location de voiture (souvent 60-100 €/jour selon la saison et le véhicule) reste le poste le plus rentable pour explorer au-delà de Reykjavik, comparé au coût des excursions organisées à la journée.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : le Flybus rejoint le centre de Reykjavik en 45 minutes environ, synchronisé avec les horaires de vol, pour environ 25 €.",
          "Équipement : prévoyez des vêtements chauds et imperméables même en été, la météo islandaise pouvant changer plusieurs fois dans la même journée.",
          "Conduite : les routes secondaires et pistes (F) peuvent nécessiter un véhicule 4x4, en particulier en dehors de l'été — vérifiez les conditions avant de partir.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois à quatre nuits permettent Reykjavik, le Cercle d'or et le Blue Lagoon.",
          "Une semaine ou plus laisse le temps d'explorer la côte sud (plages de sable noir, glaciers) ou de faire une partie du tour de l'île par la route 1.",
        ],
      },
    ],
  },
  {
    slug: "stockholm",
    city: "Stockholm",
    country: "Suède",
    routeSlug: "paris-stockholm",
    origin: "PAR",
    destination: "ARN",
    originCity: "Paris",
    title: "Que faire à Stockholm : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Stockholm : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Stockholm : meilleure période, quartiers à voir, budget réel sur place, accès depuis Arlanda pour les voyageurs français.",
    intro:
      "Stockholm, bâtie sur quatorze îles reliées par des ponts, se visite dans des conditions radicalement différentes selon la saison. Voici les repères concrets avant de réserver : climat, quartiers, budget réel et accès depuis l'aéroport.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Couronne suédoise (SEK), pas l'euro.",
      langue: "Suédois. L'anglais est parlé couramment par la quasi-totalité de la population.",
      visa: "Aucun visa pour un séjour touristique, carte d'identité valide suffisante (espace Schengen).",
      transport:
        "Métro, bus et ferries urbains entre les îles ; un pass transport de plusieurs jours est souvent le plus avantageux.",
      budgetJour: "80 à 130 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Stockholm ?",
        paragraphs: [
          "Mai à août profite de journées très longues (le soleil se couche après 22 h en juin) et d'un climat doux, la meilleure période pour profiter des îles et des terrasses en bord d'eau.",
          "L'hiver est rigoureux et sombre, avec une nuit qui tombe dès le milieu de l'après-midi en décembre-janvier — une ambiance particulière, notamment autour des marchés de Noël, mais qui ne convient pas à tous les voyageurs.",
          "Fin juin, la fête de la Saint-Jean (Midsommar) voit une partie de la ville se vider, de nombreux Suédois partant à la campagne : certains commerces et restaurants ferment pendant quelques jours.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Gamla Stan, la vieille ville, concentre ruelles pavées, palais royal et façades colorées — le cœur touristique de Stockholm, à visiter tôt le matin pour éviter l'affluence.",
          "Södermalm offre l'ambiance la plus locale : cafés indépendants, boutiques vintage et point de vue sur la ville depuis Monteliusvägen, particulièrement au coucher du soleil.",
          "Djurgården, île verte accessible à pied ou en ferry, rassemble plusieurs musées majeurs dont le Vasa (navire du 17e siècle intact) et le parc d'attractions Gröna Lund.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement revient à 100-150 € la nuit pour un hôtel correct en centre-ville, 35-50 € en auberge, avec une hausse en juin-juillet.",
          "Un repas simple (déjeuner du jour, « dagens lunch ») coûte 12-15 €, un dîner au restaurant 30-45 € par personne — la Suède reste un pays cher pour la restauration.",
          "Les transports coûtent environ 4 € le trajet unique, ou un pass journée autour de 14 € couvrant bus, métro et plusieurs liaisons en ferry urbain.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : l'Arlanda Express relie la gare centrale en 18 minutes pour environ 30 € ; le bus Flygbussarna, plus lent (45 minutes), coûte nettement moins cher.",
          "Paiement : la Suède est l'un des pays les plus avancés vers le tout-carte — les espèces sont rarement nécessaires, y compris pour de très petits achats.",
          "Alcool : la vente d'alcool fort et de vin en magasin est réservée au monopole d'État Systembolaget, aux horaires plus restreints qu'en France.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Trois nuits couvrent Gamla Stan, Södermalm et Djurgården.",
          "Quatre à cinq nuits permettent d'ajouter une excursion dans l'archipel de Stockholm (plus de 30 000 îles et îlots) en bateau depuis le centre.",
        ],
      },
    ],
  },
  {
    slug: "mexico",
    city: "Mexico",
    country: "Mexique",
    routeSlug: "paris-mexico",
    origin: "PAR",
    destination: "MEX",
    originCity: "Paris",
    title: "Que faire à Mexico : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Mexico : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Mexico : meilleure période, quartiers à voir, budget réel sur place, altitude et conseils pratiques pour les voyageurs français.",
    intro:
      "Mexico, perchée à plus de 2 200 mètres d'altitude, profite d'un climat tempéré toute l'année, loin de l'image tropicale qu'on prête souvent au pays. Voici les repères concrets avant de réserver : quartiers, budget réel et organisation sur place.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Peso mexicain (MXN).",
      langue:
        "Espagnol. L'anglais est répandu dans les zones touristiques, moins dans le reste de la ville.",
      visa: "Aucun visa pour un séjour touristique de moins de 180 jours, passeport valide requis.",
      transport:
        "Métro étendu et bon marché, mais taxi officiel ou VTC recommandés pour un premier trajet avec bagages.",
      budgetJour: "45 à 80 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Mexico ?",
        paragraphs: [
          "Grâce à l'altitude, Mexico reste tempérée toute l'année, rarement au-dessus de 25 °C en journée. La saison sèche, de novembre à avril, offre un ciel plus dégagé et moins d'averses.",
          "La saison des pluies, de mai à octobre, apporte des averses généralement brèves et prévisibles en fin d'après-midi, sans empêcher les visites en journée.",
          "Le Jour des Morts (fin octobre-début novembre) offre une expérience culturelle unique, avec ofrendas et défilés, mais concentre aussi une forte affluence touristique.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Le Centro Histórico, classé à l'UNESCO, rassemble la cathédrale métropolitaine, le Zócalo et les ruines aztèques du Templo Mayor, en plein cœur de la ville moderne.",
          "Roma et Condesa, quartiers résidentiels aux avenues arborées, concentrent la scène gastronomique et créative la plus dynamique de la ville, particulièrement agréables à pied.",
          "Coyoacán, ancien village annexé par l'agglomération, garde une ambiance de petite ville avec ses places colorées et la maison-musée de Frida Kahlo (Casa Azul).",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement reste abordable : 40-70 € la nuit pour un hôtel correct à Roma ou Condesa, 15-25 € en auberge.",
          "La street food (tacos, marchés) permet de manger pour 3-6 € le repas ; un dîner plus soigné dans un restaurant de Roma ou Condesa revient à 15-30 € par personne.",
          "Les transports sont très bon marché : environ 0,25 € le trajet en métro, quelques euros en taxi ou VTC pour la plupart des trajets en ville.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : la ligne 5 du métro dessert l'aéroport (station Terminal Aérea), mais un taxi officiel réservé dans le terminal ou un VTC restent recommandés pour un premier trajet avec bagages.",
          "Altitude : les premiers jours, un léger essoufflement à l'effort est normal ; hydratez-vous bien et évitez l'alcool le premier soir.",
          "Eau : évitez l'eau du robinet, y compris pour se brosser les dents ; l'eau en bouteille est largement disponible et bon marché.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Quatre nuits couvrent le Centro Histórico, Roma-Condesa et Coyoacán.",
          "Une semaine ou plus permet d'ajouter une excursion aux pyramides de Teotihuacán (moins d'une heure de route) ou à Puebla, ville coloniale à deux heures de route.",
        ],
      },
    ],
  },
  {
    slug: "doha",
    city: "Doha",
    country: "Qatar",
    routeSlug: "paris-doha",
    origin: "PAR",
    destination: "DOH",
    originCity: "Paris",
    title: "Que faire à Doha : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Doha : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Doha : meilleure période, souk Waqif, budget réel sur place, accès depuis l'aéroport pour les voyageurs français.",
    intro:
      "Doha combine gratte-ciels futuristes, souk traditionnel et musées de premier plan, à six heures et demie de vol de Paris. Voici les repères concrets avant de réserver, que ce soit pour un séjour dédié ou une escale prolongée.",
    readingMinutes: 6,
    updated: "2026-08-31",
    practical: {
      monnaie: "Riyal qatari (QAR).",
      langue:
        "Arabe. L'anglais est très largement parlé, notamment dans le tourisme et les affaires.",
      visa: "Aucun visa pour un séjour touristique de courte durée, passeport valide requis.",
      transport:
        "Métro de Doha (ligne rouge notamment), taxis et VTC ; les distances entre quartiers restent importantes.",
      budgetJour: "55 à 100 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Doha ?",
        paragraphs: [
          "Novembre à mars offre des températures agréables (18-28 °C), idéales pour profiter de la corniche et des activités extérieures sans souffrir de la chaleur.",
          "L'été (juin-septembre) dépasse régulièrement les 40 °C avec une forte humidité, rendant les sorties diurnes difficiles : la vie se déplace alors vers les espaces climatisés et le soir.",
          "Les grands événements sportifs ou culturels organisés dans le pays peuvent faire grimper ponctuellement les prix des vols et des hôtels — à vérifier avant de fixer vos dates.",
        ],
      },
      {
        heading: "Les incontournables à voir en priorité",
        paragraphs: [
          "Le souk Waqif, cœur historique reconstitué de Doha, rassemble échoppes d'épices, de textiles et restaurants traditionnels — particulièrement animé en soirée, une fois la chaleur retombée.",
          "Le Museum of Islamic Art, conçu par I. M. Pei sur une île artificielle, présente une collection majeure d'art islamique dans un cadre architectural remarquable, entrée gratuite.",
          "La Corniche, promenade de sept kilomètres le long de la baie, offre la meilleure vue sur la skyline de Doha, particulièrement photogénique au coucher du soleil.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Le Qatar peut se visiter avec des budgets très variables : un repas dans le souk Waqif revient à 10-15 €, tandis que la restauration dans les grands hôtels internationaux peut facilement dépasser 40-50 € par personne.",
          "L'hébergement dans les enseignes internationales reste cher (100-200 € la nuit), avec quelques options plus abordables autour de 60-80 € hors quartiers les plus centraux.",
          "Les transports sont bon marché : environ 0,50 à 1 € le trajet en métro, davantage en taxi ou VTC selon la distance.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : la ligne rouge du métro de Doha relie l'aéroport Hamad au centre-ville en une trentaine de minutes, alternative pratique et bon marché au taxi.",
          "Tenue vestimentaire : des épaules et jambes couvertes sont recommandées dans les lieux publics, en particulier pour les femmes, par respect des usages locaux.",
          "Alcool : sa vente est très restreinte, généralement limitée aux hôtels internationaux disposant d'une licence.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Deux à trois nuits suffisent pour le souk Waqif, le Museum of Islamic Art et la Corniche.",
          "Utile aussi en escale longue vers l'Asie ou l'Océanie : une journée complète permet déjà de découvrir l'essentiel de la ville.",
        ],
      },
    ],
  },
  {
    slug: "bali",
    city: "Bali",
    country: "Indonésie",
    routeSlug: "paris-bali",
    origin: "PAR",
    destination: "DPS",
    originCity: "Paris",
    title: "Que faire à Bali : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Bali : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Bali : meilleure saison, quartiers Ubud, Seminyak et Canggu, budget sur place, transports, visa et conseils pratiques pour les voyageurs français.",
    intro:
      "Bali ne se limite pas à une plage : l'île concentre rizières en terrasses, temples, spots de surf et scène de travailleurs à distance, à condition de bien choisir sa base tant les ambiances diffèrent d'un quartier à l'autre. Voici les repères concrets avant de réserver.",
    readingMinutes: 8,
    updated: "2026-09-01",
    practical: {
      monnaie:
        "Roupie indonésienne (IDR). Environ 1 € = 17 000 IDR. Distributeurs largement disponibles, prévoyez du liquide pour les warungs.",
      langue:
        "Indonésien (bahasa Indonesia) et balinais. L'anglais est très répandu dans les zones touristiques du sud de l'île.",
      visa: "Visa à l'arrivée (VOA) payant pour les Français, environ 30 € pour 30 jours, prolongeable une fois sur place. Passeport valide au moins 6 mois.",
      transport:
        "Pas de transport public structuré : scooter de location (permis international requis), chauffeur à la journée, ou applications Gojek/Grab pour de courts trajets.",
      budgetJour:
        "35 à 65 € par personne et par jour, davantage dans les villas avec piscine du sud de l'île.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Bali ?",
        paragraphs: [
          "La saison sèche, de mai à septembre, offre le climat le plus fiable : peu de pluie, chaleur stable autour de 27-31 °C, mer calme sur la côte sud. C'est aussi la période la plus fréquentée et la plus chère, en particulier juillet-août.",
          "La saison des pluies, de novembre à mars, n'empêche pas de voyager : les averses sont généralement intenses mais brèves, souvent en fin d'après-midi, et la végétation est alors la plus verte de l'année. Décembre et début janvier restent chers malgré la pluie, portés par la demande des fêtes.",
          "Le Nyepi, jour du silence balinais qui marque le nouvel an du calendrier saka (en mars, date variable), immobilise complètement l'île pendant 24 heures : aéroport fermé, rues désertes, lumières éteintes. Un moment culturel unique à vivre sur place, mais à anticiper si vos dates de vol tombent ce jour précis — aucun avion ne décolle ni n'atterrit.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "Seminyak concentre restaurants soignés, boutiques et beach clubs au coucher du soleil — le choix le plus confortable pour un premier séjour, mais aussi l'un des plus embouteillés du sud de l'île.",
          "Canggu, plus au nord, est devenu la base des surfeurs et des travailleurs à distance : cafés avec wifi, rizières encore visibles entre les constructions récentes, et une circulation qui sature un peu plus chaque année sur l'axe principal.",
          "Ubud, à l'intérieur des terres, reste le cœur culturel et spirituel de l'île : rizières en terrasses de Tegalalang, forêt des singes, cours de yoga et marché artisanal. Les nuits y sont plus fraîches qu'au bord de mer, sans plage à proximité immédiate.",
          "Uluwatu, à la pointe sud, offre les plus belles falaises et les meilleurs spots de surf, avec son temple perché et sa danse Kecak au coucher du soleil. Nusa Dua, plus au calme, concentre les grands complexes hôteliers familiaux.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "Un repas dans un warung local coûte 2 à 5 €, un dîner soigné à Seminyak ou Canggu 12 à 25 € par personne. Le café de spécialité, très présent à Canggu, revient à 2 à 4 €.",
          "L'hébergement va de 15 à 25 € pour une guesthouse correcte à 40-80 € pour une villa privée avec piscine, un standard courant dans le sud de l'île. Les hôtels de Nusa Dua ou Seminyak en bord de mer dépassent facilement 100 € en haute saison.",
          "Un scooter de location revient à 5 à 7 € par jour, un chauffeur privé à la journée 25 à 35 €. Les entrées de temples et rizières coûtent en général 2 à 4 € par site.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Formalités : visa à l'arrivée payant pour les Français (environ 30 €, 30 jours, prolongeable une fois), passeport valide au moins 6 mois après la date d'entrée.",
          "Depuis l'aéroport Ngurah Rai (DPS), comptez 20 à 40 minutes de route vers Seminyak ou Kuta, 1 h à 1 h 30 vers Ubud selon le trafic — souvent plus long en fin d'après-midi sur l'axe du sud de l'île.",
          "Un scooter demande un permis international : les contrôles de police ciblant les touristes sans ce document sont fréquents autour de Canggu et Seminyak. Le casque est obligatoire même sur de courts trajets.",
          "Sur place : tenue couvrant épaules et genoux (souvent un sarong fourni sur place) pour visiter les temples, eau du robinet non potable, et négociation attendue avec les chauffeurs non affiliés à une application.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Une semaine permet de combiner deux bases — par exemple Ubud pour la culture et les rizières, puis Uluwatu ou Seminyak pour la plage — plutôt que de tout faire depuis un seul point de chute vu les distances et le trafic.",
          "Compte tenu du trajet (17 à 20 heures avec escale), un séjour de moins de dix jours rentabilise mal le temps de vol : la plupart des voyageurs venus d'Europe restent deux à trois semaines, parfois en combinant Bali avec les îles voisines de Nusa Penida ou Gili.",
        ],
      },
    ],
  },
  {
    slug: "casablanca",
    city: "Casablanca",
    country: "Maroc",
    routeSlug: "paris-casablanca",
    origin: "PAR",
    destination: "CMN",
    originCity: "Paris",
    title: "Que faire à Casablanca : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Casablanca : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Casablanca : meilleure période, mosquée Hassan II, budget réel sur place, accès depuis l'aéroport pour les voyageurs français.",
    intro:
      "Casablanca, capitale économique du Maroc, contraste avec l'image touristique de Marrakech : architecture Art déco, corniche atlantique et rythme de grande ville active. Voici les repères concrets avant de réserver.",
    readingMinutes: 6,
    updated: "2026-09-01",
    practical: {
      monnaie: "Dirham marocain (MAD).",
      langue: "Arabe et français, très largement parlé dans les affaires et le tourisme.",
      visa: "Aucun visa pour un séjour touristique de moins de 90 jours, passeport valide requis.",
      transport:
        "Tramway, petits taxis (à négocier ou au compteur) et train ONCF direct depuis l'aéroport.",
      budgetJour: "45 à 75 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Casablanca ?",
        paragraphs: [
          "Mars-mai et septembre-novembre offrent des températures modérées (18-26 °C), la position côtière limitant les excès de chaleur observés dans les villes marocaines plus continentales comme Marrakech.",
          "L'été reste chaud et humide sans être extrême, tempéré par la proximité de l'Atlantique. L'hiver est doux en journée mais peut être pluvieux et venteux, avec des nuits fraîches.",
          "Les grandes fêtes religieuses (Ramadan, Aïd) concentrent une forte affluence de la diaspora marocaine sur les vols : les prix montent alors plus tôt qu'en période normale.",
        ],
      },
      {
        heading: "Les incontournables à voir en priorité",
        paragraphs: [
          "La mosquée Hassan II, l'une des plus grandes au monde, se dresse directement au bord de l'Atlantique et se visite en partie par visite guidée — un incontournable architectural, y compris pour les non-pratiquants.",
          "L'ancienne médina, plus modeste que celle de Marrakech ou Fès, garde une ambiance authentique loin des circuits touristiques denses ; le quartier des Habous (nouvelle médina) offre une version plus ordonnée et récente du même esprit.",
          "La Corniche d'Ain Diab, front de mer bordé de cafés et de piscines privées, concentre la vie balnéaire et nocturne de la ville, particulièrement animée le week-end.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement reste abordable : 45-75 € la nuit pour un hôtel d'affaires correct, davantage dans les enseignes internationales du quartier des affaires.",
          "Un repas dans une gargote locale (tajine, couscous) revient à 5-8 €, un dîner plus soigné en bord de mer à 15-25 € par personne.",
          "Les petits taxis rouges se négocient hors compteur ou se prennent au compteur (moins cher) : un trajet en ville coûte généralement 2-5 €.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : le train ONCF relie directement Mohammed-V à la gare de Casa-Voyageurs en une trentaine de minutes — bien plus pratique et économique qu'un taxi aux heures de pointe.",
          "Casablanca est une ville de travail avant d'être une ville touristique : les rues sont moins orientées vers les visiteurs qu'à Marrakech, ce qui en fait une expérience plus authentique mais avec moins d'infrastructure dédiée au tourisme.",
          "Négociation : dans les petits taxis sans compteur utilisé, convenez du prix avant de monter.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Deux nuits suffisent pour la mosquée Hassan II, la médina et la Corniche.",
          "Casablanca fonctionne aussi très bien comme point de passage : beaucoup de voyageurs y font escale une nuit avant de rejoindre Marrakech, Rabat (moins d'une heure de train) ou Essaouira.",
        ],
      },
    ],
  },
  {
    slug: "miami",
    city: "Miami",
    country: "États-Unis",
    routeSlug: "paris-miami",
    origin: "PAR",
    destination: "MIA",
    originCity: "Paris",
    title: "Que faire à Miami : guide complet pour bien préparer son voyage",
    metaTitle: "Que faire à Miami : guide voyage complet 2026 | TrouveMonVol",
    description:
      "Guide Miami : meilleure période, quartiers à voir, budget réel sur place, ESTA et conseils pratiques pour les voyageurs français.",
    intro:
      "Miami mélange plages Art déco, culture latino-américaine et vie nocturne, à neuf heures et demie de vol de Paris. Voici les repères concrets avant de réserver : climat, quartiers, budget réel et organisation sur place.",
    readingMinutes: 6,
    updated: "2026-09-01",
    practical: {
      monnaie: "Dollar américain (USD).",
      langue:
        "Anglais et espagnol, très largement parlé compte tenu de la forte population latino-américaine.",
      visa: "Aucun visa pour un séjour touristique de moins de 90 jours, mais autorisation ESTA obligatoire avant le départ.",
      transport:
        "Metrorail et bus limités ; la location de voiture reste recommandée pour sortir du centre.",
      budgetJour: "75 à 120 € par personne et par jour, hébergement compris.",
    },
    sections: [
      {
        heading: "Quelle est la meilleure période pour visiter Miami ?",
        paragraphs: [
          "Décembre à avril offre le climat le plus agréable (22-28 °C, faible humidité), avec logiquement la plus forte affluence et les tarifs les plus élevés autour du Nouvel An.",
          "De juin à novembre, la chaleur devient lourde et humide, avec un risque réel d'ouragans en fin d'été (pic en août-septembre) : les tarifs de vol et d'hôtel baissent en compensation, un vrai arbitrage à faire.",
          "Mai et la première quinzaine de novembre offrent un compromis intéressant, entre chaleur encore maîtrisée et tarifs déjà en baisse.",
        ],
      },
      {
        heading: "Les quartiers à voir en priorité",
        paragraphs: [
          "South Beach, avec son architecture Art déco pastel et sa plage bordée d'Ocean Drive, concentre l'image la plus connue de Miami — animée jour et nuit, notamment autour de Lincoln Road.",
          "Wynwood, ancien quartier industriel reconverti, rassemble le plus grand ensemble de street art de la ville (Wynwood Walls) et une scène de galeries, bars et brunchs très dynamique.",
          "Little Havana, cœur de la communauté cubaine de Miami, offre cafés cubains, cigares roulés à la main et musique live, en particulier le long de Calle Ocho.",
        ],
      },
      {
        heading: "Quel budget prévoir sur place ?",
        paragraphs: [
          "L'hébergement à South Beach revient à 90-150 € la nuit pour un hôtel correct, avec des options plus abordables à Downtown ou Brickell.",
          "La restauration de rue et les food trucks permettent de manger pour 10-15 €, un dîner plus soigné à 25-40 € par personne — taxes et pourboire (environ 25-30 % au total) non inclus dans le prix affiché.",
          "La location de voiture, souvent utile pour sortir du centre, coûte 40-70 € par jour selon la catégorie, en plus du stationnement souvent payant.",
        ],
      },
      {
        heading: "Conseils pratiques avant de partir",
        paragraphs: [
          "Depuis l'aéroport : le Metrorail (ligne Orange) relie l'aéroport au centre via le Miami Intermodal Center, mais un VTC ou une voiture de location restent plus pratiques avec des bagages.",
          "Ouragans : suivez les prévisions si vous voyagez entre juin et novembre, et privilégiez un hébergement à annulation flexible sur cette période.",
          "Pourboire et taxes : comme dans le reste des États-Unis, les prix affichés n'incluent ni taxe ni pourboire, à ajouter mentalement à chaque addition.",
        ],
      },
      {
        heading: "Combien de temps rester ?",
        paragraphs: [
          "Quatre nuits permettent de couvrir South Beach, Wynwood et Little Havana sans excès de route chaque jour.",
          "Une semaine ou plus laisse le temps d'ajouter une excursion aux Keys (Key West, à environ trois heures de route) ou aux Everglades.",
        ],
      },
    ],
  },
];

export function getCityGuide(slug: string): CityGuide | undefined {
  return CITY_GUIDES.find((guide) => guide.slug === slug);
}

/** Guide correspondant à une page trajet (/vols/<routeSlug>). */
export function getCityGuideForRoute(routeSlug: string): CityGuide | undefined {
  return CITY_GUIDES.find((guide) => guide.routeSlug === routeSlug);
}

/**
 * Guide de la ville d'ARRIVÉE d'une page trajet.
 *
 * Le rattachement se faisait par `routeSlug`, donc par couple départ-arrivée :
 * le guide de Barcelone n'était visible que depuis /vols/paris-barcelone, alors
 * que marseille-barcelone, nice-barcelone et toulouse-barcelone parlent de la
 * même ville. Or ce contenu — quartiers, budget sur place, transports,
 * formalités — ne dépend pas de l'aéroport de départ.
 *
 * Le repli sur `routeSlug` couvre les pages générées, dont le code de
 * destination vient du référentiel géographique et peut désigner un aéroport
 * précis là où le guide porte le code de la ville (MXP contre MIL).
 */
export function guideForRoutePage(routeSlug: string, destination: string): CityGuide | undefined {
  const code = destination.toUpperCase();
  return (
    CITY_GUIDES.find((guide) => guide.destination.toUpperCase() === code) ??
    getCityGuideForRoute(routeSlug)
  );
}
