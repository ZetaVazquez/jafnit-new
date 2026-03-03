
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle, BarChart3, Target } from 'lucide-react';

interface HeroCarouselProps {
  onStartQuestionnaire: () => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ onStartQuestionnaire }) => {

  const handleScrollToPrograms = () => {
    const el = document.getElementById('programas');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden dark-section">
      {/* Background image with dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/lovable-uploads/36f5f0c3-e789-4843-b583-f8d9790e501d.png)`,
        }}
      >
        <div className="absolute inset-0 gradient-overlay-dark"></div>
      </div>

      {/* Subtle geometric accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="geometric-shape circle-shape w-64 h-64 -top-32 -left-32 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-48 h-48 bottom-20 right-10 animate-bounce-gentle"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 lg:pt-40 pb-16 min-h-screen flex flex-col justify-between">
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-1">
          {/* Left: Text content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05]">
                Mejora{' '}
                <em className="heading-accent not-italic font-bold italic">tu estructura</em>
                <br />
                y alcanza resultados reales
              </h1>
              <p className="text-lg lg:text-xl text-white/70 max-w-lg leading-relaxed">
                Evalúa en qué punto te encuentras para conocer el plan adecuado para ti.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button
                onClick={onStartQuestionnaire}
                className="btn-cta text-base px-8 py-4 rounded-lg"
              >
                Realizar Evaluación
              </Button>
              <button
                onClick={handleScrollToPrograms}
                className="text-white/70 hover:text-white font-medium flex items-center gap-1 transition-colors py-3"
              >
                Ver Programas <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4">
              <p className="text-white/50 text-sm font-medium">
                José Antonio Fernández · <span className="text-white/40">Coach Nutricional & Fitness</span>
              </p>
            </div>
          </div>

          {/* Right: Trainer image */}
          <div className="hidden lg:flex justify-end items-end relative">
            <img 
              src="/lovable-uploads/eddd69ef-b238-4ea9-bd8a-2fc3dc1aff1b.png"
              alt="José Antonio Fernández - Coach Nutricional" 
              className="h-[70vh] object-contain object-bottom drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Bottom: Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-8 lg:mt-0">
          {[
            {
              icon: CheckCircle,
              title: 'Análisis Personalizado',
              description: 'Evaluación completa de tu situación actual.'
            },
            {
              icon: Target,
              title: 'Planificación Estructurada',
              description: 'Programa adaptado a tu nivel y objetivo.'
            },
            {
              icon: BarChart3,
              title: 'Acompañamiento Profesional',
              description: 'Seguimiento y ajuste con criterio experto.'
            }
          ].map((feature, i) => (
            <div 
              key={i}
              className="glass-card-light p-5 lg:p-6 hover-lift cursor-default"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[hsl(var(--accent-green))]/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
