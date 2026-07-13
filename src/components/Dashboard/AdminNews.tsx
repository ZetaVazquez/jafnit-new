
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

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
  const { hasActiveSubscription } = useSubscription();

  useEffect(() => {
    // Solo cargar noticias si el usuario está autenticado y tiene suscripción activa
    if (user && hasActiveSubscription) {
      fetchNews();
    } else {
      setLoading(false);
    }
  }, [user, hasActiveSubscription]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching admin news:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (newsId: string) => {
    setExpandedNews(expandedNews === newsId ? null : newsId);
  };

  // Si el usuario no está autenticado o no tiene suscripción activa, no mostrar nada
  if (!user || !hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-nutrition-green-lighter">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-nutrition-green mb-6">
              Noticias y Actualizaciones
            </h2>
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">
                  Necesitas una suscripción activa para ver las noticias y actualizaciones.
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
      <div className="min-h-screen bg-nutrition-green-lighter">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-nutrition-green mb-6">
              Noticias y Actualizaciones
            </h2>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nutrition-green"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="min-h-screen bg-nutrition-green-lighter">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-nutrition-green mb-6">
              Noticias y Actualizaciones
            </h2>
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No hay noticias disponibles en este momento.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nutrition-green-lighter">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-nutrition-green mb-6">
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
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <CardContent className="p-0">
                    {item.image_url && (
                      <div className="relative">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(item.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-nutrition-green" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-nutrition-green" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-nutrition-black mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {isExpanded ? item.content : truncatedContent}
                      </p>
                      {item.link_url && (
                        <a
                          href={item.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-nutrition-green text-sm mt-3 font-medium hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" /> Ver enlace
                        </a>
                      )}
                      {item.content.length > 150 && (
                        <p className="text-nutrition-green text-sm mt-2 font-medium">
                          {isExpanded ? 'Hacer clic para contraer' : 'Hacer clic para leer más'}
                        </p>
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
