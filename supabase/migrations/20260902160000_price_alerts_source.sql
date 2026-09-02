-- Provenance d'une alerte prix : d'où vient la personne qui l'a créée.
--
-- Une campagne (TikTok aujourd'hui, autre chose demain) doit pouvoir être jugée
-- sur ce qu'elle produit réellement — des alertes créées — et pas sur des vues.
-- Sans ces deux colonnes, une alerte née d'une vidéo est indiscernable d'une
-- alerte née d'une recherche Google : il n'existe aucun compte utilisateur ni
-- mouchard sur le site pour rattacher l'une à l'autre après coup.
--
-- `source` reprend utm_source (le canal : « tiktok »), `source_content` reprend
-- utm_content (la variante : la vidéo, le lien en bio…). Les deux sont
-- facultatifs : toutes les alertes déjà en base, et toutes celles créées depuis
-- /alertes ou l'accueil, restent à NULL.
--
-- Le contenu vient de l'URL, donc de l'extérieur : il est nettoyé et tronqué
-- côté serveur avant écriture (voir subscribeToAlert dans flights.functions.ts).

ALTER TABLE public.price_alerts
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS source_content text;

-- Compter les alertes d'une campagne sans balayer toute la table. Partiel : les
-- lignes sans provenance — l'immense majorité — restent hors de l'index.
CREATE INDEX IF NOT EXISTS price_alerts_source_idx
  ON public.price_alerts (source, created_at DESC)
  WHERE source IS NOT NULL;
