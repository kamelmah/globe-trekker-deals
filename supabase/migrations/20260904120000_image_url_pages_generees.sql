-- Photo de la ville de destination, sur les deux tables de contenu généré.
--
-- POURQUOI. Une page générée n'a de photo de sa ville que si quelqu'un l'a
-- déposée dans `src/data/city-photos.ts`, ou si elle fait partie des vingt-quatre
-- villes curées. Partout ailleurs, c'est le visuel neutre : honnête, mais il ne
-- dit rien de la destination, et il ne sera pas écrit à la main sept cents fois.
--
-- La colonne porte l'URL d'une photo de LA ville, relevée à la génération par
-- `src/lib/city-image.server.ts` (Wikipédia puis Pexels). Elle est nullable, et
-- c'est délibéré : quand aucune source ne donne d'image de la bonne ville, on
-- laisse NULL et la page garde son visuel local. Une URL fausse serait pire
-- qu'une absence.
--
-- Une entrée de `city-photos` passe devant cette colonne : elle a été regardée,
-- choisie et légendée, ce qu'un relevé automatique ne sait pas faire.
--
-- Aucune donnée existante n'est touchée : les lignes déjà rédigées restent à
-- NULL jusqu'au passage de `scripts/backfill-city-images.ts`.

ALTER TABLE public.route_editorials
  ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.route_editorials.image_url IS
  'Photo de la ville de destination (Wikipédia ou Pexels). NULL = visuel local côté page.';

ALTER TABLE public.guide_requests
  ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.guide_requests.image_url IS
  'Photo de la ville du guide (Wikipédia ou Pexels). NULL = visuel local côté page.';

-- `route_editorials` est lue publiquement (politique « Lecture publique des
-- textes publies ») : la nouvelle colonne suit le même GRANT que les autres,
-- déjà accordé au niveau de la table. Rien à ajouter.
