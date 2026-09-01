create or replace function public.configurer_taches_planifiees(p_secret text, p_base_url text)
returns table(jobid bigint, jobname text, schedule text)
language plpgsql
security definer
set search_path = public, cron, extensions
as $fn$
declare
  v_headers text;
begin
  v_headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'x-cron-secret', p_secret
  )::text;

  perform cron.schedule(
    'rafraichir-prix',
    '7 * * * *',
    format($q$select net.http_post(url:=%L, headers:=%L::jsonb, body:='{}'::jsonb) as request_id;$q$,
      p_base_url || '/api/public/rafraichir-prix', v_headers)
  );

  perform cron.schedule(
    'relever-saisonnalite',
    '23 */3 * * *',
    format($q$select net.http_post(url:=%L, headers:=%L::jsonb, body:='{}'::jsonb) as request_id;$q$,
      p_base_url || '/api/public/relever-saisonnalite', v_headers)
  );

  -- L'ancienne tâche anonyme (jobid 1, sans secret) est remplacée par la tâche nommée.
  delete from cron.job j where j.jobname is null or j.jobname ~ '^job_?[0-9]*$';

  return query select j.jobid, j.jobname, j.schedule from cron.job j order by j.jobid;
end;
$fn$;

revoke all on function public.configurer_taches_planifiees(text, text) from public, anon, authenticated;
grant execute on function public.configurer_taches_planifiees(text, text) to service_role;