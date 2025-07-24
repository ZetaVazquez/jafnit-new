
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PlanRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDecideLater: () => void;
  recommendedPlan: 'monthly' | 'quarterly';
}

const PlanRecommendationModal: React.FC<PlanRecommendationModalProps> = ({
  isOpen,
  onClose,
  onDecideLater,
  recommendedPlan
}) => {
  const [selectedPlan, setSelectedPlan] = useState(recommendedPlan);
  const { user } = useAuth();
  const { toast } = useToast();

  const plans = {
    monthly: {
      name: 'Plan Básico',
      price: '€75',
      duration: 'Pago único',
      features: [
        'Evaluación inicial completa',
        'Plan de alimentación personalizado',
        'Rutina de ejercicios básica',
        'Seguimiento semanal',
        'Soporte por WhatsApp',
        'Acceso a recursos básicos'
      ]
    },
    quarterly: {
      name: 'Plan Premium',
      price: '€120',
      duration: 'Por mes',
      features: [
        'Todo lo del plan mensual',
        'Evaluación médica avanzada',
        'Plan de suplementación',
        'Rutina de ejercicios avanzada',
        'Seguimiento bisemanal',
        'Recetas personalizadas',
        'Acceso a la app móvil premium',
        '2 sesiones de entrenamiento personal',
        'Seguimiento mensual personalizado'
      ]
    }
  };

  const handleStripePayment = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar logueado para realizar el pago.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Procesando...",
        description: "Redirigiendo a Stripe Checkout"
      });

      const planType = selectedPlan === 'monthly' ? 'basic' : 'premium';
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        onClose();
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => { onClose(); window.location.href = '/'; }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-nutrition-green-lighter to-white relative">
          {/* Decorative background elements reducidos para el modal */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
            <div className="geometric-shape circle-shape w-16 h-16 top-5 left-5 animate-pulse-slow"></div>
            <div className="geometric-shape circle-shape w-12 h-12 top-1/2 right-5 animate-bounce-gentle"></div>
            <div className="geometric-shape triangle-shape triangle-up bottom-5 left-1/4 animate-float"></div>
            <div className="geometric-shape triangle-shape triangle-down top-1/4 right-1/4 animate-pulse-slow"></div>
          </div>

          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-nutrition-green flex items-center justify-center title-main">
                <Star className="w-6 h-6 mr-2" />
                Plan Recomendado Para Ti
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-nutrition-gray">
                  Basándote en tus respuestas del cuestionario, hemos seleccionado el mejor plan para ti:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(plans).map(([key, plan]) => (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all duration-300 border-2 bg-white/90 backdrop-blur-sm ${
                      selectedPlan === key
                        ? 'border-nutrition-green'
                        : 'border-gray-200 hover:border-nutrition-green-light'
                    } ${
                      recommendedPlan === key ? 'ring-2 ring-nutrition-accent' : ''
                    }`}
                    onClick={() => setSelectedPlan(key as 'monthly' | 'quarterly')}
                  >
                    <CardHeader className="text-center">
                      {recommendedPlan === key && (
                        <div className="inline-block bg-nutrition-accent text-white px-3 py-1 rounded-full text-sm font-medium mb-2 mx-auto">
                          Recomendado
                        </div>
                      )}
                      <CardTitle className="text-xl text-nutrition-black title-playful">
                        {plan.name}
                      </CardTitle>
                      <div className="text-3xl font-bold text-nutrition-green title-main">
                        {plan.price}
                      </div>
                      <p className="text-nutrition-gray">{plan.duration}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <Check className="w-4 h-4 mr-2 mt-0.5 text-nutrition-green flex-shrink-0" />
                            <span className="text-nutrition-gray">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-bold text-nutrition-green-dark mb-2 title-playful">Método de Pago</h3>
                <div className="flex items-center space-x-2">
                  <div className="bg-white p-2 rounded">
                    <span className="text-nutrition-green font-bold">Stripe</span>
                  </div>
                  <span className="text-nutrition-gray">Pago seguro con tarjeta</span>
                </div>
                <p className="text-sm text-nutrition-gray mt-2">
                  Pago seguro procesado por Stripe con activación inmediata
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    onDecideLater();
                    window.location.href = '/';
                  }}
                  className="flex-1"
                >
                  Decidir Más Tarde
                </Button>
                <Button
                  onClick={handleStripePayment}
                  className="flex-1"
                >
                  Pagar con Stripe
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default PlanRecommendationModal;
