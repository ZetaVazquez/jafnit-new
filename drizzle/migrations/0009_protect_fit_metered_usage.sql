CREATE TABLE public.fit_usage_limits (
  scope text NOT NULL,
  bucket_start timestamptz NOT NULL,
  requests integer NOT NULL DEFAULT 0,
  PRIMARY KEY (scope, bucket_start)
);
GRANT ALL ON public.fit_usage_limits TO service_role;
REVOKE ALL ON public.fit_usage_limits FROM anon, authenticated;
ALTER TABLE public.fit_usage_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.consume_fit_allowance(p_key text, p_authenticated boolean, p_gateway boolean DEFAULT false)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_now timestamptz := now();
  v_minute timestamptz := date_trunc('minute', v_now);
  v_day timestamptz := date_trunc('day', v_now AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  v_scopes text[];
  v_starts timestamptz[];
  v_limits integer[];
  i integer;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'permission denied'; END IF;
  IF p_key IS NULL OR length(p_key) NOT BETWEEN 1 AND 100 THEN RAISE EXCEPTION 'invalid key'; END IF;
  PERFORM pg_advisory_xact_lock(846210763);
  IF p_gateway THEN
    v_scopes := ARRAY['gateway:all:day'];
    v_starts := ARRAY[v_day];
    v_limits := ARRAY[5000];
    IF NOT p_authenticated THEN
      v_scopes := v_scopes || ARRAY['gateway:guest:minute', 'gateway:guest:day'];
      v_starts := v_starts || ARRAY[v_minute, v_day];
      v_limits := v_limits || ARRAY[100, 1000];
    END IF;
  ELSE
    v_scopes := ARRAY['caller:' || p_key || ':minute', 'caller:' || p_key || ':day'];
    v_starts := ARRAY[v_minute, v_day];
    v_limits := CASE WHEN p_authenticated THEN ARRAY[30, 300] ELSE ARRAY[12, 120] END;
  END IF;
  FOR i IN 1..array_length(v_scopes, 1) LOOP
    IF COALESCE((SELECT requests FROM public.fit_usage_limits WHERE scope = v_scopes[i] AND bucket_start = v_starts[i]), 0) >= v_limits[i] THEN
      RETURN false;
    END IF;
  END LOOP;
  FOR i IN 1..array_length(v_scopes, 1) LOOP
    INSERT INTO public.fit_usage_limits(scope, bucket_start, requests) VALUES (v_scopes[i], v_starts[i], 1)
    ON CONFLICT(scope, bucket_start) DO UPDATE SET requests = fit_usage_limits.requests + 1;
  END LOOP;
  DELETE FROM public.fit_usage_limits WHERE bucket_start < v_day - interval '1 day';
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.consume_fit_allowance(text, boolean, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_fit_allowance(text, boolean, boolean) TO service_role;