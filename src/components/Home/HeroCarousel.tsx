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
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Deja de vivir en el cuerpo que ya no quieres y empieza a construir la versión más fuerte de ti mismo",
      subtitle: "Transforma tu físico y tu mentalidad con un plan que realmente funciona, diseñado específicamente para personas como tú que han intentado todo sin éxito. Sin dietas imposibles de seguir, sin entrenamientos de 3 horas que no puedes mantener. Solo resultados reales y duraderos que te harán sentir orgulloso cada vez que te mires al espejo."
    },
    {
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "¿Cansado de intentar y no conseguir resultados? Yo pasé por exactamente lo mismo que tú estás viviendo ahora",
      subtitle: "Yo estuve donde tú estás en este momento. Perdí 30 kilos sin destruir mi salud ni mi vida social, y lo más importante: sin volver a recuperar el peso perdido. Ahora ayudo a personas como tú a conseguir el cuerpo que merecen y la confianza que necesitan para vivir la vida que realmente quieren."
    },
    {
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "El problema no eres tú, no es tu fuerza de voluntad, no es tu genética. Es tu método y nadie te lo había explicado antes",
      subtitle: "Planes personalizados que se adaptan a tu vida real, no a la vida perfecta que no tienes. Nada de copiar y pegar rutinas de internet que no funcionan para ti. Tu cuerpo es único, tus objetivos son únicos, tu ritmo de vida es único, y por eso tu plan debe ser único también."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="home" className="relative h-[85vh] md:h-[90vh] overflow-hidden">
      {/* Background Carousel Images - Always visible but opacified */}
      <div className="absolute inset-0">
        <img
          src={slides[currentSlide].image}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        {/* Green overlay to opacify the background images */}
        <div className="absolute inset-0 bg-gradient-to-br from-nutrition-green/85 via-nutrition-green-emerald/80 to-nutrition-green-sage/75"></div>
      </div>

      {/* Diagonal Split Overlay - Hidden on screens smaller than 1110px */}
      <div className="absolute inset-0 hidden xl:[1110px]:block">
        {/* Left Side with Content */}
        <div className="absolute inset-0 diagonal-split bg-gradient-to-br from-nutrition-green/95 via-nutrition-green-emerald/90 to-nutrition-green-sage/85">
          <div className="flex items-center justify-start h-full pl-8 lg:pl-16">
            <div className="text-white max-w-2xl">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white/20">
                  <img 
                    src="/lovable-uploads/7a65475a-1feb-4fb7-b32f-5fae0d6019fd.png" 
                    alt="JAFNFIT Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white drop-shadow-lg">
                    JAFNFIT
                  </h1>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-yellow-300 drop-shadow-md">
                Dietética y Entrenamiento Personal
              </h2>
              <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-6 text-yellow-100 font-bold drop-shadow-md leading-tight">
                {slides[currentSlide].title}
              </h3>
              <p className="text-lg md:text-xl lg:text-2xl mb-10 text-yellow-100 font-medium drop-shadow-sm leading-relaxed max-w-xl">
                {slides[currentSlide].subtitle}
              </p>
              <Button
                onClick={onStartQuestionnaire}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-nutrition-green-darker px-10 py-5 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🎯 COMENZAR MI TRANSFORMACIÓN
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="absolute inset-0 diagonal-split-right"></div>
      </div>

      {/* Content for mobile/tablet - shown on screens smaller than 1110px */}
      <div className="absolute inset-0 xl:[1110px]:hidden flex items-center justify-center">
        <div className="text-white max-w-4xl text-center px-8">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white/20">
              <img 
                src="/lovable-uploads/7a65475a-1feb-4fb7-b32f-5fae0d6019fd.png" 
                alt="JAFNFIT Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-lg">
                JAFNFIT
              </h1>
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-300 drop-shadow-md">
            Dietética y Entrenamiento Personal
          </h2>
          <h3 className="text-lg md:text-xl lg:text-2xl mb-4 text-yellow-100 font-bold drop-shadow-md leading-tight">
            {slides[currentSlide].title}
          </h3>
          <p className="text-base md:text-lg mb-8 text-yellow-100 font-medium drop-shadow-sm leading-relaxed">
            {slides[currentSlide].subtitle}
          </p>
          <Button
            onClick={onStartQuestionnaire}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-nutrition-green-darker px-8 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            🎯 COMENZAR MI TRANSFORMACIÓN
          </Button>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on screens smaller than 1110px */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-200 z-10 hidden xl:[1110px]:block"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-200 z-10 hidden xl:[1110px]:block"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators - Hidden on screens smaller than 1110px */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 hidden xl:[1110px]:flex">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-yellow-400' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
