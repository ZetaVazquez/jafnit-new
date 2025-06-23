
-- Crear función para actualizar planes expirados automáticamente
CREATE OR REPLACE FUNCTION update_expired_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Actualizar suscripciones expiradas a 'expired'
  UPDATE public.subscriptions 
  SET status = 'expired', updated_at = now()
  WHERE status = 'active' 
    AND end_date IS NOT NULL 
    AND end_date < now();
END;
$$;

-- Función para verificar el estado de suscripción de un usuario
CREATE OR REPLACE FUNCTION get_user_subscription_status(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  subscription_status text;
BEGIN
  -- Primero actualizar suscripciones expiradas
  PERFORM update_expired_subscriptions();
  
  -- Obtener el estado de la suscripción del usuario
  SELECT status INTO subscription_status
  FROM public.subscriptions
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Si no tiene suscripción, retornar 'inactive'
  RETURN COALESCE(subscription_status, 'inactive');
END;
$$;

-- Agregar políticas RLS para subscriptions si no existen
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios puedan ver sus propias suscripciones
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para que admins puedan ver todas las suscripciones
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can view all subscriptions" 
  ON public.subscriptions 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Política para que admins puedan insertar/actualizar suscripciones
DROP POLICY IF EXISTS "Admins can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage subscriptions" 
  ON public.subscriptions 
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update subscriptions" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Agregar RLS para diet_plans y workout_plans
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

-- Políticas para diet_plans
DROP POLICY IF EXISTS "Users can view own diet plans" ON public.diet_plans;
CREATE POLICY "Users can view own diet plans" 
  ON public.diet_plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all diet plans" ON public.diet_plans;
CREATE POLICY "Admins can manage all diet plans" 
  ON public.diet_plans 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Políticas para workout_plans
DROP POLICY IF EXISTS "Users can view own workout plans" ON public.workout_plans;
CREATE POLICY "Users can view own workout plans" 
  ON public.workout_plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all workout plans" ON public.workout_plans;
CREATE POLICY "Admins can manage all workout plans" 
  ON public.workout_plans 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
