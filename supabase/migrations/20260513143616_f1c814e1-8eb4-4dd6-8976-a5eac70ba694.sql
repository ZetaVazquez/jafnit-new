CREATE OR REPLACE FUNCTION public.save_initial_evaluation(
  p_block_1_identification jsonb DEFAULT '{}'::jsonb,
  p_block_2_health_screening jsonb DEFAULT '{}'::jsonb,
  p_block_3_dietary_history jsonb DEFAULT '{}'::jsonb,
  p_block_4_training_profile jsonb DEFAULT '{}'::jsonb,
  p_block_5_lifestyle_recovery jsonb DEFAULT '{}'::jsonb,
  p_block_6_medical_clinical jsonb DEFAULT '{}'::jsonb,
  p_block_7_hormonal_health jsonb DEFAULT '{}'::jsonb,
  p_block_8_anthropometry jsonb DEFAULT '{}'::jsonb,
  p_mark_completed boolean DEFAULT false
)
RETURNS public.initial_evaluations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_row public.initial_evaluations%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  INSERT INTO public.initial_evaluations (
    user_id,
    block_1_identification,
    block_2_health_screening,
    block_3_dietary_history,
    block_4_training_profile,
    block_5_lifestyle_recovery,
    block_6_medical_clinical,
    block_7_hormonal_health,
    block_8_anthropometry,
    completed,
    completed_at,
    updated_at
  ) VALUES (
    v_user_id,
    COALESCE(p_block_1_identification, '{}'::jsonb),
    COALESCE(p_block_2_health_screening, '{}'::jsonb),
    COALESCE(p_block_3_dietary_history, '{}'::jsonb),
    COALESCE(p_block_4_training_profile, '{}'::jsonb),
    COALESCE(p_block_5_lifestyle_recovery, '{}'::jsonb),
    COALESCE(p_block_6_medical_clinical, '{}'::jsonb),
    COALESCE(p_block_7_hormonal_health, '{}'::jsonb),
    COALESCE(p_block_8_anthropometry, '{}'::jsonb),
    COALESCE(p_mark_completed, false),
    CASE WHEN COALESCE(p_mark_completed, false) THEN now() ELSE NULL END,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    block_1_identification = EXCLUDED.block_1_identification,
    block_2_health_screening = EXCLUDED.block_2_health_screening,
    block_3_dietary_history = EXCLUDED.block_3_dietary_history,
    block_4_training_profile = EXCLUDED.block_4_training_profile,
    block_5_lifestyle_recovery = EXCLUDED.block_5_lifestyle_recovery,
    block_6_medical_clinical = EXCLUDED.block_6_medical_clinical,
    block_7_hormonal_health = EXCLUDED.block_7_hormonal_health,
    block_8_anthropometry = EXCLUDED.block_8_anthropometry,
    completed = public.initial_evaluations.completed OR COALESCE(p_mark_completed, false),
    completed_at = CASE
      WHEN public.initial_evaluations.completed_at IS NOT NULL THEN public.initial_evaluations.completed_at
      WHEN COALESCE(p_mark_completed, false) THEN now()
      ELSE NULL
    END,
    updated_at = now()
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.save_initial_evaluation(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_initial_evaluation(jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, boolean) TO authenticated;