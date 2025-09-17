
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Gift, Download, ExternalLink } from 'lucide-react';

interface GiftsProps {
  onGoBack: () => void;
}

const Gifts: React.FC<GiftsProps> = ({ onGoBack }) => {
  const handleDownloadGift = () => {
    try {
      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = '/gifts/welcome-gift.pdf';
      link.download = 'JAFN-Gift-Welcome.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Añadir al DOM temporalmente para hacer click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Descarga iniciada para el PDF de regalo');
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      // Fallback: abrir en nueva pestaña
      window.open('/gifts/welcome-gift.pdf', '_blank');
    }
  };

  const handleViewGift = () => {
    // Crear enlace directo para evitar bloqueos de popup
    const link = document.createElement('a');
    link.href = '/gifts/welcome-gift.pdf';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Añadir al DOM y hacer click para abrir
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={onGoBack}
            variant="ghost"
            className="mb-4 text-nutrition-green hover:text-nutrition-green-dark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-nutrition-black">Mis Regalos</h1>
          <p className="text-nutrition-gray mt-2">Accede a tus regalos exclusivos</p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-white to-nutrition-green-lighter border-2 border-nutrition-green shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald rounded-full flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-nutrition-green">
                🎁 ¡Tu Regalo de Bienvenida!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-white/80 rounded-lg p-6 border border-nutrition-green-light">
                <h3 className="text-xl font-bold text-nutrition-black mb-3">
                  Guía Exclusiva JAFN
                </h3>
                <p className="text-nutrition-gray mb-4">
                  Como nuevo miembro de nuestra comunidad, tienes acceso a esta guía especial 
                  que te ayudará a comenzar tu transformación de la mejor manera.
                </p>
                <div className="bg-nutrition-green-lighter rounded-lg p-4 mb-4">
                  <p className="text-sm text-nutrition-green-dark font-medium">
                    📄 Formato: PDF
                  </p>
                  <p className="text-sm text-nutrition-green-dark font-medium">
                    📊 Contenido: Tips exclusivos y estrategias
                  </p>
                  <p className="text-sm text-nutrition-green-dark font-medium">
                    🎯 Objetivo: Acelerar tu progreso
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleViewGift}
                  variant="outline"
                  className="border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Ver Online
                </Button>

                <Button
                  onClick={handleDownloadGift}
                  className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Descargar
                </Button>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Consejo:</strong> Guarda este archivo en un lugar seguro. 
                  Siempre podrás volver a descargarlo desde esta sección.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Gifts;
