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
      monnaie: "Dirham marocain (MAD). Environ 1 € = 10,8 MAD. Devise non exportable : changez sur place.",
      langue: "Arabe et amazigh. Le français est très largement parlé dans le tourisme et les commerces.",
      visa: "Aucun visa pour les Français pour un séjour touristique de moins de 90 jours. Passeport valide requis.",
      transport: "Petits taxis (négociez ou exigez le compteur), bus n°19 depuis l'aéroport, médina uniquement à pied.",
      budgetJour: "40 à 70 € par personne et par jour en riad confortable, repas et visites inclus.",
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
      monnaie: "Baht thaïlandais (THB). Environ 1 € = 38 THB. Cartes acceptées en centre-ville, espèces ailleurs.",
      langue: "Thaï. L'anglais est courant dans les hôtels, centres commerciaux et transports.",
      visa: "Pas de visa pour les Français jusqu'à 60 jours de tourisme. Passeport valide 6 mois après l'entrée.",
      transport: "BTS Skytrain, MRT, bateaux express du Chao Phraya, taxis au compteur et applications VTC.",
      budgetJour: "35 à 70 € par jour et par personne, beaucoup moins en voyageant en street food et guesthouse.",
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
      monnaie: "Dollar américain (USD). Cartes acceptées partout, y compris pour de très petits montants.",
      langue: "Anglais. L'espagnol est très présent dans plusieurs quartiers.",
      visa: "ESTA obligatoire avant l'embarquement (environ 21 $, valable 2 ans) pour les Français, passeport biométrique requis.",
      transport: "Métro 24h/24 avec paiement sans contact OMNY, bus, ferry gratuit vers Staten Island.",
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
      langue: "Portugais. L'anglais est largement parlé, le français moins souvent chez les jeunes.",
      visa: "Aucune formalité pour les Français : carte d'identité ou passeport en cours de validité suffit.",
      transport: "Métro, tramways historiques (28, 15), funiculaires, train de banlieue vers Cascais et Sintra.",
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
      transport: "Métro dense, bus, tramway, vélos en libre-service, aéroport relié par Aerobús et métro L9.",
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
];

export function getCityGuide(slug: string): CityGuide | undefined {
  return CITY_GUIDES.find((guide) => guide.slug === slug);
}

/** Guide correspondant à une page trajet (/vols/<routeSlug>). */
export function getCityGuideForRoute(routeSlug: string): CityGuide | undefined {
  return CITY_GUIDES.find((guide) => guide.routeSlug === routeSlug);
}
