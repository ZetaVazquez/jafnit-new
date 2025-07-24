import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, RefreshCw, ExternalLink } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SubscriptionInfo: React.FC = () => {
  const { 
    subscriptionStatus, 
    planType, 
    subscriptionEnd, 
    isBasicPlan, 
    hasActiveSubscription, 
    loading,
    refreshSubscription 
  } = useSubscription();
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      toast({
        title: "Redirigiendo...",
        description: "Abriendo portal de gestión de suscripción"
      });

      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error accessing customer portal:', error);
      toast({
        title: "Error",
        description: "No se pudo acceder al portal de gestión",
        variant: "destructive"
      });
    }
  };

  const handleRefreshStatus = () => {
    refreshSubscription();
    toast({
      title: "Actualizando...",
      description: "Verificando estado de suscripción"
    });
  };

  const getPlanDisplayName = (plan: string | null) => {
    switch (plan) {
      case 'basic':
        return 'Plan Básico';
      case 'premium':
        return 'Plan Premium';
      case 'pro':
        return 'Plan PRO';
      case 'quarterly':
        return 'Plan Trimestral';
      case 'monthly':
        return 'Plan Mensual';
      default:
        return 'Sin plan activo';
    }
  };

  const getStatusBadge = () => {
    if (hasActiveSubscription) {
      return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Inactivo</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Información de Suscripción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p>Cargando información de suscripción...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Información de Suscripción
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStatus}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Estado:</span>
          {getStatusBadge()}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Plan Actual:</span>
          <span className="text-nutrition-green font-semibold">
            {getPlanDisplayName(planType)}
          </span>
        </div>

        {isBasicPlan && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Plan Básico:</strong> Pago único completado. Tienes acceso completo a las funcionalidades básicas.
            </p>
          </div>
        )}

        {subscriptionEnd && !isBasicPlan && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Próxima renovación:</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{formatDate(subscriptionEnd)}</span>
            </div>
          </div>
        )}

        {hasActiveSubscription && !isBasicPlan && (
          <div className="pt-4 border-t">
            <Button
              onClick={handleManageSubscription}
              className="w-full flex items-center gap-2"
              variant="outline"
            >
              <ExternalLink className="w-4 h-4" />
              Gestionar Suscripción
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Cambiar método de pago, cancelar o modificar plan
            </p>
          </div>
        )}

        {!hasActiveSubscription && (
          <div className="pt-4 border-t">
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                No tienes una suscripción activa. Considera contratar un plan para acceder a todas las funcionalidades.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionInfo;