
-- 1) Revoke EXECUTE from PUBLIC and anon on all SECURITY DEFINER functions in public schema
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef = true
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC, anon',
                   r.nspname, r.proname, r.args);
  END LOOP;
END $$;

-- Keep EXECUTE for authenticated on the specific helpers the app calls from the client
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_initial_evaluation(jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_create_diet_plan(text,text,uuid,integer,text,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_diet_plan(uuid,text,text,uuid,integer,text,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_approve_diet_plan(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_diet_plan(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_create_workout_plan(text,text,uuid,text,text,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_workout_plan(uuid,text,text,uuid,text,text,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_approve_workout_plan(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_workout_plan(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_exercise(uuid,text,text,text,text,text,text,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_exercise(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_meal(uuid,text,text,text,text,integer,numeric,numeric,numeric,text,text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_meal(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_subscription_end_date(uuid, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_stripe_subscription_end_date(uuid, timestamptz) TO authenticated;

-- Service role retains full access (needed by edge functions / triggers)
GRANT EXECUTE ON FUNCTION public.log_admin_table_change() TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_plan_expiry_notifications() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_expired_subscriptions() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_subscription_status(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_active_profiles() TO authenticated, anon;

-- 2) Explicit read policies for public media buckets (replace implicit public-bucket read)
DROP POLICY IF EXISTS "exercise-media public read" ON storage.objects;
CREATE POLICY "exercise-media public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'exercise-media');

DROP POLICY IF EXISTS "meal-media public read" ON storage.objects;
CREATE POLICY "meal-media public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'meal-media');

-- Restrict writes on those buckets to admins only
DROP POLICY IF EXISTS "exercise-media admin write" ON storage.objects;
CREATE POLICY "exercise-media admin write"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'exercise-media' AND public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'exercise-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "meal-media admin write" ON storage.objects;
CREATE POLICY "meal-media admin write"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'meal-media' AND public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'meal-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3) lead_followups: enforce admin-only access explicitly
ALTER TABLE public.lead_followups ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='lead_followups' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.lead_followups', r.policyname);
  END LOOP;
END $$;
CREATE POLICY "Admins manage lead followups"
  ON public.lead_followups FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4) client_forms: tighten admin scoping by re-declaring policies as admin-only, explicit
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='client_forms' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.client_forms', r.policyname);
  END LOOP;
END $$;
CREATE POLICY "Users manage own client form"
  ON public.client_forms FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all client forms"
  ON public.client_forms FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update client forms"
  ON public.client_forms FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
