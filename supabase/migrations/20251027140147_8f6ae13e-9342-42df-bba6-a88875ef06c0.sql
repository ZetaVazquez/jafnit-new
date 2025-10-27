-- Primero eliminamos las políticas existentes de admin para testimonials
DROP POLICY IF EXISTS "Admins can update all testimonials" ON user_testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON user_testimonials;
DROP POLICY IF EXISTS "Admins can delete all testimonials" ON user_testimonials;

-- Crear políticas más simples para admins usando emails específicos
-- Política para que los admins puedan ver todos los testimonios
CREATE POLICY "Admins can view all testimonials" ON user_testimonials
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE email IN ('josefiguenu@gmail.com', 'consultajafn@gmail.com', 'zaiidav347@gmail.com')
    )
  );

-- Política para que los admins puedan actualizar todos los testimonios
CREATE POLICY "Admins can update all testimonials" ON user_testimonials
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE email IN ('josefiguenu@gmail.com', 'consultajafn@gmail.com', 'zaiidav347@gmail.com')
    )
  );

-- Política para que los admins puedan eliminar todos los testimonios
CREATE POLICY "Admins can delete all testimonials" ON user_testimonials
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE email IN ('josefiguenu@gmail.com', 'consultajafn@gmail.com', 'zaiidav347@gmail.com')
    )
  );