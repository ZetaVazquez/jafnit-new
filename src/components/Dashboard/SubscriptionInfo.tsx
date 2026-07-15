import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, RefreshCw, ExternalLink } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import PlanRecommendationModal from './PlanRecommendationModal';

const SubscriptionInfo: React.FC = () => {
  const { subscriptionStatus, planType, subscriptionEnd, isBasicPlan, hasActiveSubscription, loading, refreshSubscription } = useSubscription();
  const { toast } = useToast();
  const [showPlansModal, setShowPlansModal] = useState(false);

  const handleManageSubscription = () => setShowPlansModal(true);
  const handleRefreshStatus = () => { refreshSubscription(); toast({ title: "Actualizando...", description: "Verificando estado de suscripción" }); };

  const getPlanDisplayName = (plan: string | null) => {
    switch (plan) {
      case 'basic': return 'Plan Básico';
      case 'premium': return 'Plan Premium';
      case 'pro': return 'Plan PRO';
      case 'quarterly': return 'Plan Trimestral';
      case 'monthly': return 'Plan Mensual';
      default: return 'Sin plan activo';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader><CardTitle className="flex items-center gap-2 text-white"><CreditCard className="w-5 h-5" />Información de Suscripción</CardTitle></CardHeader>
        <CardContent><div className="text-center py-4"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[hsl(var(--accent-green))]" /><p className="text-white/50">Cargando información de suscripción...</p></div></CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white"><CreditCard className="w-5 h-5 text-[hsl(var(--accent-green))]" />Información de Suscripción</div>
          <Button variant="outline" size="sm" onClick={handleRefreshStatus} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent"><RefreshCw className="w-4 h-4" /></Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white/70">Estado:</span>
          {hasActiveSubscription 
            ? <Badge className="bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] border border-[hsl(var(--accent-green))]/30">Activo</Badge>
            : <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Inactivo</Badge>
          }
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-white/70">Plan Actual:</span>
          <span className="text-[hsl(var(--accent-green))] font-semibold">{getPlanDisplayName(planType)}</span>
        </div>
        {isBasicPlan && (
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
            <p className="text-sm text-blue-300"><strong>Plan Básico:</strong> Pago único completado. Tienes acceso completo a las funcionalidades básicas.</p>
          </div>
        )}
        {subscriptionEnd && !isBasicPlan && (
          <div className="flex items-center justify-between">
            <span className="font-medium text-white/70">Próxima renovación:</span>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-white/40" /><span className="text-sm text-white/60">{formatDate(subscriptionEnd)}</span></div>
          </div>
        )}
        {hasActiveSubscription && !isBasicPlan && (
          <div className="pt-4 border-t border-white/10">
            <Button onClick={handleManageSubscription} className="w-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white" variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />Gestionar Suscripción
            </Button>
            <p className="text-xs text-white/30 mt-2 text-center">Cambiar método de pago, cancelar o modificar plan</p>
          </div>
        )}
        {!hasActiveSubscription && (
          <div className="pt-4 border-t border-white/10">
            <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
              <p className="text-sm text-orange-300">No tienes una suscripción activa. Considera contratar un plan para acceder a todas las funcionalidades.</p>
            </div>
          </div>
        )}
      </CardContent>
      <PlanRecommendationModal isOpen={showPlansModal} onClose={() => setShowPlansModal(false)} onDecideLater={() => setShowPlansModal(false)} recommendedPlan="constructor" fromQuestionnaire={false} />
    </Card>
  );
};

export default SubscriptionInfo;
