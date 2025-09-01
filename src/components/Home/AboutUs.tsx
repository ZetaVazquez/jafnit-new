
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
        {/* Circles */}
        <div className="geometric-shape circle-shape w-16 h-16 md:w-32 md:h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-12 h-12 md:w-24 md:h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-10 h-10 md:w-20 md:h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-8 h-8 md:w-16 md:h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-14 h-14 md:w-28 md:h-28 top-3/4 left-16 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-6 h-6 md:w-12 md:h-12 top-1/3 left-3/4 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-10 h-10 md:w-20 md:h-20 bottom-32 right-12 animate-pulse-slow"></div>
        
        {/* Triangles */}
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/4 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down top-2/3 right-1/3 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up bottom-1/3 left-3/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-down top-1/6 left-2/3 animate-pulse-slow"></div>
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

        {/* Journey Path with responsive design */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-1 bg-gradient-to-b from-nutrition-green via-nutrition-accent to-nutrition-green opacity-80 z-0"></div>

          {/* Journey Steps */}
          <div className="space-y-8 md:space-y-16">
            {/* Step 1 */}
            <ScrollReveal direction="up" delay={100}>
              <div className="relative">
                {/* Mobile Layout */}
                <div className="block md:hidden">
                  <div className="text-center mb-4">
                    <div className="inline-flex w-12 h-12 bg-nutrition-green text-white rounded-full font-bold text-lg items-center justify-center shadow-lg mb-4">
                      01
                    </div>
                    <h3 className="text-lg font-bold text-nutrition-black title-playful px-4">
                      ES MÁS FÁCIL CONSEGUIRLO CUANDO TE GUSTA LO QUE COMES
                    </h3>
                  </div>
                  <div className="mx-4">
                    <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-nutrition-green-light">
                      <p className="text-sm text-nutrition-gray leading-relaxed">
                        Con tu PLAN DE ALIMENTACIÓN PERSONALIZADO olvídate de contar calorías, de comer arroz con pollo sin sabor o de forzarte a comer lo que no te apetece.<br /><br />
                        👉 Conmigo vas a disfrutar del proceso sin renunciar al placer de comer Te diseño un menú realista y variado, adaptado a tu día a día, tus horarios, tus gustos y tus objetivos.<br /><br />
                        Nada de dietas rígidas ni menús que parecen castigos. Vas a comer bien y vas a lograr resultados.<br /><br />
                        🔥 ¿Lo mejor? Varias opciones por comida con cantidades claras.<br /><br />
                        Comer bien no es aburrido, si sabes cómo hacerlo. Y yo te voy a enseñar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="w-5/12 text-right pr-8">
                    <h3 className="text-xl lg:text-2xl font-bold text-nutrition-black title-playful">
                      ES MÁS FÁCIL CONSEGUIRLO CUANDO TE GUSTA LO QUE COMES
                    </h3>
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 bg-nutrition-green text-white rounded-full font-bold text-xl flex items-center justify-center z-10 relative shadow-lg">
                    01
                  </div>
                  <div className="w-5/12 pl-8">
                    <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-green-light hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <p className="text-sm text-nutrition-gray leading-relaxed">
                        Con tu PLAN DE ALIMENTACIÓN PERSONALIZADO olvídate de contar calorías, de comer arroz con pollo sin sabor o de forzarte a comer lo que no te apetece.<br />
                        👉 Conmigo vas a disfrutar del proceso sin renunciar al placer de comer Te diseño un menú realista y variado, adaptado a tu día a día, tus horarios, tus gustos y tus objetivos.<br />
                        Nada de dietas rígidas ni menús que parecen castigos. Vas a comer bien y vas a lograr resultados.<br />
                        🔥 ¿Lo mejor? Varias opciones por comida con cantidades claras.<br />
                        Comer bien no es aburrido, si sabes cómo hacerlo. Y yo te voy a enseñar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal direction="up" delay={250}>
              <div className="relative">
                {/* Mobile Layout */}
                <div className="block md:hidden">
                  <div className="text-center mb-4">
                    <div className="inline-flex w-12 h-12 bg-nutrition-accent text-white rounded-full font-bold text-lg items-center justify-center shadow-lg mb-4">
                      02
                    </div>
                    <h3 className="text-lg font-bold text-nutrition-black title-playful px-4">
                      NO IMPORTA SI NUNCA HAS PISADO UN GIMNASIO
                    </h3>
                  </div>
                  <div className="mx-4">
                    <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-nutrition-accent-light">
                      <p className="text-sm text-nutrition-gray leading-relaxed">
                        O si no sabes por dónde empezar... Aquí vas a aprender desde cero, sin miedo y con apoyo total.<br /><br />
                        Tu cuerpo puede mucho más de lo que crees.<br /><br />
                        💡 Yo me encargo de guiarte paso a paso, explicarte cada ejercicio y diseñarte una rutina realista, sin entrenar horas ni machacarte sin sentido.<br /><br />
                        👉 Entrenarás con estrategia, con técnica y con confianza.<br /><br />
                        🔥 ¿Lo mejor? Te sentirás seguro desde el día 1.<br /><br />
                        Nada de rutinas copiadas, nada de ejercicios que no entiendes. Aquí todo tiene sentido y propósito.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="w-5/12 pr-8">
                    <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-accent-light hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
                  <div className="flex-shrink-0 w-16 h-16 bg-nutrition-accent text-white rounded-full font-bold text-xl flex items-center justify-center z-10 relative shadow-lg">
                    02
                  </div>
                  <div className="w-5/12 text-left pl-8">
                    <h3 className="text-xl lg:text-2xl font-bold text-nutrition-black title-playful">
                      NO IMPORTA SI NUNCA HAS PISADO UN GIMNASIO
                    </h3>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal direction="up" delay={400}>
              <div className="relative">
                {/* Mobile Layout */}
                <div className="block md:hidden">
                  <div className="text-center mb-4">
                    <div className="inline-flex w-12 h-12 bg-nutrition-green text-white rounded-full font-bold text-lg items-center justify-center shadow-lg mb-4">
                      03
                    </div>
                    <h3 className="text-lg font-bold text-nutrition-black title-playful px-4">
                      SIN COMUNICACIÓN, NO HAY RESULTADOS
                    </h3>
                  </div>
                  <div className="mx-4">
                    <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-nutrition-green-light">
                      <p className="text-sm text-nutrition-gray leading-relaxed">
                        No es solo un plan. Es un proceso en equipo con un SEGUIMIENTO INDIVIDUALIZADO.<br /><br />
                        Para que logres tus objetivos, necesito saber cómo estás, qué necesitas y cómo te estás sintiendo.<br /><br />
                        👉 Sin tus mensajes, no puedo ayudarte ni ajustar tu plan.<br /><br />
                        Este no es un servicio enlatado: es un acompañamiento real y constante.<br /><br />
                        💡 Siempre hay otra opción que sí se adapta a ti.<br /><br />
                        No importa si algo no te gusta o se te complica.<br /><br />
                        🔁 Siempre hay una solución. Siempre hay una alternativa.<br /><br />
                        Lo importante es que te guste, te funcione y lo mantengas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="w-5/12 text-right pr-8">
                    <h3 className="text-xl lg:text-2xl font-bold text-nutrition-black title-playful">
                      SIN COMUNICACIÓN, NO HAY RESULTADOS
                    </h3>
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 bg-nutrition-green text-white rounded-full font-bold text-xl flex items-center justify-center z-10 relative shadow-lg">
                    03
                  </div>
                  <div className="w-5/12 pl-8">
                    <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-green-light hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <p className="text-sm text-nutrition-gray leading-relaxed">
                        No es solo un plan. Es un proceso en equipo con un SEGUIMIENTO INDIVIDUALIZADO.<br />
                        Para que logres tus objetivos, necesito saber cómo estás, qué necesitas y cómo te estás sintiendo.<br />
                        👉 Sin tus mensajes, no puedo ayudarte ni ajustar tu plan.<br />
                        Este no es un servicio enlatado: es un acompañamiento real y constante.<br />
                        💡 Siempre hay otra opción que sí se adapta a ti.<br />
                        No importa si algo no te gusta o se te complica.<br />
                        🔁 Siempre hay una solución. Siempre hay una alternativa.<br />
                        Lo importante es que te guste, te funcione y lo mantengas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 4 */}
            <ScrollReveal direction="up" delay={550}>
              <div className="relative">
                {/* Mobile Layout */}
                <div className="block md:hidden">
                  <div className="text-center mb-4">
                    <div className="inline-flex w-12 h-12 bg-nutrition-accent text-white rounded-full font-bold text-lg items-center justify-center shadow-lg mb-4">
                      04
                    </div>
                    <h3 className="text-lg font-bold text-nutrition-black title-playful px-4">
                      EL CAMBIO NO ES TEMPORAL, ES SOSTENIBLE
                    </h3>
                  </div>
                  <div className="mx-4">
                    <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-nutrition-accent-light">
                      <p className="text-sm text-nutrition-gray leading-relaxed">
                        Esto no es una carrera de 30 días ni de una semana.<br /><br />
                        Es un proceso en el que aprendes a mantener resultados reales sin rebotes ni frustraciones.<br /><br />
                        📲 Cada 2/4 semanas revisamos tus avances: medidas, descanso, pasos, entreno, hidratación, alimentación y más. Así ajustamos el plan y seguimos avanzando.<br /><br />
                        🧭 ¿Te vas de vacaciones o has tenido una mala semana? No pasa nada. Me avisas y adaptamos el plan para que disfrutes sin perder el rumbo.¿Quieres dejar un mal hábito? Te acompaño y lo trabajamos juntos.<br /><br />
                        🔁 Esto va más allá del físico<br /><br />
                        Mi objetivo es que cambies tu forma de ver el fitness.<br /><br />
                        Que construyas un cuerpo que te guste sin obsesiones, sin extremos.<br /><br />
                        Y sobre todo: que te dure para siempre.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="w-5/12 pr-8">
                    <div className="bg-gray-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-nutrition-accent-light hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <p className="text-sm text-nutrition-gray leading-relaxed">
                        Esto no es una carrera de 30 días ni de una semana.<br />
                        Es un proceso en el que aprendes a mantener resultados reales sin rebotes ni frustraciones.<br />
                        📲 Cada 2/4 semanas revisamos tus avances: medidas, descanso, pasos, entreno, hidratación, alimentación y más. Así ajustamos el plan y seguimos avanzando.<br />
                        🧭 ¿Te vas de vacaciones o has tenido una mala semana? No pasa nada. Me avisas y adaptamos el plan para que disfrutes sin perder el rumbo.¿Quieres dejar un mal hábito? Te acompaño y lo trabajamos juntos.<br />
                        🔁 Esto va más allá del físico<br />
                        Mi objetivo es que cambies tu forma de ver el fitness.<br />
                        Que construyas un cuerpo que te guste sin obsesiones, sin extremos.<br />
                        Y sobre todo: que te dure para siempre.
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 bg-nutrition-accent text-white rounded-full font-bold text-xl flex items-center justify-center z-10 relative shadow-lg">
                    04
                  </div>
                  <div className="w-5/12 text-left pl-8">
                    <h3 className="text-xl lg:text-2xl font-bold text-nutrition-black title-playful">
                      EL CAMBIO NO ES TEMPORAL, ES SOSTENIBLE
                    </h3>
                  </div>
                </div>
              </div>
            </ScrollReveal>
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
