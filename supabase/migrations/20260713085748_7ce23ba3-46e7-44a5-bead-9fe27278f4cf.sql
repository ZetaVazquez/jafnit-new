
ALTER TABLE public.admin_news ADD COLUMN IF NOT EXISTS link_url text;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='news-images public read') THEN
    CREATE POLICY "news-images public read" ON storage.objects FOR SELECT USING (bucket_id = 'news-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='news-images admin insert') THEN
    CREATE POLICY "news-images admin insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='news-images admin update') THEN
    CREATE POLICY "news-images admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='news-images admin delete') THEN
    CREATE POLICY "news-images admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;
