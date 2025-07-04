import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Crown } from 'lucide-react';

interface PricingProps {
  onStartQuestionnaire: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onStartQuestionnaire }) => {
  const plans = [
    {
      name: 'Plan Básico',
      price: '89',
      period: 'mes',
      icon: Star,
      description: 'Perfecto para comenzar tu transformación con lo esencial',
      features: [
        'Plan nutricional personalizado',
        'Rutina de ejercicios básica',
        'Revisión mensual',
        'Soporte por email',
        'Acceso a la comunidad',
        'Recetas saludables'
      ],
      popular: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Plan Premium',
      price: '149',
      period: 'mes',
      icon: Zap,
      description: 'La opción más popular con seguimiento personalizado',
      features: [
        'Todo lo del Plan Básico',
        'Revisiones semanales',
        'Videollamadas mensuales',
        'Ajustes en tiempo real',
        'Suplementación personalizada',
        'Soporte prioritario 24/7',
        'Análisis de progreso detallado'
      ],
      popular: true,
      color: 'from-nutrition-green to-nutrition-green-emerald'
    },
    {
      name: 'Plan Elite',
      price: '249',
      period: 'mes',
      icon: Crown,
      description: 'Máximo nivel de personalización y acompañamiento',
      features: [
        'Todo lo del Plan Premium',
        'Coaching personal 1:1',
        'Videollamadas semanales',
        'Plan de entrenamiento avanzado',
        'Análisis corporal mensual',
        'Acceso VIP a contenido exclusivo',
        'Consultorías ilimitadas',
        'Garantía de resultados'
      ],
      popular: false,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section id="precios" className="py-20 bg-gradient-to-br from-nutrition-green-lighter to-white relative overflow-hidden">
      {/* Decorative background elements */}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-0 shadow-lg ${
                plan.popular ? 'ring-2 ring-nutrition-green scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Más Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-nutrition-black">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-nutrition-black">{plan.price}€</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <Check className="w-5 h-5 text-nutrition-green mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={onStartQuestionnaire}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green-forest' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                  } text-white font-semibold py-3 rounded-lg transition-all duration-300`}
                >
                  {plan.popular ? 'Comenzar Ahora' : 'Seleccionar Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-8 border-0 shadow-lg">
          <h3 className="text-2xl font-bold text-nutrition-black mb-4">
            ¿No estás seguro de qué plan elegir?
          </h3>
          <p className="text-gray-600 mb-6">
            Responde nuestro cuestionario gratuito y te recomendaremos el plan perfecto para ti
          </p>
          <Button
            onClick={onStartQuestionnaire}
            size="lg"
            className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green-forest text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Hacer Cuestionario Gratuito
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
