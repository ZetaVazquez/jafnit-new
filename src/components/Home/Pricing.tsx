
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
      name: 'Plan Trimestral',
      duration: '3 meses',
      price: '€297',
      features: [
        'Evaluación inicial completa',
        'Plan de alimentación personalizado',
        'Rutina de ejercicios diseñada para ti',
        'Seguimiento semanal',
        'Ajustes mensuales del plan',
        'Soporte por WhatsApp',
        '2 sesiones de entrenamiento personal'
      ]
    },
    {
      id: '2',
      name: 'Plan Semestral',
      duration: '6 meses',
      price: '€497',
      features: [
        'Todo lo del plan trimestral',
        'Evaluación médica avanzada',
        'Plan de suplementación',
        'Seguimiento bisemanal',
        'Recetas personalizadas',
        'Acceso a la app móvil',
        '4 sesiones de entrenamiento personal',
        'Consulta nutricional mensual'
      ],
      highlighted: true
    },
    {
      id: '3',
      name: 'Plan Anual',
      duration: '12 meses',
      price: '€797',
      features: [
        'Todo lo de los planes anteriores',
        'Evaluación corporal mensual',
        'Plan familiar (hasta 2 personas)',
        'Seguimiento continuo',
        'Programa de mantenimiento',
        'Descuento en productos',
        '8 sesiones de entrenamiento personal',
        'Consulta psicológica deportiva',
        'Descuento del 15%'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4">
            Planes y Precios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus objetivos y presupuesto
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg overflow-hidden ${
                plan.highlighted
                  ? 'ring-4 ring-nutrition-orange transform scale-105'
                  : 'hover:shadow-xl'
              } transition-all duration-300`}
            >
              <div className={`p-8 ${plan.highlighted ? 'bg-nutrition-green' : 'bg-white'}`}>
                <div className="text-center">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-nutrition-black'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className={`text-lg mb-4 ${
                    plan.highlighted ? 'text-white opacity-90' : 'text-gray-600'
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
                        plan.highlighted ? 'text-white' : 'text-gray-600'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onStartQuestionnaire}
                  className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-nutrition-orange hover:bg-nutrition-orange-dark text-white'
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
