import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-nutrition-green">
            📄 AUTORIZACIÓN DE COBRO Y CONDICIONES DEL SERVICIO
          </DialogTitle>
          <DialogDescription>
            José Antonio Dietética y Entrenamiento - Términos y Condiciones
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <p className="text-gray-700">
              En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo y conforme a la normativa vigente sobre servicios y contratación electrónica, José Antonio Dietética y Entrenamiento informa y solicita el consentimiento expreso del cliente en relación con las condiciones de cobro, cancelación, y prestación de servicios.
            </p>

            <div className="space-y-3">
              <h3 className="font-semibold text-nutrition-green">1. AUTORIZACIÓN DE COBRO RECURRENTE</h3>
              <p className="text-gray-700">
                El/la cliente autoriza expresamente a José Antonio Dietética y Entrenamiento a realizar el cargo automático mensual en su tarjeta de débito/crédito o cuenta bancaria registrada, en concepto de pago del servicio contratado (nutrición, entrenamiento, u otros servicios integrados), con carácter recurrente cada día 1 de mes.
              </p>
              <p className="text-gray-700">
                Dicha autorización permanecerá vigente mientras exista una relación comercial activa entre el cliente y José Antonio Dietética y Entrenamiento, salvo revocación formal por parte del cliente bajo las condiciones que se detallan a continuación.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-nutrition-green">2. CANCELACIÓN DEL COBRO Y DERECHO DE DESISTIMIENTO</h3>
              <p className="text-gray-700">
                Para suspender el cobro del mes siguiente, el cliente deberá comunicar su intención de baja o pausa del servicio con al menos 15 días naturales de antelación a la siguiente fecha de cobro (día 1 de mes).
              </p>
              <p className="text-gray-700">
                La solicitud de baja deberá realizarse por escrito (email o formulario habilitado en la web).
              </p>
              <p className="text-gray-700">
                Pasado ese plazo, el cargo será procesado y no se realizarán devoluciones, salvo en los casos contemplados como fuerza mayor, debidamente acreditados (ej. hospitalización, baja médica oficial, traslado laboral documentado, etc.).
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-nutrition-green">3. COMPROMISO Y CONDICIONES DE RESULTADOS</h3>
              <p className="text-gray-700">
                El cliente acepta que los resultados de salud, pérdida de grasa, mejora física o rendimiento deportivo no pueden garantizarse únicamente por la prestación del servicio, sino que dependen del compromiso activo y sostenido con el plan personalizado de:
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4">
                <li>Alimentación</li>
                <li>Entrenamiento</li>
                <li>Descanso y hábitos</li>
              </ul>
              <p className="text-gray-700">
                Por tanto, el cliente renuncia expresamente a solicitar devoluciones del importe abonado por no obtener los resultados esperados, asumiendo que estos están condicionados a su propia participación, adherencia y constancia con las pautas facilitadas.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-nutrition-green">4. PAGOS CON PERMANENCIA</h3>
              <p className="text-gray-700">
                En caso de haber contratado un plan con descuento y/o permanencia obligatoria (por ejemplo: programas trimestrales o semestrales con condiciones preferenciales), no podrá cancelarse antes de su finalización, y se mantendrá el compromiso de pago íntegro hasta la fecha final del contrato, salvo causas justificadas y debidamente documentadas.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-nutrition-green">5. TRATAMIENTO DE DATOS</h3>
              <p className="text-gray-700">
                Los datos proporcionados serán tratados conforme a la legislación vigente en materia de protección de datos. Podrá ejercer sus derechos de acceso, rectificación o cancelación a través del correo electrónico habilitado.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h3 className="font-semibold text-nutrition-green mb-2">Aceptación digital por el/la cliente:</h3>
              <p className="text-gray-700">
                Mediante el registro en la web y la contratación del servicio, el/la cliente manifiesta su consentimiento expreso a las condiciones aquí expuestas.
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;