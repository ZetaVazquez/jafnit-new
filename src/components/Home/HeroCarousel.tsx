import React from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface HeroCarouselProps {
  onStartQuestionnaire?: () => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ onStartQuestionnaire }) => {
  const slides = [
    {
      id: 1,
      title: "Transforma Tu Vida con JAFNFIT",
      subtitle: "Planes Personalizados de Alimentación y Entrenamiento",
      description: "Descubre cómo puedes alcanzar tus objetivos de salud y bienestar con nuestros programas diseñados específicamente para ti.",
      image: "/lovable-uploads/eddd69ef-b238-4ea9-bd8a-2fc3dc1aff1b.png",
      buttonText: "¡Quiero Empezar Ya!"
    },
    {
      id: 2,
      title: "Alimentación Inteligente",
      subtitle: "Sin Dietas Restrictivas, Solo Resultados",
      description: "Aprende a comer de forma equilibrada y sostenible. Nuestros planes nutricionales se adaptan a tu estilo de vida y preferencias.",
      image: "/lovable-uploads/dd91a4d8-2d68-4ac4-b7e5-8ae097f1b833.png",
      buttonText: "Ver Planes Nutricionales"
    },
    {
      id: 3,
      title: "Entrenamiento Personalizado",
      subtitle: "Ejercítate Desde Casa o el Gimnasio",
      description: "Rutinas de ejercicio adaptadas a tu nivel y disponibilidad. Progresa a tu ritmo con el apoyo de un entrenador profesional.",
      image: "/lovable-uploads/4ecf9313-d7ff-45b8-9b65-f74a7d809a03.png",
      buttonText: "Crear Mi Rutina"
    }
  ];

  return (
    <section id="inicio" className="relative min-h-screen flex items-center">
      {/* Formas geométricas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculos grandes */}
        <div className="geometric-shape circle-shape w-32 h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        
        {/* Círculos medianos */}
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 left-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-18 h-18 top-2/3 left-1/6 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-14 h-14 bottom-1/2 left-3/4 animate-float"></div>
        
        {/* Triángulos */}
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up top-3/4 right-1/6 animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
                  <div className="text-center lg:text-left space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-nutrition-black leading-tight title-main">
                      {slide.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl text-nutrition-green font-semibold title-playful">
                      {slide.subtitle}
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                      {slide.description}
                    </p>
                    <Button 
                      onClick={onStartQuestionnaire}
                      className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {slide.buttonText}
                    </Button>
                  </div>
                  <div className="flex justify-center lg:justify-end">
                    <div className="relative">
                      <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-300">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default HeroCarousel;
