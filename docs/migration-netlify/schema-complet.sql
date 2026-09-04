-- ============================================================================
-- TrouveMonVol — schéma complet, à rejouer sur un projet Supabase vierge.
--
-- Concaténation des 14 migrations du dépôt, dans l'ordre chronologique, moins
-- ce qui est spécifique à la plateforme Lovable (détaillé en fin de fichier).
--
-- Structure uniquement : aucune donnée. Rejouable sans erreur.
--
-- ----------------------------------------------------------------------------
-- AVANT DE COLLER : extensions à activer
--
-- Une seule est indispensable :
--
--   pgcrypto — pour `gen_random_bytes()`, utilisé comme valeur par défaut du
--              jeton de désinscription des alertes prix. `gen_random_uuid()`
--              est native depuis PostgreSQL 13 et n'exige rien.
--
-- Sur Supabase elle est activée par défaut dans le schéma `extensions`, et le
-- `search_path` de la base l'y trouve. Si la création de `price_alerts` échoue
-- sur `gen_random_bytes`, qualifier l'appel : `extensions.gen_random_bytes(24)`.
--
-- pg_cron, pg_net et vault ne sont PAS nécessaires : la planification passe
-- désormais par les fonctions planifiées Netlify, pas par la base.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ============================================================================
-- 1. Prix : alertes, historique, cache
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.price_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  depart_date date,
  return_date date,
  currency text NOT NULL DEFAULT 'EUR',
  initial_price numeric NOT NULL,
  last_price numeric NOT NULL,
  last_checked_at timestamp with time zone,
  unsubscribe_token text NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS price_alerts_active_idx
  ON public.price_alerts (active, last_checked_at);

CREATE UNIQUE INDEX IF NOT EXISTS price_alerts_unique_idx
  ON public.price_alerts (email, origin, destination, coalesce(depart_date, '1970-01-01'::date));

GRANT ALL ON public.price_alerts TO service_role;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.price_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  origin text NOT NULL,
  destination text NOT NULL,
  -- Mois de DÉPART du vol, toujours le 1er du mois. Ce n'est pas une date de
  -- relevé : cette table décrit une saisonnalité, pas une évolution.
  month date NOT NULL,
  lowest_price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  -- Date du relevé qui a produit le minimum stocké. NULL = inconnue.
  observed_at timestamp with time zone
);

CREATE UNIQUE INDEX IF NOT EXISTS price_history_unique_idx
  ON public.price_history (origin, destination, month);

GRANT SELECT ON public.price_history TO anon, authenticated;
GRANT ALL ON public.price_history TO service_role;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.price_cache (
  cache_key text NOT NULL PRIMARY KEY,
  payload jsonb NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS price_cache_expires_idx ON public.price_cache (expires_at);

GRANT ALL ON public.price_cache TO service_role;
ALTER TABLE public.price_cache ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Suite des prix relevés, en ajout seul : une ligne par couple, par mois de
-- départ et par jour d'observation. C'est elle qui rend l'évolution lisible.

CREATE TABLE IF NOT EXISTS public.price_observations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  origin text NOT NULL,
  destination text NOT NULL,
  departure_month date NOT NULL,
  lowest_price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'eur',
  observed_on date NOT NULL DEFAULT ((now() AT TIME ZONE 'utc')::date),
  observed_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT price_observations_un_releve_par_jour
    UNIQUE (origin, destination, departure_month, observed_on)
);

CREATE INDEX IF NOT EXISTS price_observations_route_idx
  ON public.price_observations (origin, destination, departure_month, observed_on DESC);

GRANT SELECT ON public.price_observations TO anon, authenticated;
GRANT ALL ON public.price_observations TO service_role;
ALTER TABLE public.price_observations ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Textes éditoriaux propres à chaque page de liaison générée : ce qui empêche
-- deux destinations d'une même origine de se ressembler mot pour mot.
-- `source_snapshot` garde les données transmises au modèle, pour vérifier après
-- coup qu'aucun chiffre du texte n'a été inventé.

CREATE TABLE IF NOT EXISTS public.route_editorials (
  route_slug text PRIMARY KEY,
  origin text NOT NULL,
  destination text NOT NULL,
  meta_description text NOT NULL,
  intro text NOT NULL,
  sections jsonb NOT NULL,
  model text NOT NULL,
  input_tokens integer,
  output_tokens integer,
  source_snapshot jsonb,
  published boolean NOT NULL DEFAULT true,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  -- Photo de la ville d'arrivée relevée à la rédaction (Wikipédia, puis Pexels).
  -- NULL quand aucune source n'a d'image de CETTE ville : la page reprend alors
  -- son visuel d'ambiance, ce qui vaut mieux qu'une photo d'une autre ville.
  image_url text,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS route_editorials_generated_at_idx
  ON public.route_editorials (generated_at ASC);

GRANT SELECT ON public.route_editorials TO anon, authenticated;
GRANT ALL ON public.route_editorials TO service_role;
ALTER TABLE public.route_editorials ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_route_editorials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE TRIGGER route_editorials_updated_at
  BEFORE UPDATE ON public.route_editorials
  FOR EACH ROW EXECUTE FUNCTION public.set_route_editorials_updated_at();

-- ============================================================================
-- 2. Exploitation : journal, contact, newsletter
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ops_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  kind text NOT NULL,
  label text NOT NULL,
  ok boolean NOT NULL DEFAULT true,
  status integer,
  result_count integer,
  duration_ms integer,
  message text,
  context jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS ops_logs_created_at_idx ON public.ops_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS ops_logs_kind_idx ON public.ops_logs (kind, created_at DESC);

GRANT ALL ON public.ops_logs TO service_role;
ALTER TABLE public.ops_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. Guides éditoriaux
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.guide_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  city text NOT NULL,
  country text NOT NULL,
  origin text NOT NULL DEFAULT 'PAR',
  destination text NOT NULL,
  route_slug text NOT NULL,
  status text NOT NULL DEFAULT 'souhaite',
  draft jsonb,
  generated_at timestamp with time zone,
  published_at timestamp with time zone,
  -- Même rôle que sur route_editorials : photo de la ville du guide, ou NULL.
  image_url text,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.guide_requests TO service_role;
ALTER TABLE public.guide_requests ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_guide_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- CREATE OR REPLACE TRIGGER exige PostgreSQL 14+. Supabase est au-delà.
CREATE OR REPLACE TRIGGER guide_requests_updated_at
  BEFORE UPDATE ON public.guide_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_guide_requests_updated_at();

-- ============================================================================
-- 4. Politiques RLS
--
-- Deux régimes seulement :
--   • lecture publique  — prix déjà affichés sur le site ;
--   • aucun accès       — tout le reste. Le rôle de service contourne RLS,
--                         c'est lui qui écrit.
--
-- `CREATE POLICY` n'accepte pas IF NOT EXISTS : chaque création est donc
-- conditionnée à son absence, ce qui rend le fichier rejouable.
-- ============================================================================

DO $$
DECLARE
  p record;
BEGIN
  FOR p IN
    SELECT * FROM (VALUES
      ('price_history',          'Price history is publicly readable',        'SELECT', 'true'),
      ('price_observations',     'Lecture publique des releves de prix',      'SELECT', 'true'),
      ('route_editorials',       'Lecture publique des textes publies',       'SELECT', 'published = true'),
      ('price_alerts',           'Aucun acces public aux alertes prix',       'ALL',    'false'),
      ('price_cache',            'Aucun acces public au cache de prix',       'ALL',    'false'),
      ('ops_logs',               'Aucun acces public au journal',             'ALL',    'false'),
      ('contact_messages',       'Aucun acces public aux messages de contact','ALL',    'false'),
      ('newsletter_subscribers', 'Aucun acces public aux inscrits newsletter','ALL',    'false'),
      ('guide_requests',         'Aucun acces public aux demandes de guides', 'ALL',    'false')
    ) AS t(table_name, policy_name, cmd, predicate)
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = p.table_name AND policyname = p.policy_name
    ) THEN
      IF p.cmd = 'SELECT' THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (%s)',
          p.policy_name, p.table_name, p.predicate);
      ELSE
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR ALL TO anon, authenticated USING (%s) WITH CHECK (%s)',
          p.policy_name, p.table_name, p.predicate, p.predicate);
      END IF;
    END IF;
  END LOOP;
END
$$;

-- ============================================================================
-- CE QUI A ÉTÉ VOLONTAIREMENT ÉCARTÉ (spécifique à Lovable)
--
-- 1. 20260901205852 — fonction `configurer_taches_planifiees(text, text)`
--    Programmait deux tâches pg_cron appelant les endpoints HTTP du site via
--    `net.http_post`. Exige pg_cron ET pg_net. Supprimée par une migration
--    ultérieure du même lot, et remplacée ici par les fonctions planifiées
--    Netlify. NE PAS REJOUER.
--
-- 2. 20260901205949 — `grant usage on schema cron to postgres` (et al.)
--    Élargit les droits sur le schéma `cron` de la plateforme. Sans objet hors
--    pg_cron. NE PAS REJOUER.
--
-- 3. 20260901210055 — table `job_secrets`
--    Ne servait qu'à stocker le secret que la tâche pg_cron devait présenter
--    aux endpoints HTTP. Les fonctions planifiées Netlify s'exécutent dans le
--    même projet et lisent les variables d'environnement directement : il n'y
--    a plus de secret à faire transiter. NE PAS REJOUER.
--
-- Rien d'autre dans les migrations du bot n'est spécifique à la plateforme :
-- 20260901205923 est la reprise mot pour mot de notre propre migration
-- saisonnalité, déjà incluse plus haut.
-- ============================================================================

-- ============================================================================
-- VÉRIFICATION APRÈS EXÉCUTION
-- ============================================================================
-- SELECT
--   (SELECT count(*) FROM information_schema.tables
--      WHERE table_schema = 'public') AS tables,
--   (SELECT count(*) FROM pg_policies WHERE schemaname = 'public') AS politiques,
--   (SELECT count(*) FROM pg_indexes  WHERE schemaname = 'public') AS index;
-- Attendu : 9 tables, 9 politiques, 20 index (clés primaires comprises).
