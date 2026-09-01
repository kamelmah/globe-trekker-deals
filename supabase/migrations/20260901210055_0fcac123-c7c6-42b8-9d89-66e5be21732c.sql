-- Le secret des tâches planifiées ne peut pas vivre dans le texte de la tâche
-- pg_cron sans être écrit en clair dans une migration versionnée. Il est donc
-- stocké ici, écrit une seule fois par le serveur qui, lui, lit la variable
-- d'environnement `LOVABLE_CRON_SECRET`, et relu par la tâche au moment de
-- l'appel.
CREATE TABLE IF NOT EXISTS public.job_secrets (
  name text PRIMARY KEY,
  secret text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.job_secrets TO service_role;

ALTER TABLE public.job_secrets ENABLE ROW LEVEL SECURITY;
-- Aucune politique : ni les visiteurs ni les comptes connectés ne peuvent lire
-- ou écrire cette table. Seul le rôle de service y accède.

DROP FUNCTION IF EXISTS public.configurer_taches_planifiees(text, text);