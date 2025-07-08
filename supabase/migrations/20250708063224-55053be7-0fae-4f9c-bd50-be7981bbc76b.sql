
-- Crear tabla para comentarios de usuarios pendientes de aprobación
CREATE TABLE public.user_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en la tabla user_testimonials
ALTER TABLE public.user_testimonials ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan crear sus propios testimonios
CREATE POLICY "Users can create their own testimonials" 
  ON public.user_testimonials 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan ver sus propios testimonios
CREATE POLICY "Users can view their own testimonials" 
  ON public.user_testimonials 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para que los usuarios puedan ver testimonios aprobados
CREATE POLICY "Users can view approved testimonials" 
  ON public.user_testimonials 
  FOR SELECT 
  USING (status = 'approved');

-- Política para que los administradores puedan ver todos los testimonios
CREATE POLICY "Admins can view all testimonials" 
  ON public.user_testimonials 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::public.app_role
    )
  );

-- Política para que los administradores puedan actualizar todos los testimonios
CREATE POLICY "Admins can update all testimonials" 
  ON public.user_testimonials 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::public.app_role
    )
  );

-- Política para que los administradores puedan eliminar todos los testimonios
CREATE POLICY "Admins can delete all testimonials" 
  ON public.user_testimonials 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::public.app_role
    )
  );
