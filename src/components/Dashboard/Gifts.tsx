
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Gift, Download } from 'lucide-react';

interface GiftsProps {
  onGoBack: () => void;
}

const Gifts: React.FC<GiftsProps> = ({ onGoBack }) => {
  const { toast } = useToast();
  const handleDownloadGift = async () => {
    const pdfPath = '/gifts/welcome-gift.pdf';
    try {
      const res = await fetch(pdfPath, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('pdf')) throw new Error('Contenido inesperado (no es PDF)');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = 'JAFN-Gift-Welcome.pdf';
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast({ title: 'Descarga iniciada', description: 'Se está descargando tu regalo en PDF.' });
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
      toast({ variant: 'destructive', title: 'No se pudo descargar el PDF', description: 'Revisaremos el enlace. Intenta de nuevo más tarde.' });
      window.open(pdfPath, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={onGoBack} variant="ghost" className="mb-4 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Mis Regalos</h1>
          <p className="text-white/50 mt-2">Accede a tus regalos exclusivos</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full flex items-center justify-center mb-4 border border-yellow-500/30">
                <Gift className="w-8 h-8 text-yellow-400" />
              </div>
              <CardTitle className="text-2xl text-yellow-400">🎁 ¡Tu Regalo de Bienvenida!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Guía Exclusiva JAFN</h3>
                <p className="text-white/50 mb-4">Como nuevo miembro de nuestra comunidad, tienes acceso a esta guía especial que te ayudará a comenzar tu transformación de la mejor manera.</p>
                <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                  <p className="text-sm text-[hsl(var(--accent-green))] font-medium">📄 Formato: PDF</p>
                  <p className="text-sm text-[hsl(var(--accent-green))] font-medium">📊 Contenido: Tips exclusivos y estrategias</p>
                  <p className="text-sm text-[hsl(var(--accent-green))] font-medium">🎯 Objetivo: Acelerar tu progreso</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Button onClick={handleDownloadGift} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Download className="w-5 h-5 mr-2" />Descargar
                </Button>
              </div>
              <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-300/80">💡 <strong>Consejo:</strong> Guarda este archivo en un lugar seguro. Siempre podrás volver a descargarlo desde esta sección.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Gifts;
