# Liens « Réserver en direct chez la compagnie » — étude de faisabilité

Document de décision, préalable à tout code. Il répond à une question : peut-on
construire, pour chaque offre, un lien vers le site officiel de la compagnie
avec trajet et dates pré-remplis ?

Réponse courte : **oui pour environ 70 % de nos offres, non de façon fiable pour
le reste**, et deux corrections sont nécessaires avant d'écrire la moindre ligne.

Relevé du 2026-09-01.

---

## 1. Les compagnies réellement présentes

Mesuré sur **235 offres**, 19 trajets représentatifs de la liste blanche
(Maghreb, Europe du Sud, Corse, Paris), trois mois de départ.

| Rang | Code | Compagnie | Offres | Part |
|---:|---|---|---:|---:|
| 1 | TO | Transavia France | 63 | 26,8 % |
| 2 | FR | Ryanair | 54 | 23,0 % |
| 3 | PC | Pegasus Airlines | 29 | 12,3 % |
| 4 | VY | Vueling | 28 | 11,9 % |
| 5 | V7 | Volotea | 18 | 7,7 % |
| 6 | MW | **Malta Air** | 17 | 7,2 % |
| 7 | U2 | easyJet | 9 | 3,8 % |
| 8 | BJ | Nouvelair | 4 | 1,7 % |
| 9 | TU | Tunisair | 3 | 1,3 % |
| 10 | AF | Air France | 3 | 1,3 % |
| 11 | AL | ALPAVIA | 2 | 0,9 % |
| 12 | AT | Royal Air Maroc | 1 | 0,4 % |
| 13 | NI | Portugalia Airlines | 1 | 0,4 % |
| 14 | YW | Iberia Regional (Air Nostrum) | 1 | 0,4 % |
| 15 | AZ | ITA Airways | 1 | 0,4 % |
| 16 | EC | easyJet Europe | 1 | 0,4 % |

Ces 16 codes couvrent 100 % des offres relevées.

### Ils se ramènent à moins de sites qu'il n'y paraît

Quatre codes ne correspondent pas à un site de réservation propre :

| Code | Compagnie | Se réserve en réalité sur |
|---|---|---|
| **MW** | Malta Air | **ryanair.com** — filiale du groupe Ryanair |
| **EC** | easyJet Europe | **easyjet.com** — même groupe, autre certificat |
| **NI** | Portugalia | **flytap.com** — groupe TAP |
| **YW** | Iberia Regional | **iberia.com** — opéré par Air Nostrum |

Conséquence directe : Ryanair + Malta Air pèsent **30,2 %** des offres à eux
deux, et easyJet + easyJet Europe 4,2 %. Le tableau des sites à traiter est
donc plus court que celui des compagnies.

---

## 2. Formats d'URL

Trois niveaux de confiance, à ne pas confondre.

### Vérifié — format documenté et testé

**Ryanair** (et Malta Air) — 30,2 % des offres

```
https://www.ryanair.com/fr/fr/trip/flights/select
  ?adults=1&teens=0&children=0&infants=0
  &dateOut=2026-11-22
  &originIata=BVA
  &destinationIata=RAK
```

Testé : HTTP 200, et le site complète lui-même les paramètres à l'arrivée
(`tpAdults`…), signe qu'il les a bien interprétés. Paramètres optionnels :
`isReturn`, `dateIn`, `isConnectedFlight`.

### Chemin trouvé, paramètres à confirmer

**Vueling** — 11,9 %

`https://tickets.vueling.com/` redirige vers `/booking/flightSearch` (HTTP 200).
Le chemin de recherche existe donc, mais je n'ai pas pu établir le nom des
paramètres depuis un simple appel HTTP.

### Non vérifiable depuis ici — protection anti-robot

Trois sites répondent **403** à une requête automatisée : impossible de tester
un format d'URL sans un vrai navigateur.

| Compagnie | Part | Site | Statut |
|---|---:|---|---|
| Transavia | 26,8 % | transavia.com | 403 |
| easyJet | 4,2 % | easyjet.com | 403 |
| ITA Airways | 0,4 % | ita-airways.com | 403 |

**Transavia est le premier transporteur de nos résultats.** Tant que son format
n'est pas établi, la fonctionnalité laisse de côté plus d'un quart des offres.

### Site accessible, format inconnu

Page d'accueil en HTTP 200, mais aucun format de recherche documenté trouvé :
Volotea (7,7 %), Pegasus (12,3 %), Nouvelair, Tunisair, Royal Air Maroc,
Air France, TAP, Iberia.

---

## 3. Deux corrections nécessaires avant de coder

### a. Nous ne gardons pas l'aéroport, seulement la ville

C'est le blocage le plus concret. Nos offres stockent `origin: "PAR"` et
`destination: "RAK"` — des codes **villes**. Or Ryanair veut `originIata=BVA` :
un vol Paris–Marrakech part de Beauvais, pas de « Paris ».

Un lien construit sur PAR mènerait à une recherche vide ou fausse.

La donnée existe pourtant : l'API renvoie `origin_airport` et
`destination_airport` dans chaque offre, nous ne les conservons simplement pas
(`offersFromApi`, src/lib/travelpayouts.server.ts). C'est un ajout de deux
champs à `FlightOffer`, sans appel supplémentaire.

### b. Un lien pré-rempli n'est pas un lien qui aboutit

Ces sites sont des applications monopage : l'URL est interprétée au chargement
par leur code, pas par un serveur. Un paramètre renommé lors d'une refonte ne
provoque aucune erreur visible — la page s'ouvre simplement sur une recherche
vide, et l'utilisateur croit que nous l'avons mal envoyé. Il n'existe aucun
moyen de détecter cette panne automatiquement.

Ce que ça implique : chaque format doit être testé à la main à l'ouverture, puis
revérifié périodiquement, exactement comme la liste blanche des routes.

---

## 4. Ce que je recommande

**Commencer par Ryanair seul.** 30,2 % des offres, format documenté et testé,
et le seul groupe pour lequel je peux affirmer que ça marche aujourd'hui.
Le lien n'apparaît que pour les compagnies dont le format est vérifié — même
règle que pour les bagages : pas de donnée, pas d'affichage.

**Puis établir Transavia**, le premier transporteur de nos résultats. Il faut
ouvrir le site dans un vrai navigateur, lancer une recherche, et relever l'URL
produite. Cinq minutes de manipulation valent mieux qu'une heure de supposition.

**Ne pas viser les 15.** Les six dernières compagnies du tableau pèsent moins de
3 % des offres à elles toutes. Le rapport entre l'effort de maintenance et le
gain n'y est pas.

**Un point à trancher avant de coder** : ce lien envoie l'utilisateur hors du
tunnel d'affiliation. Une réservation faite en direct chez la compagnie ne
génère aucune commission. C'est cohérent avec le positionnement transparence —
et c'est peut-être même le meilleur argument du site — mais c'est un arbitrage
de modèle économique, pas une décision technique.

---

## 5. Pour compléter ce document

Pour chaque compagnie à ajouter, la manipulation est la même :

1. Ouvrir le site officiel dans un navigateur.
2. Lancer une recherche réelle : Marseille → Alger, une date précise, 1 adulte.
3. Copier l'URL de la page de résultats.
4. Remplacer les valeurs par des repères (`{origine}`, `{destination}`, `{date}`).
5. Rouvrir l'URL reconstruite dans un onglet privé et vérifier que la recherche
   est bien pré-remplie.

L'étape 5 est celle qu'on saute et qu'on regrette : une URL qui s'ouvre n'est
pas une URL qui a compris ses paramètres.

Source du format Ryanair :
<https://www.ryanair.com/us/en/header/plan-trip>
