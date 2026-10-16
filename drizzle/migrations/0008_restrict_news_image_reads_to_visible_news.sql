ALTER POLICY "news-images public read" ON storage.objects
USING (
  bucket_id = 'news-images'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1
      FROM public.admin_news AS news
      WHERE news.published = true
        AND strpos(news.image_url, '/storage/v1/object/public/news-images/') > 0
        AND split_part(split_part(news.image_url, '/storage/v1/object/public/news-images/', 2), '?', 1) = storage.objects.name
    )
  )
);
