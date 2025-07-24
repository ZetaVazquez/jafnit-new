
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface AboutUsProps {
  onQuestionnaireOpen?: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onQuestionnaireOpen }) => {
  return (
    <section id="sobre-mi" className="py-16 bg-white relative overflow-hidden">
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
        
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <ScrollReveal direction="down">
            <h2 className="text-4xl font-bold text-nutrition-black mb-8 title-main">
              Sobre Mí
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-xl text-nutrition-green font-bold mb-8">
              🎯 ES TU TURNO ⭐
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400}>
            <p className="text-sm text-nutrition-gray leading-relaxed">
              Ya has probado de todo pero nunca lo habías hecho con estrategia, guía y seguimiento de verdad…<br />
              AUNQUE… Llevas tiempo pensando que algo tiene que cambiar. Y lo sabes. Este programa no va de dejar de comer o pasarte el día entrenando. Va de construir un cuerpo y unos hábitos que puedas mantener PARA SIEMPRE.<br />
              Olvida las dietas que no aguantas ni dos semanas. Empieza a entrenar con un plan que tenga sentido para ti.<br />
              🔹 No necesitas tener todo perfecto. Solo necesitas empezar. Yo te guío, tú te comprometes. Y el cambio llega.<br />
            </p>
          </ScrollReveal>
        </div>

        {/* Vertical Journey Path */}
        <div className="relative max-w-5xl mx-auto">
          {/* Dynamic serpentine path with gradient and animation */}
          <div className="absolute left-1/2 top-0 w-20 transform -translate-x-1/2 pointer-events-none" style={{ height: '70%' }}>
            <svg 
              className="w-full h-full" 
              viewBox="0 0 80 900" 
              preserveAspectRatio="none"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'rgba(34, 197, 94, 0.8)', stopOpacity: 1}} />
                  <stop offset="25%" style={{stopColor: 'rgba(5, 150, 105, 0.9)', stopOpacity: 1}} />
                  <stop offset="50%" style={{stopColor: 'rgba(132, 204, 22, 0.8)', stopOpacity: 1}} />
                  <stop offset="75%" style={{stopColor: 'rgba(34, 197, 94, 0.9)', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: 'rgba(5, 150, 105, 0.8)', stopOpacity: 1}} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background glow path */}
              <path 
                d="M40 0 L10 100 L70 200 L5 300 L75 400 L8 500 L72 600 L10 700 L70 800 L40 900" 
                stroke="url(#pathGradient)" 
                strokeWidth="8" 
                strokeDasharray="12,8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                opacity="0.7"
              />
              
              {/* Main animated path */}
              <path 
                d="M40 0 L10 100 L70 200 L5 300 L75 400 L8 500 L72 600 L10 700 L70 800 L40 900" 
                stroke="url(#pathGradient)" 
                strokeWidth="4" 
                strokeDasharray="12,8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Journey Steps with compact spacing */}
          <div className="space-y-2">
            {/* Step 1 - Left side */}
            <ScrollReveal direction="right" delay={100}>
              <div className="flex items-center">
                <div className="w-2/2 pr-8">
                  <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-green-light hover:shadow-xl transition-all duration-300 transform hover:scale-105 ml-auto max-w-lg">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                        ES MÁS FÁCIL CONSEGUIRLO CUANDO TE GUSTA LO QUE COMES 💪🍴
                      </h3>
                      <p className="text-sm text-nutrition-gray leading-relaxed">
                        Con tu PLAN DE ALIMENTACIÓN PERSONALIZADO olvídate de contar calorías, de comer arroz con pollo sin sabor o de forzarte a comer lo que no te apetece.<br />
                         👉 Conmigo vas a disfrutar del proceso sin renunciar al placer de comer
                        Te diseño un menú realista y variado, adaptado a tu día a día, tus horarios, tus gustos y tus objetivos.<br />
                        Nada de dietas rígidas ni menús que parecen castigos. Vas a comer bien y vas a lograr resultados.<br />
                        🔥 ¿Lo mejor? Varias opciones por comida con cantidades claras.<br />
                        Comer bien no es aburrido, si sabes cómo hacerlo. Y yo te voy a enseñar.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-nutrition-green text-white rounded-full font-bold text-lg flex items-center justify-center z-10 relative shadow-lg">
                  01
                </div>
                <div className="w-1/2 pl-8"></div>
              </div>
            </ScrollReveal>

            {/* Step 2 - Right side */}
            <div className="flex items-center">
              <div className="w-1/2 pr-8"></div>
              <div className="flex-shrink-0 w-12 h-12 bg-nutrition-accent text-white rounded-full font-bold text-lg flex items-center justify-center z-10 relative shadow-lg">
                02
              </div>
              <div className="w-1/2 pl-8">
                <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-accent-light hover:shadow-xl transition-all duration-300 transform hover:scale-105 max-w-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                      NO IMPORTA SI NUNCA HAS PISADO UN GIMNASIO 🏋️‍♂️                   
                    </h3>
                    <p className="text-sm text-nutrition-gray leading-relaxed">
                        O si no sabes por dónde empezar... Aquí vas a aprender desde cero, sin miedo y con apoyo total.<br />
                        Tu cuerpo puede mucho más de lo que crees.<br />
                         💡 Yo me encargo de guiarte paso a paso, explicarte cada ejercicio y diseñarte una rutina realista, sin entrenar horas ni machacarte sin sentido.<br />
                        👉 Entrenarás con estrategia, con técnica y con confianza.<br />
                        🔥 ¿Lo mejor? Te sentirás seguro desde el día 1.<br />
                        Nada de rutinas copiadas, nada de ejercicios que no entiendes. Aquí todo tiene sentido y propósito.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Left side */}
            <div className="flex items-center">
              <div className="w-1/2 pr-8">
                <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-green-light hover:shadow-xl transition-all duration-300 transform hover:scale-105 ml-auto max-w-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                     SIN COMUNICACIÓN, NO HAY RESULTADOS 📲💬
                    </h3>
                    <p className="text-sm text-nutrition-gray leading-relaxed">
                      No es solo un plan. Es un proceso en equipo con un SEGUIMIENTO INDIVIDUALIZADO.<br />
                      Para que logres tus objetivos, necesito saber cómo estás, qué necesitas y cómo te estás sintiendo.<br />
                      👉 Sin tus mensajes, no puedo ayudarte ni ajustar tu plan.<br />
                       Este no es un servicio enlatado: es un acompañamiento real y constante.<br />
                      💡 Siempre hay otra opción que sí se adapta a ti.<br />
                      No importa si algo no te gusta o se te complica.
                       🔁 Siempre hay una solución. Siempre hay una alternativa.<br />
                      Lo importante es que te guste, te funcione y lo mantengas.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 w-12 h-12 bg-nutrition-green text-white rounded-full font-bold text-lg flex items-center justify-center z-10 relative shadow-lg">
                03
              </div>
              <div className="w-1/2 pl-8"></div>
            </div>

            {/* Step 4 - Right side */}
            <div className="flex items-center">
              <div className="w-1/2 pr-8"></div>
              <div className="flex-shrink-0 w-12 h-12 bg-nutrition-accent text-white rounded-full font-bold text-lg flex items-center justify-center z-10 relative shadow-lg">
                04
              </div>
              <div className="w-1/2 pl-8">
                <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-accent-light hover:shadow-xl transition-all duration-300 transform hover:scale-105 max-w-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                     EL CAMBIO NO ES TEMPORAL, ES SOSTENIBLE 🧠📈
                    </h3>
                    <p className="text-sm text-nutrition-gray leading-relaxed">
                      Esto no es una carrera de 30 días ni de una semana.<br />
                       Es un proceso en el que aprendes a mantener resultados reales sin rebotes ni frustraciones.<br />
                      📲 Cada 2/4 semanas revisamos tus avances: medidas, descanso, pasos, entreno, hidratación, alimentación y más. Así ajustamos el plan y seguimos avanzando.<br />
                      🧭 ¿Te vas de vacaciones o has tenido una mala semana? No pasa nada. Me avisas y adaptamos el plan para que disfrutes sin perder el rumbo.¿Quieres dejar un mal hábito? Te acompaño y lo trabajamos juntos.<br />
                      🔁 Esto va más allá del físico
                      Mi objetivo es que cambies tu forma de ver el fitness.<br />
                       Que construyas un cuerpo que te guste sin obsesiones, sin extremos.
                       Y sobre todo: que te dure para siempre.<br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Call to Action Section */}
          <div className="text-center mt-16 bg-gray-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 border-nutrition-green-light">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                      AHORA TE TOCA A TI  💥
                </h3>
            </div>
            <p className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                Llevas tiempo pensándolo.. sabes que necesitas un cambio… y ya no te vale hacerlo solo, sin guía ni resultados.
                Este programa no va de castigar tu cuerpo. Va de construir un físico del que estés orgulloso, con estrategias que realmente encajan contigo.<br />
                🎯 Aquí no hay fórmulas mágicas.Solo lo que funciona, adaptado a tu estilo de vida.<br />
                📌 ¿Para quién es esto?<br />
                 ✅ Para quien está cansado de hacer todo bien… pero no ver resultados.<br />
                 ✅ Para quien entrena, pero no sabe si lo está haciendo bien.<br />
                 ✅ Para quien quiere dejar atrás la ansiedad con la comida.<br />
                 ✅ Para quien quiere recuperar su autoestima y su energía.<br />
                🔥 Si estás listo para dejar de improvisar, y empezar de verdad…<br />
                👉 Rellena el formulario ahora y empieza tu cambio real.<br />
             </p>
            <Button 
              onClick={onQuestionnaireOpen}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-sm lg:text-base px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              ✨ Quiero Cambiar
            </Button>
          </div>

          {/* Stats Section */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
              <div className="text-2xl font-bold text-nutrition-black">30+</div>
              <div className="text-sm text-nutrition-gray">Clientes en Seguimiento</div>
            </div>
            <div className="text-center bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
              <div className="text-2xl font-bold text-nutrition-black">6</div>
              <div className="text-sm text-nutrition-gray">Meses de Experiencia</div>
            </div>
            <div className="text-center bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
              <div className="text-2xl font-bold text-nutrition-black">100%</div>
              <div className="text-sm text-nutrition-gray">Compromiso Personal</div>
            </div>
            <div className="text-center bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
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
