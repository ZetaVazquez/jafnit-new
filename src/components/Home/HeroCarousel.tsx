
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroCarouselProps {
  onStartQuestionnaire: () => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ onStartQuestionnaire }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Transforma tu Vida',
      subtitle: 'Nutrición y entrenamiento personalizado'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Alcanza tus Metas',
      subtitle: 'Con el mejor seguimiento profesional'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Alimentación Saludable',
      subtitle: 'Planes nutricionales adaptados a ti'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Carousel Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Right side - Image with diagonal cut */}
            <div className="absolute inset-0 diagonal-split-right">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30" />
            </div>
          </div>
        ))}
      </div>

      {/* Left side - Content with diagonal cut and gradient */}
      <div className="absolute inset-0 diagonal-split gradient-overlay">
        <div className="flex items-center justify-center h-full px-8">
          <div className="text-center text-white max-w-lg">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              José Antonio
            </h1>
            <h2 className="text-2xl md:text-3xl font-light mb-2 animate-fade-in">
              Dietética y Entrenamiento
            </h2>
            <p className="text-xl mb-8 opacity-90 animate-fade-in">
              {slides[currentSlide].subtitle}
            </p>
            <Button
              onClick={onStartQuestionnaire}
              size="lg"
              className="bg-nutrition-orange hover:bg-nutrition-orange-dark text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Comienza tu Transformación
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
