CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL DEFAULT 'Usuario',
  email text NOT NULL,
  description text,
  profile_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  age integer,
  weight numeric(5,2),
  height numeric(5,2),
  activity_level text,
  health_goals text,
  dietary_preferences text,
  exercise_frequency text,
  health_conditions text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_type text NOT NULL DEFAULT 'monthly',
  status text NOT NULL DEFAULT 'pending',
  start_date timestamptz,
  end_date timestamptz,
  payment_method text DEFAULT 'manual',
  amount numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  assigned_to uuid,
  title text NOT NULL,
  description text,
  meal_plan jsonb,
  calories_target integer,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  assigned_to uuid,
  title text NOT NULL,
  description text,
  exercises jsonb,
  difficulty_level text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_type text NOT NULL,
  title text NOT NULL,
  description text,
  target_value numeric(10,2),
  target_unit text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_id uuid,
  date date NOT NULL DEFAULT CURRENT_DATE,
  completed boolean DEFAULT false,
  value_achieved numeric(10,2),
  notes text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, goal_id, date)
);

CREATE TABLE IF NOT EXISTS public.body_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  weight numeric(5,2),
  body_fat_percentage numeric(5,2),
  muscle_mass numeric(5,2),
  waist_circumference numeric(5,2),
  chest_circumference numeric(5,2),
  hip_circumference numeric(5,2),
  notes text,
  measured_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity_type text NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pending_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_type text NOT NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'manual',
  payment_reference text,
  receipt_url text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  description text,
  earning_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  created_by uuid,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  comment text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stripe_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  plan_type text NOT NULL DEFAULT 'none',
  status text NOT NULL DEFAULT 'inactive',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stripe_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL UNIQUE,
  email text NOT NULL,
  name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stripe_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_product_id text NOT NULL UNIQUE,
  stripe_price_id text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  amount integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'eur',
  interval_type text,
  plan_type text NOT NULL DEFAULT 'basic',
  active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  pdf_url text NOT NULL,
  regular_price numeric NOT NULL DEFAULT 0,
  discounted_price numeric NOT NULL DEFAULT 0,
  category text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.guide_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  guide_id uuid NOT NULL,
  amount_paid numeric NOT NULL DEFAULT 0,
  stripe_payment_intent_id text,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, guide_id)
);

CREATE TABLE IF NOT EXISTS public.terms_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  terms_version text NOT NULL DEFAULT '1.0',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_modal_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  modal_type text NOT NULL,
  shown_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, modal_type)
);

CREATE TABLE IF NOT EXISTS public.client_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text,
  birth_date date,
  age integer,
  gender text,
  phone text,
  email text,
  dni_nie text,
  address text,
  city text,
  start_date date,
  contracted_program text,
  payment_method text,
  next_renewal date,
  acquisition_source text,
  main_objective text,
  secondary_objectives text,
  personal_motivation text,
  commitment_time text,
  ninety_day_goal text,
  initial_weight numeric,
  height_cm numeric,
  bmi numeric,
  waist_perimeter numeric,
  hip_perimeter numeric,
  body_fat_percentage numeric,
  resting_heart_rate numeric,
  measurements_date date,
  daily_activity_level text,
  current_training text,
  physical_limitations text,
  training_availability text,
  meals_per_day integer,
  current_diet_type text,
  food_restrictions text,
  current_supplements text,
  intolerances_allergies text,
  pathologies text,
  daily_water_intake text,
  professional_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','questionnaire_responses','subscriptions','diet_plans','workout_plans','daily_goals','daily_progress','body_measurements','activity_logs','pending_payments','admin_earnings','admin_news','user_testimonials','stripe_subscriptions','stripe_customers','stripe_products','guides','guide_purchases','terms_acceptances','user_modal_interactions','client_forms']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.update_expired_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.subscriptions
  SET status = 'expired', updated_at = now()
  WHERE status = 'active' AND end_date IS NOT NULL AND end_date < now();
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  subscription_status text;
BEGIN
  SELECT status INTO subscription_status
  FROM public.subscriptions
  WHERE user_id = user_uuid
    AND status = 'active'
    AND (end_date IS NULL OR end_date > now())
  ORDER BY created_at DESC
  LIMIT 1;
  RETURN COALESCE(subscription_status, 'inactive');
END;
$$;

CREATE OR REPLACE FUNCTION public.get_active_profiles()
RETURNS TABLE (id uuid, name text, email text, description text, profile_image_url text, created_at timestamptz, updated_at timestamptz)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT p.id, p.name, p.email, p.description, p.profile_image_url, p.created_at, p.updated_at
  FROM public.profiles p;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_subscription_end_date(p_subscription_id uuid, p_new_end timestamptz)
RETURNS public.subscriptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE updated_row public.subscriptions%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  UPDATE public.subscriptions SET end_date = p_new_end, updated_at = now() WHERE id = p_subscription_id RETURNING * INTO updated_row;
  RETURN updated_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_stripe_subscription_end_date(p_subscription_id uuid, p_new_end timestamptz)
RETURNS public.stripe_subscriptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE updated_row public.stripe_subscriptions%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'permission denied';
  END IF;
  UPDATE public.stripe_subscriptions SET current_period_end = p_new_end, updated_at = now() WHERE id = p_subscription_id RETURNING * INTO updated_row;
  RETURN updated_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', 'Usuario'), COALESCE(NEW.email, ''))
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, name = COALESCE(public.profiles.name, EXCLUDED.name);
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

CREATE POLICY "profiles own select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "profiles own insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles own update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "roles own select" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "initial evaluations own select" ON public.initial_evaluations FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "initial evaluations own insert" ON public.initial_evaluations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "initial evaluations own update" ON public.initial_evaluations FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "own select questionnaire" ON public.questionnaire_responses FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "own insert questionnaire" ON public.questionnaire_responses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update questionnaire" ON public.questionnaire_responses FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "own all client forms" ON public.client_forms FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "own all subscriptions" ON public.subscriptions FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "own all pending payments" ON public.pending_payments FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "admin earnings" ON public.admin_earnings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "own diet select" ON public.diet_plans FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() = assigned_to OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "admin diet manage" ON public.diet_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "own workout select" ON public.workout_plans FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() = assigned_to OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "admin workout manage" ON public.workout_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "own all goals" ON public.daily_goals FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "own all progress" ON public.daily_progress FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "own all measurements" ON public.body_measurements FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "own all activity" ON public.activity_logs FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "news public published" ON public.admin_news FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "news admin manage" ON public.admin_news FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "testimonials public approved" ON public.user_testimonials FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "testimonials user insert" ON public.user_testimonials FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "testimonials admin update" ON public.user_testimonials FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "own stripe subscriptions" ON public.stripe_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "admin stripe subscriptions" ON public.stripe_subscriptions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "own stripe customers" ON public.stripe_customers FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "products public active" ON public.stripe_products FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "guides public active" ON public.guides FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "guides admin manage" ON public.guides FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "guide purchases own" ON public.guide_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "guide purchases insert" ON public.guide_purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "terms own insert" ON public.terms_acceptances FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "terms own select" ON public.terms_acceptances FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "modal interactions own" ON public.user_modal_interactions FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_user_id ON public.stripe_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_initial_evaluations_user_id ON public.initial_evaluations(user_id);