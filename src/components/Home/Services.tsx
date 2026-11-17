
import React from 'react';
import { Apple, Dumbbell, Users, Calendar, MessageCircle, BarChart3 } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const services = [
  {
    icon: Users,
    title: 'Gestión de Clientes',
    description: 'Fichas completas con valoración inicial, objetivos, historial y estado de suscripción.',
    features: ['Cuestionario de valoración', 'Ficha de cada cliente', 'Estado de pagos', 'Regalos y recursos']
  },
  {
    icon: Dumbbell,
    title: 'Entrenamientos',
    description: 'Crea rutinas con una biblioteca de ejercicios con vídeo, ejecución y errores comunes.',
    features: ['Biblioteca con vídeos', 'Filtros por grupo muscular', 'Rutinas en PDF', 'Niveles de dificultad']
  },
  {
    icon: Apple,
    title: 'Nutrición',
    description: 'Planes de alimentación con biblioteca de comidas, cantidades y calorías calculadas.',
    features: ['Biblioteca de comidas', 'Calorías por ración', 'Menús que varían cada semana', 'Etiquetas de dieta']
  },
  {
    icon: BarChart3,
    title: 'Seguimiento',
    description: 'Controla la evolución de cada cliente con hábitos, objetivos y progreso.',
    features: ['Seguimiento de hábitos', 'Objetivos', 'Evolución del cumplimiento', 'Calendario']
  },
  {
    icon: Calendar,
    title: 'Administración',
    description: 'Un panel para gestionar planes, contenidos, noticias, pagos y clientes.',
    features: ['Aprobación de planes', 'Gestión de pagos', 'Noticias y guías', 'Chat con clientes']
  },
  {
    icon: MessageCircle,
    title: 'Inteligencia Artificial',
    description: 'Asistente que atiende a tus clientes y genera borradores de dietas y rutinas.',
    features: ['Asistente virtual 24/7', 'Borradores automáticos', 'Revisión antes de publicar', 'Ahorro de tiempo']
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
    <section id="servicios" className="relative py-14 md:py-24 dark-section overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, hsla(var(--accent-green) / 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, hsla(var(--accent-green) / 0.04) 0%, transparent 50%)
        `
      }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <ScrollReveal direction="down">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Todo lo que <em className="heading-accent not-italic italic">necesitas</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Funcionalidades reales para gestionar tu negocio fitness de principio a fin.
            </p>
          </ScrollReveal>
        </div>

        {/* Service cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        </div>
    </section>
  );
};

export default Services;
