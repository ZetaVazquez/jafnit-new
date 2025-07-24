import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, Users, Trophy, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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

  const handlePlanSelection = async (planType: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo crear la sesión de pago. Inténtalo de nuevo.",
          variant: "destructive"
        });
        return;
      }

      if (data?.url) {
        // Abrir Stripe Checkout en nueva pestaña
        window.open(data.url, '_blank');
        
        // Verificar el pago cada 5 segundos
        const checkPayment = setInterval(async () => {
          try {
            const { data: subData } = await supabase.functions.invoke('check-subscription');
            if (subData?.subscribed) {
              clearInterval(checkPayment);
              onPaymentCompleted();
              toast({
                title: "¡Pago completado!",
                description: "Tu suscripción ha sido activada correctamente.",
              });
            }
          } catch (error) {
            console.error('Error checking payment:', error);
          }
        }, 5000);

        // Limpiar el intervalo después de 15 minutos
        setTimeout(() => clearInterval(checkPayment), 900000);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu solicitud.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Plan Básico',
      price: '75€',
      period: 'pago único',
      description: 'Perfecto para empezar tu transformación',
      features: [
        'Plan de alimentación personalizado',
        'Rutina de ejercicios básica',
        'Acceso a recursos educativos',
        'Soporte por email'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      price: '120€',
      period: 'al mes',
      description: 'La opción más completa para resultados óptimos',
      features: [
        'Todo lo del Plan Básico',
        'Seguimiento personalizado semanal',
        'Ajustes constantes del plan',
        'Soporte prioritario',
        'Acceso a comunidad exclusiva'
      ],
      color: 'from-nutrition-green to-nutrition-green-dark',
      popular: true
    },
    {
      id: 'pro',
      name: 'Plan PRO',
      price: '300€',
      period: 'al mes (mínimo 6 meses)',
      description: 'Transformación completa con acompañamiento intensivo',
      features: [
        'Todo lo del Plan Premium',
        'Consultas semanales 1:1',
        'Plan de suplementación',
        'Análisis corporal detallado',
        'Garantía de resultados'
      ],
      color: 'from-purple-500 to-purple-600',
      popular: false
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal={true}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold text-nutrition-green mb-2">
            ¡Bienvenido a tu transformación! 🎉
          </DialogTitle>
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">
              Para completar tu registro y acceder a todo nuestro contenido, selecciona tu plan preferido.
            </p>
            <div className="flex items-center justify-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-6">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="text-red-600 font-semibold">
                Tiempo restante: {formatTime(timeLeft)}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Si no completas tu suscripción en el tiempo indicado, tu cuenta será desactivada automáticamente.
            </p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                plan.popular ? 'border-nutrition-green shadow-lg' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-nutrition-green text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                    <Trophy className="w-4 h-4" />
                    <span>MÁS POPULAR</span>
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {plan.name}
                </CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600 ml-1">
                    {plan.period}
                  </span>
                </div>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-nutrition-green mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelection(plan.id)}
                  disabled={loading}
                  className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-nutrition-green hover:bg-nutrition-green-dark' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
          <p className="text-sm text-gray-500 mb-4">
            * Todos los planes incluyen garantía de satisfacción de 14 días
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
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