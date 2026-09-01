# Migration Lovable → Netlify

Ordre d'exécution. Chaque étape suppose la précédente vérifiée.

---

## 0. Avant tout : sortir les données irremplaçables

`price_alerts` et `newsletter_subscribers` sont les deux seules tables qui ne se
reconstruisent pas. Tout le reste — prix, cache, journal, guides — se régénère
depuis la source tarifaire.

**Trois chemins, du plus sûr au moins souhaitable.**

**A. Demander à l'agent Lovable.** Il a un accès SQL au projet : c'est lui qui a
appliqué les migrations. Lui demander en chat d'exporter les deux tables en JSON
ne demande aucun déploiement et n'expose rien. À essayer en premier.

**B. La section Cloud / Base de l'interface Lovable**, si elle expose un éditeur
SQL :

```sql
SELECT count(*) AS alertes FROM public.price_alerts;
SELECT count(*) AS inscrits FROM public.newsletter_subscribers;

SELECT json_agg(t) FROM public.price_alerts t;
SELECT json_agg(t) FROM public.newsletter_subscribers t;
```

**C. L'endpoint d'export**, `src/routes/api/public/exporter-donnees.ts`, en
dernier recours. Il n'est utile que déployé, donc **sur `main`** — la branche
`netlify` n'est pas construite par leur pipeline. Il expose des adresses
e-mail : à supprimer aussitôt l'export vérifié.

```bash
curl.exe -s -H "x-admin-token: <ADMIN_LOGS_TOKEN>" https://trouvemonvol.fr/api/public/exporter-donnees -o export.json
```

Si la réponse est `503`, `ADMIN_LOGS_TOKEN` n'est pas définie et il faut la
créer côté Lovable avant de réessayer.

**Vérification obligatoire avant de continuer :** le nombre de lignes de
l'export doit correspondre au `count(*)` de la base. Un export tronqué ne se
voit pas à l'œil.

---

## 1. Base de données

Coller `schema-complet.sql` dans l'éditeur SQL du projet Supabase vierge.
Attendu : 8 tables, 8 politiques, 18 index (les index implicites des contraintes
`UNIQUE` sont comptés).

Puis réimporter les deux tables exportées à l'étape 0.

---

## 2. Variables d'environnement Netlify

Dans l'ordre. *Site configuration → Environment variables.*

### Base de données — depuis le nouveau projet Supabase

| Variable | Où la trouver | Portée |
|---|---|---|
| `SUPABASE_URL` | Project Settings → API → Project URL | serveur |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` | **serveur seul** |
| `SUPABASE_PUBLISHABLE_KEY` | Project Settings → API → `anon` / publishable | serveur |
| `SUPABASE_PROJECT_ID` | l'identifiant du projet | serveur |
| `VITE_SUPABASE_URL` | même valeur que `SUPABASE_URL` | **client** |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | même valeur que `SUPABASE_PUBLISHABLE_KEY` | **client** |
| `VITE_SUPABASE_PROJECT_ID` | même valeur que `SUPABASE_PROJECT_ID` | **client** |

> Le préfixe `VITE_` place la valeur dans le bundle JavaScript, lisible par
> n'importe quel visiteur. **Ne jamais préfixer `SUPABASE_SERVICE_ROLE_KEY`.**
> C'est exactement ce préfixe qui avait transformé la clé publiable en fausse
> protection sur les tâches planifiées.

### Source tarifaire — depuis le tableau de bord Travelpayouts

| Variable | Note |
|---|---|
| `TRAVELPAYOUTS_TOKEN` | relisible chez eux, à recopier tel quel |
| `TRAVELPAYOUTS_MARKER` | identifiant d'affiliation |

### E-mail — Resend

| Variable | Note |
|---|---|
| `RESEND_API_KEY` | clé API Resend (`re_…`) |
| `ALERTS_FROM_EMAIL` | expéditeur, sur un domaine vérifié chez Resend |

### Génération de guides — Anthropic

| Variable | Note |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com |

### Administration

| Variable | Note |
|---|---|
| `ADMIN_LOGS_TOKEN` | à régénérer, ne pas réutiliser l'ancienne |

### Ce qui disparaît

`LOVABLE_API_KEY`, `LOVABLE_SEND_URL`, `LOVABLE_CRON_SECRET`,
`LOVABLE_CRON_SECRET_PREVIOUS`, `CRON_SECRET`, `PRICE_REFRESH_SECRET`,
`ALERTS_CRON_SECRET`.

Les quatre dernières n'existaient que pour authentifier des endpoints HTTP
déclenchés par un planificateur externe. Les fonctions planifiées Netlify ne
sont pas appelables par URL : **il n'y a plus rien à authentifier.**

---

## 3. Remplir la base neuve

Une base vierge donne un site sans aucun prix, et les fonctions planifiées **ne
s'exécutent pas sur une préversion** — uniquement sur le déploiement publié.

Deux façons d'amorcer, à choisir :

**Depuis un poste, avant la bascule DNS.** Le plus simple : les scripts
existants tournent en local avec les variables du nouveau projet.

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... TRAVELPAYOUTS_TOKEN=... node scripts/amorcer-base.mjs
```

*(script à écrire — il enchaîne `refreshFlightPrices` puis `ingestSeasonality`
jusqu'à `routesRestantes === 0`)*

**Après publication.** Déclencher les deux fonctions planifiées à la main depuis
*Netlify → Functions → Run*, puis attendre. La saisonnalité demande 6 passages
pour couvrir les 128 routes.

Dans les deux cas, l'ordre compte : **le rafraîchissement des prix d'abord**
(il alimente `price_cache`, dont dépendent les pages d'accueil et de recherche),
la saisonnalité ensuite.

---

## 4. Domaine

Le domaine est chez **Gandi**, sous ton contrôle. Il pointe aujourd'hui vers
l'ingress Lovable (`185.158.133.1` → `lovable-app-cd-1-4.p.l5e.io`).

1. Abaisser le TTL à 300 s **quelques heures avant** la bascule.
2. Vérifier la préversion Netlify de bout en bout.
3. Remplacer l'enregistrement par la cible Netlify.
4. Laisser Lovable en ligne 48 h : en cas de retour arrière, il suffit de
   remettre l'ancien enregistrement.

---

## 5. Reste à faire après la bascule

- Retirer le repli sur la clé publiable dans `job-auth.server.ts` (dette
  assumée, tracée dans le code).
- Supprimer `src/routes/api/public/exporter-donnees.ts`.
- Supprimer les endpoints `rafraichir-prix` et `relever-saisonnalite`, devenus
  redondants avec les fonctions planifiées.
- Sortir de `@lovable.dev/vite-tanstack-config` (voir `vite.config.ts`).
- Retirer `@lovable.dev/email-js` et `@lovable.dev/webhooks-js`.
