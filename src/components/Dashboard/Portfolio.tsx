
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Play } from 'lucide-react';
import DynamicBackground from '@/components/Layout/DynamicBackground';

interface PortfolioProps {
  onGoBack: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onGoBack }) => {
  // Datos de ejemplo - en el futuro vendrán del administrador
  const portfolioData = [
    {
      date: '2024-01-15',
      items: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          caption: 'Desayuno saludable del día'
        },
        {
          type: 'video',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          caption: 'Rutina de ejercicios matutina'
        }
      ]
    },
    {
      date: '2024-01-14',
      items: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          caption: 'Comida equilibrada'
        }
      ]
    },
    {
      date: '2024-01-13',
      items: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          caption: 'Cena ligera y nutritiva'
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1563379091339-03246963d21a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          caption: 'Snack saludable'
        }
      ]
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DynamicBackground className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md">
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
            <h1 className="text-2xl font-bold text-nutrition-black title-main">Portfolio Diario</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-nutrition-black mb-4 title-playful">
            Contenido Diario de José Antonio
          </h2>
          <p className="text-lg text-nutrition-gray">
            Aquí encontrarás fotos y videos que José Antonio comparte diariamente sobre alimentación, ejercicios y consejos de nutrición.
          </p>
        </div>

        <div className="space-y-8">
          {portfolioData.map((day, dayIndex) => (
            <Card key={dayIndex} className="shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald text-white">
                <CardTitle className="flex items-center space-x-2 title-playful">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(day.date)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {day.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="group">
                      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.caption}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="relative">
                            <img
                              src={item.thumbnail}
                              alt={item.caption}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <p className="text-white text-sm font-medium">{item.caption}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </DynamicBackground>
  );
};

export default Portfolio;
