
import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import PlanRecommendationModal from '@/components/Dashboard/PlanRecommendationModal';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const { hasActiveSubscription, loading, isExpired } = useSubscription();

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

  if (!hasActiveSubscription || isExpired) {
    if (fallback) {
      return <>{fallback}</>;
    }

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
