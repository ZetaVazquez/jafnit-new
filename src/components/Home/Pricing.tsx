import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Zap, Crown, Star } from 'lucide-react';

interface PricingProps {
  onStartQuestionnaire: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onStartQuestionnaire }) => {
  const plans = [
    {
      name: 'Plan Básico',
      price: '49',
      period: '/mes',
      description: 'Perfecto para empezar tu transformación',
      features: [
        'Plan nutricional personalizado',
        'Recetas adaptadas a ti',
        'Lista de equivalencias',
        'Soporte por WhatsApp',
        'Ajustes mensuales'
      ],
      icon: <Zap className="w-8 h-8" />,
      popular: false,
      buttonText: '¡Empezar ahora!'
    },
    {
      name: 'Plan Completo',
      price: '79',
      period: '/mes',
      description: 'La opción más popular para resultados completos',
      features: [
        'Todo del Plan Básico',
        'Rutina de entrenamiento personalizada',
        'Videos explicativos de ejercicios',
        'Seguimiento semanal detallado',
        'Ajuste de macros en tiempo real',
        'Grupo privado de apoyo'
      ],
      icon: <Star className="w-8 h-8" />,
      popular: true,
      buttonText: '¡Lo quiero!'
    },
    {
      name: 'Plan Premium',
      price: '129',
      period: '/mes',
      description: 'El máximo nivel de acompañamiento personalizado',
      features: [
        'Todo del Plan Completo',
        'Llamadas semanales 1:1',
        'Menú familiar adaptado',
        'Plan de suplementación',
        'Acceso 24/7 para consultas urgentes',
        'Seguimiento de composición corporal',
        'Plan de mantenimiento post-objetivo'
      ],
      icon: <Crown className="w-8 h-8" />,
      popular: false,
      buttonText: '¡Quiero el Premium!'
    }
  ];

  return (
    <section id="pricing" className="py-12 dynamic-background relative overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-nutrition-black mb-4 title-main">
            Planes y Precios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus objetivos y estilo de vida
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                plan.popular
                  ? 'bg-gradient-to-br from-nutrition-green to-nutrition-green-dark text-white border-2 border-nutrition-green'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-nutrition-orange text-white px-4 py-2 rounded-full text-sm font-bold">
                    ¡MÁS POPULAR!
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-full mb-4 ${
                  plan.popular ? 'bg-white/20' : 'bg-nutrition-green-lighter'
                }`}>
                  <div className={plan.popular ? 'text-white' : 'text-nutrition-green'}>
                    {plan.icon}
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  plan.popular ? 'text-white' : 'text-nutrition-black'
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${
                  plan.popular ? 'text-white/80' : 'text-gray-600'
                }`}>
                  {plan.description}
                </p>
              </div>

              <div className="text-center mb-8">
                <div className="flex justify-center items-baseline">
                  <span className={`text-5xl font-bold ${
                    plan.popular ? 'text-white' : 'text-nutrition-green'
                  }`}>
                    €{plan.price}
                  </span>
                  <span className={`text-lg ml-1 ${
                    plan.popular ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                      plan.popular ? 'text-white' : 'text-nutrition-green'
                    }`} />
                    <span className={`text-sm ${
                      plan.popular ? 'text-white' : 'text-gray-700'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onStartQuestionnaire}
                variant={plan.popular ? "secondary" : "default"}
                className={`w-full py-3 font-bold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-white text-nutrition-green hover:bg-gray-100'
                    : 'bg-nutrition-green text-white hover:bg-nutrition-green-dark'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ¿No estás seguro de qué plan elegir?
          </p>
          <Button
            onClick={onStartQuestionnaire}
            variant="outline"
            className="border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
          >
            Haz nuestro test personalizado
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
