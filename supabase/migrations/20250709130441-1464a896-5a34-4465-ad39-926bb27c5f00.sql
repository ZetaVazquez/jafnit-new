
-- Crear tabla para suscripciones de Stripe
CREATE TABLE public.stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Crear tabla para clientes de Stripe
CREATE TABLE public.stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Crear tabla para productos y precios de Stripe
CREATE TABLE public.stripe_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_product_id TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  amount INTEGER NOT NULL, -- amount in cents
  currency TEXT NOT NULL DEFAULT 'eur',
  interval_type TEXT CHECK (interval_type IN ('one_time', 'month', 'year')),
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'pro')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_products ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para stripe_subscriptions
CREATE POLICY "Users can view own stripe subscriptions" 
ON public.stripe_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all stripe subscriptions" 
ON public.stripe_subscriptions 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para stripe_customers
CREATE POLICY "Users can view own stripe customer data" 
ON public.stripe_customers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all stripe customers" 
ON public.stripe_customers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para stripe_products (público para lectura)
CREATE POLICY "Anyone can view active stripe products" 
ON public.stripe_products 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage stripe products" 
ON public.stripe_products 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Función para obtener el estado de suscripción de Stripe del usuario
CREATE OR REPLACE FUNCTION public.get_user_stripe_subscription_status(user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  subscription_status TEXT;
BEGIN
  -- Obtener el estado de la suscripción de Stripe del usuario
  SELECT status INTO subscription_status
  FROM public.stripe_subscriptions
  WHERE user_id = user_uuid
    AND status IN ('active', 'trialing')
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Si no tiene suscripción activa de Stripe, verificar suscripción tradicional
  IF subscription_status IS NULL THEN
    RETURN get_user_subscription_status(user_uuid);
  END IF;
  
  RETURN COALESCE(subscription_status, 'inactive');
END;
$$;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stripe_subscriptions_updated_at
  BEFORE UPDATE ON public.stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stripe_customers_updated_at
  BEFORE UPDATE ON public.stripe_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stripe_products_updated_at
  BEFORE UPDATE ON public.stripe_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar productos iniciales de Stripe (se actualizarán con los IDs reales de Stripe)
INSERT INTO public.stripe_products (stripe_product_id, stripe_price_id, name, description, amount, currency, interval_type, plan_type) VALUES
('prod_basic_placeholder', 'price_basic_placeholder', 'Plan Básico', 'Evaluación inicial completa y plan básico', 7500, 'eur', 'one_time', 'basic'),
('prod_premium_placeholder', 'price_premium_placeholder', 'Plan Premium', 'Plan mensual con seguimiento personalizado', 12000, 'eur', 'month', 'premium'),
('prod_pro_placeholder', 'price_pro_placeholder', 'Plan PRO', 'Plan profesional con entrenamiento personal', 30000, 'eur', 'month', 'pro');
