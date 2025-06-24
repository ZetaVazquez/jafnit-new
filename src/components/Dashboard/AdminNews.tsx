
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
}

const AdminNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Si el usuario no está autenticado o no tiene suscripción activa, no mostrar nada
  if (!user || !hasActiveSubscription) {
    return (
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
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-nutrition-green mb-6">
          Noticias y Actualizaciones
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nutrition-green"></div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-nutrition-green mb-6">
        Noticias y Actualizaciones
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {news.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
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
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(item.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <h3 className="text-xl font-bold text-nutrition-black mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminNews;
