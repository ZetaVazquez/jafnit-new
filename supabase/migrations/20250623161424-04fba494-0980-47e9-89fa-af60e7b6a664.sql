
-- Crear tabla para pagos pendientes
CREATE TABLE public.pending_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'quarterly')),
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'bizum',
  payment_reference TEXT,
  receipt_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para la tabla pending_payments
ALTER TABLE public.pending_payments ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios vean solo sus propios pagos pendientes
CREATE POLICY "Users can view their own pending payments" 
  ON public.pending_payments 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para que los usuarios puedan crear sus propios pagos pendientes
CREATE POLICY "Users can create their own pending payments" 
  ON public.pending_payments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para que los administradores puedan ver todos los pagos pendientes
CREATE POLICY "Admins can view all pending payments" 
  ON public.pending_payments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Política para que los administradores puedan actualizar todos los pagos pendientes
CREATE POLICY "Admins can update all pending payments" 
  ON public.pending_payments 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Crear bucket para comprobantes de pago
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-receipts', 'payment-receipts', false);

-- Política para que los usuarios puedan subir sus propios comprobantes
CREATE POLICY "Users can upload their own payment receipts" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'payment-receipts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para que los usuarios puedan ver sus propios comprobantes
CREATE POLICY "Users can view their own payment receipts" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'payment-receipts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para que los administradores puedan ver todos los comprobantes
CREATE POLICY "Admins can view all payment receipts" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'payment-receipts' AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
