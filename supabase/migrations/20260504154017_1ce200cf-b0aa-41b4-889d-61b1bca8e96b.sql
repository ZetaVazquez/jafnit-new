CREATE TABLE IF NOT EXISTS public.initial_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_initial_evaluations_updated_at ON public.initial_evaluations;
CREATE TRIGGER update_initial_evaluations_updated_at
  BEFORE UPDATE ON public.initial_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typnamespace = 'public'::regnamespace AND typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user'::public.app_role,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

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

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX IF NOT EXISTS idx_initial_evaluations_user_id ON public.initial_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);