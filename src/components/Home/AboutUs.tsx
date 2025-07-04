
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Award, Users, Target } from 'lucide-react';

const AboutUs = () => {
  const features = [
    {
      icon: <Heart className="w-8 h-8 text-nutrition-green" />,
      title: "Pasión por la Salud",
      description: "Creemos que una vida saludable es la base de la felicidad y el bienestar."
    },
    {
      icon: <Award className="w-8 h-8 text-nutrition-green" />,
      title: "Experiencia Comprobada",
      description: "Años de experiencia ayudando a personas a alcanzar sus objetivos de salud."
    },
    {
      icon: <Users className="w-8 h-8 text-nutrition-green" />,
      title: "Enfoque Personal",
      description: "Cada persona es única, por eso creamos planes completamente personalizados."
    },
    {
      icon: <Target className="w-8 h-8 text-nutrition-green" />,
      title: "Resultados Reales",
      description: "Nos enfocamos en cambios sostenibles que perduren en el tiempo."
    }
  ];

  return (
    <section id="about" className="py-16 bg-gradient-to-br from-white to-nutrition-green-light/10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido de texto */}
          <div>
            <h2 className="section-title text-nutrition-black mb-6">
              Sobre Nosotros
            </h2>
            <p className="text-lg text-nutrition-gray mb-6 leading-relaxed">
              Somos un equipo de profesionales apasionados por la nutrición y el bienestar. 
              Nuestro objetivo es ayudarte a lograr un estilo de vida saludable de manera 
              sostenible y personalizada.
            </p>
            <p className="text-lg text-nutrition-gray mb-8 leading-relaxed">
              Combinamos conocimiento científico con un enfoque humano y cercano, 
              porque entendemos que cada persona tiene necesidades únicas y merece 
              un plan diseñado específicamente para ella.
            </p>
            <Button 
              size="lg"
              className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Conoce Nuestro Equipo
            </Button>
          </div>

          {/* Imagen y características */}
          <div className="space-y-8">
            <div className="relative">
              <img 
                src="/lovable-uploads/dd91a4d8-2d68-4ac4-b7e5-8ae097f1b833.png" 
                alt="Equipo de nutricionistas"
                className="rounded-2xl shadow-lg w-full object-cover h-64"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nutrition-green/20 to-transparent rounded-2xl"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-nutrition-green-light"
                >
                  <div className="flex items-center mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-nutrition-black mb-2 title-playful">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-nutrition-gray">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
