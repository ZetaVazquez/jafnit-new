CREATE TABLE public.client_progress_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  review_date date NOT NULL DEFAULT CURRENT_DATE,
  compliance_pct integer NOT NULL DEFAULT 0,
  diet_pct integer,
  training_pct integer,
  water_pct integer,
  sleep_pct integer,
  notes text,
  next_steps text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, review_date)
);

GRANT SELECT ON public.client_progress_reviews TO authenticated;
GRANT ALL ON public.client_progress_reviews TO service_role;

ALTER TABLE public.client_progress_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients read own reviews"
  ON public.client_progress_reviews FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER client_progress_reviews_updated_at
  BEFORE UPDATE ON public.client_progress_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.admin_upsert_progress_review(
  p_user_id uuid,
  p_review_date date,
  p_compliance_pct integer,
  p_diet_pct integer DEFAULT NULL,
  p_training_pct integer DEFAULT NULL,
  p_water_pct integer DEFAULT NULL,
  p_sleep_pct integer DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_next_steps text DEFAULT NULL
)
RETURNS public.client_progress_reviews
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE r public.client_progress_reviews%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  INSERT INTO public.client_progress_reviews (
    user_id, review_date, compliance_pct, diet_pct, training_pct, water_pct, sleep_pct, notes, next_steps, created_by
  ) VALUES (
    p_user_id, COALESCE(p_review_date, CURRENT_DATE), COALESCE(p_compliance_pct, 0),
    p_diet_pct, p_training_pct, p_water_pct, p_sleep_pct, p_notes, p_next_steps, auth.uid()
  )
  ON CONFLICT (user_id, review_date) DO UPDATE SET
    compliance_pct = EXCLUDED.compliance_pct,
    diet_pct = EXCLUDED.diet_pct,
    training_pct = EXCLUDED.training_pct,
    water_pct = EXCLUDED.water_pct,
    sleep_pct = EXCLUDED.sleep_pct,
    notes = EXCLUDED.notes,
    next_steps = EXCLUDED.next_steps,
    updated_at = now()
  RETURNING * INTO r;
  RETURN r;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_delete_progress_review(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  DELETE FROM public.client_progress_reviews WHERE id = p_id;
END; $$;

REVOKE ALL ON FUNCTION public.admin_upsert_progress_review(uuid, date, integer, integer, integer, integer, integer, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_upsert_progress_review(uuid, date, integer, integer, integer, integer, integer, text, text) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.admin_delete_progress_review(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_progress_review(uuid) TO authenticated, service_role;