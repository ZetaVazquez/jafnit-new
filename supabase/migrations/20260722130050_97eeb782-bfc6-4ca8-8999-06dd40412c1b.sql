
-- coach_conversations: one thread per user
CREATE TABLE public.coach_conversations (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coach_conversations TO authenticated;
GRANT ALL ON public.coach_conversations TO service_role;
ALTER TABLE public.coach_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own coach conversation"
  ON public.coach_conversations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins read coach conversations"
  ON public.coach_conversations FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER coach_conversations_updated_at
  BEFORE UPDATE ON public.coach_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- coach_measurements: one row per user
CREATE TABLE public.coach_measurements (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg NUMERIC,
  height_cm NUMERIC,
  age INTEGER,
  waist_cm NUMERIC,
  activity_level TEXT,
  sleep_hours NUMERIC,
  meals_per_day INTEGER,
  water_l NUMERIC,
  extra JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coach_measurements TO authenticated;
GRANT ALL ON public.coach_measurements TO service_role;
ALTER TABLE public.coach_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own coach measurements"
  ON public.coach_measurements FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins read coach measurements"
  ON public.coach_measurements FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER coach_measurements_updated_at
  BEFORE UPDATE ON public.coach_measurements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Admin RPC to read any user's conversation
CREATE OR REPLACE FUNCTION public.admin_read_coach_conversation(p_user_id UUID)
RETURNS public.coach_conversations
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r public.coach_conversations%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  SELECT * INTO r FROM public.coach_conversations WHERE user_id = p_user_id;
  RETURN r;
END; $$;

REVOKE ALL ON FUNCTION public.admin_read_coach_conversation(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_read_coach_conversation(UUID) TO authenticated;
