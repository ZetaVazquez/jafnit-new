
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { PricingPlan } from '@/types';

interface PricingProps {
  onStartQuestionnaire: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onStartQuestionnaire }) => {
  const plans: PricingPlan[] = [
    {
      id: '1',
      name: 'Plan Mensual',
      duration: '1 mes',
      price: '€75',
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
      id: '2',
      name: 'Plan Trimestral',
      duration: '3 meses',
      price: '€210',
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
      highlighted: true
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4">
            Planes y Precios
          </h2>
          <p className="text-xl text-nutrition-gray max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus objetivos y presupuesto
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                plan.highlighted
                  ? 'ring-4 ring-nutrition-accent transform scale-105'
                  : 'hover:shadow-xl border-2 border-transparent hover:border-nutrition-green-light'
              }`}
            >
              <div className={`p-8 ${plan.highlighted ? 'bg-nutrition-green' : 'bg-white'}`}>
                <div className="text-center">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-nutrition-black'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className={`text-lg mb-4 ${
                    plan.highlighted ? 'text-white opacity-90' : 'text-nutrition-gray'
                  }`}>
                    {plan.duration}
                  </p>
                  <div className={`text-4xl font-bold mb-6 ${
                    plan.highlighted ? 'text-white' : 'text-nutrition-green'
                  }`}>
                    {plan.price}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className={`w-5 h-5 mr-3 mt-0.5 ${
                        plan.highlighted ? 'text-white' : 'text-nutrition-green'
                      }`} />
                      <span className={`text-sm ${
                        plan.highlighted ? 'text-white' : 'text-nutrition-gray'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onStartQuestionnaire}
                  className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    plan.highlighted
                      ? 'bg-nutrition-accent hover:bg-nutrition-accent-dark text-white'
                      : 'bg-nutrition-green hover:bg-nutrition-green-dark text-white'
                  }`}
                >
                  Elegir Plan
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
