CREATE OR REPLACE FUNCTION public.admin_set_client_subscription(
  p_user_id uuid,
  p_plan_type text
)
RETURNS public.subscriptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_subscription public.subscriptions%ROWTYPE;
  v_start timestamptz := now();
  v_end timestamptz;
  v_amount numeric;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;

  IF p_plan_type NOT IN ('monthly', 'quarterly') THEN
    RAISE EXCEPTION 'invalid plan type';
  END IF;

  IF p_plan_type = 'monthly' THEN
    v_end := v_start + interval '1 month';
    v_amount := 75;
  ELSE
    v_end := v_start + interval '3 months';
    v_amount := 210;
  END IF;

  SELECT * INTO v_subscription
  FROM public.subscriptions
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_subscription.id IS NULL THEN
    INSERT INTO public.subscriptions (
      user_id, plan_type, status, start_date, end_date, payment_method, amount
    ) VALUES (
      p_user_id, p_plan_type, 'active', v_start, v_end, 'manual', v_amount
    )
    RETURNING * INTO v_subscription;
  ELSE
    UPDATE public.subscriptions
    SET plan_type = p_plan_type,
        status = 'active',
        start_date = v_start,
        end_date = v_end,
        payment_method = COALESCE(payment_method, 'manual'),
        amount = v_amount,
        updated_at = now()
    WHERE id = v_subscription.id
    RETURNING * INTO v_subscription;
  END IF;

  RETURN v_subscription;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_client_subscription(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_client_subscription(uuid, text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.admin_remove_client_subscription(p_subscription_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;

  DELETE FROM public.subscriptions WHERE id = p_subscription_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_remove_client_subscription(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_remove_client_subscription(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.admin_update_subscription_end_date(
  p_subscription_id uuid,
  p_new_end timestamptz
)
RETURNS public.subscriptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  updated_row public.subscriptions%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;

  UPDATE public.subscriptions
  SET end_date = p_new_end,
      status = CASE WHEN p_new_end > now() THEN 'active' ELSE 'expired' END,
      updated_at = now()
  WHERE id = p_subscription_id
  RETURNING * INTO updated_row;

  IF updated_row.id IS NULL THEN
    RAISE EXCEPTION 'subscription not found';
  END IF;

  RETURN updated_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_stripe_subscription_end_date(
  p_subscription_id uuid,
  p_new_end timestamptz
)
RETURNS public.stripe_subscriptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  updated_row public.stripe_subscriptions%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;

  UPDATE public.stripe_subscriptions
  SET current_period_end = p_new_end,
      status = CASE WHEN p_new_end > now() THEN 'active' ELSE 'canceled' END,
      updated_at = now()
  WHERE id = p_subscription_id
  RETURNING * INTO updated_row;

  IF updated_row.id IS NULL THEN
    RAISE EXCEPTION 'subscription not found';
  END IF;

  RETURN updated_row;
END;
$$;