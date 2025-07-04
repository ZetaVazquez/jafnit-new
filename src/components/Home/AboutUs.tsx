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
      name: 'María González',
      comment: 'José Antonio me ayudó a transformar completamente mi estilo de vida. En 6 meses perdí 15 kilos y gané mucha confianza.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Carlos Rodríguez',
      comment: 'El plan personalizado de entrenamiento y nutrición superó todas mis expectativas. Recomiendo 100% sus servicios.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Ana Martín',
      comment: 'Profesional, dedicado y con resultados reales. Mi salud y energía mejoraron significativamente.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'David López',
      comment: 'La mejor inversión que he hecho en mi salud. El seguimiento personalizado marca la diferencia.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <section id="about" className="py-8 md:py-16 dynamic-background relative overflow-hidden">
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
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-nutrition-black mb-4 md:mb-8 title-main tracking-tight">
            Sobre Mi
          </h2>
        </div>

        {/* FILA 1: Cuadro de texto arriba a la izquierda solamente + Opiniones arriba derecha */}
        <div className="mb-8 md:mb-16 relative">
          <div className="flex justify-start">
            <div className="w-full max-w-3xl">
              <div className="bg-white backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-10 shadow-xl border border-nutrition-green-light">
                <h3 className="text-xl md:text-3xl lg:text-4xl font-bold text-nutrition-green mb-4 md:mb-8 title-playful">
                  💢 De odiar mi reflejo a cambiar mi vida (y ahora la tuya)
                </h3>
                <p className="text-base md:text-xl text-nutrition-green-dark mb-4 md:mb-6 leading-relaxed">
                  Durante años, el sobrepeso fue parte de mí. A los 14 años pesaba más de 100 kg 🧍‍♂️. Me pasaba horas en el gimnasio 💥 intentando compensar cada comida cargada de culpa.
                </p>
                <p className="text-base md:text-xl text-nutrition-green-dark mb-4 md:mb-6 leading-relaxed">
                  🥶 Dejé de comer. Entrené como un loco. Me exigí hasta los límites.
                </p>
                <p className="text-base md:text-xl text-nutrition-green-dark mb-4 md:mb-6 leading-relaxed">
                  ¿Resultados? Bajé peso, sí… pero también perdí salud, energía y ganas de vivir.
                </p>
                <p className="text-base md:text-xl text-nutrition-green-dark font-semibold">
                  Hasta que el cuerpo dijo basta.
                </p>
              </div>
            </div>
          </div>

          {/* Opiniones arriba derecha - centradas */}
          <div className="absolute top-0 right-4 md:right-8 hidden lg:block">
            <div className="space-y-4">
              {/* Primera opinión arriba derecha - rotada hacia la derecha */}
              <div className="transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light max-w-xs">
                  <div className="flex items-center mb-3">
                    <img
                      src={testimonials[0].image}
                      alt={testimonials[0].name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
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
              <div className="transform -rotate-2 hover:rotate-0 transition-transform duration-300 ml-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light max-w-xs">
                  <div className="flex items-center mb-3">
                    <img
                      src={testimonials[1].image}
                      alt={testimonials[1].name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
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
        <div className="mb-8 md:mb-16">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="relative flex flex-col md:flex-row items-center justify-center md:space-x-12">
              <div className="absolute left-0 inset-y-0 hidden md:flex items-center justify-center">
                <div className="w-[36rem] h-[36rem] rounded-full border-2 border-nutrition-green-light opacity-30 animate-pulse"></div>
              </div>
              <div className="absolute left-0 inset-y-0 hidden md:flex items-center justify-center">
                <div className="w-[40rem] h-[40rem] rounded-full border-1 border-nutrition-accent opacity-20 animate-pulse delay-300"></div>
              </div>
              
              <div className="relative z-10 w-64 h-64 md:w-[32rem] md:h-[32rem] rounded-full border-2 md:border-4 border-white shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300 mb-4 md:mb-0">
                <img
                  src="/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png"
                  alt="José Antonio - Tu Dietista y Entrenador Personal"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-xl border border-nutrition-green-light hover:shadow-2xl transition-all duration-300 hover:scale-105 md:ml-8 md:mt-16">
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

        {/* FILA 3: Cuadro de texto abajo a la derecha solamente + Opiniones abajo izquierda */}
        <div className="mb-8 md:mb-16 relative">
          <div className="flex justify-end">
            <div className="w-full max-w-3xl">
              <div className="bg-white backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-10 shadow-xl border border-nutrition-green-light">
                <h4 className="text-xl md:text-3xl font-bold text-nutrition-green mb-4 md:mb-8 title-playful">
                  🎯 Mi método: Simple, efectivo y sostenible
                </h4>
                <p className="text-base md:text-xl text-nutrition-green-dark leading-relaxed mb-4 md:mb-6">
                  Créeme cuando te digo que he probado de todo: dietas extremas, suplementos "milagro", rutinas imposibles 🔄.
                </p>
                <p className="text-base md:text-xl text-nutrition-green-dark leading-relaxed mb-4 md:mb-6">
                  Lo que funciona de verdad es un enfoque equilibrado que puedas mantener en el tiempo 📈.
                </p>
                <p className="text-base md:text-xl text-nutrition-green-dark leading-relaxed font-semibold">
                  No más extremos. Solo resultados reales y duraderos 🏆.
                </p>
              </div>
            </div>
          </div>

          {/* Opiniones abajo izquierda - centradas */}
          <div className="absolute bottom-0 left-4 md:left-8 hidden lg:block">
            <div className="space-y-4">
              {/* Primera opinión abajo izquierda - rotada hacia la izquierda */}
              <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light max-w-xs">
                  <div className="flex items-center mb-3">
                    <img
                      src={testimonials[2].image}
                      alt={testimonials[2].name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
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
              <div className="transform rotate-2 hover:rotate-0 transition-transform duration-300 ml-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-nutrition-green-light max-w-xs">
                  <div className="flex items-center mb-3">
                    <img
                      src={testimonials[3].image}
                      alt={testimonials[3].name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
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
        <div className="mb-8 md:mb-16">
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              <div className="bg-white backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-12 shadow-xl border border-nutrition-green-light">
                <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                  <div className="flex items-center text-base md:text-xl text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-3 md:mr-4 text-xl md:text-2xl">🔥</span>
                    Sin dietas imposibles
                  </div>
                  <div className="flex items-center text-base md:text-xl text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-3 md:mr-4 text-xl md:text-2xl">🏋️‍♂️</span>
                    Sin rutinas de 3 horas al día
                  </div>
                  <div className="flex items-center text-base md:text-xl text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-3 md:mr-4 text-xl md:text-2xl">🧊</span>
                    Sin perder el norte
                  </div>
                </div>
                <p className="text-base md:text-xl text-nutrition-green-dark mb-4 md:mb-6 leading-relaxed">
                  Si estás cansado de no reconocerte en el espejo, de probar y fallar, de sentir que ya nada funciona…
                </p>
                <p className="text-base md:text-xl text-nutrition-green-dark mb-6 md:mb-8 leading-relaxed font-semibold text-nutrition-green">
                  👉 Yo estuve ahí. Y salí. Ahora te toca a ti.
                </p>
                
                <div className="text-center">
                  <Button 
                    onClick={onQuestionnaireOpen}
                    className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-6 md:px-12 py-4 md:py-6 text-lg md:text-2xl font-bold rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                  >
                    🎯 QUIERO CAMBIAR
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl border border-nutrition-green-light">
          <h3 className="text-2xl md:text-4xl font-bold text-center text-nutrition-green mb-8 md:mb-12 title-main">
            Resultados Que Hablan Por Sí Solos
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald text-white rounded-full mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-nutrition-green mb-2 md:mb-3 title-main">{stat.value}</div>
                <div className="text-nutrition-gray font-medium text-sm md:text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
