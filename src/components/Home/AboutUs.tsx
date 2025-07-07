import React from 'react';
import { Award, Users, Heart, Target, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AboutUsProps {
  onQuestionnaireOpen?: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onQuestionnaireOpen }) => {
  const stats = [
    { icon: Users, value: '30+', label: 'Clientes en Seguimiento' },
    { icon: Award, value: '6', label: 'Meses de Experiencia' },
    { icon: Heart, value: '100%', label: 'Compromiso Personal' },
    { icon: Target, value: '100+', label: 'Objetivos Alcanzados' }
  ];

  const testimonials = [
    {
      name: '🧍‍♀️ Laura Jiménez (32 años)',
      comment: 'Nunca pensé que una dieta pudiera ser así de fácil de seguir. ¡No paso hambre, me encanta lo que como y ya bajé 4 kilos! Gracias por enseñarme a disfrutar comiendo 🙌🍝',
      rating: 4
    },
    {
      name: '🧍‍♂️ Pablo Moreno (36 años)',
      comment: 'Estoy sorprendido de lo mucho que he avanzado sin pasarme horas en el gym. El entrenamiento es personalizado y me encanta que puedo hacerlo en casa o en el parque 🏋️‍♂️🏡.',
      rating: 5
    },
    {
      name: '🧍‍♀️ Alba Fernández (29 años)',
      comment: 'Me sentí escuchada desde el primer día. Cada duda que tengo, me la responden rápido. Siento que no estoy sola en esto y eso me da tranquilidad 🙏📩.',
      rating: 4
    },
    {
      name: '🧍‍♂️ Iván Gutiérrez (30 años)',
      comment: 'Volví a usar ropa que no me ponía hace años, pero lo que más valoro es que ahora tengo energía para todo. Este cambio me ha devuelto las ganas de vivir al 100%.',
      rating: 5
    }
  ];

  return (
    <section id="sobre-mi" className="py-16 bg-gradient-to-br from-nutrition-green-lighter via-white to-nutrition-green-lighter relative overflow-hidden">
      {/* Unified background overlay for consistency */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 70%, rgba(132, 204, 22, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 90% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 10% 90%, rgba(187, 247, 208, 0.2) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }}></div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="geometric-shape circle-shape w-16 h-16 md:w-32 md:h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-12 h-12 md:w-24 md:h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-10 h-10 md:w-20 md:h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-8 h-8 md:w-16 md:h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        
        <div className="geometric-shape circle-shape w-14 h-14 md:w-28 md:h-28 top-1/3 left-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-11 h-11 md:w-22 md:h-22 bottom-1/3 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-9 h-9 md:w-18 md:h-18 top-2/3 left-1/6 animate-bounce-gentle"></div>
        
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up top-3/4 right-1/6 animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-nutrition-black mb-6 title-main">
                Sobre Mí
              </h2>
              <div className="space-y-4 text-lg text-nutrition-gray leading-relaxed">
                <p>
                  Me llamo <span className="font-bold text-nutrition-green">José Antonio</span>, soy dietista-nutricionista y entrenador personal. 
                  Durante años luché contra el sobrepeso, probé mil dietas diferentes, 
                  me apunté a gimnasios que abandonaba a los pocos meses...
                </p>
                <p>
                  <span className="font-bold text-nutrition-accent">La diferencia no estaba en encontrar la dieta perfecta 
                  o el entrenamiento más duro.</span> Estaba en entender que cada persona es única 
                  y necesita un enfoque completamente personalizado.
                </p>
                <p>
                  Después de perder 30 kilos y mantener mi peso ideal durante años, 
                  me dedico a ayudar a personas como tú a conseguir sus objetivos 
                  sin sacrificar su vida social ni su salud mental.
                </p>
              </div>
            </div>

            {/* Centered text and button */}
            <div className="text-center py-8">
              <p className="text-xl font-bold text-nutrition-green mb-6">
                Yo estuve ahí. Y salí. Ahora te toca a ti.
              </p>
              <Button 
                className="bg-nutrition-accent hover:bg-nutrition-accent-dark text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Quiero Cambiar
              </Button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Background decorative circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-nutrition-green/20 to-nutrition-accent/20 rounded-full transform rotate-3"></div>
              
              {/* Main image container */}
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="/lovable-uploads/1ef2ec72-6a8a-4e2c-a3f9-72fc43a1ce69.png"
                  alt="José Antonio - Antes y Después" 
                  className="w-full h-auto rounded-xl"
                />
                
                {/* Overlay with transformation badge */}
                <div className="absolute -bottom-4 -right-4 bg-nutrition-accent text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  -30kg ✨
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
