import React from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface PricingProps {
  onStartQuestionnaire: () => void;
  onOpenProgramModal?: (programId: string) => void;
}

const Pricing: React.FC<PricingProps> = () => (
  <section id="pricing" className="relative py-14 md:py-24 dark-section overflow-hidden">
    <div className="container mx-auto px-4 relative z-10">
      <ScrollReveal direction="up">
        <div className="glass-card-light p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Solicita una <em className="heading-accent not-italic italic">demostración</em>
          </h2>
          <p className="text-lg text-white/60 mb-8 leading-relaxed">
            Te enseñamos la plataforma en funcionamiento y cómo adaptarla a tu centro, consulta o servicio de entrenamiento.
          </p>
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-lg font-bold text-base transition-all duration-300 hover:-translate-y-0.5"
            style={{ backgroundColor: 'hsl(142, 71%, 45%)', color: '#ffffff' }}
          >
            Solicitar demo
          </button>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default Pricing;
