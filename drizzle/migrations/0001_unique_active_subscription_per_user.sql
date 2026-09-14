-- Elimina duplicados de suscripciones activas dejando la más reciente
DELETE FROM public.subscriptions s
USING public.subscriptions s2
WHERE s.user_id = s2.user_id
  AND s.status = 'active' AND s2.status = 'active'
  AND s.created_at < s2.created_at;

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_one_active_per_user
  ON public.subscriptions (user_id)
  WHERE status = 'active';