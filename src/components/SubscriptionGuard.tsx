
import React, { useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import PlanRecommendationModal from '@/components/Dashboard/PlanRecommendationModal';
import ForcedPaymentModal from '@/components/Auth/ForcedPaymentModal';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  strictMode?: boolean; // Para activar modo estricto con temporizador
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
  children, 
  fallback,
  strictMode = false 
}) => {
  const { hasActiveSubscription, loading, isExpired, refreshSubscription } = useSubscription();
  const { user, signOut } = useAuth();

  // Verificar suscripción cada 30 segundos en modo estricto
  useEffect(() => {
    if (!strictMode || !user) return;

    const interval = setInterval(() => {
      refreshSubscription();
    }, 30000);

    return () => clearInterval(interval);
  }, [strictMode, user, refreshSubscription]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nutrition-green-lighter to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nutrition-green mx-auto"></div>
          <p className="mt-4 text-nutrition-gray">Verificando suscripción...</p>
        </div>
      </div>
    );
  }

  const handlePaymentCompleted = () => {
    refreshSubscription();
  };

  const handleAccountClosure = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (!hasActiveSubscription || isExpired) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // En modo estricto, mostrar modal de pago forzoso
    if (strictMode) {
      return (
        <ForcedPaymentModal
          isOpen={true}
          onPaymentCompleted={handlePaymentCompleted}
          onAccountClosure={handleAccountClosure}
        />
      );
    }

    // En modo normal, mostrar modal de recomendación
    return (
      <PlanRecommendationModal
        isOpen={true}
        onClose={() => {}}
        onDecideLater={() => {}}
        recommendedPlan="monthly"
      />
    );
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
