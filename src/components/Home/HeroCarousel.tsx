
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
  onStartQuestionnaire: () => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ onStartQuestionnaire }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/lovable-uploads/36f5f0c3-e789-4843-b583-f8d9790e501d.png",
      title: "El problema no eres tú, no es tu fuerza de voluntad, no es tu genética. Es tu método y nadie te lo había explicado antes",
      subtitle: "Planes personalizados que se adaptan a tu vida real, no a la vida perfecta que no tienes. Nada de copiar y pegar rutinas de internet que no funcionan para ti. Tu cuerpo es único, tus objetivos son únicos, tu ritmo de vida es único, y por eso tu plan debe ser único también.",
      buttonText: "QUIERO COMENZAR MI TRANSFORMACION"
    },
    {
      image: "/lovable-uploads/d9e824a6-f8e7-4015-a718-30c43f008240.png", 
      title: "¿Cansado de intentar y no conseguir resultados? Yo pasé por exactamente lo mismo que tú estás viviendo ahora",
      subtitle: "Yo estuve donde tú estás en este momento. Perdí 30 kilos sin destruir mi salud ni mi vida social, y lo más importante: sin volver a recuperar el peso perdido. Ahora ayudo a personas como tú a conseguir el cuerpo que merecen y la confianza que necesitan para vivir la vida que realmente quieren.",
      buttonText: "QUIERO COMENZAR MI TRANSFORMACION"
    },
    {
      image: "/lovable-uploads/0ca241a3-fbaf-49b9-82ab-896f359c1099.png",
      title: "Deja de vivir en el cuerpo que ya no quieres y empieza a construir la versión más fuerte de ti mismo",
      subtitle: "Transforma tu físico y tu mentalidad con un plan que realmente funciona, diseñado específicamente para personas como tú que han intentado todo sin éxito. Sin dietas imposibles de seguir, sin entrenamientos de 3 horas que no puedes mantener. Solo resultados reales y duraderos que te harán sentir orgulloso cada vez que te mires al espejo.",
      buttonText: "QUIERO COMENZAR MI TRANSFORMACION"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="inicio" className="relative h-[75vh] lg:h-[80vh] overflow-hidden bg-gradient-to-br from-nutrition-green via-nutrition-green-emerald to-nutrition-green-dark">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="geometric-shape circle-shape w-32 h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
      </div>

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            <div className="absolute inset-0 bg-green-600/70"></div>
          </div>
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">
                <div className="text-white space-y-4 lg:space-y-6 pb-12 lg:pb-16">
                  <div className="space-y-3 lg:space-y-4">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden border-4 border-white/30 mx-auto lg:mx-0">
                      <img 
                        src="/lovable-uploads/7a65475a-1feb-4fb7-b32f-5fae0d6019fd.png" 
                        alt="JAFNFIT Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center lg:text-left">
                      <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold title-main mb-1 lg:mb-2 text-white">
                        JAFNFIT
                      </h1>
                      <p className="text-base lg:text-lg text-yellow-300 font-medium">
                        Dietética y Entrenamiento Personal
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 lg:space-y-4 text-center lg:text-left">
                    <h2 className="text-xl lg:text-3xl xl:text-4xl font-bold leading-tight text-white">
                      {slide.title}
                    </h2>
                    <p className="text-sm lg:text-base xl:text-lg text-white leading-relaxed max-w-2xl">
                      {slide.subtitle}
                    </p>
                  </div>

                  <div className="flex justify-center lg:justify-start pt-2">
                    <Button
                      onClick={onStartQuestionnaire}
                      size="lg"
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-sm lg:text-base px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      {slide.buttonText}
                    </Button>
                  </div>
                </div>

                <div className="hidden lg:block relative h-full">
                  {/* Trainer silhouette fija */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Silueta del entrenador fija - fuera del contenido de los slides */}
      <div className="hidden lg:block absolute bottom-0 right-8 xl:right-16 w-80 h-full pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-full flex items-end">
          <img 
            src="/lovable-uploads/eddd69ef-b238-4ea9-bd8a-2fc3dc1aff1b.png"
            alt="Trainer silhouette" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
