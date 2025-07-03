
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
    <section id="about" className="py-16 dynamic-background relative overflow-hidden">
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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-nutrition-black mb-8 title-main tracking-tight">
            Sobre Mi
          </h2>
        </div>

        {/* FILA 1: Cuadro de texto arriba a la izquierda solamente */}
        <div className="mb-16">
          <div className="flex justify-start">
            <div className="w-full max-w-3xl">
              <div className="bg-white backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-nutrition-green-light">
                <h3 className="text-3xl md:text-4xl font-bold text-nutrition-green mb-8 title-playful">
                  💢 De odiar mi reflejo a cambiar mi vida (y ahora la tuya)
                </h3>
                <p className="text-xl text-nutrition-green-dark mb-6 leading-relaxed">
                  Durante años, el sobrepeso fue parte de mí. A los 14 años pesaba más de 100 kg 🧍‍♂️. Me pasaba horas en el gimnasio 💥 intentando compensar cada comida cargada de culpa.
                </p>
                <p className="text-xl text-nutrition-green-dark mb-6 leading-relaxed">
                  🥶 Dejé de comer. Entrené como un loco. Me exigí hasta los límites.
                </p>
                <p className="text-xl text-nutrition-green-dark mb-6 leading-relaxed">
                  ¿Resultados? Bajé peso, sí… pero también perdí salud, energía y ganas de vivir.
                </p>
                <p className="text-xl text-nutrition-green-dark font-semibold">
                  Hasta que el cuerpo dijo basta.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FILA 2: Foto en el centro con cuadrito de info AL LADO */}
        <div className="mb-16">
          <div className="flex justify-center items-center">
            <div className="relative flex items-center justify-center space-x-12">
              {/* Decorative rings around the image */}
              <div className="absolute left-0 inset-y-0 flex items-center justify-center">
                <div className="w-[36rem] h-[36rem] rounded-full border-2 border-nutrition-green-light opacity-30 animate-pulse"></div>
              </div>
              <div className="absolute left-0 inset-y-0 flex items-center justify-center">
                <div className="w-[40rem] h-[40rem] rounded-full border-1 border-nutrition-accent opacity-20 animate-pulse delay-300"></div>
              </div>
              
              {/* Main image container - MÁS GRANDE */}
              <div className="relative z-10 w-[32rem] h-[32rem] rounded-full border-4 border-white shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
                <img
                  src="/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png"
                  alt="José Antonio - Tu Dietista y Entrenador Personal"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating info card - AL LADO de la foto, MÁS PEQUEÑO y UN POCO MÁS ABAJO */}
              <div className="bg-white p-4 rounded-xl shadow-xl border border-nutrition-green-light hover:shadow-2xl transition-all duration-300 hover:scale-105 ml-8 mt-16">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-nutrition-green rounded-full animate-pulse"></div>
                  <div>
                    <h4 className="font-bold text-nutrition-green text-lg title-playful">José Antonio</h4>
                    <p className="text-nutrition-gray text-base">Dietista y Entrenador</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FILA 3: Cuadro de texto abajo a la derecha solamente */}
        <div className="mb-16">
          <div className="flex justify-end">
            <div className="w-full max-w-3xl">
              <div className="bg-white backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-nutrition-green-light">
                <h4 className="text-3xl font-bold text-nutrition-green mb-8 title-playful">
                  🎯 Mi método: Simple, efectivo y sostenible
                </h4>
                <p className="text-xl text-nutrition-green-dark leading-relaxed mb-6">
                  Créeme cuando te digo que he probado de todo: dietas extremas, suplementos "milagro", rutinas imposibles 🔄.
                </p>
                <p className="text-xl text-nutrition-green-dark leading-relaxed mb-6">
                  Lo que funciona de verdad es un enfoque equilibrado que puedas mantener en el tiempo 📈.
                </p>
                <p className="text-xl text-nutrition-green-dark leading-relaxed font-semibold">
                  No más extremos. Solo resultados reales y duraderos 🏆.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FILA 4: Cuadro centrado con call to action */}
        <div className="mb-16">
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              <div className="bg-white backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-nutrition-green-light">
                <div className="space-y-6 mb-8">
                  <div className="flex items-center text-xl text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-4 text-2xl">🔥</span>
                    Sin dietas imposibles
                  </div>
                  <div className="flex items-center text-xl text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-4 text-2xl">🏋️‍♂️</span>
                    Sin rutinas de 3 horas al día
                  </div>
                  <div className="flex items-center text-xl text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-4 text-2xl">🧊</span>
                    Sin perder el norte
                  </div>
                </div>
                <p className="text-xl text-nutrition-green-dark mb-6 leading-relaxed">
                  Si estás cansado de no reconocerte en el espejo, de probar y fallar, de sentir que ya nada funciona…
                </p>
                <p className="text-xl text-nutrition-green-dark mb-8 leading-relaxed font-semibold text-nutrition-green">
                  👉 Yo estuve ahí. Y salí. Ahora te toca a ti.
                </p>
                
                <div className="text-center">
                  <Button 
                    onClick={onQuestionnaireOpen}
                    className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-12 py-6 text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                  >
                    🎯 QUIERO CAMBIAR
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-nutrition-green-light">
          <h3 className="text-4xl font-bold text-center text-nutrition-green mb-12 title-main">
            Resultados Que Hablan Por Sí Solos
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald text-white rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-12 h-12" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-nutrition-green mb-3 title-main">{stat.value}</div>
                <div className="text-nutrition-gray font-medium text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
