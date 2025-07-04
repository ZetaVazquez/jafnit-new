
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  onStartQuestionnaire: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onStartQuestionnaire }) => {
  const testimonials = [
    {
      name: "María García",
      role: "Oficinista, 32 años",
      content: "Perdí 15 kg en 6 meses siguiendo el plan personalizado. Lo mejor es que aprendí a comer bien sin renunciar a los sabores que me gustan.",
      rating: 5,
      image: "/lovable-uploads/7a65475a-1feb-4fb7-b32f-5fae0d6019fd.png"
    },
    {
      name: "Carlos Rodríguez",
      role: "Ingeniero, 28 años",
      content: "El seguimiento personalizado hizo toda la diferencia. Nunca pensé que podría mantener una rutina de ejercicio tan constante.",
      rating: 5,
      image: "/lovable-uploads/4ecf9313-d7ff-45b8-9b65-f74a7d809a03.png"
    },
    {
      name: "Ana López",
      role: "Madre de familia, 35 años",
      content: "Conseguí equilibrar mi alimentación con el tiempo limitado que tengo. Los menús son prácticos y deliciosos.",
      rating: 5,
      image: "/lovable-uploads/a0cdee08-42e1-4aef-b245-e58ac85bf290.png"
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-gradient-to-br from-white to-nutrition-green-light/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title text-nutrition-black mb-4">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-xl text-nutrition-gray max-w-2xl mx-auto">
            Historias reales de transformación y éxito
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-nutrition-green-light relative"
            >
              <Quote className="w-8 h-8 text-nutrition-green opacity-50 mb-4" />
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-nutrition-gray mb-6 italic leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-nutrition-black title-playful">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-nutrition-gray">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-nutrition-gray mb-6 text-lg">
            ¿Listo para escribir tu propia historia de éxito?
          </p>
          <Button 
            onClick={onStartQuestionnaire}
            size="lg"
            className="bg-nutrition-accent hover:bg-nutrition-accent-dark text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Comenzar Mi Transformación
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
