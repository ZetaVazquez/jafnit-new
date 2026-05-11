
CREATE OR REPLACE FUNCTION public.admin_approve_workout_plan(p_id uuid)
RETURNS workout_plans
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r public.workout_plans%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  UPDATE public.workout_plans
    SET status = 'approved', updated_at = now()
    WHERE id = p_id
    RETURNING * INTO r;
  RETURN r;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_workout_plan(
  p_id uuid,
  p_title text,
  p_description text,
  p_assigned_to uuid,
  p_difficulty_level text,
  p_status text,
  p_exercises jsonb
)
RETURNS workout_plans
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r public.workout_plans%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  UPDATE public.workout_plans
    SET title = p_title,
        description = p_description,
        assigned_to = p_assigned_to,
        user_id = p_assigned_to,
        difficulty_level = p_difficulty_level,
        status = p_status,
        exercises = p_exercises,
        updated_at = now()
    WHERE id = p_id
    RETURNING * INTO r;
  RETURN r;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_workout_plan(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  DELETE FROM public.workout_plans WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_approve_diet_plan(p_id uuid)
RETURNS diet_plans
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r public.diet_plans%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  UPDATE public.diet_plans
    SET status = 'approved', updated_at = now()
    WHERE id = p_id
    RETURNING * INTO r;
  RETURN r;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_diet_plan(
  p_id uuid,
  p_title text,
  p_description text,
  p_assigned_to uuid,
  p_calories_target integer,
  p_status text,
  p_meal_plan jsonb
)
RETURNS diet_plans
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r public.diet_plans%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  UPDATE public.diet_plans
    SET title = p_title,
        description = p_description,
        assigned_to = p_assigned_to,
        user_id = p_assigned_to,
        calories_target = p_calories_target,
        status = p_status,
        meal_plan = p_meal_plan,
        updated_at = now()
    WHERE id = p_id
    RETURNING * INTO r;
  RETURN r;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_diet_plan(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  DELETE FROM public.diet_plans WHERE id = p_id;
END;
$$;
