-- Create admin RPC to update traditional subscription end_date
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
  -- Ensure caller is admin
  IF NOT has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;

  UPDATE public.subscriptions
  SET end_date = p_new_end,
      updated_at = now()
  WHERE id = p_subscription_id
  RETURNING * INTO updated_row;

  RETURN updated_row;
END;
$$;

-- Create admin RPC to update Stripe subscription current_period_end
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
  -- Ensure caller is admin
  IF NOT has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;

  UPDATE public.stripe_subscriptions
  SET current_period_end = p_new_end,
      updated_at = now()
  WHERE id = p_subscription_id
  RETURNING * INTO updated_row;

  RETURN updated_row;
END;
$$;