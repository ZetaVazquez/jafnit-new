-- Add missing DELETE policy so users can remove their own body measurements
CREATE POLICY "Users can delete own measurements"
ON public.body_measurements
FOR DELETE
USING (auth.uid() = user_id);