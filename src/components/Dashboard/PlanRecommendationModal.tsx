
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PLANS, PlanId } from '@/config/plans';

interface PlanRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDecideLater: () => void;
  recommendedPlan: PlanId;
  fromQuestionnaire?: boolean;
}

const PlanRecommendationModal: React.FC<PlanRecommendationModalProps> = ({
  isOpen,
  onClose,
  onDecideLater,
  recommendedPlan,
  fromQuestionnaire = false
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(recommendedPlan);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePlanSelection = (planType: PlanId) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar logueado para realizar el pago.",
        variant: "destructive"
      });
      return;
    }
    const plan = PLANS.find(p => p.id === planType);
    if (plan?.stripeUrl) {
      window.open(plan.stripeUrl, '_blank');
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
                {PLANS.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all duration-300 border-2 bg-white/90 backdrop-blur-sm hover-lift ${
                      selectedPlan === plan.id
                        ? 'border-nutrition-green ring-2 ring-nutrition-green/50'
                        : 'border-gray-200 hover:border-nutrition-green-light'
                    } ${
                      recommendedPlan === plan.id ? 'ring-2 ring-nutrition-accent' : ''
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardHeader className="text-center pb-4">
                      {recommendedPlan === plan.id && (
                        <div className="inline-block bg-nutrition-accent text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                          Recomendado
                        </div>
                      )}
                      <CardTitle className="text-lg font-bold text-nutrition-black title-playful">
                        {plan.name}
                      </CardTitle>
                      <div className="text-2xl font-bold text-nutrition-green title-main">
                        {plan.priceLabel}
                      </div>
                      <p className="text-nutrition-gray text-sm">{plan.duration}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-xs">
                            <Check className="w-3 h-3 mr-2 mt-0.5 text-nutrition-green flex-shrink-0" />
                            <span className="text-nutrition-gray leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handlePlanSelection(plan.id)}
                        className="w-full bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green text-white font-bold"
                      >
                        Quiero este plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    onDecideLater();
                    window.location.href = '/';
                  }}
                  className="px-8 py-2"
                >
                  Decidir Más Tarde
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
