# TrouveMonVol — MVP

Comparateur de vols transparent, orienté SEO, avec recherche par budget.

## Ce qui sera livré

### 1. Page d'accueil (`/`)
- Barre de recherche mobile-first : départ, destination (optionnelle), dates (+ option « dates flexibles ± 3 jours »), budget max optionnel.
- Si aucune destination : grille des destinations les moins chères depuis la ville de départ.
- Section « Pourquoi nous » : prix tout compris, zéro dark pattern, zéro publicité.
- H1 clair, texte indexable rendu côté serveur, liens internes vers les 10 pages destinations.

### 2. Résultats de recherche (`/recherche`)
- Liste triée par prix, filtres : escales, compagnie, plage horaire, durée.
- Chaque offre : prix total taxes incluses, bagages inclus (cabine/soute quand l'API le fournit), compagnie, durée, escales.
- Bouton « Réserver » redirigeant vers le partenaire via le lien d'affiliation Travelpayouts.

### 3. Pages destinations SEO (`/vols-pas-chers/paris-marrakech`, etc.)
10 routes populaires au départ de Paris (Marrakech, Bangkok, New York, Lisbonne, Barcelone, Istanbul, Dubaï, Tokyo, Alger, Rome).
Chaque page, rendue côté serveur :
- Texte unique 300-500 mots (destination, meilleures périodes, conseils prix).
- Prix le plus bas relevé récemment.
- Graphique d'évolution des prix sur 12 mois.
- FAQ avec balisage schema.org FAQPage.
- Meta title/description/Open Graph uniques.

### 4. Mode Budget (`/mode-budget`)
Budget + ville de départ (+ mois optionnel) → liste des destinations atteignables, triées par prix croissant. Pas de carte interactive en V1.

### 5. SEO technique
- `sitemap.xml` généré automatiquement (accueil, mode budget, toutes les pages destinations).
- `robots.txt` avec référence au sitemap.
- URLs propres, lazy loading des images, images optimisées.

## Design
Épuré et rassurant : beaucoup de blanc, palette bleu ciel/blanc, typographie lisible, mobile-first. Aucun compteur artificiel, aucune urgence factice, aucune publicité tierce.

## Détails techniques
- Stack du projet : TanStack Start (React 19 + Tailwind v4) avec rendu serveur — les métadonnées et le contenu des pages destinations sont générés côté serveur via `head()` par route, pas injectés en JS.
- Backend Lovable Cloud activé pour : cache des prix (table `price_quotes`), historique mensuel pour les graphiques (`price_history`), et contenu éditorial des routes (`routes` : slug, villes, IATA, texte, FAQ).
- Appels Travelpayouts uniquement côté serveur via des server functions (`src/lib/flights.functions.ts`) : le token API n'est jamais exposé au navigateur. Endpoints utilisés : `prices_for_dates` (résultats), `latest`/`month-matrix` (mode budget + graphiques), lien d'affiliation avec le marker pour la redirection.
- Cache serveur des réponses (quelques heures) pour la vitesse et le quota API.
- Il me faudra un token API Travelpayouts + votre marker d'affiliation ; je les demanderai en secret projet au moment de l'intégration. Sans eux, les pages fonctionneront avec un jeu de données de démonstration clairement identifié.

## Hors périmètre (V2)
Carte interactive, alertes prix par email, comptes utilisateurs, multi-langue.
