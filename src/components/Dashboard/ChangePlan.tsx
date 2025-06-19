
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, CreditCard, AlertCircle } from 'lucide-react';

interface ChangePlanProps {
  onGoBack: () => void;
}

const ChangePlan: React.FC<ChangePlanProps> = ({ onGoBack }) => {
  const [currentPlan, setCurrentPlan] = useState('monthly'); // Plan actual del usuario
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);

  const plans = [
    {
      id: 'monthly',
      name: 'Plan Mensual',
      duration: '1 mes',
      price: 75,
      features: [
        'Evaluación inicial completa',
        'Plan de alimentación personalizado',
        'Rutina de ejercicios básica',
        'Seguimiento semanal',
        'Soporte por WhatsApp',
        'Acceso a recursos básicos'
      ]
    },
    {
      id: 'quarterly',
      name: 'Plan Trimestral',
      duration: '3 meses',
      price: 210,
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
      ],
      popular: true
    }
  ];

  const getCurrentPlan = () => plans.find(plan => plan.id === currentPlan);
  const getSelectedPlan = () => plans.find(plan => plan.id === selectedPlan);

  const calculateDifference = () => {
    const current = getCurrentPlan();
    const selected = getSelectedPlan();
    if (!current || !selected) return 0;
    
    // Calcular precio mensual equivalente
    const currentMonthlyPrice = current.id === 'monthly' ? current.price : current.price / 3;
    const selectedMonthlyPrice = selected.id === 'monthly' ? selected.price : selected.price / 3;
    
    return selectedMonthlyPrice - currentMonthlyPrice;
  };

  const handleChangePlan = () => {
    const difference = calculateDifference();
    if (difference > 0) {
      alert(`Se te cobrará la diferencia de €${difference.toFixed(2)} al mes`);
    } else if (difference < 0) {
      alert('El cambio a un plan inferior no incluye reembolso del dinero ya pagado');
    } else {
      alert('Ya tienes este plan activo');
      return;
    }
    
    // Aquí iría la lógica de cambio de plan
    setCurrentPlan(selectedPlan);
    alert('Plan cambiado exitosamente');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onGoBack}
              variant="ghost"
              className="text-nutrition-green hover:bg-nutrition-green-lighter"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-nutrition-black">Cambiar mi Plan</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-nutrition-black mb-4">
            Gestiona tu Suscripción
          </h2>
          <p className="text-lg text-nutrition-gray">
            Cambia tu plan según tus necesidades. Puedes actualizarlo o reducirlo en cualquier momento.
          </p>
        </div>

        {/* Current Plan Info */}
        <Card className="mb-8 border-nutrition-green border-2">
          <CardHeader className="bg-nutrition-green text-white">
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Tu Plan Actual</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-nutrition-black">
                  {getCurrentPlan()?.name}
                </h3>
                <p className="text-nutrition-gray">{getCurrentPlan()?.duration}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-nutrition-green">
                  €{getCurrentPlan()?.price}
                </div>
                <p className="text-sm text-nutrition-gray">por período</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                selectedPlan === plan.id
                  ? 'ring-4 ring-nutrition-accent border-nutrition-accent'
                  : 'border-gray-200 hover:border-nutrition-green-light'
              } ${
                currentPlan === plan.id ? 'opacity-50' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-nutrition-black">
                  {plan.name}
                  {plan.popular && (
                    <span className="ml-2 inline-block bg-nutrition-accent text-white px-2 py-1 rounded-full text-xs">
                      Más Popular
                    </span>
                  )}
                  {currentPlan === plan.id && (
                    <span className="ml-2 inline-block bg-nutrition-green text-white px-2 py-1 rounded-full text-xs">
                      Actual
                    </span>
                  )}
                </CardTitle>
                <p className="text-nutrition-gray">{plan.duration}</p>
                <div className="text-3xl font-bold text-nutrition-green">
                  €{plan.price}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 mr-2 mt-0.5 text-nutrition-green flex-shrink-0" />
                      <span className="text-sm text-nutrition-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Change Plan Action */}
        {selectedPlan !== currentPlan && (
          <Card className="bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-nutrition-green mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-nutrition-black mb-2">
                    Resumen del Cambio
                  </h3>
                  <p className="text-nutrition-gray mb-4">
                    Cambiarás de <strong>{getCurrentPlan()?.name}</strong> a <strong>{getSelectedPlan()?.name}</strong>
                  </p>
                  
                  {calculateDifference() > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Upgrade:</strong> Se te cobrará una diferencia de €{calculateDifference().toFixed(2)} al mes.
                      </p>
                    </div>
                  )}
                  
                  {calculateDifference() < 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <p className="text-orange-800 text-sm">
                        <strong>Downgrade:</strong> No se realizarán reembolsos por el dinero ya pagado.
                      </p>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleChangePlan}
                    className="bg-nutrition-green hover:bg-nutrition-green-dark text-white"
                  >
                    Confirmar Cambio de Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ChangePlan;
