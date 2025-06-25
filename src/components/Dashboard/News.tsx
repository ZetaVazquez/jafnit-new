
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AdminNews from './AdminNews';
import SubscriptionGuard from '@/components/SubscriptionGuard';
import DynamicBackground from '@/components/Layout/DynamicBackground';

interface NewsProps {
  onGoBack?: () => void;
}

const News: React.FC<NewsProps> = ({ onGoBack }) => {
  const { user } = useAuth();

  // Si no hay usuario autenticado, no mostrar nada
  if (!user) {
    return (
      <DynamicBackground className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {onGoBack && (
            <Button
              onClick={onGoBack}
              variant="outline"
              className="mb-6 border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          )}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-nutrition-green mb-4 title-main">
              Noticias y Actualizaciones
            </h2>
            <p className="text-gray-600">
              Debes iniciar sesión para ver las noticias.
            </p>
          </div>
        </div>
      </DynamicBackground>
    );
  }

  return (
    <SubscriptionGuard>
      <DynamicBackground className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {onGoBack && (
            <Button
              onClick={onGoBack}
              variant="outline"
              className="mb-6 border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          )}
          <AdminNews />
        </div>
      </DynamicBackground>
    </SubscriptionGuard>
  );
};

export default News;
