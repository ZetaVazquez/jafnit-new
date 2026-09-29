DROP POLICY IF EXISTS "own diet select" ON public.diet_plans;
CREATE POLICY "own diet select" ON public.diet_plans FOR SELECT TO authenticated USING (((auth.uid() = user_id OR auth.uid() = assigned_to) AND status = 'approved') OR public.has_role(auth.uid(), 'admin'::public.app_role));
DROP POLICY IF EXISTS "own workout select" ON public.workout_plans;
CREATE POLICY "own workout select" ON public.workout_plans FOR SELECT TO authenticated USING (((auth.uid() = user_id OR auth.uid() = assigned_to) AND status = 'approved') OR public.has_role(auth.uid(), 'admin'::public.app_role));