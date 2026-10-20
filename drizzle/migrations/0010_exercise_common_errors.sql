ALTER TABLE public.exercises_library ADD COLUMN IF NOT EXISTS common_errors text;
CREATE OR REPLACE FUNCTION public.admin_upsert_exercise_details(p_id uuid, p_name text, p_muscle_group text, p_description text, p_instructions text, p_video_url text, p_thumbnail_url text, p_difficulty text, p_equipment text, p_common_errors text)
RETURNS public.exercises_library LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.exercises_library%ROWTYPE;
BEGIN
 IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN RAISE EXCEPTION 'permission denied'; END IF;
 r := public.admin_upsert_exercise(p_id,p_name,p_muscle_group,p_description,p_instructions,p_video_url,p_thumbnail_url,p_difficulty,p_equipment);
 UPDATE public.exercises_library SET common_errors=p_common_errors WHERE id=r.id RETURNING * INTO r;
 RETURN r;
END; $$;
REVOKE ALL ON FUNCTION public.admin_upsert_exercise_details(uuid,text,text,text,text,text,text,text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_upsert_exercise_details(uuid,text,text,text,text,text,text,text,text,text) TO authenticated, service_role;