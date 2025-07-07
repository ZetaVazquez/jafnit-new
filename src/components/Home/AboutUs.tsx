
import React from 'react';
import { Award, Users, Heart, Target, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AboutUsProps {
  onQuestionnaireOpen?: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onQuestionnaireOpen }) => {
  return (
    <section id="sobre-mi" className="py-16 bg-gradient-to-br from-nutrition-green-lighter via-white to-nutrition-green-lighter relative overflow-hidden">
      {/* Unified background overlay for consistency */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 70%, rgba(132, 204, 22, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 90% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 10% 90%, rgba(187, 247, 208, 0.2) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }}></div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="geometric-shape circle-shape w-16 h-16 md:w-32 md:h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-12 h-12 md:w-24 md:h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-10 h-10 md:w-20 md:h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-8 h-8 md:w-16 md:h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        
        <div className="geometric-shape circle-shape w-14 h-14 md:w-28 md:h-28 top-1/3 left-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-11 h-11 md:w-22 md:h-22 bottom-1/3 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-9 h-9 md:w-18 md:h-18 top-2/3 left-1/6 animate-bounce-gentle"></div>
        
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up top-3/4 right-1/6 animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-6 title-main">
            Sobre Mí
          </h2>
          <p className="text-xl text-nutrition-green font-bold mb-8">
            🎯 ES TU TURNO ⭐
          </p>
        </div>

        {/* Journey Map Layout */}
        <div className="relative max-w-6xl mx-auto">
          {/* Dotted Path */}
          <div className="absolute top-1/2 left-0 w-full h-1 border-t-4 border-dashed border-nutrition-green-light transform -translate-y-1/2 hidden lg:block"></div>
          
          {/* Journey Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-green-light hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 bg-nutrition-green text-white rounded-full font-bold text-lg mb-4 mx-auto">
                  01
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-nutrition-black mb-3">
                    🏋️‍♀️ MI HISTORIA
                  </h3>
                  <p className="text-sm text-nutrition-gray leading-relaxed">
                    Me llamo <span className="font-bold text-nutrition-green">José Antonio</span>, soy dietista-nutricionista y entrenador personal. 
                    Durante años luché contra el sobrepeso, probé mil dietas diferentes, 
                    me apunté a gimnasios que abandonaba a los pocos meses...
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative lg:mt-16">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-accent-light hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 bg-nutrition-accent text-white rounded-full font-bold text-lg mb-4 mx-auto">
                  02
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-nutrition-black mb-3">
                    💡 EL DESCUBRIMIENTO
                  </h3>
                  <p className="text-sm text-nutrition-gray leading-relaxed">
                    <span className="font-bold text-nutrition-accent">La diferencia no estaba en encontrar la dieta perfecta 
                    o el entrenamiento más duro.</span> Estaba en entender que cada persona es única 
                    y necesita un enfoque completamente personalizado.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-green-light hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 bg-nutrition-green text-white rounded-full font-bold text-lg mb-4 mx-auto">
                  03
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-nutrition-black mb-3">
                    🎯 LA TRANSFORMACIÓN
                  </h3>
                  <p className="text-sm text-nutrition-gray leading-relaxed">
                    Después de perder 30 kilos y mantener mi peso ideal durante años, 
                    me dedico a ayudar a personas como tú a conseguir sus objetivos 
                    sin sacrificar su vida social ni su salud mental.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative lg:mt-16">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-accent-light hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 bg-nutrition-accent text-white rounded-full font-bold text-lg mb-4 mx-auto">
                  04
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-nutrition-black mb-3">
                    🚀 AHORA TE TOCA A TI
                  </h3>
                  <p className="text-sm text-nutrition-gray leading-relaxed">
                    Llevas tiempo pensándolo, sabes que necesitas un cambio 
                    y ya no te vale hacerlo solo, sin guía ni resultados.
                    Este programa no va de castigar tu cuerpo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="text-center mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 border-nutrition-green-light">
            <div className="mb-6">
              <span className="text-4xl">👊</span>
            </div>
            <p className="text-2xl font-bold text-nutrition-green mb-6">
              Yo estuve ahí. Y salí. Ahora te toca a ti.
            </p>
            <Button 
              onClick={onQuestionnaireOpen}
              className="bg-nutrition-accent hover:bg-nutrition-accent-dark text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              ✨ Quiero Cambiar
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
              <Users className="w-8 h-8 text-nutrition-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-nutrition-black">30+</div>
              <div className="text-sm text-nutrition-gray">Clientes en Seguimiento</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
              <Award className="w-8 h-8 text-nutrition-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-nutrition-black">6</div>
              <div className="text-sm text-nutrition-gray">Meses de Experiencia</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
              <Heart className="w-8 h-8 text-nutrition-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-nutrition-black">100%</div>
              <div className="text-sm text-nutrition-gray">Compromiso Personal</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
              <Target className="w-8 h-8 text-nutrition-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-nutrition-black">100+</div>
              <div className="text-sm text-nutrition-gray">Objetivos Alcanzados</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
