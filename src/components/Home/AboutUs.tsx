
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Lock, Target, Brain, Trophy, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface AboutUsProps {
  onQuestionnaireOpen?: () => void;
  onOpenAboutDetail?: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onQuestionnaireOpen, onOpenAboutDetail }) => {
  return (
    <section id="sobre-mi" className="py-20 dark-section relative overflow-hidden">
      {/* Subtle radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[hsla(var(--accent-green)/0.05)] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[hsla(var(--accent-green)/0.04)] blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <ScrollReveal direction="down">
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--text-primary))] mb-2">
              Sobre <em className="heading-accent not-italic font-bold italic">Mí</em>
            </h2>
            <div className="w-20 h-1 bg-[hsl(var(--accent-green))] rounded-full" />
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <p className="text-lg text-[hsl(var(--text-secondary))] max-w-3xl mb-16">
            Soy <strong className="text-[hsl(var(--text-primary))]">José Antonio Figueiras Núñez</strong>, el coach que te ayudará
            a encontrar la estrategia adecuada.
          </p>
        </ScrollReveal>

        {/* Main about card + quote */}
        <div className="grid lg:grid-cols-2 gap-10 mb-20">
          {/* About Card */}
          <ScrollReveal direction="left" delay={200}>
            <div className="glass-card-light p-8">
              <h3 className="text-xl font-bold text-[hsl(var(--text-primary))] mb-2">Acerca de mí</h3>
              <p className="text-sm text-[hsl(var(--text-secondary))] mb-6">
                <strong className="text-[hsl(var(--text-primary))]">Coach nutricional y deportivo</strong> especializado en llevar a las personas a su siguiente nivel.
              </p>

              {/* Name card */}
              <div className="bg-[hsla(var(--accent-green)/0.1)] border border-[hsla(var(--accent-green)/0.3)] rounded-xl p-4 mb-6">
                <p className="font-bold text-[hsl(var(--text-primary))] text-lg">José Antonio Figueiras Núñez</p>
                <p className="text-sm text-[hsl(var(--accent-green-light))]">Coach Nutricional & Fitness</p>
              </div>

              {/* Credentials */}
              <ul className="space-y-3 mb-6">
                {[
                  '+3 años de experiencia en el sector',
                  'Más de 5.000 horas impartiendo formación',
                  '100+ clientes y atletas asesorados',
                  'Creador del Método JAFN',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[hsl(var(--text-secondary))]">
                      <strong className="text-[hsl(var(--text-primary))]">{item.split(' ')[0]}</strong> {item.split(' ').slice(1).join(' ')}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-xs text-[hsl(var(--text-secondary))] opacity-70">
                <Lock className="w-3.5 h-3.5" />
                Datos 100% confidenciales
              </div>
            </div>
          </ScrollReveal>

          {/* Quote card */}
          <ScrollReveal direction="right" delay={300}>
            <div className="flex flex-col justify-center h-full">
              <div className="mb-6">
                <p className="font-bold text-[hsl(var(--text-primary))] text-xl">José Antonio Figueiras Núñez</p>
                <p className="text-sm text-[hsl(var(--accent-green-light))]">Coach Nutricional & Fitness</p>
              </div>
              <blockquote className="text-xl md:text-2xl italic text-[hsl(var(--text-secondary))] leading-relaxed border-l-4 border-[hsl(var(--accent-green))] pl-6">
                "Te ayudaré a encontrar la estrategia adecuada, partiendo de tu nivel actual y enfocando el plan a tu medida para lograr resultados."
              </blockquote>
            </div>
          </ScrollReveal>
        </div>

        {/* Trajectory Section */}
        <ScrollReveal direction="down" delay={200}>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-[hsl(var(--text-primary))]">
              Cómo ha ido evolucionando mi{' '}
              <em className="heading-accent not-italic font-bold italic">trayectoria</em>
            </h3>
          </div>
        </ScrollReveal>

        {/* 3 Pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: 'Estrategia', desc: 'Enfocaremos el progreso como un estratega.' },
            { icon: Brain, title: 'Mentalidad', desc: 'Trabajaremos de manera integral física y mentalmente.' },
            { icon: Trophy, title: 'Resultado', desc: 'El objetivo es mejorar tu calidad de vida y rendimiento.' },
          ].map((pillar, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 150}>
              <div className="glass-card-light p-6 text-center hover:scale-[1.02] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[hsla(var(--accent-green)/0.15)] flex items-center justify-center mx-auto mb-4">
                  <pillar.icon className="w-6 h-6 text-[hsl(var(--accent-green-light))]" />
                </div>
                <h4 className="font-bold text-[hsl(var(--text-primary))] text-lg mb-2">{pillar.title}</h4>
                <p className="text-sm text-[hsl(var(--text-secondary))]">{pillar.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Timeline */}
        <ScrollReveal direction="up" delay={200}>
          <div className="glass-card-light p-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Horizontal line on desktop */}
              <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[hsl(var(--accent-green))] via-[hsla(var(--accent-green)/0.5)] to-[hsl(var(--accent-green))]" />

              {[
                { year: '2018', title: 'Mis inicios', desc: 'Primeros pasos en nutrición y entrenamiento' },
                { year: '2020', title: 'Formación intensiva', desc: 'Máster y especialización profesional' },
                { year: '2023', title: 'Método JAFN', desc: 'Creación del sistema estructurado' },
                { year: '2026', title: 'Consolidación', desc: 'Método probado con cientos de clientes' },
              ].map((item, i) => (
                <div key={i} className="text-center relative">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--accent-green))] text-[hsl(var(--dark-bg))] font-bold text-xs flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg shadow-[hsla(var(--accent-green)/0.3)]">
                    {item.year}
                  </div>
                  <h5 className="font-bold text-[hsl(var(--text-primary))] mb-1">{item.title}</h5>
                  <p className="text-xs text-[hsl(var(--text-secondary))]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Know more button + Final CTA */}
        <ScrollReveal direction="up" delay={300}>
          <div className="text-center max-w-3xl mx-auto">
            <blockquote className="text-lg md:text-xl italic text-[hsl(var(--text-secondary))] mb-8 leading-relaxed">
              "Voy a ayudarte a construir la disciplina y la estrategia que necesitas para lograr el resultado más ambicioso que puedas imaginar."
            </blockquote>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={onQuestionnaireOpen}
                className="btn-cta text-base px-10 py-4"
              >
                Realizar Evaluación
              </Button>
              <Button
                onClick={onOpenAboutDetail}
                variant="outline"
                className="text-base px-8 py-4 border-[hsl(var(--accent-green))]/50 text-[hsl(var(--accent-green-light))] hover:bg-[hsla(var(--accent-green)/0.1)]"
              >
                Conocer más sobre mí <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { value: '100+', label: 'Clientes Asesorados' },
            { value: '+3', label: 'Años de Experiencia' },
            { value: '100%', label: 'Compromiso Personal' },
            { value: '5000+', label: 'Horas de Formación' },
          ].map((stat, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 100}>
              <div className="glass-card-light p-5 text-center">
                <div className="text-2xl md:text-3xl font-bold text-[hsl(var(--accent-green-light))]">{stat.value}</div>
                <div className="text-xs text-[hsl(var(--text-secondary))] mt-1">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
