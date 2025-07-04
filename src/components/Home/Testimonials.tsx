import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  onStartQuestionnaire: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onStartQuestionnaire }) => {
  const testimonials = [
    {
      name: 'María González',
      age: 34,
      location: 'Madrid',
      image: '/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png',
      testimonial: 'Perdí 15 kilos en 4 meses sin pasar hambre. El plan de José se adaptó perfectamente a mi rutina de trabajo y familia. ¡Increíble!',
      rating: 5,
      achievement: 'Perdió 15kg en 4 meses'
    },
    {
      name: 'Carlos Ruiz',
      age: 28,
      location: 'Barcelona',
      image: '/lovable-uploads/a0cdee08-42e1-4aef-b245-e58ac85bf290.png',
      testimonial: 'Después de años probando dietas, finalmente encontré algo que funciona. José me enseñó a comer bien para siempre, no solo por unas semanas.',
      rating: 5,
      achievement: 'Cambió su relación con la comida'
    },
    {
      name: 'Ana Martín',
      age: 42,
      location: 'Valencia',
      image: '/lovable-uploads/dd91a4d8-2d68-4ac4-b7e5-8ae097f1b833.png',
      testimonial: 'No solo mejoré mi físico, sino también mi energía y autoestima. El seguimiento personalizado marca la diferencia.',
      rating: 5,
      achievement: 'Mejoró su energía y autoestima'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
    ));
  };

  return (
    <section id="testimonios" className="py-20 dynamic-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos grandes */}
        <div className="geometric-shape circle-shape w-32 h-32 top-10 right-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 left-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 left-1/3 animate-bounce-gentle"></div>
        
        {/* Círculos medianos */}
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 right-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-18 h-18 top-2/3 right-1/6 animate-bounce-gentle"></div>
        
        {/* Triángulos */}
        <div className="geometric-shape triangle-shape triangle-up top-40 right-1/2 transform translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 left-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 right-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 left-1/2 animate-pulse-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up top-3/4 left-1/6 animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Testimonios reales de personas que han transformado sus vidas con nuestro método
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-nutrition-black">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.age} años, {testimonial.location}</p>
                    <div className="flex mt-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Quote className="w-8 h-8 text-nutrition-green-light absolute -top-2 -left-1 opacity-50" />
                  <p className="text-gray-700 leading-relaxed mb-4 pl-6">
                    {testimonial.testimonial}
                  </p>
                </div>
                
                <div className="bg-nutrition-green-lighter p-3 rounded-lg">
                  <p className="text-sm font-medium text-nutrition-green">
                    ✨ {testimonial.achievement}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            ¿Listo para ser el próximo testimonio de éxito?
          </p>
          <Button
            onClick={onStartQuestionnaire}
            size="lg"
            className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green-forest text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Comenzar Mi Transformación
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
