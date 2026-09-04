import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, Users, Trophy, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { PLANS, PlanId } from '@/config/plans';

interface ForcedPaymentModalProps {
  isOpen: boolean;
  onPaymentCompleted: () => void;
  onAccountClosure: () => void;
}

const ForcedPaymentModal: React.FC<ForcedPaymentModalProps> = ({
  isOpen,
  onPaymentCompleted,
  onAccountClosure
}) => {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos
  const { toast } = useToast();
  const { signOut } = useAuth();

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAccountClosure();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCloseModal = async () => {
    try {
      await signOut();
      localStorage.clear();
      window.location.href = '/';
      toast({
        title: "Modal cerrado",
        description: "Redirigiendo a la página principal...",
      });
    } catch (error) {
      console.error('Error closing modal:', error);
      // Force redirect even if there's an error
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const handleAccountClosure = async () => {
    try {
      await signOut();
      onAccountClosure();
      toast({
        title: "Tiempo agotado",
        description: "Tu cuenta ha sido desactivada por no completar el pago. Puedes registrarte nuevamente cuando estés listo.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error closing account:', error);
    }
  };

  const handlePlanSelection = (planType: PlanId) => {
    setLoading(true);
    try {
      const plan = PLANS.find(p => p.id === planType);
      if (plan?.stripeUrl) {
        window.open(plan.stripeUrl, '_blank');
      }
      toast({
        title: "Redirigiendo a Stripe",
        description: "Te hemos redirigido a la página de pago segura. Una vez completado el pago, tu suscripción será activada."
      });
      setTimeout(() => {
        onPaymentCompleted();
      }, 2000);
    } catch (error) {
      console.error('Error opening payment:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al abrir la página de pago.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const plans = PLANS.map(p => ({
    id: p.id,
    name: p.name,
    price: p.priceLabel,
    period: p.duration,
    description: p.tagline,
    features: p.features,
    popular: p.highlighted,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal} modal={true}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold text-primary mb-2 font-heading">
            ¡Bienvenido a tu transformación! 🎉
          </DialogTitle>
          <DialogDescription className="sr-only">
            Selecciona tu plan para completar el registro
          </DialogDescription>
          <div className="text-center">
            <p className="text-lg text-white/70 mb-4">
              Para completar tu registro y acceder a todo nuestro contenido, selecciona tu plan preferido.
            </p>
            <div className="flex items-center justify-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 mb-6">
              <Clock className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold">
                Tiempo restante: {formatTime(timeLeft)}
              </span>
            </div>
            <p className="text-sm text-white/50">
              Si no completas tu suscripción en el tiempo indicado, tu cuenta será desactivada automáticamente.
            </p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative border-2 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 ${
                plan.popular ? 'border-primary shadow-lg shadow-primary/20' : 'border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-10 whitespace-nowrap">
                  <div className="bg-primary text-black px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                    <Trophy className="w-4 h-4" />
                    <span>MÁS POPULAR</span>
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-2xl font-bold text-white font-heading">
                  {plan.name}
                </CardTitle>
                <div className="text-4xl font-bold text-white mb-2">
                  {plan.price}
                  <span className="text-lg font-normal text-white/50 ml-1">
                    {plan.period}
                  </span>
                </div>
                <CardDescription className="text-white/60">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelection(plan.id)}
                  disabled={loading}
                  className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-primary text-black hover:bg-primary/90'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Seleccionar Plan</span>
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/50 mb-4">
            * Todos los planes incluyen garantía de satisfacción de 14 días
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-white/60">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>+1000 clientes satisfechos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Pago seguro con Stripe</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForcedPaymentModal;
