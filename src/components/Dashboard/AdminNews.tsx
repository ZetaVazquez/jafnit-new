
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ChevronDown, ChevronUp, ExternalLink, ImageOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { resolveNewsImage } from '@/lib/newsImage';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  link_url?: string | null;
  created_at: string;
}

const AdminNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNews, setExpandedNews] = useState<string | null>(null);
  const { user } = useAuth();
  const [failedImages, setFailedImages] = useState<string[]>([]);

  useEffect(() => {
    // Las noticias están disponibles para los clientes con sesión iniciada.
    if (user) {
      fetchNews();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      const items = await Promise.all((data || []).map(async (item) => ({
        ...item,
        image_url: await resolveNewsImage(item.image_url),
      })));
      setNews(items);
    } catch (error) {
      console.error('Error fetching admin news:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (newsId: string) => {
    setExpandedNews(expandedNews === newsId ? null : newsId);
  };

  // No mostrar noticias sin sesión iniciada.
  if (!user) {
    return (
      <div className="text-[hsl(var(--text-primary))]">
        <div className="w-full">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[hsl(var(--accent-green-light))] mb-6">
              Noticias y Actualizaciones
            </h2>
            <Card className="border-[hsl(var(--dark-border))] bg-[hsl(var(--dark-surface))]">
              <CardContent className="p-8 text-center">
                <p className="text-[hsl(var(--text-secondary))]">
                  Debes iniciar sesión para ver las noticias y actualizaciones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-[hsl(var(--text-primary))]">
        <div className="w-full">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[hsl(var(--accent-green-light))] mb-6">
              Noticias y Actualizaciones
            </h2>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--accent-green))]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-[hsl(var(--text-primary))]">
        <div className="w-full">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[hsl(var(--accent-green-light))] mb-6">
              Noticias y Actualizaciones
            </h2>
            <Card className="border-[hsl(var(--dark-border))] bg-[hsl(var(--dark-surface))]">
              <CardContent className="p-8 text-center">
                <p className="text-[hsl(var(--text-secondary))]">No hay noticias disponibles en este momento.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-[hsl(var(--text-primary))]">
      <div className="w-full">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[hsl(var(--accent-green-light))] mb-6">
            Noticias y Actualizaciones
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {news.map((item) => {
              const isExpanded = expandedNews === item.id;
              const truncatedContent = item.content.length > 150 
                ? item.content.substring(0, 150) + '...' 
                : item.content;
              
              return (
                <Card 
                  key={item.id} 
                  className="overflow-hidden border-[hsl(var(--dark-border))] bg-[hsl(var(--dark-surface))] text-[hsl(var(--text-primary))]"
                >
                  <CardContent className="p-0">
                    {item.image_url && (
                      <div className="flex min-h-40 items-center justify-center bg-[hsl(var(--dark-bg))]">
                        {failedImages.includes(item.id) ? (
                          <div className="flex flex-col items-center gap-2 py-10 text-[hsl(var(--text-secondary))]">
                            <ImageOff className="h-6 w-6" />
                            <p className="text-sm">Imagen no disponible</p>
                          </div>
                        ) : (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            loading="lazy"
                            onError={() => setFailedImages((previous) => [...previous, item.id])}
                            className="block w-full max-h-96 object-contain"
                          />
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center text-sm text-[hsl(var(--text-secondary))] min-w-0">
                          <Calendar className="w-4 h-4 mr-2 shrink-0" />
                          {new Date(item.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>

                      </div>
                      <h3 className="text-xl font-bold text-[hsl(var(--text-primary))] mb-3 break-words">
                        {item.title}
                      </h3>
                      <p className="text-[hsl(var(--text-secondary))] leading-relaxed whitespace-pre-line break-words">
                        {isExpanded ? item.content : truncatedContent}
                      </p>
                      {item.link_url && (
                        <a
                          href={item.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[hsl(var(--accent-green-light))] text-sm mt-3 font-medium hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" /> Ver enlace
                        </a>
                      )}
                      {item.content.length > 150 && (
                        <Button
                          variant="ghost"
                          onClick={() => toggleExpanded(item.id)}
                          aria-expanded={isExpanded}
                          className="mt-3 text-[hsl(var(--accent-green-light))] hover:bg-[hsl(var(--accent-green))]/10"
                        >
                          {isExpanded ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                          {isExpanded ? 'Leer menos' : 'Leer más'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNews;
