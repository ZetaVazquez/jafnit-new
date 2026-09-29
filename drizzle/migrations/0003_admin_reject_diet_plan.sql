CREATE OR REPLACE FUNCTION public.admin_reject_diet_plan(p_id uuid)
RETURNS public.diet_plans LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE r public.diet_plans%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN RAISE EXCEPTION 'permission denied'; END IF;
  UPDATE public.diet_plans SET status = 'rejected', updated_at = now() WHERE id = p_id RETURNING * INTO r;
  RETURN r;
END; $$;
REVOKE ALL ON FUNCTION public.admin_reject_diet_plan(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_reject_diet_plan(uuid) TO authenticated;