-- 1) Exercises library
CREATE TABLE public.exercises_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  muscle_group text NOT NULL,
  description text,
  instructions text,
  video_url text,
  thumbnail_url text,
  difficulty text NOT NULL DEFAULT 'intermediate',
  equipment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.exercises_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exercises_library read authenticated"
ON public.exercises_library FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "exercises_library admin manage"
ON public.exercises_library FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER exercises_library_updated_at
BEFORE UPDATE ON public.exercises_library
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_exercises_library_muscle ON public.exercises_library(muscle_group);

-- 2) Meals library
CREATE TABLE public.meals_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  meal_type text NOT NULL,
  description text,
  image_url text,
  calories integer,
  protein_g numeric,
  carbs_g numeric,
  fats_g numeric,
  ingredients text,
  diet_tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.meals_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meals_library read authenticated"
ON public.meals_library FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "meals_library admin manage"
ON public.meals_library FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER meals_library_updated_at
BEFORE UPDATE ON public.meals_library
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_meals_library_type ON public.meals_library(meal_type);

-- 3) Draft state in plans
ALTER TABLE public.workout_plans
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS generated_by_ai boolean NOT NULL DEFAULT false;

ALTER TABLE public.diet_plans
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS generated_by_ai boolean NOT NULL DEFAULT false;

-- Update client SELECT policies to hide drafts
DROP POLICY IF EXISTS "own workout select" ON public.workout_plans;
CREATE POLICY "own workout select"
ON public.workout_plans FOR SELECT
TO authenticated
USING (
  ((auth.uid() = user_id OR auth.uid() = assigned_to) AND status = 'approved')
  OR has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "own diet select" ON public.diet_plans;
CREATE POLICY "own diet select"
ON public.diet_plans FOR SELECT
TO authenticated
USING (
  ((auth.uid() = user_id OR auth.uid() = assigned_to) AND status = 'approved')
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 4) Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-media', 'exercise-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('meal-media', 'meal-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "exercise-media public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'exercise-media');

CREATE POLICY "exercise-media admin write"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'exercise-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "exercise-media admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'exercise-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "exercise-media admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'exercise-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "meal-media public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'meal-media');

CREATE POLICY "meal-media admin write"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'meal-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "meal-media admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'meal-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "meal-media admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'meal-media' AND has_role(auth.uid(), 'admin'::app_role));

-- 5) Seed initial exercises
INSERT INTO public.exercises_library (name, muscle_group, description, instructions, difficulty, equipment) VALUES
('Press de banca', 'pecho', 'Ejercicio compuesto para pecho, hombros y tríceps.', 'Acuéstate en banco plano, baja la barra al pecho y empuja hacia arriba.', 'intermediate', 'Barra y banco'),
('Press inclinado con mancuernas', 'pecho', 'Trabajo del pectoral superior.', 'En banco inclinado a 30°, baja las mancuernas hasta el pecho y sube.', 'intermediate', 'Mancuernas'),
('Flexiones', 'pecho', 'Ejercicio de peso corporal para pecho y core.', 'Mantén el cuerpo recto, baja hasta tocar el suelo y empuja arriba.', 'beginner', 'Sin equipamiento'),
('Dominadas', 'espalda', 'Tracción vertical clásica.', 'Cuélgate de la barra, sube hasta superar la barbilla, baja controlado.', 'advanced', 'Barra de dominadas'),
('Remo con barra', 'espalda', 'Tracción horizontal para dorsal.', 'Inclínate 45°, lleva la barra al abdomen, mantén la espalda recta.', 'intermediate', 'Barra'),
('Jalón al pecho', 'espalda', 'Polea alta para dorsal.', 'Sentado, baja la barra al pecho con codos hacia abajo.', 'beginner', 'Polea'),
('Sentadilla con barra', 'piernas', 'Rey de los ejercicios de pierna.', 'Barra en trapecios, baja como sentándote, sube empujando talones.', 'intermediate', 'Barra y rack'),
('Peso muerto', 'piernas', 'Ejercicio compuesto total.', 'Cadera atrás, espalda recta, levanta la barra extendiendo cadera y rodilla.', 'advanced', 'Barra'),
('Zancadas', 'piernas', 'Trabajo unilateral de piernas.', 'Da un paso adelante, baja hasta 90°, vuelve. Alterna piernas.', 'beginner', 'Mancuernas o peso corporal'),
('Prensa de piernas', 'piernas', 'Cuadriceps con menor estrés lumbar.', 'En máquina, baja controlado y empuja sin bloquear rodillas.', 'beginner', 'Máquina prensa'),
('Press militar', 'hombros', 'Empuje vertical con barra.', 'De pie, barra en hombros, empuja hasta extender brazos.', 'intermediate', 'Barra'),
('Elevaciones laterales', 'hombros', 'Aislamiento del deltoides medio.', 'Sube las mancuernas a los lados hasta la altura del hombro.', 'beginner', 'Mancuernas'),
('Curl de bíceps con barra', 'brazos', 'Trabajo clásico de bíceps.', 'De pie, codos pegados al cuerpo, sube y baja la barra controlado.', 'beginner', 'Barra'),
('Extensiones de tríceps en polea', 'brazos', 'Aislamiento de tríceps.', 'En polea alta, baja la cuerda extendiendo los codos.', 'beginner', 'Polea'),
('Plancha', 'core', 'Estabilidad del núcleo.', 'Apóyate en antebrazos y puntas, cuerpo recto, mantén la posición.', 'beginner', 'Sin equipamiento'),
('Crunch abdominal', 'core', 'Flexión de abdomen.', 'Acostado, sube los hombros del suelo contrayendo el abdomen.', 'beginner', 'Sin equipamiento'),
('Burpees', 'cardio', 'Ejercicio de cuerpo completo HIIT.', 'Sentadilla, plancha, flexión, salto. Repite explosivamente.', 'advanced', 'Sin equipamiento'),
('Saltos a la comba', 'cardio', 'Cardio y coordinación.', 'Salta sobre la cuerda manteniendo ritmo constante.', 'beginner', 'Comba');