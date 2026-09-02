-- Textes éditoriaux propres à chaque page de liaison générée.
--
-- Les pages /vols/<slug> générées partagent forcément leur structure : mêmes
-- sections, mêmes formulations, seuls les noms de villes changent. Mesuré entre
-- marseille-alger et marseille-oran, cela donnait 69 % de phrases identiques —
-- deux destinations d'une même origine desservies par les mêmes compagnies se
-- ressemblent trop pour que le gabarit suffise.
--
-- Cette table porte, par trajet, un texte rédigé à partir des données réelles de
-- CE trajet : prix plancher relevé et sa date, distance, compagnies, saisonnalité.
-- `source_snapshot` conserve exactement ce qui a été fourni au modèle, pour
-- pouvoir vérifier après coup qu'aucun chiffre du texte n'a été inventé.
--
-- Les pages éditoriales écrites à la main (src/data/destinations.ts) ne sont pas
-- concernées : elles ont déjà un texte propre.

CREATE TABLE IF NOT EXISTS public.route_editorials (
  route_slug text PRIMARY KEY,
  origin text NOT NULL,
  destination text NOT NULL,
  meta_description text NOT NULL,
  intro text NOT NULL,
  -- Tableau de { heading, paragraphs[] }, même forme que DestinationRoute.sections.
  sections jsonb NOT NULL,
  model text NOT NULL,
  input_tokens integer,
  output_tokens integer,
  -- Données transmises au modèle : sert d'audit, jamais de source d'affichage.
  source_snapshot jsonb,
  published boolean NOT NULL DEFAULT true,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- La tâche planifiée reprend les textes les plus anciens : l'index sert ce tri.
CREATE INDEX IF NOT EXISTS route_editorials_generated_at_idx
  ON public.route_editorials (generated_at ASC);

GRANT SELECT ON public.route_editorials TO anon, authenticated;
GRANT ALL ON public.route_editorials TO service_role;

ALTER TABLE public.route_editorials ENABLE ROW LEVEL SECURITY;

-- Lecture publique des seules lignes publiées. La page les lit côté serveur avec
-- la clé de service, mais on reste cohérent avec price_history : ce qui est
-- affiché publiquement est lisible publiquement, et un brouillon non publié ne
-- fuite pas.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'route_editorials'
      AND policyname = 'Lecture publique des textes publies'
  ) THEN
    CREATE POLICY "Lecture publique des textes publies"
      ON public.route_editorials FOR SELECT
      TO anon, authenticated
      USING (published = true);
  END IF;
END
$$;

-- Aucune politique d'écriture : seul le rôle de service écrit, en contournant RLS.

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
