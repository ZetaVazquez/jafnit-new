import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Apple, Dumbbell, Calendar, Users, Target, Heart } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Apple,
      title: 'Nutrición Personalizada',
      description: 'Planes alimentarios diseñados específicamente para ti, considerando tus gustos, horarios y objetivos.',
      features: ['Análisis nutricional completo', 'Menús semanales', 'Recetas personalizadas', 'Seguimiento continuo'],
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Dumbbell,
      title: 'Entrenamiento Personal',
      description: 'Rutinas de ejercicio adaptadas a tu nivel y necesidades, con seguimiento profesional.',
      features: ['Evaluación física inicial', 'Rutinas personalizadas', 'Corrección de técnica', 'Progresión controlada'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Calendar,
      title: 'Seguimiento Continuo',
      description: 'Acompañamiento constante para garantizar que alcances tus objetivos de forma sostenible.',
      features: ['Revisiones semanales', 'Ajustes en tiempo real', 'Motivación constante', 'Resolución de dudas'],
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Users,
      title: 'Grupos de Apoyo',
      description: 'Comunidad de personas con objetivos similares para mantenerte motivado y comprometido.',
      features: ['Sesiones grupales', 'Retos mensuales', 'Intercambio de experiencias', 'Apoyo mutuo'],
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Target,
      title: 'Objetivos Específicos',
      description: 'Programas diseñados para metas concretas: pérdida de peso, ganancia muscular, salud general.',
      features: ['Planes específicos', 'Metas alcanzables', 'Medición de progreso', 'Celebración de logros'],
      color: 'from-teal-500 to-green-600'
    },
    {
      icon: Heart,
      title: 'Bienestar Integral',
      description: 'Enfoque holístico que incluye aspectos físicos, mentales y emocionales de tu salud.',
      features: ['Gestión del estrés', 'Mejora del sueño', 'Equilibrio emocional', 'Hábitos saludables'],
      color: 'from-rose-500 to-pink-600'
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-gradient-to-br from-nutrition-green-lighter to-white relative overflow-hidden">
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
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una gama completa de servicios personalizados para ayudarte a alcanzar tus objetivos de salud y bienestar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-md">
              <CardHeader>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mb-4`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-nutrition-black">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-nutrition-green rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green-forest text-white">
                  Más Información
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
