-- Photo de la ville de destination, sur les deux tables de contenu généré.
--
-- POURQUOI. Les pages générées n'avaient d'image que par `getDestinationImage`,
-- qui ne connaît qu'une trentaine de villes curées et retombe sinon sur une
-- ambiance régionale : une bannière de port grec sur un guide algérien, une dune
-- sur une page marocaine. Le visuel n'était donc relié à la ville que pour les
-- destinations les plus fréquentées.
--
-- La colonne porte l'URL d'une photo de LA ville, relevée à la génération par
-- `src/lib/city-image.server.ts` (Wikipédia puis Pexels). Elle est nullable, et
-- c'est délibéré : quand aucune source ne donne d'image de la bonne ville, on
-- laisse NULL et la page garde son visuel d'ambiance. Une URL fausse serait pire
-- qu'une absence.
--
-- Aucune donnée existante n'est touchée : les lignes déjà rédigées restent à
-- NULL jusqu'au passage de `scripts/backfill-city-images.ts`.

ALTER TABLE public.route_editorials
  ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.route_editorials.image_url IS
  'Photo de la ville de destination (Wikipédia ou Pexels). NULL = visuel d''ambiance côté page.';

ALTER TABLE public.guide_requests
  ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.guide_requests.image_url IS
  'Photo de la ville du guide (Wikipédia ou Pexels). NULL = visuel d''ambiance côté page.';

-- `route_editorials` est lue publiquement (politique « Lecture publique des
-- textes publies ») : la nouvelle colonne suit le même GRANT que les autres,
-- déjà accordé au niveau de la table. Rien à ajouter.
