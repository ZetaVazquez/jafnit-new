
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TestimonialsModal from './TestimonialsModal';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { supabase } from '@/integrations/supabase/client';

interface TestimonialsProps {
  onStartQuestionnaire: () => void;
}

interface DatabaseTestimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  status: string;
  created_at: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onStartQuestionnaire }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvedTestimonials, setApprovedTestimonials] = useState<DatabaseTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultTestimonials: DatabaseTestimonial[] = [
    {
      id: '1',
      name: '📱 Laura, 38 años',
      comment: 'Hola, tenía que decírtelo… ¡Estoy flipando! 😍 Me está encantando el menú, por fin como bien sin sentir que estoy a dieta. Me preparaste las tostadas que me indicaste y probé las combinaciones de platos y el boniato… ¡riquísimo y no paso hambre! ¡Desde la ultima vez bajé ya 2 kg sin darme cuenta! Gracias 🙏💚',
      rating: 5, status: 'approved', created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: '📱 Marta, 29 años',
      comment: 'Si, nunca pensé que me gustaría seguir un plan nutricional 😅 Me siento con energía, no me da ansiedad comer y encima tengo opciones. ¡Lo de la lista de equivalencias es una salvación! Gracias por hacerlo todo tan fácil. Esto por fin encaja conmigo 💪🥑',
      rating: 5, status: 'approved', created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: '📱 David, 45 años',
      comment: 'Hola, muy buenas Jose, gracias por tu interés. Estoy comiendo mejor que nunca y sin rayarme 🤯 Pensé que definir era comer arroz y pollo, pero con este plan estoy disfrutando cada comida. Ya me noto más delgado, mantengo la fuerza en el gym y no me aburro. ¡Esto es otro nivel! 👌🔥',
      rating: 5, status: 'approved', created_at: new Date().toISOString()
    },
    {
      id: '4',
      name: '📱 Nerea, 34 años',
      comment: 'Jose, no sabes la seguridad que me está dando esto 😭 Pensé que iba a sentirme torpe o perdida, pero los vídeos y tu guía me lo están poniendo muy fácil. ¡Es la primera vez que entreno con ganas! Y me siento más fuerte cada semana. Gracias 💪❤️',
      rating: 5, status: 'approved', created_at: new Date().toISOString()
    }
  ];

  const testimonialSections = [
    {
      title: "ES MÁS FÁCIL CONSEGUIRLO CUANDO TE GUSTA LO QUE COMES 💪🍴",
      testimonials: [
        { id: 'modal1', name: '📱 Laura, 38 años', comment: 'Hola, tenía que decírtelo… ¡Estoy flipando! 😍 Me está encantando el menú, por fin como bien sin sentir que estoy a dieta. Me preparaste las tostadas que me indicaste y probé las combinaciones de platos y el boniato… ¡riquísimo y no paso hambre! ¡Desde la ultima vez bajé ya 2 kg sin darme cuenta! Gracias 🙏💚', rating: 5 },
        { id: 'modal2', name: '📱 Marta, 29 años', comment: 'Si, nunca pensé que me gustaría seguir un plan nutricional 😅 Me siento con energía, no me da ansiedad comer y encima tengo opciones. ¡Lo de la lista de equivalencias es una salvación! Gracias por hacerlo todo tan fácil. Esto por fin encaja conmigo 💪🥑', rating: 5 },
        { id: 'modal3', name: '📱 David, 45 años', comment: 'Hola, muy buenas Jose, gracias por tu interés. Estoy comiendo mejor que nunca y sin rayarme 🤯 Pensé que definir era comer arroz y pollo, pero con este plan estoy disfrutiendo cada comida. Ya me noto más delgado, mantengo la fuerza en el gym y no me aburro. ¡Esto es otro nivel! 👌🔥', rating: 5 }
      ]
    },
    {
      title: "NO IMPORTA SI NUNCA HAS PISADO UN GIMNASIO 🏋️‍♂️",
      testimonials: [
        { id: 'modal4', name: '📱 Nerea, 34 años | Nunca había entrenado', comment: 'Jose, no sabes la seguridad que me está dando esto 😭 Pensé que iba a sentirme torpe o perdida, pero los vídeos y tu guía me lo están poniendo muy fácil. ¡Es la primera vez que entreno con ganas! Y me siento más fuerte cada semana. Gracias 💪❤️', rating: 5 },
        { id: 'modal5', name: '📱 Carlos, 41 años | Empezando desde cero en casa', comment: 'Lo llevo genial meu, brutal la rutina, pensé que tendría que meterme al gym y hacer cosas raras… y resulta que estoy entrenando en casa y noto el cambio ya. Todo claro, todo explicado y sin agobios. ¡Esto sí que es para gente real! 🔥🏠', rating: 5 },
        { id: 'modal6', name: '📱 Elena, 27 años | Miedo a entrenar sola', comment: 'Jose, tenía miedo de empezar porque nunca hice fuerza y no sabía si lo haría bien. Pero me explicaste todo paso a paso, y con los vídeos lo entiendo perfecto. ¡Ahora entreno con confianza! Y hasta corrijo posturas que hacía mal antes. Mil gracias 🙌🏋️‍♀️', rating: 5 }
      ]
    },
    {
      title: "SIN COMUNICACIÓN, NO HAY RESULTADOS 📲💬",
      testimonials: [
        { id: 'modal7', name: '📱 Ana, 32 años', comment: 'Jose, gracias por estar tan pendiente siempre 🙏 Nunca antes sentí que alguien me acompañara así en un plan. Cuando me atasqué, me diste opciones sin juzgarme y eso me hizo seguir. Me estoy cuidando de verdad, y no me siento sola en el proceso 💚', rating: 5 },
        { id: 'modal8', name: '📱 Pablo, 37 años', comment: 'Lo que más valoro es poder escribirte cuando algo no va bien y que me respondas con soluciones reales, sin rollos. Siento que esto va más allá del típico menú o rutina. Gracias por ajustar el plan cuando lo necesito, eso marca la diferencia 🔁📲', rating: 5 },
        { id: 'modal9', name: '📱 Lucía, 40 años', comment: '¡Jose! Solo decirte que este seguimiento lo cambia todo. Me siento escuchada, me das ideas cuando me saturo y no tengo que fingir que todo va bien. Cada semana noto que avanzamos juntos. Es la primera vez que siento que esto es para mí ❤️💬', rating: 5 }
      ]
    },
    {
      title: "EL CAMBIO NO ES TEMPORAL, ES SOSTENIBLE 🧠📈",
      testimonials: [
        { id: 'modal10', name: '📱 Sergio, 36 años', comment: 'Jose, por fin siento que esto no es una carrera de fondo con fecha de caducidad. Antes bajaba rápido y luego volvía a subir, siempre lo mismo. Ahora entiendo lo que hago, me veo mejor y sobre todo: me mantengo. Gracias por enseñarme a hacerlo bien y sin obsesiones 🙌📈', rating: 5 },
        { id: 'modal11', name: '📱 Cristina, 31 años', comment: 'Estoy feliz porque esta vez no tiré la toalla en vacaciones 😭 Me ayudaste a adaptarlo sin agobios y eso lo cambió todo. Estoy aprendiendo a cuidarme sin castigarme y eso no lo había logrado nunca. Gracias de corazón 💛🌿', rating: 5 },
        { id: 'modal12', name: '📱 Luis, 43 años', comment: 'Tío, esta forma de trabajar me ha cambiado la cabeza. No es solo el físico, es la calma que siento comiendo bien, entrenando sin matarme y viendo que avanzo poco a poco. Esto ya es parte de mi vida, y se nota. Gracias por tanto 💥🧠', rating: 5 }
      ]
    }
  ];

  useEffect(() => {
    fetchApprovedTestimonials();
  }, []);

  const fetchApprovedTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('user_testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching testimonials:', error);
        setApprovedTestimonials(defaultTestimonials);
      } else {
        setApprovedTestimonials(data && data.length > 0 ? data : defaultTestimonials);
      }
    } catch (error) {
      console.error('Error:', error);
      setApprovedTestimonials(defaultTestimonials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="testimonios" className="relative py-24 dark-section overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(circle at 30% 20%, hsla(var(--accent-green) / 0.05) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, hsla(var(--accent-green) / 0.04) 0%, transparent 50%)
        `
      }}></div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal direction="down">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Opiniones de Nuestros <em className="heading-accent not-italic italic">Clientes</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Descubre lo que dicen las personas que han transformado su vida con nosotros
            </p>
          </ScrollReveal>
        </div>

        {/* Testimonial cards */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="glass-card-light p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded mb-4 w-2/3"></div>
                <div className="h-20 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {approvedTestimonials.slice(0, 4).map((testimonial, index) => (
              <ScrollReveal key={testimonial.id} direction="up" delay={index * 150}>
                <div className="glass-card-light p-6 hover-lift h-full">
                  <div className="mb-4">
                    <h4 className="font-bold text-white text-sm mb-2">{testimonial.name}</h4>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[hsl(var(--accent-green-light))] text-[hsl(var(--accent-green-light))]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">"{testimonial.comment}"</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* More button */}
        <ScrollReveal direction="up" delay={600}>
          <div className="text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-cta text-sm px-8 py-3 rounded-lg"
            >
              MÁS COMENTARIOS
            </button>
          </div>
        </ScrollReveal>
      </div>

      <TestimonialsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        testimonialSections={testimonialSections}
      />
    </section>
  );
};

export default Testimonials;
