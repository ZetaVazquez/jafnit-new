
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import AdminNews from './AdminNews';
import SubscriptionGuard from '@/components/SubscriptionGuard';

const News: React.FC = () => {
  const { user } = useAuth();

  // Si no hay usuario autenticado, no mostrar nada
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-nutrition-green mb-4">
            Noticias y Actualizaciones
          </h2>
          <p className="text-gray-600">
            Debes iniciar sesión para ver las noticias.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SubscriptionGuard>
      <div className="container mx-auto px-4 py-8">
        <AdminNews />
      </div>
    </SubscriptionGuard>
  );
};

export default News;
