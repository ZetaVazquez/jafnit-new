CREATE OR REPLACE FUNCTION public.admin_create_diet_plan(
  p_title text,
  p_description text,
  p_assigned_to uuid,
  p_calories_target integer,
  p_status text,
  p_meal_plan jsonb
) RETURNS public.diet_plans
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r public.diet_plans%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  INSERT INTO public.diet_plans (title, description, user_id, assigned_to, calories_target, status, meal_plan, created_by, generated_by_ai)
  VALUES (p_title, p_description, p_assigned_to, p_assigned_to, p_calories_target, COALESCE(p_status,'draft'), COALESCE(p_meal_plan,'{}'::jsonb), auth.uid(), false)
  RETURNING * INTO r;
  RETURN r;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_create_workout_plan(
  p_title text,
  p_description text,
  p_assigned_to uuid,
  p_difficulty_level text,
  p_status text,
  p_exercises jsonb
) RETURNS public.workout_plans
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r public.workout_plans%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  INSERT INTO public.workout_plans (title, description, user_id, assigned_to, difficulty_level, status, exercises, created_by, generated_by_ai)
  VALUES (p_title, p_description, p_assigned_to, p_assigned_to, p_difficulty_level, COALESCE(p_status,'draft'), COALESCE(p_exercises,'{}'::jsonb), auth.uid(), false)
  RETURNING * INTO r;
  RETURN r;
END;
$$;