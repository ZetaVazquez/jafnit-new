-- Ensure RLS is enabled on activity_logs (idempotent)
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to delete their own activity logs (needed to desmarcar hábitos)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'activity_logs' 
      AND policyname = 'Users can delete own activity logs'
  ) THEN
    CREATE POLICY "Users can delete own activity logs"
    ON public.activity_logs
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- (Optional) Allow users to update their own activity logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'activity_logs' 
      AND policyname = 'Users can update own activity logs'
  ) THEN
    CREATE POLICY "Users can update own activity logs"
    ON public.activity_logs
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
END $$;