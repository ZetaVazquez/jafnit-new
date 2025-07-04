
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
    <section id="pricing" className="py-32 relative overflow-hidden">
      {/* Formas geométricas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculos grandes */}
        <div className="geometric-shape circle-shape w-32 h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        
        {/* Círculos medianos */}
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 left-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-18 h-18 top-2/3 left-1/6 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-14 h-14 bottom-1/2 left-3/4 animate-float"></div>
        
        {/* Triángulos */}
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
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
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 border-nutrition-green-light hover:border-nutrition-green"
            >
              <div className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 text-nutrition-black title-playful">
                    {plan.name}
                  </h3>
                  <p className="text-lg mb-4 text-nutrition-gray">
                    {plan.duration}
                  </p>
                  <div className="text-4xl font-bold mb-6 text-nutrition-green title-main">
                    {plan.price}
                  </div>
                  {plan.highlighted && (
                    <div className="inline-block bg-nutrition-accent text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                      Más Popular
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 mr-3 mt-0.5 text-nutrition-green" />
                      <span className="text-sm text-nutrition-gray">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onStartQuestionnaire}
                  className="w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
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
