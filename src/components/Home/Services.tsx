
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple, Dumbbell, Users, Calendar, MessageCircle, BarChart3 } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Apple,
      title: 'Planes Nutricionales Personalizados',
      description: 'Diseñamos planes de alimentación adaptados a tus objetivos, preferencias y estilo de vida.',
      features: ['Análisis nutricional completo', 'Menús semanales', 'Lista de compras', 'Recetas saludables']
    },
    {
      icon: Dumbbell,
      title: 'Entrenamiento Personalizado',
      description: 'Rutinas de ejercicio complementarias a tu plan nutricional para maximizar resultados.',
      features: ['Rutinas adaptadas', 'Videos explicativos', 'Progress tracking', 'Ajustes semanales']
    },
    {
      icon: Users,
      title: 'Seguimiento Individualizado',
      description: 'Acompañamiento personalizado con revisiones regulares y ajustes según tu progreso.',
      features: ['Consultas regulares', 'Análisis de progreso', 'Ajustes del plan', 'Soporte continuo']
    },
    {
      icon: Calendar,
      title: 'Planificación de Comidas',
      description: 'Organización completa de tus comidas con horarios y preparación anticipada.',
      features: ['Calendario de comidas', 'Meal prep', 'Horarios optimizados', 'Preparación por lotes']
    },
    {
      icon: MessageCircle,
      title: 'Soporte 24/7',
      description: 'Comunicación directa con tu nutricionista para resolver dudas y mantenerte motivado.',
      features: ['Chat directo', 'Respuesta rápida', 'Motivación constante', 'Resolución de dudas']
    },
    {
      icon: BarChart3,
      title: 'Análisis de Progreso',
      description: 'Seguimiento detallado de tu evolución con métricas y gráficos personalizados.',
      features: ['Métricas corporales', 'Gráficos de progreso', 'Reportes mensuales', 'Análisis de tendencias']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos un enfoque integral para tu bienestar, combinando nutrición, ejercicio y seguimiento personalizado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-nutrition-green">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald text-white rounded-full mb-4 mx-auto">
                  <service.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl text-nutrition-black">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-nutrition-gray mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-nutrition-gray">
                      <div className="w-2 h-2 bg-nutrition-green rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-nutrition-green-dark mb-4">
            ¿Necesitas algo más específico?
          </h3>
          <p className="text-nutrition-gray mb-6 max-w-2xl mx-auto">
            Ofrecemos consultas personalizadas para necesidades específicas como nutrición deportiva, 
            trastornos alimentarios, alergias e intolerancias, y mucho más.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-white text-nutrition-green px-4 py-2 rounded-full text-sm font-medium">
              Nutrición Deportiva
            </span>
            <span className="bg-white text-nutrition-green px-4 py-2 rounded-full text-sm font-medium">
              Pérdida de Peso
            </span>
            <span className="bg-white text-nutrition-green px-4 py-2 rounded-full text-sm font-medium">
              Ganancia Muscular
            </span>
            <span className="bg-white text-nutrition-green px-4 py-2 rounded-full text-sm font-medium">
              Alergias e Intolerancias
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
