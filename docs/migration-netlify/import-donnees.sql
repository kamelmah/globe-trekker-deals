-- ============================================================================
-- Réimport des trois tables non régénérables dans le projet Supabase personnel.
--
-- À exécuter APRÈS schema-complet.sql, dans l'éditeur SQL de azcrawgizygplwfjmsgh.
--
-- ----------------------------------------------------------------------------
-- CE QUE DOIT CONTENIR L'EXPORT
--
-- Un tableau JSON par table, dont chaque objet a pour clés les noms de colonnes.
-- C'est le format que produisent PostgREST, `json_agg`, et la plupart des
-- exports Supabase. Exemple pour newsletter_subscribers :
--
--   [
--     {"id":"3f2b…","email":"a@b.fr","source":"footer","active":true,
--      "created_at":"2026-08-30T12:00:00+00:00"}
--   ]
--
-- Colonnes attendues, dans n'importe quel ordre :
--
--   price_alerts            id, email, origin, destination, depart_date,
--                           return_date, currency, initial_price, last_price,
--                           last_checked_at, unsubscribe_token, active, created_at
--   newsletter_subscribers  id, email, source, active, created_at
--   contact_messages        id, name, email, subject, message, created_at
--
-- ----------------------------------------------------------------------------
-- POURQUOI ON RÉIMPORTE LES `id`, `created_at` ET SURTOUT `unsubscribe_token`
--
-- `unsubscribe_token` est le seul lien entre un e-mail DÉJÀ ENVOYÉ et l'alerte
-- correspondante. Le laisser se régénérer casserait tous les liens de
-- désinscription déjà dans les boîtes de réception des inscrits — un lien de
-- désinscription qui ne fonctionne plus n'est pas un détail technique.
--
-- Même raisonnement pour `id` et `created_at` : on restaure, on ne recrée pas.
--
-- ----------------------------------------------------------------------------
-- POURQUOI `json_populate_recordset`
--
-- Il fait correspondre les clés JSON aux colonnes de la table par leur NOM. Ni
-- l'ordre ni le nombre de colonnes de l'export n'ont d'importance, et une
-- colonne absente prend sa valeur par défaut. C'est beaucoup plus sûr qu'un
-- INSERT positionnel, où une colonne décalée passerait inaperçue.
--
-- `ON CONFLICT DO NOTHING` sans cible couvre toutes les contraintes (clé
-- primaire, unicité sur l'e-mail, index unique des alertes) : le script est
-- donc rejouable, et un import partiel se reprend sans doublon.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Alertes prix
-- ---------------------------------------------------------------------------
INSERT INTO public.price_alerts
SELECT * FROM json_populate_recordset(
  null::public.price_alerts,
  $json$
  [ COLLER ICI LE TABLEAU JSON DE price_alerts ]
  $json$::json
)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Inscrits à la lettre d'information
-- ---------------------------------------------------------------------------
INSERT INTO public.newsletter_subscribers
SELECT * FROM json_populate_recordset(
  null::public.newsletter_subscribers,
  $json$
  [ COLLER ICI LE TABLEAU JSON DE newsletter_subscribers ]
  $json$::json
)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 3. Messages de contact
-- ---------------------------------------------------------------------------
INSERT INTO public.contact_messages
SELECT * FROM json_populate_recordset(
  null::public.contact_messages,
  $json$
  [ COLLER ICI LE TABLEAU JSON DE contact_messages ]
  $json$::json
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VÉRIFICATION — à lancer juste après, et à comparer aux comptes de la source
-- ============================================================================
SELECT 'price_alerts'           AS table, count(*) AS lignes FROM public.price_alerts
UNION ALL
SELECT 'newsletter_subscribers', count(*) FROM public.newsletter_subscribers
UNION ALL
SELECT 'contact_messages',       count(*) FROM public.contact_messages;

-- Contrôle de cohérence des alertes : aucun jeton de désinscription ne doit
-- manquer ni être dupliqué, sinon des désinscriptions échoueraient en silence.
SELECT count(*) FILTER (WHERE unsubscribe_token IS NULL)      AS jetons_manquants,
       count(*) - count(DISTINCT unsubscribe_token)           AS jetons_dupliques,
       count(*) FILTER (WHERE active)                         AS alertes_actives
FROM public.price_alerts;

-- ============================================================================
-- SI L'EXPORT LOVABLE EST EN CSV PLUTÔT QU'EN JSON
--
-- Ne pas convertir à la main. Passer par l'interface Supabase :
--   Table Editor → sélectionner la table → Insert → Import data from CSV.
--
-- Elle fait correspondre les colonnes par leur en-tête et signale les écarts.
-- Vérifier ensuite avec les mêmes requêtes de contrôle ci-dessus.
--
-- Attention aux booléens (`active`) et aux dates nulles (`depart_date`,
-- `return_date`, `last_checked_at`) : un CSV note souvent NULL comme une chaîne
-- vide, que l'import doit interpréter comme NULL et non comme du texte.
-- ============================================================================
