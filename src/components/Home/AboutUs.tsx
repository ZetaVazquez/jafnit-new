import React from 'react';
import { Button } from '@/components/ui/button';
import { Target, Heart, Users, Award } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <section id="sobre-nosotros" className="py-20 dynamic-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos grandes */}
        <div className="geometric-shape circle-shape w-32 h-32 top-10 right-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 left-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 left-1/3 animate-bounce-gentle"></div>
        
        {/* Círculos medianos */}
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 right-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-18 h-18 top-2/3 right-1/6 animate-bounce-gentle"></div>
        
        {/* Triángulos */}
        <div className="geometric-shape triangle-shape triangle-up top-40 right-1/2 transform translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 left-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 right-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 left-1/2 animate-pulse-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up top-3/4 left-1/6 animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div>
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
                Sobre Nosotros
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Somos especialistas en transformar vidas a través de la nutrición personalizada y el entrenamiento funcional.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Con más de 10 años de experiencia en el sector de la salud y el bienestar, 
                hemos ayudado a cientos de personas a alcanzar sus objetivos de forma sostenible y saludable.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nuestro enfoque se basa en la ciencia, la personalización y el acompañamiento continuo 
                para garantizar resultados duraderos que se adapten a tu estilo de vida.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-nutrition-green-lighter p-3 rounded-full">
                  <Target className="w-6 h-6 text-nutrition-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-nutrition-black">Objetivos Claros</h3>
                  <p className="text-sm text-gray-600">Definimos metas alcanzables</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-nutrition-green-lighter p-3 rounded-full">
                  <Heart className="w-6 h-6 text-nutrition-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-nutrition-black">Salud Integral</h3>
                  <p className="text-sm text-gray-600">Cuidamos tu bienestar completo</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-nutrition-green-lighter p-3 rounded-full">
                  <Users className="w-6 h-6 text-nutrition-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-nutrition-black">Acompañamiento</h3>
                  <p className="text-sm text-gray-600">Estamos contigo en cada paso</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-nutrition-green-lighter p-3 rounded-full">
                  <Award className="w-6 h-6 text-nutrition-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-nutrition-black">Resultados Probados</h3>
                  <p className="text-sm text-gray-600">Metodología con garantías</p>
                </div>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green-forest text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Conocer Más
            </Button>
          </div>

          {/* Image Section */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/lovable-uploads/4d9ad9e4-a814-4469-b756-3e46df99f4b2.png"
                alt="Equipo de nutricionistas y entrenadores"
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-nutrition-green-lighter to-nutrition-green-light rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
