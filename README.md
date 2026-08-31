# Budget Flights Finder

Prompt à coller dans Lovable

Je veux construire une web app appelée TrouveMonVol, un comparateur de vols pensé pour être bien référencé sur Google dès le lancement et pour se différencier de Skyscanner par la transparence et la recherche par budget/dates flexibles.

Concept

Un comparateur de vols qui agrège les prix via l'API Travelpayouts (Aviasales), avec deux angles forts que les gros comparateurs ne font pas bien :

Recherche "j'ai un budget X, montre-moi où je peux partir" (pas besoin de connaître sa destination à l'avance)

Aucune publicité intrusive, aucun faux compte à rebours, prix affichés avec tous les frais visibles dès le départ

Stack technique

Frontend React + Tailwind

Backend Supabase (base de données + auth + edge functions pour appeler l'API externe côté serveur, jamais côté client, pour ne pas exposer la clé API)

Intégration API Travelpayouts (Aviasales Flight Search API) pour les prix de vols en temps réel et le tracking d'affiliation

Rendu des pages optimisé pour le SEO : chaque page doit avoir des meta tags dynamiques (title, description, Open Graph) générés côté serveur, pas seulement côté client

Pages à créer

1. Page d'accueil

Barre de recherche principale : ville de départ, destination (optionnelle — peut rester vide pour le mode "budget"), dates (avec option "dates flexibles ± 3 jours"), budget max (optionnel)

Si aucune destination n'est renseignée : afficher une grille de destinations triées par prix croissant depuis la ville de départ

Section "pourquoi nous" mettant en avant la transparence des prix (pas de frais cachés) et l'absence de dark patterns

Doit inclure un H1 clair, du texte descriptif indexable (pas juste une app JS vide), et des liens internes vers les pages de destinations populaires

2. Pages de résultats de recherche

Liste des vols triés par prix, avec filtres (escales, compagnie, horaires, durée)

Chaque prix doit afficher clairement : prix total, taxes incluses, ce qui est inclus (bagage cabine/soute)

Bouton de réservation qui redirige vers le partenaire via le lien d'affiliation Travelpayouts

3. Pages destinations dédiées (SEO — la partie la plus importante)

Génère une page statique/indexable pour chaque route populaire, au format /vols-pas-chers/paris-marrakech, /vols-pas-chers/paris-bangkok, etc.

Chaque page doit contenir : un texte unique de 300-500 mots sur la destination et les meilleures périodes pour y aller, le prix le plus bas trouvé récemment, un graphique d'évolution des prix sur les 12 derniers mois, une FAQ (schema.org FAQPage) avec des questions comme "quel est le meilleur mois pour aller à [destination] pas cher"

But : capter le trafic Google longue traîne sur "vol pas cher [ville A] [ville B]"

Génère automatiquement un sitemap.xml qui liste toutes ces pages destinations

4. Page "Mode Budget"

L'utilisateur entre son budget et sa ville de départ, sans destination

Résultat : carte interactive ou liste de toutes les destinations accessibles avec ce budget, triées par prix

Exigences SEO techniques impératives

Rendu server-side ou pré-rendu (pas de contenu important uniquement injecté en JS côté client) pour que Google puisse indexer le texte

Meta title et meta description uniques et dynamiques par page (pas de titre générique répété)

Balises Open Graph pour un bon partage sur réseaux sociaux

URLs propres et lisibles (pas de paramètres illisibles dans l'URL des pages destinations)

Temps de chargement rapide : lazy loading des images, compression

Sitemap.xml et robots.txt générés automatiquement

Design

Épuré, rassurant, beaucoup de blanc, aucune publicité tierce, aucun compteur artificiel de "places restantes"

Palette simple (bleu/blanc type ciel), typographie lisible

Mobile-first : la majorité du trafic recherche de vols vient du mobile

MVP (première version à livrer)

Page d'accueil avec recherche classique (départ, arrivée, dates)

Connexion à l'API Travelpayouts pour afficher des résultats réels

10 pages destinations statiques pour les routes les plus recherchées au départ de Paris

Mode budget basique (liste, sans carte interactive dans un premier temps)

V2 (à ne pas construire tout de suite)

Carte interactive pour le mode budget

Alertes prix par email

Comptes utilisateurs et historique de recherche

Multi-langue pour attaquer d'autres marchés

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://globe-trekker-deals.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bd538714-3dcd-40ba-b7e1-59552777d589).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
