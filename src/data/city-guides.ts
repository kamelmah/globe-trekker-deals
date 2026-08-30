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
      monnaie: "Livre turque (TRY). Taux très variable : changez par petites sommes, les bureaux de Grand-Rue offrent de meilleurs taux que l'aéroport.",
      langue: "Turc. L'anglais est courant dans le tourisme, le français beaucoup moins.",
      visa: "Aucun visa pour les Français en séjour touristique de moins de 90 jours. Passeport valide au moins 150 jours après l'entrée.",
      transport: "Tramway T1, métro, funiculaires et ferries. Prenez une carte Istanbulkart dès l'arrivée, elle sert sur tous les modes.",
      budgetJour: "45 à 80 € par personne et par jour, hébergement en hôtel confortable, repas et visites inclus.",
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
      monnaie: "Dirham des Émirats (AED), indexé sur le dollar. Environ 1 € = 4 AED. Carte acceptée quasiment partout.",
      langue: "Arabe officiel, anglais parlé partout, y compris dans les taxis et les commerces.",
      visa: "Aucun visa préalable pour les Français : visa gratuit de 90 jours délivré à l'arrivée. Passeport valide 6 mois.",
      transport: "Métro (lignes rouge et verte), tramway de la Marina, taxis abordables et applications VTC.",
      budgetJour: "80 à 150 € par personne et par jour hors hôtel de luxe ; beaucoup moins en mangeant local.",
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
      monnaie: "Yen (JPY). Environ 1 € = 165 JPY. Les espèces restent utiles malgré la généralisation du sans contact.",
      langue: "Japonais. L'anglais est limité à l'oral mais la signalétique des transports est bilingue.",
      visa: "Aucun visa pour les Français jusqu'à 90 jours de tourisme. Formulaire d'immigration en ligne via Visit Japan Web.",
      transport: "Métro Tokyo Metro et Toei, lignes JR dont la Yamanote. Carte Suica ou Pasmo indispensable.",
      budgetJour: "70 à 130 € par personne et par jour, hébergement compris en hôtel de catégorie moyenne.",
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
      monnaie: "Dinar algérien (DZD), non exportable et non convertible hors du pays. Prévoyez des espèces en euros.",
      langue: "Arabe et amazigh officiels ; le français est très largement compris et parlé.",
      visa: "Visa obligatoire pour les Français : demande au consulat avec réservation d'hôtel ou attestation d'hébergement.",
      transport: "Métro, tramway, téléphériques, taxis et bus ETUSA. Les courses en taxi se négocient souvent au départ.",
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
      transport: "Métro (lignes A, B, C), tramways et bus ATAC. Le centre historique se parcourt à pied.",
      budgetJour: "70 à 120 € par personne et par jour, hébergement en hôtel de catégorie moyenne compris.",
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
      monnaie: "Dinar tunisien (TND), non exportable. Environ 1 € = 3,4 TND. Changez sur place et gardez les reçus.",
      langue: "Arabe officiel ; le français est très largement parlé et compris partout.",
      visa: "Aucun visa pour les Français en séjour touristique de moins de 90 jours. Passeport valide requis.",
      transport: "Métro léger, train TGM vers Carthage et La Marsa, louages et taxis jaunes au compteur.",
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
];

export function getCityGuide(slug: string): CityGuide | undefined {
  return CITY_GUIDES.find((guide) => guide.slug === slug);
}

/** Guide correspondant à une page trajet (/vols/<routeSlug>). */
export function getCityGuideForRoute(routeSlug: string): CityGuide | undefined {
  return CITY_GUIDES.find((guide) => guide.routeSlug === routeSlug);
}
