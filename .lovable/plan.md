# TrouveMonVol — MVP

Comparateur de vols transparent, orienté SEO, avec recherche par budget, vendeur toujours identifié et alertes prix par email.

## Ce qui sera livré

### 1. Page d'accueil (`/`)
- Barre de recherche mobile-first : départ, destination (optionnelle), dates (+ option « dates flexibles ± 3 jours »), budget max optionnel.
- Si aucune destination : grille des destinations les moins chères depuis la ville de départ.
- Section « Pourquoi nous » : prix tout compris, vendeur identifié, zéro dark pattern, zéro publicité.
- H1 clair, texte indexable rendu côté serveur, liens internes vers les 10 pages destinations.

### 2. Résultats de recherche (`/recherche`)
- Liste triée par prix, filtres : escales, compagnie, plage horaire, durée.
- Chaque offre : prix total taxes incluses, bagages inclus (cabine/soute quand l'API le fournit), compagnie, durée, escales.
- Vendeur réel affiché explicitement sous chaque résultat (« Vendu par Air France », « Vendu par Kiwi.com ») à partir du champ `gate`/`agent` de l'API ; aucun résultat sans vendeur nommé.
- Bouton « Réserver » menant directement à ce vendeur via le lien d'affiliation Travelpayouts, sans page intermédiaire ni cascade de redirections.
- Mention de confiance : « Prix garanti sans frais cachés — vous payez ce qui est affiché ici ».
- Bouton « Être alerté si le prix baisse sur ce trajet ».

### 3. Pages destinations SEO (`/vols-pas-chers/paris-marrakech`, etc.)
10 routes populaires au départ de Paris (Marrakech, Bangkok, New York, Lisbonne, Barcelone, Istanbul, Dubaï, Tokyo, Alger, Rome).
Chaque page, rendue côté serveur :
- Texte unique 300-500 mots (destination, meilleures périodes, conseils prix).
- Prix le plus bas relevé récemment.
- Graphique d'évolution des prix sur 12 mois.
- FAQ avec balisage schema.org FAQPage.
- Meta title/description/Open Graph uniques.
- Bloc d'inscription à l'alerte prix pour ce trajet.

### 4. Mode Budget (`/mode-budget`)
Budget + ville de départ (+ mois optionnel) → liste des destinations atteignables, triées par prix croissant. Pas de carte interactive en V1.

### 5. Alertes prix par email
- Inscription en un champ (email seul, aucun compte à créer) depuis les résultats et les pages destinations : trajet + dates + prix de référence enregistrés.
- Vérification quotidienne automatique du prix ; email envoyé uniquement si le prix a baissé.
- Lien de désinscription dans chaque email (token unique).

### 6. Page « Comment on gagne de l'argent » (`/comment-on-gagne-de-l-argent`)
Texte court et transparent : commission d'affiliation à la réservation, sans surcoût pour l'utilisateur. Lien discret dans le footer.

### 7. SEO technique
- `sitemap.xml` généré automatiquement (accueil, mode budget, page transparence, toutes les pages destinations).
- `robots.txt` avec référence au sitemap.
- URLs propres, lazy loading des images, images optimisées, rendu serveur du contenu indexable.

## Design
Épuré et rassurant : beaucoup de blanc, palette bleu ciel/blanc, typographie lisible, mobile-first. Aucun compteur artificiel, aucune urgence factice, aucune publicité tierce.

## Détails techniques
- Stack du projet : TanStack Start (React 19 + Tailwind v4) avec rendu serveur — métadonnées et contenu générés côté serveur via `head()` par route, pas injectés en JS.
- Backend Lovable Cloud activé pour : cache des prix (`price_quotes`), historique mensuel des prix (`price_history`), contenu éditorial des routes (`routes` : slug, villes, IATA, texte, FAQ), et alertes (`price_alerts` : trajet, dates, email, prix initial, dernier prix, token de désinscription) avec RLS restrictive (écriture via server function, aucune lecture publique des emails).
- Appels Travelpayouts uniquement côté serveur via server functions (`src/lib/flights.functions.ts`) : le token n'est jamais exposé au navigateur. Endpoints : `prices_for_dates` (résultats), `latest`/`month-matrix` (mode budget + graphiques), lien d'affiliation avec marker pour la redirection.
- Cron quotidien (pg_cron) appelant un endpoint `/api/public/check-alerts` protégé par secret, qui recompare les prix et déclenche les emails.
- Envoi d'emails via Lovable Emails (aucun compte externe requis) ; un domaine d'expédition vérifié sera nécessaire pour la production.
- Cache serveur des réponses API (quelques heures) pour la vitesse et le quota.
- Il me faudra un token API Travelpayouts + votre marker d'affiliation ; je les demanderai en secret projet au moment de l'intégration. Sans eux, les pages fonctionneront avec un jeu de données de démonstration clairement identifié.

## Hors périmètre (V2)
Carte interactive du mode budget, comparaison aéroports secondaires et badge « prix historiquement bas » (nécessite d'accumuler l'historique), comptes utilisateurs, blog et guides visa, calculateur de coût réel, multi-langue.
