import React from 'react';
import { Calendar, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types';

const News: React.FC = () => {
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Tu alimentación no es algo temporal',
      content: '📌 Deja de ver la alimentación saludable como algo temporal. No se trata de seguir una dieta estricta por 3 semanas, sino de aprender a alimentarte de forma inteligente para toda la vida. 🧠🍽️',
      date: '2024-01-15',
      type: 'instagram',
      image: '/lovable-uploads/1f14584b-e3d2-4429-8769-363699ed5b31.png'
    },
    {
      id: '2',
      title: 'Que tiene ver tu objetivo con tocar un instrumento',
      content: '¿Y si tu alimentación fuera como aprender a tocar el piano? 🎹 No puedes esperar resultados si cada dos semanas cambias de instrumento…',
      date: '2024-01-12',
      type: 'instagram',
      image: '/lovable-uploads/7ac6cf0a-58e2-4ccc-b742-8c3813ecd697.png'
    },
    {
      id: '3',
      title: 'Pequeños cambios grandes resultados',
      content: '📌 Pequeños cambios = grandes resultados. No necesitas hacerlo perfecto, solo mantenerte constante. 🎯 Si cada semana sumas una mejora realista, el cambio llega sin sentir que te estás forzando',
      date: '2024-01-10',
      type: 'instagram',
      image: '/lovable-uploads/0822324f-ee5f-4ac8-b452-680991c41159.png'
    },
    {
      id: '4',
      title: 'Encuentra tu propósito y alinea tus hábitos con él',
      content: '📌 Para sostener hábitos saludables, necesitas un propósito real.',
      date: '2024-01-08',
      type: 'instagram',
      image: '/lovable-uploads/3f8cd7c7-6d1c-4d5f-a944-d083a71f3f95.png'
    }
  ];

  const instagramLinks = [
    'https://www.instagram.com/p/DJ7FdduNykY/?img_index=1',
    'https://www.instagram.com/p/DJpD5uwNIiO/?img_index=1',
    'https://www.instagram.com/p/DJXCVW5NfUC/?img_index=1',
    'https://www.instagram.com/p/DIy_OEWtLUg/?img_index=1'
  ];

  const handleInstagramClick = (index: number) => {
    window.open(instagramLinks[index], '_blank');
  };

  return (
    <section id="noticias" className="py-20 dynamic-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos grandes */}
        <div className="geometric-shape circle-shape w-32 h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        
        {/* Círculos medianos */}
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 left-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-18 h-18 top-2/3 left-1/6 animate-bounce-gentle"></div>
        
        {/* Triángulos */}
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up top-3/4 right-1/6 animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
            Noticias y Actualizaciones
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mantente al día con las últimas noticias sobre nutrición, entrenamiento y bienestar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {newsItems.map((item, index) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Instagram className="w-6 h-6 text-pink-500 bg-white p-1 rounded-full" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(item.date).toLocaleDateString('es-ES')}
                </div>
                <h3 className="text-xl font-bold text-nutrition-black mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                  {item.content}
                </p>
                <Button
                  onClick={() => handleInstagramClick(index)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-auto"
                >
                  <Instagram className="w-4 h-4" />
                  Ver en Instagram
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
