
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface PricingProps {
  onStartQuestionnaire: () => void;
  onOpenProgramModal?: (programId: string) => void;
}

const plans = [
  {
    id: 'explorador',
    name: 'Explorador',
    tagline: 'Persona que empieza y necesita orden',
    price: '29',
    duration: 'Pago único',
    highlighted: false,
    features: [
      'Base estructural',
      '7 días',
      'Guía base de alimentación',
      'Orientación general',
      'Sin seguimiento',
    ],
    stripeUrl: 'https://buy.stripe.com/28EcN62DHgtIgxtfE46wE00',
  },
  {
    id: 'constructor',
    name: 'Constructor',
    tagline: 'Persona decidida que quiere aplicar método',
    price: '99',
    duration: '/mes',
    highlighted: true,
    features: [
      'Planificación estructurada',
      'Nivel medio',
      'Plan nutricional adaptado',
      'Rutina progresiva',
      'Evaluación y ajuste 1 a 1',
    ],
    stripeUrl: 'https://buy.stripe.com/7sYdRa7Y13GW9513Vm6wE01',
  },
  {
    id: 'estratega',
    name: 'Estratega',
    tagline: 'Comprometida que busca transformación real',
    price: '297',
    duration: '/mes',
    highlighted: false,
    features: [
      'Acompañamiento completo y continuo',
      '12 semanas (90 días)',
      'Plan completo y personalizable',
      'Plan completo, personalizado y progresión',
      'Evaluaciones periódicas y ajustes estratégicos',
    ],
    stripeUrl: 'https://buy.stripe.com/6oUbJ21zDfpE0yvbnO6wE02',
  },
];

const differentiators = {
  left: [
    { text: 'La diferencia no está en el marketing.', bold: true },
    { text: 'El nivel de personalización', bold: false },
    { text: 'El grado de seguimiento', bold: false },
  ],
  right: [
    { text: 'La profundidad del diagnóstico', bold: false },
    { text: 'El nivel de personalización', bold: false },
    { text: 'El grado de seguimiento', bold: false },
    { text: 'La frecuencia de ajustes estratégicos', bold: false },
  ],
};

const Pricing: React.FC<PricingProps> = ({ onStartQuestionnaire, onOpenProgramModal }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (!user) {
      onStartQuestionnaire();
      return;
    }
    if (plan.stripeUrl) {
      window.open(plan.stripeUrl, '_blank');
      toast({
        title: 'Redirigiendo a Stripe',
        description: 'Te hemos redirigido a la página de pago segura.',
      });
    }
  };

  return (
    <section id="pricing" className="py-20 dark-section relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal direction="down">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Elige el{' '}
              <em className="heading-accent not-italic font-bold italic">nivel adecuado</em>{' '}
              según tu momento
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              No todos necesitan el mismo grado de <strong className="text-white/80">acompañamiento</strong>, por eso este sistema está organizado en{' '}
              <strong className="text-white/80">tres niveles progresivos</strong>, según tu punto actual y tu nivel de compromiso.
            </p>
          </ScrollReveal>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <ScrollReveal key={plan.id} direction="up" delay={index * 150}>
              <div
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                  plan.highlighted
                    ? 'glass-card ring-2 ring-accent/50 shadow-lg shadow-accent/10'
                    : 'glass-card-light'
                }`}
              >
                {/* Badge */}
                {plan.highlighted ? (
                  <div className="text-center py-3 bg-[hsl(45,100%,51%)] text-[hsl(220,20%,10%)]">
                    <span className="text-lg font-black uppercase tracking-wider">⭐ POPULAR</span>
                  </div>
                ) : (
                  <div className="text-center py-2 bg-[hsla(0,0%,100%,0.05)] text-[hsla(0,0%,100%,0.5)] text-xs font-bold uppercase tracking-widest">
                    {plan.name.toUpperCase()}
                  </div>
                )}

                <div className="p-6 lg:p-8">
                  <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-white/50 mb-6">{plan.tagline}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}€</span>
                    <span className="text-white/40 text-sm">{plan.duration}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? 'btn-cta'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    Saber más sobre {plan.name} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Differentiators */}
        <ScrollReveal direction="up" delay={300}>
          <div className="glass-card-light rounded-2xl p-8 lg:p-12 max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Qué cambia <em className="heading-accent not-italic font-bold italic">realmente</em> entre niveles
            </h3>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <ul className="space-y-3">
                {differentiators.left.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-white/40 mt-2 flex-shrink-0" />
                    <span className={`text-sm ${item.bold ? 'text-white font-semibold' : 'text-white/60'}`}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {differentiators.right.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/70">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
              <p className="text-sm text-white/50">
                No elijas por precio. Elige por nivel de estructura. Si no sabes cuál es el adecuado, empieza por la{' '}
                <strong className="text-white/80">Evaluación Inicial</strong>.
              </p>
              <Button onClick={onStartQuestionnaire} className="btn-cta px-6 py-3 rounded-lg whitespace-nowrap">
                Solicitar Evaluación Inicial
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Pricing;
