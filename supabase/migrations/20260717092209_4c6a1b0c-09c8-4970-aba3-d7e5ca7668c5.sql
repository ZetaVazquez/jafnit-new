
-- ============ Notifications ============
CREATE TABLE public.user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link_url text,
  read boolean NOT NULL DEFAULT false,
  dedupe_key text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, dedupe_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_notifications TO authenticated;
GRANT ALL ON public.user_notifications TO service_role;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_select_own" ON public.user_notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notif_update_own" ON public.user_notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notif_delete_own" ON public.user_notifications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_user_notifications_user_read ON public.user_notifications(user_id, read, created_at DESC);

-- ============ Audit Log ============
CREATE TABLE public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid,
  actor_email text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  target_user_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_admin_read" ON public.admin_audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "audit_admin_insert" ON public.admin_audit_log
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE INDEX idx_admin_audit_log_created ON public.admin_audit_log(created_at DESC);
CREATE INDEX idx_admin_audit_log_entity ON public.admin_audit_log(entity_type, entity_id);

-- ============ Generic audit trigger ============
CREATE OR REPLACE FUNCTION public.log_admin_table_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_email text;
  v_target uuid;
  v_entity_id text;
BEGIN
  -- Only log when the change is performed by an admin (skip system/edge-function writes).
  IF v_actor IS NULL OR NOT public.has_role(v_actor, 'admin'::public.app_role) THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = v_actor;

  v_entity_id := COALESCE(
    (to_jsonb(NEW) ->> 'id'),
    (to_jsonb(OLD) ->> 'id')
  );

  BEGIN
    v_target := COALESCE(
      NULLIF(to_jsonb(NEW) ->> 'user_id', '')::uuid,
      NULLIF(to_jsonb(OLD) ->> 'user_id', '')::uuid,
      NULLIF(to_jsonb(NEW) ->> 'assigned_to', '')::uuid,
      NULLIF(to_jsonb(OLD) ->> 'assigned_to', '')::uuid
    );
  EXCEPTION WHEN others THEN
    v_target := NULL;
  END;

  INSERT INTO public.admin_audit_log(
    actor_user_id, actor_email, action, entity_type, entity_id, target_user_id, details
  ) VALUES (
    v_actor,
    v_email,
    TG_OP,
    TG_TABLE_NAME,
    v_entity_id,
    v_target,
    jsonb_build_object(
      'op', TG_OP,
      'new', CASE WHEN TG_OP <> 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
      'old', CASE WHEN TG_OP <> 'INSERT' THEN to_jsonb(OLD) ELSE NULL END
    )
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_user_roles
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_table_change();
CREATE TRIGGER audit_diet_plans
  AFTER INSERT OR UPDATE OR DELETE ON public.diet_plans
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_table_change();
CREATE TRIGGER audit_workout_plans
  AFTER INSERT OR UPDATE OR DELETE ON public.workout_plans
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_table_change();
CREATE TRIGGER audit_subscriptions
  AFTER INSERT OR UPDATE OR DELETE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_table_change();
CREATE TRIGGER audit_stripe_subscriptions
  AFTER INSERT OR UPDATE OR DELETE ON public.stripe_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_table_change();
CREATE TRIGGER audit_pending_payments
  AFTER INSERT OR UPDATE OR DELETE ON public.pending_payments
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_table_change();

-- ============ Expiry notifications generator ============
CREATE OR REPLACE FUNCTION public.generate_plan_expiry_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
  v_days int;
BEGIN
  FOR r IN
    SELECT user_id, end_date FROM (
      SELECT user_id, end_date
      FROM public.subscriptions
      WHERE status = 'active' AND end_date IS NOT NULL
      UNION ALL
      SELECT user_id, current_period_end AS end_date
      FROM public.stripe_subscriptions
      WHERE status = 'active' AND current_period_end IS NOT NULL
    ) s
  LOOP
    v_days := (r.end_date::date - CURRENT_DATE);
    IF v_days = 3 THEN
      INSERT INTO public.user_notifications(user_id, type, title, message, link_url, dedupe_key)
      VALUES (
        r.user_id,
        'plan_expiring_3d',
        'Tu plan vence en 3 días',
        'Tu plan finaliza el ' || to_char(r.end_date, 'DD/MM/YYYY') || '. Renueva ahora para no perder el acceso a tus programas.',
        '/dashboard?view=subscription',
        'expiring_3d_' || to_char(r.end_date, 'YYYYMMDD')
      )
      ON CONFLICT (user_id, dedupe_key) DO NOTHING;
    ELSIF v_days = 0 THEN
      INSERT INTO public.user_notifications(user_id, type, title, message, link_url, dedupe_key)
      VALUES (
        r.user_id,
        'plan_expiring_0d',
        'Tu plan vence hoy',
        'Tu plan JAFN finaliza hoy. Renueva antes de que expire para mantener tu acceso.',
        '/dashboard?view=subscription',
        'expiring_0d_' || to_char(r.end_date, 'YYYYMMDD')
      )
      ON CONFLICT (user_id, dedupe_key) DO NOTHING;
    ELSIF v_days = -1 THEN
      INSERT INTO public.user_notifications(user_id, type, title, message, link_url, dedupe_key)
      VALUES (
        r.user_id,
        'plan_expired_1d',
        'Tu plan ha caducado',
        'Tu plan caducó ayer. Renueva para recuperar el acceso completo a JAFN.',
        '/dashboard?view=subscription',
        'expired_1d_' || to_char(r.end_date, 'YYYYMMDD')
      )
      ON CONFLICT (user_id, dedupe_key) DO NOTHING;
    END IF;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.generate_plan_expiry_notifications() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_plan_expiry_notifications() TO authenticated;
