-- Agregar 'habit_completed' a los tipos de actividad permitidos en activity_logs
DO $$
BEGIN
  -- Verificar si la restricción existe y modificarla
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'activity_logs_activity_type_check'
  ) THEN
    -- Eliminar la restricción existente
    ALTER TABLE public.activity_logs 
    DROP CONSTRAINT activity_logs_activity_type_check;
    
    -- Crear nueva restricción con 'habit_completed' incluido
    ALTER TABLE public.activity_logs
    ADD CONSTRAINT activity_logs_activity_type_check 
    CHECK (activity_type IN ('login', 'logout', 'goal_completed', 'measurement_added', 'diet_viewed', 'workout_completed', 'habit_completed'));
  ELSE
    -- Si no existe, crear la restricción directamente
    ALTER TABLE public.activity_logs
    ADD CONSTRAINT activity_logs_activity_type_check 
    CHECK (activity_type IN ('login', 'logout', 'goal_completed', 'measurement_added', 'diet_viewed', 'workout_completed', 'habit_completed'));
  END IF;
END $$;