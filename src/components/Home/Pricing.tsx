import React from 'react';
import { Check, Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingProps {
  onStartQuestionnaire?: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onStartQuestionnaire }) => {
  const plans = [
    {
      name: 'Plan Básico',
      price: '39€',
      period: '/mes',
      description: 'Perfecto para comenzar tu transformación',
      features: [
        'Plan nutricional personalizado',
        'Menús semanales detallados',
        'Lista de compras incluida',
        'Recetas fáciles y rápidas',
        'Seguimiento mensual',
        'Soporte por email'
      ],
      popular: false,
      color: 'border-nutrition-green-light'
    },
    {
      name: 'Plan Completo',
      price: '79€',
      period: '/mes',
      description: 'La opción más popular para resultados garantizados',
      features: [
        'Todo del Plan Básico',
        'Rutina de entrenamiento personalizada',
        'Videos explicativos de ejercicios',
        'Seguimiento semanal',
        'WhatsApp directo conmigo',
        'Ajustes en tiempo real',
        'Consultas ilimitadas'
      ],
      popular: true,
      color: 'border-nutrition-green'
    },
    {
      name: 'Plan Premium',
      price: '129€',
      period: '/mes',
      description: 'Máximo acompañamiento para resultados excepcionales',
      features: [
        'Todo del Plan Completo',
        'Consultas presenciales (Madrid)',
        'Análisis corporal completo',
        'Plan de suplementación',
        'Seguimiento diario',
        'Acceso 24/7',
        'Garantía de resultados'
      ],
      popular: false,
      color: 'border-nutrition-green-dark'
    }
  ];

  return (
    <section id="precios" className="py-20 dynamic-background relative overflow-hidden">
      {/* Formas geométricas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos grandes */}
        <div className="geometric-shape circle-shape w-32 h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        
        {/* Círculos medianos */}
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 left-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-18 h-18 top-2/3 left-1/6 animate-bounce-gentle"></div>
        
        {/* Triángulos */}
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up top-3/4 right-1/6 animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
            Planes y Precios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades y objetivos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 ${plan.color} relative ${plan.popular ? 'transform scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-nutrition-green text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Más Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-nutrition-black mb-2 title-playful">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-nutrition-green">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <Check className="w-5 h-5 text-nutrition-green mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={onStartQuestionnaire}
                className={`w-full py-3 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'bg-nutrition-green hover:bg-nutrition-green-dark text-white' 
                    : 'bg-white hover:bg-nutrition-green text-nutrition-green hover:text-white border-2 border-nutrition-green'
                }`}
              >
                Elegir {plan.name}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-nutrition-green-light max-w-4xl mx-auto">
            <MessageCircle className="w-12 h-12 text-nutrition-green mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-nutrition-green mb-4 title-playful">
              ¿Tienes Dudas Sobre Qué Plan Elegir?
            </h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Contáctame directamente y te ayudo a encontrar el plan perfecto para tus objetivos
            </p>
            <Button 
              onClick={() => window.open('https://api.whatsapp.com/send/?phone=34697754823&text=Hola+Jose%2C+quiero+empezar+mi+plan+con+JAFNFIT+%EF%BF%BD&type=phone_number&app_absent=0', '_blank')}
              className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Hablar por WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
