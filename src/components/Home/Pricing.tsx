
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { PricingPlan } from '@/types';

interface PricingProps {
  onStartQuestionnaire: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onStartQuestionnaire }) => {
  const plans: PricingPlan[] = [
    {
      id: '1',
      name: 'Plan Básico',
      duration: 'Pago único',
      price: '€75',
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
    {
      id: '2',
      name: 'Plan Premium',
      duration: 'Por mes',
      price: '€120',
      features: [
        'Dirigido a personas que buscan mejorar composición corporal',
        'Nutrición incluida + organización de comidas',
        'Entrenamiento: Plan para casa o gimnasio',
        'Hábitos: Plan estructurado + herramientas',
        'Seguimiento: 1 consulta online o presencial mensual',
        'Sin análisis',
        'Soporte: Acceso básico a herramientas',
        'Extras: Plantillas de control y rutinas'
      ],
      highlighted: true
    },
    {
      id: '3',
      name: 'Plan PRO',
      duration: 'Duración mínima 3 meses',
      price: '€300',
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
  ];

  return (
    <section id="pricing" className="py-12 relative overflow-hidden">
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
          <h2 className="text-4xl font-bold text-nutrition-black mb-4">
            Planes y Precios
          </h2>
          <p className="text-xl text-nutrition-gray max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus objetivos y presupuesto
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 ${
                plan.highlighted 
                  ? 'border-nutrition-green ring-4 ring-nutrition-green/20' 
                  : 'border-nutrition-green-light hover:border-nutrition-green'
              }`}
            >
              <div className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2 text-nutrition-black title-playful">
                    {plan.name}
                  </h3>
                  <p className="text-sm mb-4 text-nutrition-gray">
                    {plan.duration}
                  </p>
                  <div className="text-3xl font-bold mb-4 text-nutrition-green title-main">
                    {plan.price}
                    {plan.id === '2' && <span className="text-sm text-nutrition-gray">/mes</span>}
                    {plan.id === '3' && <span className="text-sm text-nutrition-gray">/mes</span>}
                  </div>
                  {plan.highlighted && (
                    <div className="inline-block bg-nutrition-accent text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                      Más Popular
                    </div>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => {
                    const isNegative = feature.includes('no incluido') || feature.includes('Sin');
                    return (
                      <li key={index} className="flex items-start">
                        {isNegative ? (
                          <X className="w-4 h-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                        ) : (
                          <Check className="w-4 h-4 mr-2 mt-0.5 text-nutrition-green flex-shrink-0" />
                        )}
                        <span className={`text-xs ${isNegative ? 'text-red-600' : 'text-nutrition-gray'}`}>
                          {feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <Button
                  onClick={onStartQuestionnaire}
                  className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    plan.highlighted
                      ? 'bg-nutrition-green hover:bg-nutrition-green-dark text-white'
                      : 'bg-nutrition-green-light hover:bg-nutrition-green text-nutrition-green-dark hover:text-white'
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
