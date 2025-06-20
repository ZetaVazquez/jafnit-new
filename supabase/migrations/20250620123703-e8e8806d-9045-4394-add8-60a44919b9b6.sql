
-- Actualizar la tabla profiles para incluir más información del usuario
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Crear políticas RLS para la tabla profiles (eliminando las existentes primero)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Crear nuevas políticas
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Función para eliminar todos los datos de un usuario cuando borra su cuenta
CREATE OR REPLACE FUNCTION public.delete_user_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Eliminar todos los datos relacionados con el usuario
  DELETE FROM public.daily_progress WHERE user_id = OLD.id;
  DELETE FROM public.daily_goals WHERE user_id = OLD.id;
  DELETE FROM public.body_measurements WHERE user_id = OLD.id;
  DELETE FROM public.diet_plans WHERE user_id = OLD.id;
  DELETE FROM public.workout_plans WHERE user_id = OLD.id;
  DELETE FROM public.questionnaire_responses WHERE user_id = OLD.id;
  DELETE FROM public.subscriptions WHERE user_id = OLD.id;
  DELETE FROM public.activity_logs WHERE user_id = OLD.id;
  DELETE FROM public.profiles WHERE id = OLD.id;
  
  RETURN OLD;
END;
$$;

-- Eliminar trigger existente si existe y crear nuevo
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.delete_user_data();
