-- Ensure the professional initial evaluation table exists in the live database.
-- This migration is intentionally idempotent because the original migration file
-- existed in the codebase but the live database did not have the table.

CREATE TABLE IF NOT EXISTS public.initial_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  block_1_identification jsonb NOT NULL DEFAULT '{}'::jsonb,
  block_2_health_screening jsonb NOT NULL DEFAULT '{}'::jsonb,
  block_3_dietary_history jsonb NOT NULL DEFAULT '{}'::jsonb,
  block_4_training_profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  block_5_lifestyle_recovery jsonb NOT NULL DEFAULT '{}'::jsonb,
  block_6_medical_clinical jsonb NOT NULL DEFAULT '{}'::jsonb,
  block_7_hormonal_health jsonb NOT NULL DEFAULT '{}'::jsonb,
  block_8_anthropometry jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT initial_evaluations_user_id_key UNIQUE (user_id)
);

ALTER TABLE public.initial_evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own evaluation" ON public.initial_evaluations;
DROP POLICY IF EXISTS "Users can insert own evaluation" ON public.initial_evaluations;
DROP POLICY IF EXISTS "Users can update own evaluation" ON public.initial_evaluations;
DROP POLICY IF EXISTS "Admins can manage all evaluations" ON public.initial_evaluations;

CREATE POLICY "Users can view own evaluation"
  ON public.initial_evaluations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evaluation"
  ON public.initial_evaluations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own evaluation"
  ON public.initial_evaluations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all evaluations"
  ON public.initial_evaluations
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.update_initial_evaluations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS initial_evaluations_updated_at ON public.initial_evaluations;
CREATE TRIGGER initial_evaluations_updated_at
  BEFORE UPDATE ON public.initial_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_initial_evaluations_updated_at();

CREATE INDEX IF NOT EXISTS idx_initial_evaluations_user_id ON public.initial_evaluations(user_id);
