-- Crear tabla para manejar suscripciones de Stripe
CREATE TABLE IF NOT EXISTS public.stripe_subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  amount INTEGER NOT NULL, -- amount in cents
  currency TEXT DEFAULT 'eur',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stripe_subscription_events ENABLE ROW LEVEL SECURITY;

-- Políticas para admins
CREATE POLICY "Admins can manage all stripe subscription events" 
ON public.stripe_subscription_events 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para usuarios ver sus propias suscripciones
CREATE POLICY "Users can view own stripe subscription events" 
ON public.stripe_subscription_events 
FOR SELECT 
USING (auth.uid() = user_id);

-- Función para sincronizar Stripe con suscripciones locales
CREATE OR REPLACE FUNCTION sync_stripe_to_subscriptions()
RETURNS TRIGGER AS $$
BEGIN
  -- Si es una nueva suscripción de Stripe o una actualización
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Insertar o actualizar en la tabla subscriptions
    INSERT INTO public.subscriptions (
      user_id,
      plan_type,
      status,
      start_date,
      end_date,
      amount,
      payment_method
    ) VALUES (
      NEW.user_id,
      NEW.plan_type,
      NEW.status,
      NEW.current_period_start,
      NEW.current_period_end,
      NEW.amount / 100.0, -- Convert cents to euros
      'stripe'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_type = NEW.plan_type,
      status = NEW.status,
      start_date = NEW.current_period_start,
      end_date = NEW.current_period_end,
      amount = NEW.amount / 100.0,
      payment_method = 'stripe',
      updated_at = now();

    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para sincronizar automáticamente
CREATE TRIGGER sync_stripe_subscriptions_trigger
  AFTER INSERT OR UPDATE ON public.stripe_subscription_events
  FOR EACH ROW
  EXECUTE FUNCTION sync_stripe_to_subscriptions();