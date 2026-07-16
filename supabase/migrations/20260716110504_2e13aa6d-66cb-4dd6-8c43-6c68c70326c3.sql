
-- 1) Lock down SECURITY DEFINER functions: revoke from PUBLIC/anon; grant only where needed
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public' AND p.prosecdef
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', r.sig);
  END LOOP;
END $$;

-- has_role must be callable by authenticated (used inside RLS policies) and by service_role
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.save_initial_evaluation(jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_subscription_status(uuid) TO authenticated;

-- Admin RPCs: internal has_role check gates access. Callable by authenticated (rpc from admin UI).
GRANT EXECUTE ON FUNCTION public.admin_approve_diet_plan(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_approve_workout_plan(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_create_diet_plan(text,text,uuid,integer,text,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_create_workout_plan(text,text,uuid,text,text,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_diet_plan(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_exercise(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_meal(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_workout_plan(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_diet_plan(uuid,text,text,uuid,integer,text,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_stripe_subscription_end_date(uuid,timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_subscription_end_date(uuid,timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_workout_plan(uuid,text,text,uuid,text,text,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_exercise(uuid,text,text,text,text,text,text,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_meal(uuid,text,text,text,text,integer,numeric,numeric,numeric,text,text[]) TO authenticated;
-- handle_new_user & update_expired_subscriptions: no client callers; leave revoked

-- 2) Public bucket listing: restrict SELECT policies to authenticated (public URLs still work via public bucket flag)
DROP POLICY IF EXISTS "meal-media public read" ON storage.objects;
DROP POLICY IF EXISTS "exercise-media public read" ON storage.objects;
CREATE POLICY "meal-media auth read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id='meal-media');
CREATE POLICY "exercise-media auth read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id='exercise-media');

-- 3) guide_purchases: remove self-insert; only service_role/admin may insert (via edge function after Stripe verify)
DROP POLICY IF EXISTS "guide purchases insert" ON public.guide_purchases;
CREATE POLICY "guide purchases admin insert" ON public.guide_purchases FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4) user_roles: explicit admin-only INSERT/DELETE/UPDATE policies (default-deny made explicit)
CREATE POLICY "user_roles admin insert" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "user_roles admin update" ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "user_roles admin delete" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
