DROP FUNCTION IF EXISTS public.admin_set_client_subscription(uuid, text);
DROP FUNCTION IF EXISTS public.admin_remove_client_subscription(uuid);
DROP FUNCTION IF EXISTS public.admin_update_subscription_end_date(uuid, timestamptz);

CREATE OR REPLACE FUNCTION public.admin_update_subscription_end_date(
  p_subscription_id uuid,
  p_new_end timestamptz,
  p_user_id uuid DEFAULT NULL,
  p_plan_type text DEFAULT NULL,
  p_remove boolean DEFAULT false
)
RETURNS public.subscriptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  updated_row public.subscriptions%ROWTYPE;
  v_subscription_id uuid := p_subscription_id;
  v_start timestamptz := now();
  v_end timestamptz := p_new_end;
  v_amount numeric;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;

  IF p_remove THEN
    DELETE FROM public.subscriptions WHERE id = p_subscription_id
    RETURNING * INTO updated_row;
    RETURN updated_row;
  END IF;

  IF p_plan_type IS NOT NULL THEN
    IF p_plan_type NOT IN ('monthly', 'quarterly') THEN
      RAISE EXCEPTION 'invalid plan type';
    END IF;

    IF p_user_id IS NULL THEN
      RAISE EXCEPTION 'user id is required';
    END IF;

    IF p_plan_type = 'monthly' THEN
      v_end := COALESCE(v_end, v_start + interval '1 month');
      v_amount := 75;
    ELSE
      v_end := COALESCE(v_end, v_start + interval '3 months');
      v_amount := 210;
    END IF;

    IF v_subscription_id IS NULL THEN
      SELECT id INTO v_subscription_id
      FROM public.subscriptions
      WHERE user_id = p_user_id
      ORDER BY created_at DESC
      LIMIT 1;
    END IF;

    IF v_subscription_id IS NULL THEN
      INSERT INTO public.subscriptions (
        user_id, plan_type, status, start_date, end_date, payment_method, amount
      ) VALUES (
        p_user_id, p_plan_type, 'active', v_start, v_end, 'manual', v_amount
      )
      RETURNING * INTO updated_row;
    ELSE
      UPDATE public.subscriptions
      SET plan_type = p_plan_type,
          status = 'active',
          start_date = v_start,
          end_date = v_end,
          payment_method = COALESCE(payment_method, 'manual'),
          amount = v_amount,
          updated_at = now()
      WHERE id = v_subscription_id
      RETURNING * INTO updated_row;
    END IF;
  ELSE
    UPDATE public.subscriptions
    SET end_date = p_new_end,
        status = CASE WHEN p_new_end > now() THEN 'active' ELSE 'expired' END,
        updated_at = now()
    WHERE id = p_subscription_id
    RETURNING * INTO updated_row;
  END IF;

  IF updated_row.id IS NULL THEN
    RAISE EXCEPTION 'subscription not found';
  END IF;

  RETURN updated_row;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_subscription_end_date(uuid, timestamptz, uuid, text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_subscription_end_date(uuid, timestamptz, uuid, text, boolean) TO authenticated, service_role;