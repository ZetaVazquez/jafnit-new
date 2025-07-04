
import React from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Dumbbell, Target, Users, Calendar, TrendingUp } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Utensils className="w-8 h-8 text-nutrition-green" />,
      title: "Nutrición Personalizada",
      description: "Planes alimentarios adaptados a tus necesidades, objetivos y estilo de vida."
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-nutrition-green" />,
      title: "Entrenamiento Dirigido",
      description: "Rutinas de ejercicio diseñadas específicamente para maximizar tus resultados."
    },
    {
      icon: <Target className="w-8 h-8 text-nutrition-green" />,
      title: "Objetivos Claros",
      description: "Establecemos metas realistas y alcanzables para mantener tu motivación."
    },
    {
      icon: <Users className="w-8 h-8 text-nutrition-green" />,
      title: "Seguimiento Personal",
      description: "Acompañamiento continuo para asegurar que alcances tus objetivos."
    },
    {
      icon: <Calendar className="w-8 h-8 text-nutrition-green" />,
      title: "Planificación Integral",
      description: "Organizamos tu alimentación y ejercicio de forma práctica y sostenible."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-nutrition-green" />,
      title: "Resultados Medibles",
      description: "Monitoreamos tu progreso con métricas claras y objetivas."
    }
  ];

  return (
    <section id="services" className="py-16 bg-gradient-to-br from-nutrition-green-light/20 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title text-nutrition-black mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-nutrition-gray max-w-2xl mx-auto">
            Ofrecemos un enfoque integral para transformar tu salud y bienestar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-nutrition-green-light"
            >
              <div className="flex items-center mb-4">
                {service.icon}
                <h3 className="text-xl font-semibold ml-3 text-nutrition-black title-playful">
                  {service.title}
                </h3>
              </div>
              <p className="text-nutrition-gray leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Descubre Más
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
