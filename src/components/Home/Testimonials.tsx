import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialsProps {
  onStartQuestionnaire: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onStartQuestionnaire }) => {
  const testimonialSections = [
    {
      title: "ES MÁS FÁCIL CONSEGUIRLO CUANDO TE GUSTA LO QUE COMES 💪🍴",
      testimonials: [
        {
          id: '1',
          name: '📱 Laura, 38 años',
          comment: 'Hola, tenía que decírtelo… ¡Estoy flipando! 😍 Me está encantando el menú, por fin como bien sin sentir que estoy a dieta. Me preparaste las tostadas que me indicaste y probé las combinaciones de platos y el boniato… ¡riquísimo y no paso hambre! ¡Desde la ultima vez bajé ya 2 kg sin darme cuenta! Gracias 🙏💚',
          rating: 5
        },
        {
          id: '2',
          name: '📱 Marta, 29 años',
          comment: 'Si, nunca pensé que me gustaría seguir un plan nutricional 😅 Me siento con energía, no me da ansiedad comer y encima tengo opciones. ¡Lo de la lista de equivalencias es una salvación! Gracias por hacerlo todo tan fácil. Esto por fin encaja conmigo 💪🥑',
          rating: 5
        },
        {
          id: '3',
          name: '📱 David, 45 años',
          comment: 'Hola, muy buenas Jose, gracias por tu interés. Estoy comiendo mejor que nunca y sin rayarme 🤯 Pensé que definir era comer arroz y pollo, pero con este plan estoy disfrutando cada comida. Ya me noto más delgado, mantengo la fuerza en el gym y no me aburro. ¡Esto es otro nivel! 👌🔥',
          rating: 5
        }
      ]
    },
    {
      title: "NO IMPORTA SI NUNCA HAS PISADO UN GIMNASIO 🏋️‍♂️",
      testimonials: [
        {
          id: '4',
          name: '📱 Nerea, 34 años | Nunca había entrenado',
          comment: 'Jose, no sabes la seguridad que me está dando esto 😭 Pensé que iba a sentirme torpe o perdida, pero los vídeos y tu guía me lo están poniendo muy fácil. ¡Es la primera vez que entreno con ganas! Y me siento más fuerte cada semana. Gracias 💪❤️',
          rating: 5
        },
        {
          id: '5',
          name: '📱 Carlos, 41 años | Empezando desde cero en casa',
          comment: 'Lo llevo genial meu, brutal la rutina, pensé que tendría que meterme al gym y hacer cosas raras… y resulta que estoy entrenando en casa y noto el cambio ya. Todo claro, todo explicado y sin agobios. ¡Esto sí que es para gente real! 🔥🏠',
          rating: 5
        },
        {
          id: '6',
          name: '📱 Elena, 27 años | Miedo a entrenar sola',
          comment: 'Jose, tenía miedo de empezar porque nunca hice fuerza y no sabía si lo haría bien. Pero me explicaste todo paso a paso, y con los vídeos lo entiendo perfecto. ¡Ahora entreno con confianza! Y hasta corrijo posturas que hacía mal antes. Mil gracias 🙌🏋️‍♀️',
          rating: 5
        }
      ]
    },
    {
      title: "SIN COMUNICACIÓN, NO HAY RESULTADOS 📲💬",
      testimonials: [
        {
          id: '7',
          name: '📱 Ana, 32 años | Objetivo: pérdida de peso con apoyo constante',
          comment: 'Jose, gracias por estar tan pendiente siempre 🙏 Nunca antes sentí que alguien me acompañara así en un plan. Cuando me atasqué, me diste opciones sin juzgarme y eso me hizo seguir. Me estoy cuidando de verdad, y no me siento sola en el proceso 💚',
          rating: 5
        },
        {
          id: '8',
          name: '📱 Pablo, 37 años | Objetivo: crear hábitos sostenibles con apoyo real',
          comment: 'Lo que más valoro es poder escribirte cuando algo no va bien y que me respondas con soluciones reales, sin rollos. Siento que esto va más allá del típico menú o rutina. Gracias por ajustar el plan cuando lo necesito, eso marca la diferencia 🔁📲',
          rating: 5
        },
        {
          id: '9',
          name: '📱 Lucía, 40 años | Objetivo: ganar energía y recuperar motivación',
          comment: '¡Jose! Solo decirte que este seguimiento lo cambia todo. Me siento escuchada, me das ideas cuando me saturo y no tengo que fingir que todo va bien. Cada semana noto que avanzamos juntos. Es la primera vez que siento que esto es para mí ❤️💬',
          rating: 5
        }
      ]
    },
    {
      title: "EL CAMBIO NO ES TEMPORAL, ES SOSTENIBLE 🧠📈",
      testimonials: [
        {
          id: '10',
          name: '📱 Sergio, 36 años | Objetivo: perder peso y mantenerlo',
          comment: 'Jose, por fin siento que esto no es una carrera de fondo con fecha de caducidad. Antes bajaba rápido y luego volvía a subir, siempre lo mismo. Ahora entiendo lo que hago, me veo mejor y sobre todo: me mantengo. Gracias por enseñarme a hacerlo bien y sin obsesiones 🙌📈',
          rating: 5
        },
        {
          id: '11',
          name: '📱 Cristina, 31 años | Objetivo: dejar el "todo o nada" y disfrutar el proceso',
          comment: 'Estoy feliz porque esta vez no tiré la toalla en vacaciones 😭 Me ayudaste a adaptarlo sin agobios y eso lo cambió todo. Estoy aprendiendo a cuidarme sin castigarme y eso no lo había logrado nunca. Gracias de corazón 💛🌿',
          rating: 5
        },
        {
          id: '12',
          name: '📱 Luis, 43 años | Objetivo: hábitos duraderos sin efecto rebote',
          comment: 'Tío, esta forma de trabajar me ha cambiado la cabeza. No es solo el físico, es la calma que siento comiendo bien, entrenando sin matarme y viendo que avanzo poco a poco. Esto ya es parte de mi vida, y se nota. Gracias por tanto 💥🧠',
          rating: 5
        }
      ]
    }
  ];

  return (
    <section id="testimonios" className="py-16 bg-gradient-to-br from-nutrition-green-lighter via-white to-nutrition-accent-light relative overflow-hidden">
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
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4 md:mb-6 title-main">
            Opiniones de Nuestros Clientes
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre lo que dicen las personas que han transformado su vida con nosotros
          </p>
        </div>

        {/* Render each testimonial section */}
        {testimonialSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-16 md:mb-20">
            {/* Section Title - Made smaller */}
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-nutrition-green mb-4 title-playful">
                {section.title}
              </h3>
            </div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {section.testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-nutrition-green-light hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div>
                      <h4 className="font-bold text-nutrition-black text-sm md:text-base title-playful mb-2">{testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current text-nutrition-green" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-nutrition-green-dark text-sm md:text-base leading-relaxed">"{testimonial.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
