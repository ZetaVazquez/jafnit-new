import React, { useState } from 'react';
import { Calendar, Instagram, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import NewsModal from './NewsModal';
import consejosImage from '@/assets/consejos-cocinar-sano.png';
import mitoAguaImage from '@/assets/mito-agua-limon.png';
import mitoHidratosImage from '@/assets/mito-hidratos.png';

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
      image: consejosImage
    },
    {
      id: '2',
      title: 'Mitos: Beber agua con limón en ayunas quema grasa',
      content: '🍋 Desmontamos este popular mito nutricional. ¿Realmente el agua con limón en ayunas tiene efectos mágicos para quemar grasa?',
      date: '2024-01-12',
      type: 'instagram',
      image: mitoAguaImage
    },
    {
      id: '3',
      title: 'Mitos: Miedo a los hidratos de carbono',
      content: '🍞 Muchas personas tienen miedo a consumir carbohidratos. Te explicamos por qué no deberías temerles y cómo incluirlos inteligentemente.',
      date: '2024-01-10',
      type: 'instagram',
      image: mitoHidratosImage
    },
    // Noticias expandidas (las 3 siguientes)
    {
      id: '4',
      title: 'Tu alimentación no es algo temporal',
      content: `📌 Deja de ver la alimentación saludable como algo temporal. No se trata de seguir una dieta estricta por 3 semanas, sino de aprender a alimentarte de forma inteligente para toda la vida.

🧠 La mentalidad del "todo o nada" es tu peor enemigo:
• "Empiezo el lunes" y abandono el miércoles
• Restricciones extremas que no puedes mantener
• Culpa constante por "fallar" en la dieta
• Búsqueda desesperada de la fórmula mágica

🍽️ Cambio de perspectiva hacia hábitos sostenibles:
• Pequeños ajustes que puedas mantener para siempre
• Flexibilidad para disfrutar ocasiones especiales
• Aprender a tomar mejores decisiones sin obsesionarte
• Construir una relación saludable con la comida

✨ El objetivo no es ser perfecto, sino ser constante:
• 80% de decisiones saludables vs. 20% de flexibilidad
• Progresar, no buscar la perfección
• Cada comida es una nueva oportunidad
• Tu alimentación debe encajar en tu vida, no al revés

Recuerda: los cambios que puedes mantener para siempre son los únicos que realmente transforman tu vida.`,
      date: '2024-01-08',
      type: 'news',
      image: '/lovable-uploads/1f14584b-e3d2-4429-8769-363699ed5b31.png'
    },
    {
      id: '5',
      title: 'Tu objetivo tiene que ver con tocar un instrumento',
      content: `🎹 ¿Y si tu alimentación fuera como aprender a tocar el piano? No puedes esperar resultados si cada dos semanas cambias de instrumento...

🎵 Imaginate que quieres aprender piano:
• Semana 1-2: "Voy a tocar 3 horas diarias"
• Semana 3: "Esto es muy difícil, mejor pruebo guitarra"
• Semana 5: "La guitarra no me gusta, voy a violín"
• Mes 3: "No sé tocar ningún instrumento, no sirvo para esto"

🍽️ Esto es exactamente lo que haces con las dietas:
• Dieta cetogénica → No funciona
• Ayuno intermitente → No funciona  
• Dieta de la piña → No funciona
• "Soy un desastre, no hay nada que funcione"

🎯 La clave está en la CONSISTENCIA, no en la perfección:
• Elige UN enfoque nutricional sostenible
• Manténlo al menos 3-6 meses
• Ajusta detalles, pero no cambies el sistema completo
• Los resultados llegan con la repetición constante

🏆 Maestría = Tiempo + Consistencia + Paciencia:
• El pianista no se hace en 2 semanas
• Tu transformación tampoco
• Cada día de práctica suma
• La magia está en no rendirse

¿Estás dispuesto/a a "tocar tu instrumento nutricional" todos los días?`,
      date: '2024-01-05',
      type: 'news',
      image: '/lovable-uploads/7ac6cf0a-58e2-4ccc-b742-8c3813ecd697.png'
    },
    {
      id: '6',
      title: 'Pequeños cambios = Grandes resultados',
      content: `📌 Pequeños cambios = grandes resultados. No necesitas hacerlo perfecto, solo mantenerte constante. 

🎯 Si cada semana sumas una mejora realista, el cambio llega sin sentir que te estás forzando.

⚡ El poder de los micro-hábitos:
• Semana 1: Añade una fruta a tu desayuno
• Semana 2: Bebe un vaso de agua al levantarte
• Semana 3: Camina 10 minutos después de comer
• Semana 4: Cena 2 horas antes de dormir

🔥 Por qué funcionan mejor que los cambios drásticos:
• Son sostenibles a largo plazo
• No generan resistencia mental
• Se integran naturalmente en tu rutina
• Crean impulso positivo que se acumula

🧠 Tu cerebro prefiere los cambios graduales:
• Los cambios extremos activan mecanismos de "supervivencia"
• Tu mente lucha contra lo que percibe como "amenaza"
• Los pequeños ajustes pasan desapercibidos
• Se convierten en automáticos sin esfuerzo consciente

📈 El efecto acumulativo es PODEROSO:
• 1% de mejora diaria = 37 veces mejor en un año
• La suma de pequeñas victorias crea grandes transformaciones
• Cada micro-hábito refuerza tu identidad saludable
• Los resultados permanentes nacen de acciones permanentes

💪 Estrategia para esta semana:
Elige UN pequeño cambio y comprométete solo con eso. Cuando sea natural (2-3 semanas), añade el siguiente.

¿Cuál será tu primer micro-cambio?`,
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

        <div className="container mx-auto px-4 relative z-20">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
          {newsItems.map((item, index) => (
            <ScrollReveal key={item.id} direction="up" delay={index * 200}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                <div className="relative">
                  {item.type === 'instagram' ? (
                    <AspectRatio ratio={1}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain bg-white"
                        loading="lazy"
                      />
                    </AspectRatio>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
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
