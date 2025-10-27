-- Corregir la política de UPDATE para incluir WITH CHECK
DROP POLICY IF EXISTS "Admins can update all testimonials" ON user_testimonials;

CREATE POLICY "Admins can update all testimonials" ON user_testimonials
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE email IN ('josefiguenu@gmail.com', 'consultajafn@gmail.com', 'zaiidav347@gmail.com')
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE email IN ('josefiguenu@gmail.com', 'consultajafn@gmail.com', 'zaiidav347@gmail.com')
    )
  );