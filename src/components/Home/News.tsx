import React from 'react';
import { Calendar, Instagram } from 'lucide-react';
import { NewsItem } from '@/types';

const News: React.FC = () => {
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Nuevos estudios sobre la importancia del desayuno',
      content: 'Recientes investigaciones demuestran que un desayuno equilibrado puede mejorar el rendimiento físico y mental durante todo el día.',
      date: '2024-01-15',
      type: 'news',
      image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      title: 'Rutina de ejercicios para principiantes',
      content: 'Una guía completa para comenzar tu viaje fitness de manera segura y efectiva.',
      date: '2024-01-12',
      type: 'instagram',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      title: 'Los beneficios de la hidratación correcta',
      content: 'Conoce por qué mantenerse hidratado es crucial para el rendimiento deportivo y la salud general.',
      date: '2024-01-10',
      type: 'news',
      image: 'https://images.unsplash.com/photo-1549741738-27287e35ef10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '4',
      title: 'Meal prep: Organiza tu semana',
      content: 'Aprende técnicas de preparación de comidas para mantener una dieta saludable toda la semana.',
      date: '2024-01-08',
      type: 'instagram',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="news" className="py-20 dynamic-background relative overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-nutrition-black mb-4 title-main">
            Noticias y Actualizaciones
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mantente al día con las últimas noticias sobre nutrición, entrenamiento y bienestar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {newsItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  {item.type === 'instagram' ? (
                    <Instagram className="w-6 h-6 text-pink-500 bg-white p-1 rounded-full" />
                  ) : (
                    <Calendar className="w-6 h-6 text-nutrition-green bg-white p-1 rounded-full" />
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(item.date).toLocaleDateString('es-ES')}
                </div>
                <h3 className="text-xl font-bold text-nutrition-black mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
