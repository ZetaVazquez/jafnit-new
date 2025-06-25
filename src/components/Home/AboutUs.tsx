
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
      {/* Decorative background elements con más círculos y triángulos */}
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
          <h2 className="text-5xl font-bold text-nutrition-black mb-6 title-main tracking-tight">
            Sobre Mi
          </h2>
        </div>

        {/* First section: Text + Photo side by side on desktop */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-nutrition-green-light">
              <h3 className="text-3xl font-bold text-nutrition-green mb-6 title-playful">
                💢 De odiar mi reflejo a cambiar mi vida (y ahora la tuya)
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Durante años, el sobrepeso fue parte de mí. A los 14 años pesaba más de 100 kg 🧍‍♂️. Me pasaba horas en el gimnasio 💥 intentando compensar cada comida cargada de culpa.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                🥶 Dejé de comer. Entrené como un loco. Me exigí hasta los límites.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                ¿Resultados? Bajé peso, sí… pero también perdí salud, energía y ganas de vivir.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed font-semibold text-nutrition-green">
                Hasta que el cuerpo dijo basta.
              </p>
            </div>
          </div>
          
          {/* Profile photo section - larger and more centered */}
          <div className="relative flex justify-center items-center">
            {/* Decorative rings around the image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 rounded-full border-4 border-nutrition-green-light opacity-30 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[420px] h-[420px] rounded-full border-2 border-nutrition-accent opacity-20 animate-pulse delay-300"></div>
            </div>
            
            {/* Main image container with white border - larger size */}
            <div className="relative z-10 w-80 h-80 rounded-full border-8 border-white shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
              <img
                src="/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png"
                alt="José Antonio - Tu Dietista y Entrenador Personal"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating info card */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-nutrition-green-light hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-nutrition-green rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-bold text-nutrition-green text-lg title-playful">José Antonio</h4>
                  <p className="text-nutrition-gray text-sm">Dietista y Entrenador</p>
                  <p className="text-xs text-gray-500 mt-1">Tu Compañero en el Cambio</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second section: Two blocks horizontally on desktop */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light rounded-2xl p-8 shadow-lg">
            <h4 className="text-2xl font-bold text-nutrition-green-dark mb-4 title-playful">
              🚀 Mi misión ahora es ayudarte a transformar tu físico sin destruirte en el intento
            </h4>
            <p className="text-lg text-nutrition-green-dark leading-relaxed mb-4">
              Ese fue el punto de inflexión. Empecé a estudiar, a entender cómo funciona realmente el cuerpo y la mente 🧠. Dejé de castigarme y reconstruí mi forma de entrenar, de comer y de vivir.
            </p>
            <p className="text-lg text-nutrition-green-dark leading-relaxed">
              Hoy soy dietista y entrenador. Pero sobre todo, soy alguien que ha estado donde tú estás.
            </p>
            <p className="text-lg text-nutrition-green-dark leading-relaxed font-semibold">
              Trabajo con personas reales, con agendas apretadas, inseguridades y objetivos claros 🎯
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-nutrition-green-light">
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-lg text-gray-700">
                <span className="text-nutrition-green font-semibold mr-2">🔥</span>
                Sin dietas imposibles
              </div>
              <div className="flex items-center text-lg text-gray-700">
                <span className="text-nutrition-green font-semibold mr-2">🏋️‍♂️</span>
                Sin rutinas de 3 horas al día
              </div>
              <div className="flex items-center text-lg text-gray-700">
                <span className="text-nutrition-green font-semibold mr-2">🧊</span>
                Sin perder el norte
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Si estás cansado de no reconocerte en el espejo, de probar y fallar, de sentir que ya nada funciona…
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed font-semibold text-nutrition-green">
              👉 Yo estuve ahí. Y salí. Ahora te toca a ti.
            </p>
            
            <div className="text-center">
              <Button 
                onClick={onQuestionnaireOpen}
                className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                🎯 QUIERO CAMBIAR
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section with more dynamic design */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-nutrition-green-light">
          <h3 className="text-3xl font-bold text-center text-nutrition-green mb-8 title-main">
            Resultados Que Hablan Por Sí Solos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald text-white rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-10 h-10" />
                </div>
                <div className="text-4xl font-bold text-nutrition-green mb-2 title-main">{stat.value}</div>
                <div className="text-nutrition-gray font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
