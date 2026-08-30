# TrouveMonVol — MVP

Comparateur de vols transparent, orienté SEO : recherche par budget sur carte du monde, vendeur toujours identifié, alertes prix par email.

## Ce qui sera livré

### 1. Page d'accueil (`/`)
- Barre de recherche mobile-first : départ, destination (optionnelle), dates (+ « dates flexibles ± 3 jours »), budget max optionnel.
- Si aucune destination : grille des destinations les moins chères depuis la ville de départ.
- Section « Pourquoi nous » : prix tout compris, vendeur identifié, zéro dark pattern, zéro publicité.
- H1 clair, texte indexable rendu côté serveur, liens internes vers les pages destinations, le mode budget et le blog.

### 2. Résultats de recherche (`/recherche`)
- Liste triée par prix ; filtres escales, compagnie, plage horaire, durée.
- Chaque offre : prix total taxes incluses, bagages inclus (quand l'API le fournit), compagnie, durée, escales.
- Vendeur réel nommé sous chaque résultat (« Vendu par Air France », « Vendu par Kiwi.com ») via le champ `gate`/`agent` ; jamais d'intermédiaire anonyme.
- Bouton « Réserver » menant directement à ce vendeur via le lien d'affiliation, sans page intermédiaire.
- Mention « Prix garanti sans frais cachés — vous payez ce qui est affiché ici ».
- Estimation CO2 par vol (distance + segments ; méthode expliquée) et badge « vol plus écologique » sur l'option la moins émettrice quand elle n'est pas déjà la moins chère.
- Sélecteur de devise global (EUR par défaut, USD/GBP/CHF/CAD), mémorisé côté navigateur.
- Vue alternative « Calendrier » : grille d'un mois, prix le plus bas par jour de départ, code couleur vert/orange/rouge.
- Bouton « Être alerté si le prix baisse sur ce trajet ».

### 3. Pages destinations SEO (`/vols-pas-chers/paris-marrakech`, …)
10 routes au départ de Paris (Marrakech, Bangkok, New York, Lisbonne, Barcelone, Istanbul, Dubaï, Tokyo, Alger, Rome), rendues côté serveur :
- Texte unique 300-500 mots (destination, meilleures périodes, conseils prix).
- Prix le plus bas relevé récemment + graphique d'évolution sur 12 mois.
- FAQ balisée schema.org FAQPage.
- Meta title/description/Open Graph uniques, bloc d'alerte prix, liens vers articles du blog.

### 4. Mode Budget — carte du monde (`/mode-budget`)
- Carte interactive plein écran (Leaflet + tuiles libres, aucun compte tiers requis), pins par destination avec prix au survol/clic, zoom et déplacement libres.
- Destinations hors budget affichées en grisé plutôt que masquées.
- Panneau latéral (bas d'écran sur mobile) listant les mêmes destinations, synchronisé avec la carte.
- Au premier chargement, sans recherche : destinations populaires au départ de Paris déjà affichées.
- Carte chargée uniquement côté client ; un résumé texte rendu côté serveur reste indexable.

### 5. Blog conseils (`/conseils`, `/conseils/<slug>`)
5 articles au lancement (600-1000 mots, ton concret) : trouver un vol pas cher, meilleur moment pour réserver, à l'avance ou dernière minute, comment les compagnies fixent leurs prix, éviter les frais cachés. Meta uniques par article, liens internes vers destinations et mode budget.

### 6. FAQ générale (`/faq`)
Accordéon sur le fonctionnement du site (prix qui changent, aucun surcoût, alertes, qui vend le billet), balisage FAQPage, lien en footer.

### 7. Alertes prix par email
- Inscription en un champ (email seul, aucun compte) depuis les résultats et les pages destinations : trajet, dates, prix de référence.
- Vérification quotidienne automatique ; email envoyé seulement si le prix baisse. Lien de désinscription par token.

### 8. Page « Comment on gagne de l'argent »
Explication courte : commission d'affiliation à la réservation, sans surcoût pour l'utilisateur. Lien discret en footer.

### 9. SEO technique
`sitemap.xml` généré automatiquement (accueil, mode budget, destinations, articles, FAQ, transparence), `robots.txt`, URLs propres, lazy loading des images, contenu indexable rendu côté serveur.

## Design
Épuré et rassurant : beaucoup de blanc, palette bleu ciel/blanc, typographie lisible, mobile-first. Aucun compteur artificiel, aucune urgence factice, aucune publicité tierce.

## Détails techniques
- Stack du projet : TanStack Start (React 19 + Tailwind v4) avec rendu serveur — métadonnées et contenu via `head()` par route, pas injectés en JS côté client.
- Lovable Cloud activé pour : `routes` (slug, villes, IATA, texte, FAQ), `price_quotes` (cache), `price_history` (graphiques 12 mois), `price_alerts` (trajet, dates, email, prix initial, dernier prix, token), `posts` ou contenu fichier pour le blog. RLS restrictive : lecture publique du contenu éditorial uniquement, alertes écrites via server function, emails jamais exposés.
- Appels Travelpayouts uniquement côté serveur via server functions (`src/lib/flights.functions.ts`) ; token jamais exposé. Endpoints : `prices_for_dates` (résultats), `month-matrix`/`calendar` (vue calendrier + graphiques), `latest`/`cheapest destinations` (mode budget), lien d'affiliation avec marker.
- Conversion de devises côté serveur avec taux mis en cache ; prix affichés toujours convertis depuis la réponse API.
- Cron quotidien (pg_cron) vers un endpoint `/api/public/check-alerts` protégé par secret ; envoi via Lovable Emails (un domaine d'expédition vérifié sera nécessaire en production).
- Carte : Leaflet importé dynamiquement après hydratation (jamais dans le graphe SSR).
- Il me faudra un token API Travelpayouts + votre marker d'affiliation, demandés en secret projet au moment de l'intégration. Sans eux, l'app tourne sur un jeu de données de démonstration clairement identifié.
- Volume important : je livrerai dans cet ordre — fondations et design system, recherche + API, pages destinations + SEO, mode budget carte, calendrier + CO2 + devises, blog/FAQ/transparence, alertes email.

## Hors périmètre (V2)
Carte comme page d'accueil principale, aéroports secondaires et badge « prix historiquement bas », comptes utilisateurs, guides visa, calculateur de coût réel, partage WhatsApp/Instagram, multi-langue.
