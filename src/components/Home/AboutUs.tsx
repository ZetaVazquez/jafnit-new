
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

  const testimonials = [
    {
      id: 1,
      name: "María G.",
      text: "Increíble transformación en 3 meses! José me ayudó a perder 12 kilos y ganar confianza. Su método realmente funciona 💪",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b1a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rotation: "-rotate-3",
      position: "top-left"
    },
    {
      id: 2,
      name: "Carlos R.",
      text: "El mejor entrenador! Plan personalizado que se adapta a mi horario. Bajé 15 kilos sin sufrir 🙌",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rotation: "rotate-2",
      position: "top-right"
    },
    {
      id: 3,
      name: "Ana M.",
      text: "Cambió mi vida completamente. Ahora tengo energía, autoestima y el cuerpo que siempre quise ❤️",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rotation: "rotate-1",
      position: "bottom-left"
    },
    {
      id: 4,
      name: "David L.",
      text: "Profesional 100%. Sus consejos y seguimiento marcaron la diferencia. Recomendado totalmente 👍",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rotation: "-rotate-2",
      position: "bottom-right"
    }
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

        {/* Main content area with testimonials */}
        <div className="relative">
          {/* Testimonials positioned around the content */}
          {/* Top Left Testimonials */}
          <div className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4 z-20 hidden lg:block">
            <div className={`${testimonials[0].rotation} transform hover:scale-105 transition-all duration-300`}>
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-nutrition-green-light max-w-xs">
                <div className="flex items-center mb-2">
                  <img src={testimonials[0].image} alt={testimonials[0].name} className="w-8 h-8 rounded-full mr-2" />
                  <span className="font-semibold text-sm text-nutrition-green">{testimonials[0].name}</span>
                </div>
                <p className="text-xs text-gray-700 leading-tight">{testimonials[0].text}</p>
              </div>
            </div>
          </div>

          {/* Top Right Testimonials */}
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-8 z-20 hidden lg:block">
            <div className={`${testimonials[1].rotation} transform hover:scale-105 transition-all duration-300`}>
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-nutrition-green-light max-w-xs">
                <div className="flex items-center mb-2">
                  <img src={testimonials[1].image} alt={testimonials[1].name} className="w-8 h-8 rounded-full mr-2" />
                  <span className="font-semibold text-sm text-nutrition-green">{testimonials[1].name}</span>
                </div>
                <p className="text-xs text-gray-700 leading-tight">{testimonials[1].text}</p>
              </div>
            </div>
          </div>

          {/* Bottom Left Testimonials */}
          <div className="absolute bottom-0 left-0 transform -translate-x-8 translate-y-4 z-20 hidden lg:block">
            <div className={`${testimonials[2].rotation} transform hover:scale-105 transition-all duration-300`}>
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-nutrition-green-light max-w-xs">
                <div className="flex items-center mb-2">
                  <img src={testimonials[2].image} alt={testimonials[2].name} className="w-8 h-8 rounded-full mr-2" />
                  <span className="font-semibold text-sm text-nutrition-green">{testimonials[2].name}</span>
                </div>
                <p className="text-xs text-gray-700 leading-tight">{testimonials[2].text}</p>
              </div>
            </div>
          </div>

          {/* Bottom Right Testimonials */}
          <div className="absolute bottom-0 right-0 transform translate-x-8 translate-y-8 z-20 hidden lg:block">
            <div className={`${testimonials[3].rotation} transform hover:scale-105 transition-all duration-300`}>
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-nutrition-green-light max-w-xs">
                <div className="flex items-center mb-2">
                  <img src={testimonials[3].image} alt={testimonials[3].name} className="w-8 h-8 rounded-full mr-2" />
                  <span className="font-semibold text-sm text-nutrition-green">{testimonials[3].name}</span>
                </div>
                <p className="text-xs text-gray-700 leading-tight">{testimonials[3].text}</p>
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 lg:mb-20">
            {/* Left Content Block */}
            <div className="order-1 lg:order-1 w-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-nutrition-green-light">
                <h3 className="text-xl md:text-3xl font-bold text-nutrition-green mb-4 lg:mb-6 title-playful">
                  💢 De odiar mi reflejo a cambiar mi vida (y ahora la tuya)
                </h3>
                <p className="text-base lg:text-lg text-gray-700 mb-4 lg:mb-6 leading-relaxed">
                  Durante años, el sobrepeso fue parte de mí. A los 14 años pesaba más de 100 kg 🧍‍♂️. Me pasaba horas en el gimnasio 💥 intentando compensar cada comida cargada de culpa.
                </p>
                <p className="text-base lg:text-lg text-gray-700 mb-4 lg:mb-6 leading-relaxed">
                  🥶 Dejé de comer. Entrené como un loco. Me exigí hasta los límites.
                </p>
                <p className="text-base lg:text-lg text-gray-700 mb-4 lg:mb-6 leading-relaxed">
                  ¿Resultados? Bajé peso, sí… pero también perdí salud, energía y ganas de vivir.
                </p>
                <p className="text-base lg:text-lg text-gray-700 mb-4 lg:mb-6 leading-relaxed font-semibold text-nutrition-green">
                  Hasta que el cuerpo dijo basta.
                </p>
              </div>
            </div>
            
            {/* Profile photo section - much larger and more prominent */}
            <div className="order-2 lg:order-2 relative flex justify-center items-center w-full py-8 lg:py-0">
              {/* Decorative rings around the image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full border-2 lg:border-4 border-nutrition-green-light opacity-30 animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[400px] h-[400px] md:w-[520px] md:h-[520px] lg:w-[640px] lg:h-[640px] rounded-full border-1 lg:border-2 border-nutrition-accent opacity-20 animate-pulse delay-300"></div>
              </div>
              
              {/* Main image container - much larger */}
              <div className="relative z-10 w-80 h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] rounded-full border-4 lg:border-8 border-white shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
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
          </div>
        </div>

        {/* Second section: Two blocks horizontally aligned */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-20">
          <div className="bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light rounded-2xl p-6 lg:p-8 shadow-lg">
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

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-nutrition-green-light">
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

        {/* Mobile testimonials - only visible on mobile */}
        <div className="lg:hidden mb-12">
          <h3 className="text-xl font-bold text-center text-nutrition-green mb-6 title-main">
            Lo que dicen mis clientes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-nutrition-green-light">
                <div className="flex items-center mb-2">
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full mr-3" />
                  <span className="font-semibold text-nutrition-green">{testimonial.name}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{testimonial.text}</p>
              </div>
            ))}
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
