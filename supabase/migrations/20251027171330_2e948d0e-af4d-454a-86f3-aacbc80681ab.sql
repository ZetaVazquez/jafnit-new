-- Crear tabla para las guías
CREATE TABLE public.guides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  pdf_url TEXT NOT NULL,
  regular_price NUMERIC NOT NULL,
  discounted_price NUMERIC NOT NULL,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_guides_updated_at
BEFORE UPDATE ON public.guides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para guides
CREATE POLICY "Anyone can view active guides"
ON public.guides
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage guides"
ON public.guides
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Crear tabla para las compras de guías
CREATE TABLE public.guide_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  amount_paid NUMERIC NOT NULL,
  stripe_payment_intent_id TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en guide_purchases
ALTER TABLE public.guide_purchases ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para guide_purchases
CREATE POLICY "Users can view their own purchases"
ON public.guide_purchases
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
ON public.guide_purchases
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases"
ON public.guide_purchases
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Crear bucket para PDFs de guías
INSERT INTO storage.buckets (id, name, public)
VALUES ('guides', 'guides', false);

-- Políticas de storage para el bucket guides
CREATE POLICY "Admins can upload guides"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'guides' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update guides"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'guides' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete guides"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'guides' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users who purchased can download guides"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'guides' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    EXISTS (
      SELECT 1 FROM public.guide_purchases
      WHERE user_id = auth.uid()
      AND guide_id::text = (storage.foldername(name))[1]
    )
  )
);