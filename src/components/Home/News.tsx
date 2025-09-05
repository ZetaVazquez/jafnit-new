import React, { useState } from 'react';
import { Calendar, Instagram, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import NewsModal from './NewsModal';

const News: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const newsItems: NewsItem[] = [
    // Instagram posts (las 3 primeras)
    {
      id: '1',
      title: 'Consejos: No tengo tiempo para cocinar sano',
      content: '🥘 ¿Sientes que no tienes tiempo para cocinar sano todos los días? Te enseñamos estrategias prácticas para alimentarte bien sin complicarte la vida.',
      date: '2024-01-15',
      type: 'instagram',
      image: '/lovable-uploads/02b37b86-627d-4c1c-a55a-1fdab3eaf6cf.png'
    },
    {
      id: '2',
      title: 'Mitos: Beber agua con limón en ayunas quema grasa',
      content: '🍋 Desmontamos este popular mito nutricional. ¿Realmente el agua con limón en ayunas tiene efectos mágicos para quemar grasa?',
      date: '2024-01-12',
      type: 'instagram',
      image: '/lovable-uploads/649a395f-0ba7-4144-82a9-f45d469b77b7.png'
    },
    {
      id: '3',
      title: 'Mitos: Miedo a los hidratos de carbono',
      content: '🍞 Muchas personas tienen miedo a consumir carbohidratos. Te explicamos por qué no deberías temerles y cómo incluirlos inteligentemente.',
      date: '2024-01-10',
      type: 'instagram',
      image: '/lovable-uploads/9a9ed6cd-bf68-4a70-9964-f04533b6397d.png'
    },
    // Noticias expandidas (las 3 siguientes)
    {
      id: '4',
      title: 'La importancia del descanso en tu proceso de cambio',
      content: `💤 El descanso no es un lujo, es una necesidad fundamental para tu transformación física y mental.

Durante el sueño, tu cuerpo se regenera, consolida la memoria y regula las hormonas del hambre y la saciedad. Una mala calidad de sueño puede sabotear todos tus esfuerzos en nutrición y entrenamiento.

✨ Consejos para mejorar tu descanso:
• Mantén horarios regulares de sueño
• Evita pantallas 1 hora antes de dormir
• Crea un ambiente fresco y oscuro
• Practica técnicas de relajación
• Evita comidas pesadas antes de acostarte

Recuerda: dormir bien no es perder tiempo, es invertir en tu bienestar y resultados.`,
      date: '2024-01-08',
      type: 'news',
      image: '/lovable-uploads/1f14584b-e3d2-4429-8769-363699ed5b31.png'
    },
    {
      id: '5',
      title: 'Hidratación: Más allá de los 8 vasos de agua',
      content: `💧 La hidratación adecuada va mucho más allá de beber 8 vasos de agua al día.

Tu necesidad de líquidos depende de múltiples factores: tu peso, nivel de actividad, clima, alimentación y estado de salud. Los alimentos también contribuyen significativamente a tu hidratación diaria.

🥤 Señales de buena hidratación:
• Orina de color amarillo claro
• Energía estable durante el día
• Piel elástica y saludable
• Concentración mental óptima

🍉 Alimentos que te hidratan:
• Frutas: sandía, melón, naranjas
• Verduras: pepino, lechuga, tomate
• Sopas y caldos caseros
• Infusiones y tés naturales

La clave está en escuchar a tu cuerpo y mantener un equilibrio constante.`,
      date: '2024-01-05',
      type: 'news',
      image: '/lovable-uploads/7ac6cf0a-58e2-4ccc-b742-8c3813ecd697.png'
    },
    {
      id: '6',
      title: 'Planificación de comidas: Tu aliado para el éxito',
      content: `📝 La planificación de comidas es el superpoder de quienes logran mantener hábitos saludables a largo plazo.

Cuando planificas con anticipación, reduces la tentación de opciones poco saludables, ahorras tiempo y dinero, y garantizas que tu cuerpo reciba los nutrientes que necesita.

🎯 Pasos para una planificación exitosa:

1. EVALÚA TU SEMANA
   • Revisa tu agenda y compromisos
   • Identifica días más ocupados
   • Planifica comidas según tu rutina

2. DISEÑA TU MENÚ
   • Incluye todos los grupos alimenticios
   • Considera tus preferencias y objetivos
   • Prepara opciones de respaldo rápidas

3. ORGANIZA TUS COMPRAS
   • Haz una lista organizada por secciones
   • Compra ingredientes versátiles
   • Prioriza productos frescos y de temporada

4. PREPARA CON INTELIGENCIA
   • Dedica 1-2 horas a meal prep
   • Cocina porciones adicionales
   • Congela opciones para emergencias

Recuerda: no necesitas perfección, solo consistencia. Empieza planificando 3-4 días y ve aumentando gradualmente.`,
      date: '2024-01-03',
      type: 'news',
      image: '/lovable-uploads/0822324f-ee5f-4ac8-b452-680991c41159.png'
    }
  ];

  const instagramLinks = [
    'https://www.instagram.com/p/DKzXHCoK1V4/?img_index=1',
    'https://www.instagram.com/p/DL2-O4RAogE/?img_index=1',
    'https://www.instagram.com/p/DL2-O4RAogE/?img_index=1'
  ];

  const handleInstagramClick = (index: number) => {
    window.open(instagramLinks[index], '_blank');
  };

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  return (
    <section id="noticias" className="py-16 bg-gradient-to-br from-nutrition-green via-nutrition-green-emerald to-nutrition-green-dark relative overflow-hidden">
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
          <ScrollReveal direction="down">
            <h2 className="text-4xl font-bold text-white mb-4 title-main">
              Noticias y Actualizaciones
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Mantente al día con las últimas noticias sobre nutrición, entrenamiento y bienestar
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <ScrollReveal key={item.id} direction="up" delay={index * 200}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
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
                      <Eye className="w-6 h-6 text-nutrition-green bg-white p-1 rounded-full" />
                    )}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(item.date).toLocaleDateString('es-ES')}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                    {item.type === 'news' 
                      ? item.content.split('\n')[0] + '...'
                      : item.content
                    }
                  </p>
                  <Button
                    onClick={() => item.type === 'instagram' 
                      ? handleInstagramClick(index) 
                      : handleNewsClick(item)
                    }
                    className={`w-full font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-auto ${
                      item.type === 'instagram' 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                        : 'bg-gradient-to-r from-nutrition-green to-nutrition-green-dark hover:from-nutrition-green-dark hover:to-nutrition-green text-white'
                    }`}
                  >
                    {item.type === 'instagram' ? (
                      <>
                        <Instagram className="w-4 h-4" />
                        Ver en Instagram
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Leer más
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <NewsModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          newsItem={selectedNews}
        />
      </div>
    </section>
  );
};

export default News;
