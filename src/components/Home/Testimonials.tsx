
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Testimonial } from '@/types';

interface TestimonialsProps {
  onStartQuestionnaire: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onStartQuestionnaire }) => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'María González',
      comment: 'José Antonio me ayudó a transformar completamente mi estilo de vida. En 6 meses perdí 15 kilos y gané mucha confianza.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      comment: 'El plan personalizado de entrenamiento y nutrición superó todas mis expectativas. Recomiendo 100% sus servicios.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '3',
      name: 'Ana Martín',
      comment: 'Profesional, dedicado y con resultados reales. Mi salud y energía mejoraron significativamente.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '4',
      name: 'David López',
      comment: 'La mejor inversión que he hecho en mi salud. El seguimiento personalizado marca la diferencia.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4">
            Opiniones de Nuestros Clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre lo que dicen las personas que han transformado su vida con nosotros
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="comic-bubble">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-nutrition-black">{testimonial.name}</h4>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-nutrition-orange" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={onStartQuestionnaire}
            className="bg-nutrition-orange hover:bg-nutrition-orange-dark text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Quiero mi Cambio
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
