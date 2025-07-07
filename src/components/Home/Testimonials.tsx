import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestimonialsProps {
  onStartQuestionnaire?: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onStartQuestionnaire }) => {
  const testimonials = [
    {
      name: 'Laura Jiménez',
      age: 32,
      image: '/lovable-uploads/216ce35e-6565-456f-939a-869be82c0695.png',
      rating: 5,
      comment: 'Nunca pensé que una dieta pudiera ser así de fácil de seguir. ¡No paso hambre, me encanta lo que como y ya bajé 4 kilos! Gracias por enseñarme a disfrutar comiendo 🙌🍝',
      result: '-4 kg en 2 meses'
    },
    {
      name: 'Pablo Moreno',
      age: 36,
      image: '/lovable-uploads/4d9ad9e4-a814-4469-b756-3e46df99f4b2.png',
      rating: 5,
      comment: 'Estoy sorprendido de lo mucho que he avanzado sin pasarme horas en el gym. El entrenamiento es personalizado y me encanta que puedo hacerlo en casa o en el parque 🏋️‍♂️🏡.',
      result: '+5 kg músculo, -8 kg grasa'
    },
    {
      name: 'Alba Fernández',
      age: 29,
      image: '/lovable-uploads/a0cdee08-42e1-4aef-b245-e58ac85bf290.png',
      rating: 5,
      comment: 'Me sentí escuchada desde el primer día. Cada duda que tengo, me la responden rápido. Siento que no estoy sola en esto y eso me da tranquilidad 🙏📩.',
      result: 'Mejor relación con la comida'
    },
    {
      name: 'Iván Gutiérrez',
      age: 30,
      image: '/lovable-uploads/1ef2ec72-6a8a-4e2c-a3f9-72fc43a1ce69.png',
      rating: 5,
      comment: 'Volví a usar ropa que no me ponía hace años, pero lo que más valoro es que ahora tengo energía para todo. Este cambio me ha devuelto las ganas de vivir al 100%.',
      result: '-10 kg y mucha más energía'
    }
  ];

  return (
    <section id="testimonios" className="py-20 dynamic-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="geometric-shape circle-shape w-32 h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 left-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-18 h-18 top-2/3 left-1/6 animate-bounce-gentle"></div>
        
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up top-3/4 right-1/6 animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
            Historias de Éxito Reales
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre cómo nuestros clientes han transformado sus vidas con nuestros planes personalizados
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-nutrition-green-light relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-nutrition-green-light" />
              
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-nutrition-green-light mr-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-nutrition-black title-playful">
                    {testimonial.name}, {testimonial.age} años
                  </h4>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-nutrition-green" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed italic">
                "{testimonial.comment}"
              </p>

              <div className="bg-nutrition-green-lighter rounded-lg p-3">
                <p className="text-nutrition-green-dark font-semibold text-center">
                  🎯 {testimonial.result}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-nutrition-green-light max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-nutrition-green mb-4 title-playful">
              ¿Quieres ser el Próximo Caso de Éxito?
            </h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Únete a nuestra familia de personas que han decidido transformar su vida de forma definitiva
            </p>
            <Button 
              onClick={onStartQuestionnaire}
              className="bg-nutrition-green hover:bg-nutrition-green-dark text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              ¡Quiero Mi Transformación!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
