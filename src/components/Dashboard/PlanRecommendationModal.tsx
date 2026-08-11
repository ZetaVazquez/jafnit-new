
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
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto bg-[hsl(220,20%,8%)] border-white/10 text-white">
          <div className="relative z-10">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center">
                <Star className="w-6 h-6 mr-2 text-[hsl(var(--accent-green-light))]" />
                Plan Recomendado Para Ti
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-white/60">
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
                    className={`cursor-pointer transition-all duration-300 border bg-white/5 backdrop-blur-sm hover:scale-[1.02] ${
                      selectedPlan === plan.id
                        ? 'border-[hsl(var(--accent-green))] ring-2 ring-[hsl(var(--accent-green))]/40'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardHeader className="text-center pb-4">
                      {recommendedPlan === plan.id && (
                        <div className="mx-auto inline-block bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green-light))] border border-[hsl(var(--accent-green))]/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                          Recomendado
                        </div>
                      )}
                      <CardTitle className="text-lg font-bold text-white">
                        {plan.name}
                      </CardTitle>
                      <div className="text-3xl font-bold text-white">
                        {plan.priceLabel}
                      </div>
                      <p className="text-white/40 text-sm">{plan.duration}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-xs">
                            <Check className="w-3 h-3 mr-2 mt-0.5 text-[hsl(var(--accent-green-light))] flex-shrink-0" />
                            <span className="text-white/70 leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handlePlanSelection(plan.id)}
                        className={`w-full font-semibold ${
                          recommendedPlan === plan.id
                            ? 'btn-cta'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        }`}
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
                  className="px-8 py-2 bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
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
