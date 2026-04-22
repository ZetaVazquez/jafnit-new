-- Tabla para la Evaluación Inicial profesional (segundo cuestionario)
CREATE TABLE IF NOT EXISTS public.initial_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  block_1_identification JSONB DEFAULT '{}'::jsonb,
  block_2_health_screening JSONB DEFAULT '{}'::jsonb,
  block_3_dietary_history JSONB DEFAULT '{}'::jsonb,
  block_4_training_profile JSONB DEFAULT '{}'::jsonb,
  block_5_lifestyle_recovery JSONB DEFAULT '{}'::jsonb,
  block_6_medical_clinical JSONB DEFAULT '{}'::jsonb,
  block_7_hormonal_health JSONB DEFAULT '{}'::jsonb,
  block_8_anthropometry JSONB DEFAULT '{}'::jsonb,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.initial_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own evaluation"
  ON public.initial_evaluations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evaluation"
  ON public.initial_evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own evaluation"
  ON public.initial_evaluations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all evaluations"
  ON public.initial_evaluations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.update_initial_evaluations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER initial_evaluations_updated_at
  BEFORE UPDATE ON public.initial_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_initial_evaluations_updated_at();

CREATE INDEX IF NOT EXISTS idx_initial_evaluations_user_id ON public.initial_evaluations(user_id);
