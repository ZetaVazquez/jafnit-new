
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
  recommendedPlan: 'basic' | 'premium' | 'pro';
  fromQuestionnaire?: boolean;
}

const PlanRecommendationModal: React.FC<PlanRecommendationModalProps> = ({
  isOpen,
  onClose,
  onDecideLater,
  recommendedPlan,
  fromQuestionnaire = false
}) => {
  const [selectedPlan, setSelectedPlan] = useState(recommendedPlan);
  const { user } = useAuth();
  const { toast } = useToast();

  const plans = {
    basic: {
      name: 'Plan Básico',
      price: '€75',
      duration: 'Pago único',
      features: [
        'Dirigido a principiantes que quieren orden',
        'Nutrición personalizada con menú adaptado',
        'Entrenamiento no incluido',
        'Hábitos con guías básicas',
        'Seguimiento: 1 revisión por mensaje',
        'Sin análisis',
        'Sin soporte',
        'Extras: Guía de compras y batch cooking'
      ]
    },
    premium: {
      name: 'Plan Premium',
      price: '€120',
      duration: 'Por mes',
      features: [
        'Dirigido a personas que buscan mejorar composición corporal',
        'Nutrición incluida + organización de comidas',
        'Entrenamiento: Plan para casa o gimnasio',
        'Hábitos: Plan estructurado + herramientas',
        'Seguimiento: 1 consulta online o presencial mensual',
        'Sin análisis',
        'Soporte: Acceso básico a herramientas',
        'Extras: Plantillas de control y rutinas'
      ]
    },
    pro: {
      name: 'Plan PRO',
      price: '€300',
      duration: 'Duración mínima 6 meses',
      features: [
        'Dirigido a personas comprometidas con un cambio completo',
        'Nutrición incluida + revisión y ajustes avanzados',
        'Entrenamiento completo, progresivo y evaluado',
        'Hábitos: Fases inicio - media - consolidación',
        'Seguimiento: Revisión quincenal por vídeo o mensaje',
        'Análisis: Informe mensual con métricas y feedback',
        'Soporte directo por WhatsApp (24h hábiles)',
        'Extras: Retos, comunidad privada y evolución total'
      ]
    }
  };

  const handleStripePayment = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar logueado para realizar el pago.",
        variant: "destructive"
      });
      return;
    }

    // URLs específicas para cada plan
    const planUrls = {
      'basic': 'https://buy.stripe.com/28EcN62DHgtIgxtfE46wE00',
      'premium': 'https://buy.stripe.com/7sYdRa7Y13GW9513Vm6wE01',
      'pro': 'https://buy.stripe.com/6oUbJ21zDfpE0yvbnO6wE02'
    };

    const url = planUrls[selectedPlan];
    if (url) {
      window.open(url, '_blank');
      toast({
        title: "Redirigiendo a Stripe",
        description: "Te hemos redirigido a la página de pago segura"
      });
    }
    
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => { onClose(); window.location.href = '/'; }}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-nutrition-green-lighter to-white">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            <div className="geometric-shape circle-shape w-16 h-16 top-5 left-5 animate-pulse-slow"></div>
            <div className="geometric-shape circle-shape w-12 h-12 top-1/2 right-5 animate-bounce-gentle"></div>
            <div className="geometric-shape triangle-shape triangle-up bottom-5 left-1/4 animate-float"></div>
            <div className="geometric-shape triangle-shape triangle-down top-1/4 right-1/4 animate-pulse-slow"></div>
          </div>

          <div className="relative z-10">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl md:text-3xl font-bold text-nutrition-green flex items-center justify-center title-main">
                <Star className="w-6 h-6 mr-2" />
                Plan Recomendado Para Ti
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-nutrition-gray">
                  {fromQuestionnaire 
                    ? "Basándote en tus respuestas del cuestionario, hemos seleccionado el mejor plan para ti:"
                    : "¿Qué plan quieres comprar?"
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(plans).map(([key, plan]) => (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all duration-300 border-2 bg-white/90 backdrop-blur-sm hover-lift ${
                      selectedPlan === key
                        ? 'border-nutrition-green ring-2 ring-nutrition-green/50'
                        : 'border-gray-200 hover:border-nutrition-green-light'
                    } ${
                      recommendedPlan === key ? 'ring-2 ring-nutrition-accent' : ''
                    }`}
                    onClick={() => setSelectedPlan(key as 'basic' | 'premium' | 'pro')}
                  >
                    <CardHeader className="text-center pb-4">
                      {recommendedPlan === key && (
                        <div className="inline-block bg-nutrition-accent text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                          Recomendado
                        </div>
                      )}
                      <CardTitle className="text-lg font-bold text-nutrition-black title-playful">
                        {plan.name}
                      </CardTitle>
                      <div className="text-2xl font-bold text-nutrition-green title-main">
                        {plan.price}
                      </div>
                      <p className="text-nutrition-gray text-sm">{plan.duration}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-xs">
                            <Check className="w-3 h-3 mr-2 mt-0.5 text-nutrition-green flex-shrink-0" />
                            <span className="text-nutrition-gray leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-bold text-nutrition-green-dark mb-3 title-playful">Método de Pago</h3>
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <span className="text-nutrition-green font-bold">Stripe</span>
                  </div>
                  <span className="text-nutrition-gray">Pago seguro con tarjeta</span>
                </div>
                <p className="text-xs text-nutrition-gray mt-2">
                  Pago seguro procesado por Stripe con activación inmediata
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    onDecideLater();
                    window.location.href = '/';
                  }}
                  className="flex-1 py-2"
                >
                  Decidir Más Tarde
                </Button>
                <Button
                  onClick={handleStripePayment}
                  className="flex-1 py-2 bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green text-white font-bold"
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
