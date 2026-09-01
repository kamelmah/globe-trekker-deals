-- Saisonnalité par mois de départ, et historique réel des prix.
--
-- `price_history` conserve, pour chaque couple et chaque MOIS DE DÉPART, le prix
-- le plus bas jamais observé — la ligne est écrasée à la baisse à chaque relevé.
-- C'est une courbe de saisonnalité, pas une évolution dans le temps.
--
-- `observed_at` date ce minimum : le site n'affiche jamais un prix sans dire
-- quand il a été relevé, et `updated_at` ne pouvait pas jouer ce rôle puisqu'il
-- bouge à chaque écriture, y compris quand la valeur ne change pas.
--
-- La colonne est NULLABLE et sans valeur par défaut, volontairement : remplir
-- les 112 lignes déjà présentes avec `now()` daterait de ce jour des relevés
-- faits avant. NULL veut dire « date de relevé inconnue », ce qui est vrai.
ALTER TABLE public.price_history
  ADD COLUMN IF NOT EXISTS observed_at timestamp with time zone;

COMMENT ON COLUMN public.price_history.observed_at IS
  'Date du relevé qui a produit le minimum stocké. NULL = inconnue (ligne antérieure à la colonne). À ne pas confondre avec updated_at, qui bouge à chaque écriture.';

-- Un minimum écrasé à la baisse ne pourra jamais dire « ce vol a baissé de 22 %
-- depuis juin » : l'information est détruite à l'écriture. L'évolution réelle
-- demande une table en AJOUT SEUL — une ligne par couple, par mois de départ et
-- par JOUR d'observation.
--
-- Volume attendu : ~1 500 lignes par passage mensuel complet, soit ~18 000 par
-- an. Rien qui demande de partitionner.
CREATE TABLE IF NOT EXISTS public.price_observations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  origin text NOT NULL,
  destination text NOT NULL,
  -- Toujours le 1er du mois, comme price_history.month.
  departure_month date NOT NULL,
  lowest_price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'eur',
  observed_on date NOT NULL DEFAULT ((now() AT TIME ZONE 'utc')::date),
  observed_at timestamp with time zone NOT NULL DEFAULT now(),
  -- Un relevé par jour et par mois de départ : deux passages le même jour
  -- corrigent la valeur au lieu d'empiler des doublons.
  CONSTRAINT price_observations_un_releve_par_jour
    UNIQUE (origin, destination, departure_month, observed_on)
);

COMMENT ON TABLE public.price_observations IS
  'Suite des prix relevés, en ajout seul. Le plus récent par mois de départ donne la saisonnalité courante ; la suite complète donne l''évolution dans le temps.';

-- La lecture d'une page ne demande qu'un couple : index sur le couple, puis le
-- mois de départ, puis l'observation la plus récente.
CREATE INDEX IF NOT EXISTS price_observations_route_idx
  ON public.price_observations (origin, destination, departure_month, observed_on DESC);

GRANT ALL ON public.price_observations TO service_role;
GRANT SELECT ON public.price_observations TO anon, authenticated;

ALTER TABLE public.price_observations ENABLE ROW LEVEL SECURITY;

-- Lecture publique : ces prix sont déjà affichés sur les pages destinations.
-- Aucune règle d'écriture n'est déclarée, donc aucune écriture n'est possible
-- hors du rôle de service — c'est le comportement voulu.
CREATE POLICY "Lecture publique des releves de prix"
  ON public.price_observations FOR SELECT
  TO anon, authenticated
  USING (true);