-- lovable-cron-fallback-reviewed: 288 runs/day; el borrado a los 10 minutos es una acción temporal sin evento que la dispare
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.unschedule('cleanup-unpaid-signups')
where exists (select 1 from cron.job where jobname = 'cleanup-unpaid-signups');

select cron.schedule(
  'cleanup-unpaid-signups',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://ecddfjnddtgxrqciwsgj.supabase.co/functions/v1/cleanup-unpaid-signups',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZGRmam5kZHRneHJxY2l3c2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDIzNzgsImV4cCI6MjA5MzQ3ODM3OH0.dkR8e8fGWU7fLpqi02nDZxgRlIkBnWZugdZZn4WrTA8"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);