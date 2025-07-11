-- Crear tabla para almacenar las aceptaciones de términos y condiciones
CREATE TABLE public.terms_acceptances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  terms_version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan insertar su propia aceptación
CREATE POLICY "Users can insert their own terms acceptance" 
ON public.terms_acceptances 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan ver su propia aceptación
CREATE POLICY "Users can view their own terms acceptance" 
ON public.terms_acceptances 
FOR SELECT 
USING (auth.uid() = user_id);

-- Política para que los admins puedan ver todas las aceptaciones
CREATE POLICY "Admins can view all terms acceptances" 
ON public.terms_acceptances 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));