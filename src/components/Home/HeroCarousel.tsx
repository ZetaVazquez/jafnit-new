
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
  onStartQuestionnaire: () => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ onStartQuestionnaire }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/lovable-uploads/7ef270ff-62f2-4ce7-a2cb-494f6e9f3218.png",
      title: "¿Cansado de intentar y no conseguir resultados? Yo pasé por exactamente lo mismo que tú estás viviendo ahora",
      subtitle: "Yo estuve donde tú estás en este momento. Perdí 30 kilos sin destruir mi salud ni mi vida social, y lo más importante: sin volver a recuperar el peso perdido. Ahora ayudo a personas como tú a conseguir el cuerpo que merecen y la confianza que necesitan para vivir la vida que realmente quieren.",
      buttonText: "🔥 COMENZAR MI TRANSFORMACIÓN"
    },
    {
      image: "/lovable-uploads/4ecf9313-d7ff-45b8-9b65-f74a7d809a03.png", 
      title: "Transforma tu cuerpo con un plan diseñado específicamente para ti",
      subtitle: "Nada de dietas extremas ni entrenamientos que no puedes mantener. Mi método se adapta a tu estilo de vida para que consigas resultados reales y duraderos.",
      buttonText: "✨ EMPEZAR AHORA"
    },
    {
      image: "/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png",
      title: "Únete a cientos de personas que ya han transformado su vida",
      subtitle: "No estás solo en este proceso. Te acompaño paso a paso para que consigas el cuerpo que quieres y, más importante, para que mantengas los resultados para siempre.",
      buttonText: "🚀 QUIERO EMPEZAR"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
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
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh] lg:min-h-[80vh]">
                <div className="text-white space-y-6 lg:space-y-8">
                  <div className="space-y-4 lg:space-y-6 mt-4 lg:mt-8">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-4 border-white/30 mx-auto lg:mx-0">
                      <img 
                        src="/lovable-uploads/7a65475a-1feb-4fb7-b32f-5fae0d6019fd.png" 
                        alt="JAFNFIT Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center lg:text-left">
                      <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold title-main mb-2 lg:mb-4">
                        JAFNFIT
                      </h1>
                      <p className="text-lg lg:text-xl text-white/90 font-medium">
                        Dietética y Entrenamiento Personal
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 lg:space-y-6 text-center lg:text-left">
                    <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-base lg:text-lg xl:text-xl text-white/90 leading-relaxed max-w-2xl">
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

                <div className="hidden lg:block">
                  {/* Space for image - content is in background */}
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
