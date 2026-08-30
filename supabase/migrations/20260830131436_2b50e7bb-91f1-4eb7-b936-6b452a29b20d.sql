CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  depart_date DATE,
  return_date DATE,
  currency TEXT NOT NULL DEFAULT 'EUR',
  initial_price NUMERIC NOT NULL,
  last_price NUMERIC NOT NULL,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  unsubscribe_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX price_alerts_active_idx ON public.price_alerts (active, last_checked_at);
CREATE UNIQUE INDEX price_alerts_unique_idx ON public.price_alerts (email, origin, destination, coalesce(depart_date, '1970-01-01'::date));

GRANT ALL ON public.price_alerts TO service_role;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  month DATE NOT NULL,
  lowest_price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX price_history_unique_idx ON public.price_history (origin, destination, month);

GRANT SELECT ON public.price_history TO anon;
GRANT SELECT ON public.price_history TO authenticated;
GRANT ALL ON public.price_history TO service_role;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Price history is publicly readable" ON public.price_history FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.price_cache (
  cache_key TEXT NOT NULL PRIMARY KEY,
  payload JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX price_cache_expires_idx ON public.price_cache (expires_at);

GRANT ALL ON public.price_cache TO service_role;
ALTER TABLE public.price_cache ENABLE ROW LEVEL SECURITY;