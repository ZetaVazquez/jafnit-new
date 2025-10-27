-- Update user_testimonials policies to use role-based admin checks
DROP POLICY IF EXISTS "Admins can delete all testimonials" ON user_testimonials;
DROP POLICY IF EXISTS "Admins can update all testimonials" ON user_testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON user_testimonials;

-- Allow admins (via user_roles) to view all testimonials
CREATE POLICY "Admins can view all testimonials"
ON user_testimonials
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to update any testimonial
CREATE POLICY "Admins can update all testimonials"
ON user_testimonials
FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Allow admins to delete any testimonial
CREATE POLICY "Admins can delete all testimonials"
ON user_testimonials
FOR DELETE
USING (has_role(auth.uid(), 'admin'));
