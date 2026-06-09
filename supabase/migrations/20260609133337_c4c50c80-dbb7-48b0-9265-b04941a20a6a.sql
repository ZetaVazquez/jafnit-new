
ALTER TABLE public.meals_library
  ADD COLUMN IF NOT EXISTS created_by_ai boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS bedca_refs jsonb;

CREATE TABLE IF NOT EXISTS public.bedca_foods_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_normalized text NOT NULL UNIQUE,
  query text NOT NULL,
  bedca_id text,
  kcal_100g numeric,
  protein_g_100g numeric,
  carbs_g_100g numeric,
  fats_g_100g numeric,
  found boolean NOT NULL DEFAULT false,
  raw_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.bedca_foods_cache TO authenticated;
GRANT ALL ON public.bedca_foods_cache TO service_role;

ALTER TABLE public.bedca_foods_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read bedca cache"
ON public.bedca_foods_cache FOR SELECT
TO authenticated
USING (true);

CREATE TRIGGER update_bedca_foods_cache_updated_at
BEFORE UPDATE ON public.bedca_foods_cache
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
