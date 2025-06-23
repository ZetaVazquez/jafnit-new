
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Star } from 'lucide-react';
import BizumPaymentProcess from './BizumPaymentProcess';

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
  const [showPaymentProcess, setShowPaymentProcess] = useState(false);

  const plans = {
    monthly: {
      name: 'Plan Mensual',
      price: '€75',
      duration: '1 mes',
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
      name: 'Plan Trimestral',
      price: '€210',
      duration: '3 meses',
      features: [
        'Todo lo del plan mensual',
        'Evaluación médica avanzada',
        'Plan de suplementación',
        'Rutina de ejercicios avanzada',
        'Seguimiento bisemanal',
        'Recetas personalizadas',
        'Acceso a la app móvil premium',
        '2 sesiones de entrenamiento personal',
        'Ahorro de €15 al mes'
      ]
    }
  };

  const handlePayment = () => {
    setShowPaymentProcess(true);
  };

  const handlePaymentClose = () => {
    setShowPaymentProcess(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen && !showPaymentProcess} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-nutrition-green flex items-center">
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
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    selectedPlan === key
                      ? 'border-nutrition-green bg-nutrition-green-lighter'
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
                    <CardTitle className="text-xl text-nutrition-black">
                      {plan.name}
                    </CardTitle>
                    <div className="text-3xl font-bold text-nutrition-green">
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

            <div className="bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light p-4 rounded-lg">
              <h3 className="font-bold text-nutrition-green-dark mb-2">Método de Pago</h3>
              <div className="flex items-center space-x-2">
                <div className="bg-white p-2 rounded">
                  <span className="text-nutrition-green font-bold">Bizum</span>
                </div>
                <span className="text-nutrition-gray">Pago seguro y rápido</span>
              </div>
              <p className="text-sm text-nutrition-gray mt-2">
                Realiza el pago por Bizum y envíanos el comprobante para activar tu suscripción
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={onDecideLater}
                className="flex-1 border-nutrition-green text-nutrition-green hover:bg-nutrition-green-lighter"
              >
                Decidir Más Tarde
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 bg-nutrition-green hover:bg-nutrition-green-dark text-white"
              >
                Pagar con Bizum
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BizumPaymentProcess
        isOpen={showPaymentProcess}
        onClose={handlePaymentClose}
        selectedPlan={selectedPlan}
        planDetails={plans[selectedPlan]}
      />
    </>
  );
};

export default PlanRecommendationModal;
