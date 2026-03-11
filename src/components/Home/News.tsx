
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
    <section id="noticias" className="py-20 dark-section relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[hsla(var(--accent-green)/0.06)] blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <ScrollReveal direction="down">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--text-primary))] mb-4">
              Noticias y{' '}
              <em className="heading-accent not-italic font-bold italic">Actualizaciones</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg text-[hsl(var(--text-secondary))] max-w-2xl mx-auto">
              Mantente al día con las últimas noticias sobre nutrición, entrenamiento y bienestar
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <ScrollReveal key={item.id} direction="up" delay={index * 150}>
              <div className="glass-card-light overflow-hidden hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--dark-bg))] to-transparent opacity-60" />
                  <div className="absolute top-4 right-4">
                    {item.type === 'instagram' ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 text-xs font-semibold">
                        <Instagram className="w-3 h-3" /> Instagram
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsla(var(--accent-green)/0.2)] border border-[hsla(var(--accent-green)/0.3)] text-[hsl(var(--accent-green-light))] text-xs font-semibold">
                        <Eye className="w-3 h-3" /> Artículo
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-[hsl(var(--text-secondary))] mb-3">
                    <Calendar className="w-4 h-4 mr-2 text-[hsl(var(--accent-green-light))]" />
                    {new Date(item.date).toLocaleDateString('es-ES')}
                  </div>
                  <h3 className="text-lg font-bold text-[hsl(var(--text-primary))] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--text-secondary))] mb-6 leading-relaxed flex-grow">
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
                    className={`w-full font-semibold transition-all duration-300 mt-auto ${
                      item.type === 'instagram'
                        ? 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/30'
                        : 'btn-cta'
                    }`}
                  >
                    {item.type === 'instagram' ? (
                      <>
                        <Instagram className="w-4 h-4 mr-2" />
                        Ver en Instagram
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
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
