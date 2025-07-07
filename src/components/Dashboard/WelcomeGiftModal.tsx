
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, Download, X } from 'lucide-react';

interface WelcomeGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeGiftModal: React.FC<WelcomeGiftModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-white to-nutrition-green-lighter border-2 border-nutrition-green">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-nutrition-green flex items-center">
              <Gift className="w-6 h-6 mr-2" />
              ¡Bienvenido!
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-nutrition-gray hover:text-nutrition-green"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald rounded-full flex items-center justify-center mb-4">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-nutrition-black mb-2">
              🎉 ¡Tienes un regalo especial!
            </h3>
            <p className="text-nutrition-gray text-sm">
              Como nuevo miembro de JAFN, tienes acceso a nuestra guía exclusiva de bienvenida.
            </p>
          </div>

          <div className="bg-white/80 rounded-lg p-4 border border-nutrition-green-light">
            <h4 className="font-bold text-nutrition-black mb-2">📄 Tu Regalo Incluye:</h4>
            <ul className="text-sm text-nutrition-gray space-y-1">
              <li>✅ Tips exclusivos para empezar</li>
              <li>✅ Estrategias probadas</li>
              <li>✅ Guía paso a paso</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleDownloadGift}
              className="w-full bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Download className="w-5 h-5 mr-2" />
              Descargar Ahora
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-nutrition-gray">
                💡 También puedes encontrar tu regalo en la sección <strong>"Gifts"</strong> de tu dashboard
              </p>
            </div>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
            >
              Continuar al Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeGiftModal;
