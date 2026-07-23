
-- Admin listing of coach users
CREATE OR REPLACE FUNCTION public.admin_list_coach_users()
RETURNS TABLE(
  user_id uuid, name text, email text,
  has_conversation boolean, msg_count integer, last_activity timestamptz,
  weight_kg numeric, height_cm numeric, age integer, waist_cm numeric,
  activity_level text, sleep_hours numeric, meals_per_day integer, water_l numeric
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  RETURN QUERY
  SELECT
    p.id, p.name, p.email,
    (c.user_id IS NOT NULL) AS has_conversation,
    COALESCE(jsonb_array_length(c.messages), 0)::int AS msg_count,
    GREATEST(COALESCE(c.updated_at, 'epoch'::timestamptz), COALESCE(m.updated_at, 'epoch'::timestamptz)) AS last_activity,
    m.weight_kg, m.height_cm, m.age, m.waist_cm,
    m.activity_level, m.sleep_hours, m.meals_per_day, m.water_l
  FROM public.profiles p
  LEFT JOIN public.coach_conversations c ON c.user_id = p.id
  LEFT JOIN public.coach_measurements m ON m.user_id = p.id
  WHERE c.user_id IS NOT NULL OR m.user_id IS NOT NULL
  ORDER BY last_activity DESC NULLS LAST;
END; $$;
REVOKE ALL ON FUNCTION public.admin_list_coach_users() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_coach_users() TO authenticated;

-- Admin update coach measurements
CREATE OR REPLACE FUNCTION public.admin_update_coach_measurements(
  p_user_id uuid,
  p_weight_kg numeric, p_height_cm numeric, p_age integer, p_waist_cm numeric,
  p_activity_level text, p_sleep_hours numeric, p_meals_per_day integer, p_water_l numeric
) RETURNS public.coach_measurements
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.coach_measurements%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  INSERT INTO public.coach_measurements (
    user_id, weight_kg, height_cm, age, waist_cm, activity_level, sleep_hours, meals_per_day, water_l
  ) VALUES (
    p_user_id, p_weight_kg, p_height_cm, p_age, p_waist_cm, p_activity_level, p_sleep_hours, p_meals_per_day, p_water_l
  )
  ON CONFLICT (user_id) DO UPDATE SET
    weight_kg = EXCLUDED.weight_kg,
    height_cm = EXCLUDED.height_cm,
    age = EXCLUDED.age,
    waist_cm = EXCLUDED.waist_cm,
    activity_level = EXCLUDED.activity_level,
    sleep_hours = EXCLUDED.sleep_hours,
    meals_per_day = EXCLUDED.meals_per_day,
    water_l = EXCLUDED.water_l,
    updated_at = now()
  RETURNING * INTO r;
  RETURN r;
END; $$;
REVOKE ALL ON FUNCTION public.admin_update_coach_measurements(uuid, numeric, numeric, integer, numeric, text, numeric, integer, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_coach_measurements(uuid, numeric, numeric, integer, numeric, text, numeric, integer, numeric) TO authenticated;

-- Admin discard coach measurements
CREATE OR REPLACE FUNCTION public.admin_delete_coach_measurements(p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  DELETE FROM public.coach_measurements WHERE user_id = p_user_id;
END; $$;
REVOKE ALL ON FUNCTION public.admin_delete_coach_measurements(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_coach_measurements(uuid) TO authenticated;

-- Admin discard coach conversation
CREATE OR REPLACE FUNCTION public.admin_delete_coach_conversation(p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  DELETE FROM public.coach_conversations WHERE user_id = p_user_id;
END; $$;
REVOKE ALL ON FUNCTION public.admin_delete_coach_conversation(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_coach_conversation(uuid) TO authenticated;
