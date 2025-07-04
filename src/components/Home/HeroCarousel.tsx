
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
      image: "/lovable-uploads/192c284d-8bd6-439a-8232-72f7436198a5.png",
      title: "El problema no eres tú, no es tu fuerza de voluntad, no es tu genética. Es tu método y nadie te lo había explicado antes",
      subtitle: "Planes personalizados que se adaptan a tu vida real, no a la vida perfecta que no tienes. Nada de copiar y pegar rutinas de internet que no funcionan para ti. Tu cuerpo es único, tus objetivos son únicos, tu ritmo de vida es único, y por eso tu plan debe ser único también.",
      buttonText: "QUIERO COMENZAR MI TRANSFORMACION"
    },
    {
      image: "/lovable-uploads/216ce35e-6565-456f-939a-869be82c0695.png", 
      title: "Deja de vivir en el cuerpo que ya no quieres y empieza a construir la versión más fuerte de ti mismo",
      subtitle: "Transforma tu físico y tu mentalidad con un plan que realmente funciona, diseñado específicamente para personas como tú que han intentado todo sin éxito. Sin dietas imposibles de seguir, sin entrenamientos de 3 horas que no puedes mantener. Solo resultados reales y duraderos que te harán sentir orgulloso cada vez que te mires al espejo.",
      buttonText: "QUIERO COMENZAR MI TRANSFORMACION"
    },
    {
      image: "/lovable-uploads/bba1525e-dc69-41bb-acb5-238e1469290f.png",
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
    <section className="relative h-[75vh] lg:h-[80vh] overflow-hidden">
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
                <div className="text-white space-y-6 lg:space-y-8 pb-8 lg:pb-0">
                  <div className="space-y-4 lg:space-y-6">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-4 border-white/30 mx-auto lg:mx-0">
                      <img 
                        src="/lovable-uploads/7a65475a-1feb-4fb7-b32f-5fae0d6019fd.png" 
                        alt="JAFNFIT Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center lg:text-left">
                      <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold title-main mb-2 lg:mb-4 text-white">
                        JAFNFIT
                      </h1>
                      <p className="text-lg lg:text-xl text-yellow-300 font-medium">
                        Dietética y Entrenamiento Personal
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 lg:space-y-6 text-center lg:text-left">
                    <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold leading-tight text-white">
                      {slide.title}
                    </h2>
                    <p className="text-base lg:text-lg xl:text-xl text-white leading-relaxed max-w-2xl">
                      {slide.subtitle}
                    </p>
                  </div>

                  <div className="flex justify-center lg:justify-start">
                    <Button
                      onClick={onStartQuestionnaire}
                      size="lg"
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      {slide.buttonText}
                    </Button>
                  </div>
                </div>

                <div className="hidden lg:block relative h-full">
                  <div className="absolute bottom-0 right-0 w-80 h-full flex items-end">
                    <img 
                      src="/lovable-uploads/eddd69ef-b238-4ea9-bd8a-2fc3dc1aff1b.png"
                      alt="Trainer silhouette" 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

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
