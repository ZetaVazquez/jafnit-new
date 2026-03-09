
import React from 'react';
import { Apple, Dumbbell, Users, Calendar, MessageCircle, BarChart3 } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const services = [
  {
    icon: Apple,
    title: 'Planes Nutricionales Personalizados',
    description: 'Diseñamos planes de alimentación adaptados a tus objetivos, preferencias y estilo de vida.',
    features: ['Análisis nutricional completo', 'Menús semanales', 'Lista de compras', 'Recetas saludables']
  },
  {
    icon: Dumbbell,
    title: 'Entrenamiento Personalizado',
    description: 'Rutinas de ejercicio complementarias a tu plan nutricional para maximizar resultados.',
    features: ['Rutinas adaptadas', 'Videos explicativos', 'Progress tracking', 'Ajustes semanales']
  },
  {
    icon: Users,
    title: 'Seguimiento Individualizado',
    description: 'Acompañamiento personalizado con revisiones regulares y ajustes según tu progreso.',
    features: ['Consultas regulares', 'Análisis de progreso', 'Ajustes del plan', 'Soporte continuo']
  },
  {
    icon: Calendar,
    title: 'Planificación de Comidas',
    description: 'Organización completa de tus comidas con horarios y preparación anticipada.',
    features: ['Calendario de comidas', 'Meal prep', 'Horarios optimizados', 'Preparación por lotes']
  },
  {
    icon: MessageCircle,
    title: 'Soporte 24/7',
    description: 'Comunicación directa con tu nutricionista para resolver dudas y mantenerte motivado.',
    features: ['Chat directo', 'Respuesta rápida', 'Motivación constante', 'Resolución de dudas']
  },
  {
    icon: BarChart3,
    title: 'Análisis de Progreso',
    description: 'Seguimiento detallado de tu evolución con métricas y gráficos personalizados.',
    features: ['Métricas corporales', 'Gráficos de progreso', 'Reportes mensuales', 'Análisis de tendencias']
  }
];

const ServiceCard: React.FC<{ service: typeof services[0]; index: number }> = ({ service, index }) => (
  <ScrollReveal direction="up" delay={index * 150}>
    <div className="glass-card-light p-6 lg:p-8 hover-lift h-full">
      <div className="flex items-start gap-4 mb-5">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[hsl(var(--accent-green))]/20 flex items-center justify-center">
          <service.icon className="w-6 h-6 text-[hsl(var(--accent-green-light))]" />
        </div>
        <h3 className="text-lg font-bold text-white leading-tight pt-1">{service.title}</h3>
      </div>
      <p className="text-white/60 text-sm leading-relaxed mb-5">
        {service.description}
      </p>
      <ul className="space-y-2">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center text-sm text-white/50">
            <div className="w-1.5 h-1.5 bg-[hsl(var(--accent-green))] rounded-full mr-3 flex-shrink-0"></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  </ScrollReveal>
);

const Services: React.FC = () => {
  return (
    <section id="servicios" className="relative py-24 dark-section overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, hsla(var(--accent-green) / 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, hsla(var(--accent-green) / 0.04) 0%, transparent 50%)
        `
      }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal direction="down">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nuestros <em className="heading-accent not-italic italic">Servicios</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Enfoque integral para tu bienestar, combinando nutrición, ejercicio y seguimiento personalizado.
            </p>
          </ScrollReveal>
        </div>

        {/* Service cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* CTA banner */}
        <ScrollReveal direction="up" delay={400}>
          <div className="mt-16 glass-card-light p-8 lg:p-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿Necesitas algo más <em className="heading-accent not-italic italic">específico</em>?
            </h3>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              Ofrecemos consultas personalizadas para necesidades específicas como nutrición deportiva,
              trastornos alimentarios, alergias e intolerancias, y mucho más.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Nutrición Deportiva', 'Pérdida de Peso', 'Ganancia Muscular', 'Alergias e Intolerancias'].map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-full text-sm font-medium bg-[hsl(var(--accent-green))]/15 text-[hsl(var(--accent-green-light))] border border-[hsl(var(--accent-green))]/25">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Communication Section */}
        <ScrollReveal direction="up" delay={300}>
          <div className="mt-16 glass-card-light overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
              {/* Text Content */}
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  💬 El diálogo constante es <em className="heading-accent not-italic italic">fundamental</em>
                </h3>
                <div className="space-y-4 text-white/60">
                  <p className="text-base leading-relaxed">
                    Mi objetivo es comprender tu situación de manera completa para ofrecerte la mejor orientación y apoyo.
                  </p>
                  <p className="text-base leading-relaxed text-white/80 font-medium">
                    La comunicación es esencial para personalizar y optimizar tu plan de forma efectiva.
                  </p>
                  <p className="text-base leading-relaxed">
                    Cualquier ajuste que necesites, <span className="text-[hsl(var(--accent-green-light))] font-bold">SIEMPRE</span> existe una alternativa y <span className="text-[hsl(var(--accent-green-light))] font-bold">SIEMPRE</span> encontramos la mejor solución para ti.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  {['Contáctame cuando lo necesites', 'Soporte y motivación diarios', 'Material educativo y recursos'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[hsl(var(--accent-green))] rounded-full"></div>
                      <span className="text-white/80 text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Phone Mockup */}
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative transform rotate-3">
                  <div className="relative w-64 h-[500px] bg-[hsl(var(--dark-surface))] rounded-[2.5rem] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[hsl(var(--dark-border))]">
                    <div className="w-full h-full bg-[hsl(var(--dark-bg))] rounded-[2rem] overflow-hidden relative">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center px-6 pt-3 pb-1 bg-[hsl(var(--dark-surface))]">
                        <span className="text-xs font-medium text-white/70">13:17</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-4 h-2 bg-white/50 rounded-sm"></div>
                        </div>
                      </div>

                      {/* WhatsApp Header */}
                      <div className="bg-[hsl(var(--accent-green))] p-3 flex items-center space-x-3">
                        <div className="w-9 h-9 bg-white/20 rounded-full"></div>
                        <div>
                          <h4 className="text-white font-semibold text-xs">JAFNFIT - José Antonio</h4>
                          <p className="text-white/70 text-[10px]">en línea</p>
                        </div>
                      </div>

                      {/* Chat Content */}
                      <div className="flex-1 p-3 space-y-2.5 bg-[hsl(var(--dark-bg))] h-full">
                        {[
                          { text: 'Hola, tenía que decírtelo... ¡Estoy flipando! 😍 me está encantando el menú.', time: '8:27' },
                          { text: 'Me preparé las tostadas que me indicaste, probé las combinaciones... ¡riquísimo!', time: '8:28' },
                          { text: '¡Bajé ya 2 kg sin darme cuenta! Gracias 🙏 💚', time: '8:29' },
                        ].map((msg, i) => (
                          <div key={i} className="bg-[hsl(var(--dark-surface))] p-2.5 rounded-lg max-w-[85%] border border-[hsl(var(--dark-border))]">
                            <p className="text-[10px] text-white/80 leading-relaxed">{msg.text}</p>
                            <p className="text-[9px] text-white/30 mt-1 text-right">{msg.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Services;
