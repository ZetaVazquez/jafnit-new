
import React from 'react';
import { Award, Users, Heart, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AboutUsProps {
  onQuestionnaireOpen?: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onQuestionnaireOpen }) => {
  const stats = [
    { icon: Users, value: '30+', label: 'Clientes en Seguimiento' },
    { icon: Award, value: '6', label: 'Meses de Experiencia' },
    { icon: Heart, value: '100%', label: 'Compromiso Personal' },
    { icon: Target, value: '100+', label: 'Objetivos Alcanzados' }
  ];

  return (
    <section id="about" className="py-20 dynamic-background relative overflow-hidden">
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
          <h2 className="text-3xl md:text-5xl font-bold text-nutrition-black mb-6 title-main tracking-tight">
            Sobre Mi
          </h2>
        </div>

        {/* Main content grid according to sketch */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start mb-12 lg:mb-20">
          {/* Top Left Text Block */}
          <div className="order-1 lg:order-1 lg:col-span-1 lg:row-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-nutrition-green-light">
              <h3 className="text-xl md:text-2xl font-bold text-nutrition-green mb-4 lg:mb-6 title-playful">
                💢 De odiar mi reflejo a cambiar mi vida (y ahora la tuya)
              </h3>
              <p className="text-base lg:text-lg text-gray-700 mb-4 leading-relaxed">
                Durante años, el sobrepeso fue parte de mí. A los 14 años pesaba más de 100 kg 🧍‍♂️. Me pasaba horas en el gimnasio 💥 intentando compensar cada comida cargada de culpa.
              </p>
              <p className="text-base lg:text-lg text-gray-700 mb-4 leading-relaxed">
                🥶 Dejé de comer. Entrené como un loco. Me exigí hasta los límites.
              </p>
              <p className="text-base lg:text-lg text-gray-700 mb-4 leading-relaxed">
                ¿Resultados? Bajé peso, sí… pero también perdí salud, energía y ganas de vivir.
              </p>
              <p className="text-base lg:text-lg text-gray-700 font-semibold text-nutrition-green">
                Hasta que el cuerpo dijo basta.
              </p>
            </div>
          </div>
          
          {/* Central Photo - positioned in the middle */}
          <div className="order-2 lg:order-2 lg:col-span-1 lg:row-span-2 relative flex justify-center items-center w-full py-8 lg:py-0">
            {/* Decorative rings around the image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] rounded-full border-2 lg:border-4 border-nutrition-green-light opacity-30 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[340px] h-[340px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] rounded-full border-1 lg:border-2 border-nutrition-accent opacity-20 animate-pulse delay-300"></div>
            </div>
            
            {/* Main image container - large and prominent */}
            <div className="relative z-10 w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border-4 lg:border-6 border-white shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
              <img
                src="/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png"
                alt="José Antonio - Tu Dietista y Entrenador Personal"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating info card */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 lg:-bottom-8 lg:-right-8 bg-white p-3 md:p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-xl border border-nutrition-green-light hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-nutrition-green rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-bold text-nutrition-green text-sm md:text-base lg:text-lg title-playful">José Antonio</h4>
                  <p className="text-nutrition-gray text-xs md:text-sm">Dietista y Entrenador</p>
                  <p className="text-xs text-gray-500 mt-1 hidden md:block">Tu Compañero en el Cambio</p>
                </div>
              </div>
            </div>
          </div>

          {/* Empty space for top right */}
          <div className="order-3 lg:order-3 lg:col-span-1 lg:row-span-1 hidden lg:block"></div>

          {/* Bottom Right Text Block */}
          <div className="order-4 lg:order-4 lg:col-span-1 lg:row-span-1">
            <div className="bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light rounded-2xl p-6 lg:p-8 shadow-xl">
              <h4 className="text-xl lg:text-2xl font-bold text-nutrition-green-dark mb-4 title-playful">
                🚀 Mi misión ahora es ayudarte a transformar tu físico sin destruirte en el intento
              </h4>
              <p className="text-base lg:text-lg text-nutrition-green-dark leading-relaxed mb-4">
                Ese fue el punto de inflexión. Empecé a estudiar, a entender cómo funciona realmente el cuerpo y la mente 🧠. Dejé de castigarme y reconstruí mi forma de entrenar, de comer y de vivir.
              </p>
              <p className="text-base lg:text-lg text-nutrition-green-dark leading-relaxed mb-4">
                Hoy soy dietista y entrenador. Pero sobre todo, soy alguien que ha estado donde tú estás.
              </p>
              <p className="text-base lg:text-lg text-nutrition-green-dark leading-relaxed font-semibold">
                Trabajo con personas reales, con agendas apretadas, inseguridades y objetivos claros 🎯
              </p>
            </div>
          </div>
        </div>

        {/* Second section: Call to action */}
        <div className="max-w-4xl mx-auto mb-12 lg:mb-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-nutrition-green-light">
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-base lg:text-lg text-gray-700">
                <span className="text-nutrition-green font-semibold mr-2">🔥</span>
                Sin dietas imposibles
              </div>
              <div className="flex items-center text-base lg:text-lg text-gray-700">
                <span className="text-nutrition-green font-semibold mr-2">🏋️‍♂️</span>
                Sin rutinas de 3 horas al día
              </div>
              <div className="flex items-center text-base lg:text-lg text-gray-700">
                <span className="text-nutrition-green font-semibold mr-2">🧊</span>
                Sin perder el norte
              </div>
            </div>
            <p className="text-base lg:text-lg text-gray-700 mb-4 lg:mb-6 leading-relaxed">
              Si estás cansado de no reconocerte en el espejo, de probar y fallar, de sentir que ya nada funciona…
            </p>
            <p className="text-base lg:text-lg text-gray-700 mb-4 lg:mb-6 leading-relaxed font-semibold text-nutrition-green">
              👉 Yo estuve ahí. Y salí. Ahora te toca a ti.
            </p>
            
            <div className="text-center">
              <Button 
                onClick={onQuestionnaireOpen}
                className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                🎯 QUIERO CAMBIAR
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-xl border border-nutrition-green-light">
          <h3 className="text-2xl lg:text-3xl font-bold text-center text-nutrition-green mb-6 lg:mb-8 title-main">
            Resultados Que Hablan Por Sí Solos
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald text-white rounded-full mb-3 lg:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
                <div className="text-2xl lg:text-4xl font-bold text-nutrition-green mb-1 lg:mb-2 title-main">{stat.value}</div>
                <div className="text-nutrition-gray font-medium text-xs lg:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
