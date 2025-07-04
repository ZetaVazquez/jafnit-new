import React from 'react';
import { Award, Users, Heart, Target, Star } from 'lucide-react';
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

  const testimonials = [
    {
      name: '🧍‍♀️ Laura Jiménez (32 años)',
      comment: 'Nunca pensé que una dieta pudiera ser así de fácil de seguir. ¡No paso hambre, me encanta lo que como y ya bajé 4 kilos! Gracias por enseñarme a disfrutar comiendo 🙌🍝',
      rating: 4
    },
    {
      name: '🧍‍♂️ Pablo Moreno (36 años)',
      comment: 'Estoy sorprendido de lo mucho que he avanzado sin pasarme horas en el gym. El entrenamiento es personalizado y me encanta que puedo hacerlo en casa o en el parque 🏋️‍♂️🏡.',
      rating: 5
    },
    {
      name: '🧍‍♀️ Alba Fernández (29 años)',
      comment: 'Me sentí escuchada desde el primer día. Cada duda que tengo, me la responden rápido. Siento que no estoy sola en esto y eso me da tranquilidad 🙏📩.',
      rating: 4
    },
    {
      name: '🧍‍♂️ Iván Gutiérrez (30 años)',
      comment: 'Volví a usar ropa que no me ponía hace años, pero lo que más valoro es que ahora tengo energía para todo. Este cambio me ha devuelto las ganas de vivir al 100%.',
      rating: 5
    }
  ];

  return (
    <section id="about" className="py-8 md:py-12 dynamic-background relative overflow-hidden">
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

      <div className="container mx-auto px-2 md:px-4 relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-nutrition-black mb-4 md:mb-6 title-main tracking-tight">
            Sobre Mi
          </h2>
        </div>

        {/* FILA 1: Cuadro de texto arriba a la izquierda solamente + Opiniones arriba derecha más alejadas */}
        <div className="mb-6 md:mb-10 relative">
          <div className="flex justify-start">
            <div className="w-full max-w-4xl">
              <div className="bg-white backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl border border-nutrition-green-light">
                <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-nutrition-green mb-3 md:mb-4 title-playful">
                  💢 De odiar mi reflejo a cambiar mi vida (y ahora la tuya)
                </h3>
                <p className="text-sm md:text-lg text-nutrition-green-dark mb-3 md:mb-4 leading-relaxed">
                  Durante años, el sobrepeso fue parte de mí. A los 14 años pesaba más de 100 kg 🧍‍♂️. Me pasaba horas en el gimnasio 💥 intentando compensar cada comida cargada de culpa.
                </p>
                <p className="text-sm md:text-lg text-nutrition-green-dark mb-3 md:mb-4 leading-relaxed">
                  🥶 Dejé de comer. Entrené como un loco. Me exigí hasta los límites.
                </p>
                <p className="text-sm md:text-lg text-nutrition-green-dark mb-3 md:mb-4 leading-relaxed">
                  ¿Resultados? Bajé peso, sí… pero también perdí salud, energía y ganas de vivir.
                </p>
                <p className="text-sm md:text-lg text-nutrition-green-dark font-semibold">
                  Hasta que el cuerpo dijo basta.
                </p>
              </div>
            </div>
          </div>

          {/* Opiniones arriba derecha - movidas mucho más hacia el extremo derecho */}
          <div className="absolute top-8 md:top-12 -right-4 md:-right-8 hidden lg:block">
            <div className="space-y-4">
              {/* Primera opinión arriba derecha - rotada hacia la derecha */}
              <div className="transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light max-w-xs">
                  <div className="flex items-center mb-3">
                    <div>
                      <h4 className="font-bold text-nutrition-black text-sm title-playful">{testimonials[0].name}</h4>
                      <div className="flex">
                        {[...Array(testimonials[0].rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current text-nutrition-green" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-nutrition-green-dark text-xs leading-relaxed">"{testimonials[0].comment}"</p>
                </div>
              </div>

              {/* Segunda opinión arriba derecha - rotada hacia la izquierda */}
              <div className="transform -rotate-2 hover:rotate-0 transition-transform duration-300 ml-12">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light max-w-xs">
                  <div className="flex items-center mb-3">
                    <div>
                      <h4 className="font-bold text-nutrition-black text-sm title-playful">{testimonials[1].name}</h4>
                      <div className="flex">
                        {[...Array(testimonials[1].rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current text-nutrition-green" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-nutrition-green-dark text-xs leading-relaxed">"{testimonials[1].comment}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FILA 2: Foto en el centro con cuadrito de info AL LADO */}
        <div className="mb-6 md:mb-10">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="relative flex flex-col md:flex-row items-center justify-center md:space-x-12">
              <div className="absolute left-0 inset-y-0 hidden md:flex items-center justify-center">
                <div className="w-[24rem] h-[24rem] rounded-full border-2 border-nutrition-green-light opacity-30 animate-pulse"></div>
              </div>
              <div className="absolute left-0 inset-y-0 hidden md:flex items-center justify-center">
                <div className="w-[28rem] h-[28rem] rounded-full border-1 border-nutrition-accent opacity-20 animate-pulse delay-300"></div>
              </div>
              
              <div className="relative z-10 w-48 h-48 md:w-[24rem] md:h-[24rem] rounded-full border-2 md:border-4 border-white shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300 mb-4 md:mb-0">
                <img
                  src="/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png"
                  alt="José Antonio - Tu Dietista y Entrenador Personal"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-xl border border-nutrition-green-light hover:shadow-2xl transition-all duration-300 hover:scale-105 md:ml-8 md:mt-12">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-nutrition-green rounded-full animate-pulse"></div>
                  <div>
                    <h4 className="font-bold text-nutrition-green text-sm md:text-lg title-playful">José Antonio</h4>
                    <p className="text-nutrition-gray text-xs md:text-base">Dietista y Entrenador</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FILA 3: Cuadro de texto abajo a la derecha solamente + Opiniones abajo izquierda más alejadas */}
        <div className="mb-6 md:mb-10 relative">
          <div className="flex justify-end">
            <div className="w-full max-w-4xl">
              <div className="bg-white backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl border border-nutrition-green-light">
                <h4 className="text-lg md:text-2xl font-bold text-nutrition-green mb-3 md:mb-4 title-playful">
                  🎯 Mi método: Simple, efectivo y sostenible
                </h4>
                <p className="text-sm md:text-lg text-nutrition-green-dark leading-relaxed mb-3 md:mb-4">
                  Créeme cuando te digo que he probado de todo: dietas extremas, suplementos "milagro", rutinas imposibles 🔄.
                </p>
                <p className="text-sm md:text-lg text-nutrition-green-dark leading-relaxed mb-3 md:mb-4">
                  Lo que funciona de verdad es un enfoque equilibrado que puedas mantener en el tiempo 📈.
                </p>
                <p className="text-sm md:text-lg text-nutrition-green-dark leading-relaxed font-semibold">
                  No más extremos. Solo resultados reales y duraderos 🏆.
                </p>
              </div>
            </div>
          </div>

          {/* Opiniones abajo izquierda - movidas mucho más hacia el extremo izquierdo */}
          <div className="absolute bottom-0 -left-4 md:-left-8 hidden lg:block">
            <div className="space-y-4">
              {/* Primera opinión abajo izquierda - rotada hacia la izquierda */}
              <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light max-w-xs">
                  <div className="flex items-center mb-3">
                    <div>
                      <h4 className="font-bold text-nutrition-black text-sm title-playful">{testimonials[2].name}</h4>
                      <div className="flex">
                        {[...Array(testimonials[2].rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current text-nutrition-green" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-nutrition-green-dark text-xs leading-relaxed">"{testimonials[2].comment}"</p>
                </div>
              </div>

              {/* Segunda opinión abajo izquierda - rotada hacia la derecha */}
              <div className="transform rotate-2 hover:rotate-0 transition-transform duration-300 ml-12">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light max-w-xs">
                  <div className="flex items-center mb-3">
                    <div>
                      <h4 className="font-bold text-nutrition-black text-sm title-playful">{testimonials[3].name}</h4>
                      <div className="flex">
                        {[...Array(testimonials[3].rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current text-nutrition-green" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-nutrition-green-dark text-xs leading-relaxed">"{testimonials[3].comment}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FILA 4: Cuadro centrado con call to action */}
        <div className="mb-6 md:mb-10">
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">
              <div className="bg-white backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl border border-nutrition-green-light">
                <div className="grid md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="flex items-center text-sm md:text-lg text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-2 md:mr-3 text-lg md:text-xl">🔥</span>
                    Sin dietas imposibles
                  </div>
                  <div className="flex items-center text-sm md:text-lg text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-2 md:mr-3 text-lg md:text-xl">🏋️‍♂️</span>
                    Sin rutinas de 3 horas al día
                  </div>
                  <div className="flex items-center text-sm md:text-lg text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-2 md:mr-3 text-lg md:text-xl">🧊</span>
                    Sin perder el norte
                  </div>
                </div>
                <p className="text-sm md:text-lg text-nutrition-green-dark mb-3 md:mb-4 leading-relaxed">
                  Si estás cansado de no reconocerte en el espejo, de probar y fallar, de sentir que ya nada funciona…
                </p>
                <p className="text-sm md:text-lg text-nutrition-green-dark mb-4 md:mb-6 leading-relaxed font-semibold text-nutrition-green">
                  👉 Yo estuve ahí. Y salí. Ahora te toca a ti.
                </p>
                
                <div className="text-center">
                  <Button 
                    onClick={onQuestionnaireOpen}
                    className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-4 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                  >
                    🎯 QUIERO CAMBIAR
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-nutrition-green-light">
          <h3 className="text-xl md:text-3xl font-bold text-center text-nutrition-green mb-6 md:mb-8 title-main">
            Resultados Que Hablan Por Sí Solos
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald text-white rounded-full mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-6 h-6 md:w-10 md:h-10" />
                </div>
                <div className="text-xl md:text-3xl lg:text-4xl font-bold text-nutrition-green mb-1 md:mb-2 title-main">{stat.value}</div>
                <div className="text-nutrition-gray font-medium text-xs md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
