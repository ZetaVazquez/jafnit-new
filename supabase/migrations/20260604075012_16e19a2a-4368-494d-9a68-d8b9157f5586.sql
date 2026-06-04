
-- Admin RPCs for meals_library
CREATE OR REPLACE FUNCTION public.admin_upsert_meal(
  p_id uuid,
  p_name text,
  p_meal_type text,
  p_description text,
  p_image_url text,
  p_calories integer,
  p_protein_g numeric,
  p_carbs_g numeric,
  p_fats_g numeric,
  p_ingredients text,
  p_diet_tags text[]
) RETURNS public.meals_library
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.meals_library%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  IF p_id IS NULL THEN
    INSERT INTO public.meals_library (name, meal_type, description, image_url, calories, protein_g, carbs_g, fats_g, ingredients, diet_tags)
    VALUES (p_name, p_meal_type, p_description, p_image_url, p_calories, p_protein_g, p_carbs_g, p_fats_g, p_ingredients, COALESCE(p_diet_tags,'{}'))
    RETURNING * INTO r;
  ELSE
    UPDATE public.meals_library SET
      name = p_name, meal_type = p_meal_type, description = p_description,
      image_url = p_image_url, calories = p_calories, protein_g = p_protein_g,
      carbs_g = p_carbs_g, fats_g = p_fats_g, ingredients = p_ingredients,
      diet_tags = COALESCE(p_diet_tags,'{}'), updated_at = now()
    WHERE id = p_id
    RETURNING * INTO r;
  END IF;
  RETURN r;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_delete_meal(p_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  DELETE FROM public.meals_library WHERE id = p_id;
END; $$;

-- Admin RPCs for exercises_library
CREATE OR REPLACE FUNCTION public.admin_upsert_exercise(
  p_id uuid,
  p_name text,
  p_muscle_group text,
  p_description text,
  p_instructions text,
  p_video_url text,
  p_thumbnail_url text,
  p_difficulty text,
  p_equipment text
) RETURNS public.exercises_library
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.exercises_library%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  IF p_id IS NULL THEN
    INSERT INTO public.exercises_library (name, muscle_group, description, instructions, video_url, thumbnail_url, difficulty, equipment)
    VALUES (p_name, p_muscle_group, p_description, p_instructions, p_video_url, p_thumbnail_url, COALESCE(p_difficulty,'intermediate'), p_equipment)
    RETURNING * INTO r;
  ELSE
    UPDATE public.exercises_library SET
      name = p_name, muscle_group = p_muscle_group, description = p_description,
      instructions = p_instructions, video_url = p_video_url, thumbnail_url = p_thumbnail_url,
      difficulty = COALESCE(p_difficulty,'intermediate'), equipment = p_equipment, updated_at = now()
    WHERE id = p_id
    RETURNING * INTO r;
  END IF;
  RETURN r;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_delete_exercise(p_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  DELETE FROM public.exercises_library WHERE id = p_id;
END; $$;
