CREATE TABLE public.ops_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  kind text NOT NULL,
  label text NOT NULL,
  ok boolean NOT NULL DEFAULT true,
  status integer,
  result_count integer,
  duration_ms integer,
  message text,
  context jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX ops_logs_created_at_idx ON public.ops_logs (created_at DESC);
CREATE INDEX ops_logs_kind_idx ON public.ops_logs (kind, created_at DESC);

GRANT ALL ON public.ops_logs TO service_role;

ALTER TABLE public.ops_logs ENABLE ROW LEVEL SECURITY;