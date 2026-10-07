import { supabase } from '@/integrations/supabase/client';

// Existing news rows contain public URLs, but the bucket remains private.
export async function resolveNewsImage(url: string | null | undefined): Promise<string | undefined> {
  if (!url) return undefined;
  const marker = '/storage/v1/object/public/news-images/';
  const index = url.indexOf(marker);
  if (index < 0) return url;
  const path = decodeURIComponent(url.slice(index + marker.length).split('?')[0]);
  const { data, error } = await supabase.storage.from('news-images').createSignedUrl(path, 3600);
  if (error) {
    console.error('Error loading news image:', error.message);
    return undefined;
  }
  return data?.signedUrl;
}