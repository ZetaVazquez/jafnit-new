
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

interface NewsProps {
  onGoBack: () => void;
}

const News: React.FC<NewsProps> = ({ onGoBack }) => {
  // Datos de ejemplo - en el futuro vendrán del administrador
  const newsData = [
    {
      id: 1,
      title: 'La Importancia del Desayuno en tu Rutina Diaria',
      content: `Un desayuno equilibrado es fundamental para comenzar el día con energía. Te recomiendo incluir proteínas de calidad como huevos o yogur griego, carbohidratos complejos como avena o pan integral, y grasas saludables como aguacate o frutos secos.

Recuerda que saltarse el desayuno puede ralentizar tu metabolismo y afectar tu rendimiento durante el día. Un buen desayuno debería representar entre el 20-25% de tus calorías diarias totales.`,
      date: '2024-01-15',
      readTime: '3 min'
    },
    {
      id: 2,
      title: 'Hidratación: Más Allá del Agua',
      content: `La hidratación es clave para mantener un metabolismo saludable. Aunque el agua es la mejor opción, también puedes incluir infusiones sin azúcar, agua con limón o té verde.

Una buena regla es beber al menos 8 vasos de agua al día, pero esto puede variar según tu actividad física y el clima. Observa el color de tu orina: debe ser amarillo claro, indicando una hidratación adecuada.`,
      date: '2024-01-12',
      readTime: '2 min'
    },
    {
      id: 3,
      title: 'Ejercicio y Nutrición: La Combinación Perfecta',
      content: `El ejercicio y la nutrición van de la mano. No se trata solo de quemar calorías, sino de nutrir tu cuerpo para optimizar el rendimiento y la recuperación.

Antes del ejercicio, consume carbohidratos de fácil digestión. Después, es crucial incluir proteínas para la recuperación muscular. Un batido de proteína con frutas es una excelente opción post-entrenamiento.`,
      date: '2024-01-10',
      readTime: '4 min'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onGoBack}
              variant="ghost"
              className="text-nutrition-green hover:bg-nutrition-green-lighter"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-nutrition-black">Noticias para Ti</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-nutrition-black mb-4">
            Consejos y Noticias de José Antonio
          </h2>
          <p className="text-lg text-nutrition-gray">
            Artículos personalizados y consejos exclusivos para ayudarte en tu viaje hacia una vida más saludable.
          </p>
        </div>

        <div className="space-y-6">
          {newsData.map((article) => (
            <Card key={article.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald text-white">
                <CardTitle className="text-xl">{article.title}</CardTitle>
                <div className="flex items-center space-x-4 text-white/90 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime} de lectura</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-lg max-w-none">
                  {article.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-nutrition-gray mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">¿Tienes alguna pregunta?</h3>
            <p className="text-lg mb-6 opacity-90">
              José Antonio está aquí para ayudarte. No dudes en contactarlo directamente.
            </p>
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Contactar con José Antonio
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default News;
