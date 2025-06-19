
-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Crear tabla de respuestas del cuestionario
CREATE TABLE public.questionnaire_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  activity_level TEXT,
  health_goals TEXT,
  dietary_preferences TEXT,
  exercise_frequency TEXT,
  health_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de suscripciones y pagos
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'quarterly')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  payment_method TEXT DEFAULT 'bizum',
  amount DECIMAL(8,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de dietas personalizadas
CREATE TABLE public.diet_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  meal_plan JSONB, -- Contendrá las comidas estructuradas por días
  calories_target INTEGER,
  created_by UUID REFERENCES auth.users(id), -- Admin que creó la dieta
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de planes de entrenamiento
CREATE TABLE public.workout_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  exercises JSONB, -- Contendrá los ejercicios estructurados por días
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_by UUID REFERENCES auth.users(id), -- Admin que creó el entrenamiento
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de objetivos diarios
CREATE TABLE public.daily_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('diet', 'workout', 'water', 'sleep', 'supplements', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(8,2), -- Para objetivos numéricos (ej: 2 litros de agua)
  target_unit TEXT, -- unidad (litros, horas, etc)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de progreso diario
CREATE TABLE public.daily_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES public.daily_goals(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT false,
  value_achieved DECIMAL(8,2), -- Para objetivos numéricos
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, goal_id, date) -- Un progreso por objetivo por día
);

-- Crear tabla de medidas corporales para tracking
CREATE TABLE public.body_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass DECIMAL(5,2),
  waist_circumference DECIMAL(5,2),
  chest_circumference DECIMAL(5,2),
  hip_circumference DECIMAL(5,2),
  notes TEXT,
  measured_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de logs de actividad
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('login', 'logout', 'goal_completed', 'measurement_added', 'diet_viewed', 'workout_completed')),
  description TEXT,
  metadata JSONB, -- Para datos adicionales
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas RLS para questionnaire_responses
CREATE POLICY "Users can view own responses" ON public.questionnaire_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own responses" ON public.questionnaire_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own responses" ON public.questionnaire_responses FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para diet_plans
CREATE POLICY "Users can view own diet plans" ON public.diet_plans FOR SELECT USING (auth.uid() = user_id);

-- Políticas RLS para workout_plans
CREATE POLICY "Users can view own workout plans" ON public.workout_plans FOR SELECT USING (auth.uid() = user_id);

-- Políticas RLS para daily_goals
CREATE POLICY "Users can view own goals" ON public.daily_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.daily_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.daily_goals FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para daily_progress
CREATE POLICY "Users can view own progress" ON public.daily_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.daily_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.daily_progress FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para body_measurements
CREATE POLICY "Users can view own measurements" ON public.body_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own measurements" ON public.body_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own measurements" ON public.body_measurements FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para activity_logs
CREATE POLICY "Users can view own activity logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Crear función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'name', 'Usuario'),
    new.email
  );
  RETURN new;
END;
$$;

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Crear objetivos predeterminados para nuevos usuarios
CREATE OR REPLACE FUNCTION public.create_default_goals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Crear objetivos básicos para el nuevo usuario
  INSERT INTO public.daily_goals (user_id, goal_type, title, description, target_value, target_unit) VALUES
  (new.id, 'diet', 'Seguir plan de alimentación', 'Completar todas las comidas del día según el plan', 1, 'plan'),
  (new.id, 'workout', 'Realizar entrenamiento', 'Completar la rutina de ejercicios diaria', 1, 'sesión'),
  (new.id, 'water', 'Beber agua suficiente', 'Mantener hidratación adecuada', 2, 'litros'),
  (new.id, 'sleep', 'Descansar bien', 'Dormir las horas recomendadas', 8, 'horas');
  
  RETURN new;
END;
$$;

-- Trigger para crear objetivos por defecto
CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.create_default_goals();
