
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
      title: "Transforma tu Vida",
      subtitle: "Con nutrición personalizada"
    },
    {
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Entrena con Propósito",
      subtitle: "Rutinas diseñadas para ti"
    },
    {
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Alcanza tus Objetivos",
      subtitle: "Con seguimiento profesional"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slides[currentSlide].image}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Diagonal Split Overlay */}
      <div className="absolute inset-0">
        {/* Left Side with Content */}
        <div className="absolute inset-0 diagonal-split bg-nutrition-green bg-opacity-90">
          <div className="flex items-center justify-start h-full pl-8 lg:pl-16">
            <div className="text-white max-w-lg">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
                José Antonio
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-nutrition-orange">
                Dietética y Entrenamiento
              </h2>
              <h3 className="text-xl md:text-2xl lg:text-3xl mb-6">
                {slides[currentSlide].title}
              </h3>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                {slides[currentSlide].subtitle}
              </p>
              <Button
                onClick={onStartQuestionnaire}
                className="bg-nutrition-orange hover:bg-nutrition-orange-dark text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Comenzar Evaluación
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="absolute inset-0 diagonal-split-right"></div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-200 z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-200 z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-nutrition-orange' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
