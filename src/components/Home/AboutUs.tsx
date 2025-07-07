
import React from 'react';
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
        
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-8 title-main">
            Sobre Mí
          </h2>
          <p className="text-xl text-nutrition-green font-bold mb-8">
            🎯 ES TU TURNO ⭐
          </p>
          <p className="text-sm text-nutrition-gray leading-relaxed">
            Ya has probado de todo pero nunca lo habías hecho con estrategia, guía y seguimiento de verdad…
            AUNQUE… Llevas tiempo pensando que algo tiene que cambiar. Y lo sabes. Este programa no va de dejar de comer o pasarte el día entrenando. Va de construir un cuerpo y unos hábitos que puedas mantener PARA SIEMPRE.
            Olvida las dietas que no aguantas ni dos semanas. Empieza a entrenar con un plan que tenga sentido para ti.
            🔹 No necesitas tener todo perfecto. Solo necesitas empezar. Yo te guío, tú te comprometes. Y el cambio llega.                    </p>
        </div>

        {/* Vertical Journey Path */}
        <div className="relative max-w-5xl mx-auto">
          {/* Dynamic serpentine path with gradient and animation */}
          <div className="absolute left-1/2 top-0 bottom-0 w-20 transform -translate-x-1/2 pointer-events-none">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 80 1000" 
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
                d="M40 0 C60 50, 20 100, 60 150 C20 200, 60 250, 20 300 C60 350, 20 400, 60 450 C20 500, 60 550, 20 600 C60 650, 20 700, 60 750 C20 800, 60 850, 40 900 L40 1000" 
                stroke="url(#pathGradient)" 
                strokeWidth="8" 
                strokeDasharray="12,8"
                strokeLinecap="round"
                filter="url(#glow)"
                opacity="0.7"
              />
              
              {/* Main animated path */}
              <path 
                d="M40 0 C60 50, 20 100, 60 150 C20 200, 60 250, 20 300 C60 350, 20 400, 60 450 C20 500, 60 550, 20 600 C60 650, 20 700, 60 750 C20 800, 60 850, 40 900 L40 1000" 
                stroke="url(#pathGradient)" 
                strokeWidth="4" 
                strokeDasharray="12,8"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Journey Steps with reduced spacing */}
          <div className="space-y-16">
            {/* Step 1 - Left side */}
            <div className="flex items-center">
              <div className="w-1/2 pr-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-green-light hover:shadow-xl transition-all duration-300 transform hover:scale-105 ml-auto max-w-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                      ES MÁS FÁCIL CONSEGUIRLO CUANDO TE GUSTA LO QUE COMES 💪🍴
                    </h3>
                    <p className="text-sm text-nutrition-gray leading-relaxed">
                      Con tu PLAN DE ALIMENTACIÓN PERSONALIZADO olvídate de contar calorías, de comer arroz con pollo sin sabor o de forzarte a comer lo que no te apetece.
                       👉 Conmigo vas a disfrutar del proceso sin renunciar al placer de comer.
                      Te diseño un menú realista y variado, adaptado a tu día a día, tus horarios, tus gustos y tus objetivos.
                      Nada de dietas rígidas ni menús que parecen castigos. Vas a comer bien y vas a lograr resultados. Punto.
                      🔥 ¿Lo mejor? Varias opciones por comida con cantidades claras.
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

            {/* Step 2 - Right side */}
            <div className="flex items-center">
              <div className="w-1/2 pr-8"></div>
              <div className="flex-shrink-0 w-12 h-12 bg-nutrition-accent text-white rounded-full font-bold text-lg flex items-center justify-center z-10 relative shadow-lg">
                02
              </div>
              <div className="w-1/2 pl-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-accent-light hover:shadow-xl transition-all duration-300 transform hover:scale-105 max-w-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                      NO IMPORTA SI NUNCA HAS PISADO UN GIMNASIO 🏋️‍♂️                   
                    </h3>
                    <p className="text-sm text-nutrition-gray leading-relaxed">
                        O si no sabes por dónde empezar... Aquí vas a aprender desde cero, sin miedo y con apoyo total.
                        Tu cuerpo puede mucho más de lo que crees.
                         💡 Yo me encargo de guiarte paso a paso, explicarte cada ejercicio y diseñarte una rutina realista, sin entrenar horas ni machacarte sin sentido.
                        👉 Entrenarás con estrategia, con técnica y con confianza.
                        🔥 ¿Lo mejor? Te sentirás seguro desde el día 1.
                        Nada de rutinas copiadas, nada de ejercicios que no entiendes. Aquí todo tiene sentido y propósito.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Left side */}
            <div className="flex items-center">
              <div className="w-1/2 pr-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-green-light hover:shadow-xl transition-all duration-300 transform hover:scale-105 ml-auto max-w-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                     SIN COMUNICACIÓN, NO HAY RESULTADOS 📲💬
                    </h3>
                    <p className="text-sm text-nutrition-gray leading-relaxed">
                      No es solo un plan. Es un proceso en equipo con un SEGUIMIENTO INDIVIDUALIZADO.
                      Para que logres tus objetivos, necesito saber cómo estás, qué necesitas y cómo te estás sintiendo.
                      👉 Sin tus mensajes, no puedo ayudarte ni ajustar tu plan.
                       Este no es un servicio enlatado: es un acompañamiento real y constante.
                      💡 Siempre hay otra opción que sí se adapta a ti
                      No importa si algo no te gusta o se te complica.
                       🔁 Siempre hay una solución. Siempre hay una alternativa.
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
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-accent-light hover:shadow-xl transition-all duration-300 transform hover:scale-105 max-w-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                     EL CAMBIO NO ES TEMPORAL, ES SOSTENIBLE 🧠📈
                    </h3>
                    <p className="text-sm text-nutrition-gray leading-relaxed">
                      Esto no es una carrera de 30 días ni de una semana.
                       Es un proceso en el que aprendes a mantener resultados reales sin rebotes ni frustraciones.
                      📲 Cada 2/4 semanas revisamos tus avances: medidas, descanso, pasos, entreno, hidratación, alimentación y más.
                       Así ajustamos el plan y seguimos avanzando.
                      🧭 ¿Te vas de vacaciones o has tenido una mala semana?
                      No pasa nada. Me avisas y adaptamos el plan para que disfrutes sin perder el rumbo.
                       ¿Quieres dejar un mal hábito? Te acompaño y lo trabajamos juntos.
                      🔁 Esto va más allá del físico
                      Mi objetivo es que cambies tu forma de ver el fitness.
                       Que construyas un cuerpo que te guste sin obsesiones, sin extremos.
                       Y sobre todo: que te dure para siempre.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Call to Action Section */}
          <div className="text-center mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 border-nutrition-green-light">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                      AHORA TE TOCA A TI  💥
                </h3>
            </div>
            <p className="text-lg font-bold text-nutrition-black mb-3 title-playful">
                Llevas tiempo pensándolo.. sabes que necesitas un cambio… y ya no te vale hacerlo solo, sin guía ni resultados.
                Este programa no va de castigar tu cuerpo. Va de construir un físico del que estés orgulloso, con estrategias que realmente encajan contigo.
                🎯 Aquí no hay fórmulas mágicas.Solo lo que funciona, adaptado a tu estilo de vida.
                📌 ¿Para quién es esto?
                 ✅ Para quien está cansado de hacer todo bien… pero no ver resultados.
                 ✅ Para quien entrena, pero no sabe si lo está haciendo bien.
                 ✅ Para quien quiere dejar atrás la ansiedad con la comida.
                 ✅ Para quien quiere recuperar su autoestima y su energía.
                🔥 Si estás listo para dejar de improvisar, y empezar de verdad…
                👉 Rellena el formulario ahora y empieza tu cambio real.
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
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
              <div className="text-2xl font-bold text-nutrition-black">30+</div>
              <div className="text-sm text-nutrition-gray">Clientes en Seguimiento</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
              <div className="text-2xl font-bold text-nutrition-black">6</div>
              <div className="text-sm text-nutrition-gray">Meses de Experiencia</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
              <div className="text-2xl font-bold text-nutrition-black">100%</div>
              <div className="text-sm text-nutrition-gray">Compromiso Personal</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light">
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
