import React from 'react';
import { Target, Users, Award, Heart } from 'lucide-react';

const AboutUs: React.FC = () => {
  const stats = [
    { number: '500+', label: 'Clientes transformados', icon: <Users className="w-8 h-8" /> },
    { number: '5+', label: 'Años de experiencia', icon: <Award className="w-8 h-8" /> },
    { number: '95%', label: 'Clientes satisfechos', icon: <Heart className="w-8 h-8" /> },
    { number: '24/7', label: 'Soporte disponible', icon: <Target className="w-8 h-8" /> }
  ];

  const testimonials = [
    {
      text: "José Antonio cambió mi vida. No solo perdí peso, sino que aprendí a vivir de forma saludable sin sacrificios extremos.",
      author: "María González",
      achievement: "Perdió 15kg en 6 meses"
    },
    {
      text: "Su enfoque personalizado y su constante apoyo me ayudaron a alcanzar mis objetivos cuando pensé que era imposible.",
      author: "Carlos Ruiz",
      achievement: "Ganó 8kg de músculo"
    },
    {
      text: "Más que un nutricionista, es un coach de vida. Me enseñó que la salud va más allá de la báscula.",
      author: "Ana Martín",
      achievement: "Transformación completa"
    }
  ];

  return (
    <section id="about" className="py-20 dynamic-background relative overflow-hidden">
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
            Sobre Mí
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conoce mi historia y descubre por qué miles de personas han confiado en mi método
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Primera tarjeta - más pequeña */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-nutrition-green-light">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-nutrition-green rounded-full flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-nutrition-black title-playful">Mi filosofía</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Creo firmemente que la transformación real no viene de dietas extremas o rutinas imposibles de mantener. 
              Mi enfoque se basa en crear hábitos sostenibles que se adapten a tu vida real, sin sacrificar el placer de comer bien.
            </p>
          </div>

          {/* Segunda tarjeta - más pequeña */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-nutrition-green-light">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-nutrition-green rounded-full flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-nutrition-black title-playful">Mi experiencia</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Con más de 5 años ayudando a personas a transformar su relación con la comida y el ejercicio, 
              he desarrollado un método personalizado que combina ciencia nutricional con apoyo emocional constante.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-nutrition-green-light">
              <div className="text-nutrition-green mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-nutrition-black mb-2">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="relative">
          <h3 className="text-3xl font-bold text-nutrition-black text-center mb-12 title-playful">
            Lo que dicen mis clientes
          </h3>
          
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-nutrition-green-light">
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold text-nutrition-green">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.achievement}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile/Tablet testimonials with adjusted rotation */}
          <div className="lg:hidden relative h-80 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`absolute bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-nutrition-green-light w-72 transition-all duration-300 hover:z-10 hover:scale-105 ${
                  index === 0 ? 'top-4 left-4 transform rotate-3 z-30' :
                  index === 1 ? 'top-8 left-12 transform -rotate-2 z-20' :
                  'top-12 left-8 transform rotate-1 z-10'
                }`}
              >
                <p className="text-gray-700 mb-4 italic text-sm">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold text-nutrition-green text-sm">{testimonial.author}</p>
                  <p className="text-xs text-gray-600">{testimonial.achievement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
