
-- Crear tabla para las noticias del administrador
CREATE TABLE public.admin_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published BOOLEAN NOT NULL DEFAULT true
);

-- Habilitar RLS en la tabla
ALTER TABLE public.admin_news ENABLE ROW LEVEL SECURITY;

-- Política para que los administradores puedan hacer todo
CREATE POLICY "Admins can manage news" 
  ON public.admin_news 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::public.app_role
    )
  );

-- Política para que los usuarios registrados puedan ver las noticias publicadas
CREATE POLICY "Users can view published news" 
  ON public.admin_news 
  FOR SELECT 
  USING (
    published = true 
    AND auth.uid() IS NOT NULL
  );

-- Crear bucket para las imágenes de noticias si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para el bucket de imágenes de noticias
CREATE POLICY "Anyone can view news images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

CREATE POLICY "Admins can upload news images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'news-images' 
    AND EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::public.app_role
    )
  );

CREATE POLICY "Admins can update news images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'news-images' 
    AND EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::public.app_role
    )
  );

CREATE POLICY "Admins can delete news images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'news-images' 
    AND EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::public.app_role
    )
  );
