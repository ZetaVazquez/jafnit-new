import curlBarra from '@/assets/exercises/curl-biceps-barra.gif.asset.json';
import curlMartillo from '@/assets/exercises/curl-martillo.gif.asset.json';

const originalMedia: Record<string, string> = {
  '45beb8da-ff9a-4dab-a209-1256c9ed55e3': curlBarra.url,
  'dcf4be9a-3166-4cd0-88a7-624eb6d298b1': curlMartillo.url,
};

export function exerciseThumbnail(id: string | undefined, fallback: string | null | undefined) {
  return (id && originalMedia[id]) || fallback || null;
}