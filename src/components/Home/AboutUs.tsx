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

  // Testimonios de ejemplo usando la misma imagen
  const testimonials = [
    {
      id: '1',
      name: 'María González',
      comment: 'José Antonio me ayudó a transformar completamente mi estilo de vida. En 6 meses perdí 15 kilos y gané mucha confianza.',
      rating: 5,
      image: '/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png'
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      comment: 'El plan personalizado de entrenamiento y nutrición superó todas mis expectativas. Recomiendo 100% sus servicios.',
      rating: 5,
      image: '/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png'
    },
    {
      id: '3',
      name: 'Ana Martín',
      comment: 'Profesional, dedicado y con resultados reales. Mi salud y energía mejoraron significativamente.',
      rating: 5,
      image: '/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png'
    },
    {
      id: '4',
      name: 'David López',
      comment: 'La mejor inversión que he hecho en mi salud. El seguimiento personalizado marca la diferencia.',
      rating: 5,
      image: '/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png'
    }
  ];

  return (
    <section id="about" className="py-12 dynamic-background relative overflow-hidden">
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
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-nutrition-black mb-6 title-main tracking-tight">
            Sobre Mi
          </h2>
        </div>

        {/* FILA 1: Texto arriba a la izquierda y testimonios arriba a la derecha */}
        <div className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cuadro izquierda - texto original */}
            <div className="flex justify-start">
              <div className="w-full max-w-md">
                <div className="bg-white backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-nutrition-green-light">
                  <h3 className="text-lg md:text-xl font-bold text-nutrition-green mb-3 title-playful">
                    💢 De odiar mi reflejo a cambiar mi vida (y ahora la tuya)
                  </h3>
                  <p className="text-sm text-nutrition-green-dark mb-2 leading-relaxed">
                    Durante años, el sobrepeso fue parte de mí. A los 14 años pesaba más de 100 kg 🧍‍♂️. Me pasaba horas en el gimnasio 💥 intentando compensar cada comida cargada de culpa.
                  </p>
                  <p className="text-sm text-nutrition-green-dark mb-2 leading-relaxed">
                    🥶 Dejé de comer. Entrené como un loco. Me exigí hasta los límites.
                  </p>
                  <p className="text-sm text-nutrition-green-dark mb-2 leading-relaxed">
                    ¿Resultados? Bajé peso, sí… pero también perdí salud, energía y ganas de vivir.
                  </p>
                  <p className="text-sm text-nutrition-green-dark font-semibold">
                    Hasta que el cuerpo dijo basta.
                  </p>
                </div>
              </div>
            </div>

            {/* Cuadro derecha - testimonios */}
            <div className="flex justify-end">
              <div className="w-full max-w-md">
                <div className="bg-white backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-nutrition-green-light">
                  <h4 className="text-lg font-bold text-nutrition-green mb-4 title-playful text-center">
                    💬 Testimonios
                  </h4>
                  <div className="space-y-4">
                    {testimonials.slice(0, 2).map((testimonial) => (
                      <div key={testimonial.id} className="flex items-start space-x-3">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-semibold text-nutrition-green text-sm">{testimonial.name}</h5>
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current text-nutrition-orange" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-nutrition-green-dark leading-relaxed">"{testimonial.comment}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FILA 2: Foto en el centro con cuadrito de info al lado */}
        <div className="mb-6">
          <div className="flex justify-center">
            <div className="relative flex justify-center items-center w-full">
              {/* Decorative rings around the image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-60 h-60 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full border-2 border-nutrition-green-light opacity-30 animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-68 h-68 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full border-1 border-nutrition-accent opacity-20 animate-pulse delay-300"></div>
              </div>
              
              {/* Main image container */}
              <div className="relative z-10 w-52 h-52 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full border-4 border-white shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
                <img
                  src="/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png"
                  alt="José Antonio - Tu Dietista y Entrenador Personal"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating info card - movido al lado de la foto */}
              <div className="absolute top-0 right-0 md:top-4 md:right-4 lg:-right-8 lg:top-8 bg-white p-3 md:p-4 rounded-xl shadow-xl border border-nutrition-green-light hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-nutrition-green rounded-full animate-pulse"></div>
                  <div>
                    <h4 className="font-bold text-nutrition-green text-sm md:text-base title-playful">José Antonio</h4>
                    <p className="text-nutrition-gray text-xs">Dietista y Entrenador</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FILA 3: Testimonios abajo a la izquierda y texto abajo a la derecha */}
        <div className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cuadro izquierda - testimonios */}
            <div className="flex justify-start">
              <div className="w-full max-w-md">
                <div className="bg-white backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-nutrition-green-light">
                  <h4 className="text-lg font-bold text-nutrition-green mb-4 title-playful text-center">
                    💬 Más Testimonios
                  </h4>
                  <div className="space-y-4">
                    {testimonials.slice(2, 4).map((testimonial) => (
                      <div key={testimonial.id} className="flex items-start space-x-3">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-semibold text-nutrition-green text-sm">{testimonial.name}</h5>
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current text-nutrition-orange" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-nutrition-green-dark leading-relaxed">"{testimonial.comment}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cuadro derecha - texto original */}
            <div className="flex justify-end">
              <div className="w-full max-w-md">
                <div className="bg-white backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-nutrition-green-light">
                  <h4 className="text-lg font-bold text-nutrition-green mb-3 title-playful">
                    🎯 Mi método: Simple, efectivo y sostenible
                  </h4>
                  <p className="text-sm text-nutrition-green-dark leading-relaxed mb-2">
                    Créeme cuando te digo que he probado de todo: dietas extremas, suplementos "milagro", rutinas imposibles 🔄.
                  </p>
                  <p className="text-sm text-nutrition-green-dark leading-relaxed mb-2">
                    Lo que funciona de verdad es un enfoque equilibrado que puedas mantener en el tiempo 📈.
                  </p>
                  <p className="text-sm text-nutrition-green-dark leading-relaxed font-semibold">
                    No más extremos. Solo resultados reales y duraderos 🏆.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FILA 4: Cuadro centrado con call to action */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-nutrition-green-light">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-2">🔥</span>
                    Sin dietas imposibles
                  </div>
                  <div className="flex items-center text-sm text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-2">🏋️‍♂️</span>
                    Sin rutinas de 3 horas al día
                  </div>
                  <div className="flex items-center text-sm text-nutrition-green-dark">
                    <span className="text-nutrition-green font-semibold mr-2">🧊</span>
                    Sin perder el norte
                  </div>
                </div>
                <p className="text-sm text-nutrition-green-dark mb-2 leading-relaxed">
                  Si estás cansado de no reconocerte en el espejo, de probar y fallar, de sentir que ya nada funciona…
                </p>
                <p className="text-sm text-nutrition-green-dark mb-4 leading-relaxed font-semibold text-nutrition-green">
                  👉 Yo estuve ahí. Y salí. Ahora te toca a ti.
                </p>
                
                <div className="text-center">
                  <Button 
                    onClick={onQuestionnaireOpen}
                    className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-6 py-3 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                  >
                    🎯 QUIERO CAMBIAR
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-nutrition-green-light">
          <h3 className="text-2xl font-bold text-center text-nutrition-green mb-6 title-main">
            Resultados Que Hablan Por Sí Solos
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald text-white rounded-full mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-nutrition-green mb-1 title-main">{stat.value}</div>
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
