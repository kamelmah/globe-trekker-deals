CREATE POLICY "Aucun accès public au journal"
ON public.ops_logs FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Aucun accès public aux alertes prix"
ON public.price_alerts FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Aucun accès public au cache de prix"
ON public.price_cache FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);