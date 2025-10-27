-- Temporalmente, vamos a permitir a todos los usuarios autenticados actualizar testimoniales para debugging
DROP POLICY IF EXISTS "Admins can update all testimonials" ON user_testimonials;

-- Crear una política temporal menos restrictiva para debugging
CREATE POLICY "Authenticated users can update testimonials (TEMP)"
ON user_testimonials
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);