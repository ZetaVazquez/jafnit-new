import React from 'react';
import { Heart, Dumbbell, Users, Calendar, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServicesProps {
  onStartQuestionnaire?: () => void;
}

const Services: React.FC<ServicesProps> = ({ onStartQuestionnaire }) => {
  const services = [
    {
      icon: Heart,
      title: 'Planes Nutricionales Personalizados',
      description: 'Alimentación equilibrada adaptada a tus necesidades, gustos y estilo de vida.',
      features: ['Menús semanales detallados', 'Lista de compras incluida', 'Recetas fáciles y deliciosas', 'Seguimiento nutricional']
    },
    {
      icon: Dumbbell,
      title: 'Entrenamiento Personalizado',
      description: 'Rutinas de ejercicio diseñadas específicamente para tus objetivos y disponibilidad.',
      features: ['Ejercicios para casa o gimnasio', 'Videos explicativos', 'Progresión adaptada', 'Seguimiento de rendimiento']
    },
    {
      icon: Users,
      title: 'Acompañamiento Personal',
      description: 'Soporte continuo y motivación para mantener tu progreso hacia tus objetivos.',
      features: ['Consultas semanales', 'WhatsApp directo', 'Ajustes en tiempo real', 'Motivación constante']
    }
  ];

  return (
    <section id="servicios" className="py-20 dynamic-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
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
            Transforma tu vida con nuestros servicios integrales de nutrición y entrenamiento personalizado
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-nutrition-green-light">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald text-white rounded-full mb-6 mx-auto">
                <service.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-nutrition-black mb-4 text-center title-playful">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-nutrition-green-dark">
                    <CheckCircle className="w-5 h-5 text-nutrition-green mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-nutrition-green-light max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-nutrition-green mb-4 title-playful">
              ¿Listo para Comenzar tu Transformación?
            </h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Únete a más de 30 personas que ya han transformado su vida con nuestros planes personalizados
            </p>
            <Button 
              onClick={onStartQuestionnaire}
              className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Target className="w-5 h-5 mr-2" />
              Quiero Mi Plan Personalizado
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
