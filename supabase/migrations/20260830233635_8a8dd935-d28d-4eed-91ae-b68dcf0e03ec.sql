CREATE POLICY "Aucun accès public aux messages de contact"
ON public.contact_messages FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Aucun accès public aux inscrits newsletter"
ON public.newsletter_subscribers FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);