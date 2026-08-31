CREATE TABLE public.guide_requests (
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
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.guide_requests TO service_role;

ALTER TABLE public.guide_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aucun acces public aux demandes de guides"
  ON public.guide_requests FOR ALL
  TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.set_guide_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER guide_requests_updated_at
  BEFORE UPDATE ON public.guide_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_guide_requests_updated_at();