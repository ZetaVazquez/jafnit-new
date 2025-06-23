
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Check, Clock, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface BizumPaymentProcessProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: 'monthly' | 'quarterly';
  planDetails: {
    name: string;
    price: string;
    duration: string;
  };
}

const BizumPaymentProcess: React.FC<BizumPaymentProcessProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  planDetails
}) => {
  const [step, setStep] = useState(1);
  const [paymentReference, setPaymentReference] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const bizumNumber = "612345678"; // Cambiar por tu número real

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Crear el nombre único del archivo
      const fileName = `payment-receipt-${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
      
      // Subir archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Crear registro de pago pendiente
      const { error: insertError } = await supabase
        .from('pending_payments')
        .insert({
          user_id: user.id,
          plan_type: selectedPlan,
          amount: selectedPlan === 'monthly' ? 75 : 210,
          payment_method: 'bizum',
          payment_reference: paymentReference,
          receipt_url: fileName,
          notes: notes,
          status: 'pending'
        });

      if (insertError) throw insertError;

      toast({
        title: "Comprobante enviado",
        description: "Tu comprobante se ha enviado correctamente. Te notificaremos cuando se active tu suscripción.",
      });

      setStep(3);
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el comprobante. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setPaymentReference('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-nutrition-green" />
            Pago por Bizum
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-nutrition-green">
                  {planDetails.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-nutrition-green mb-2">
                    {planDetails.price}
                  </div>
                  <p className="text-nutrition-gray">{planDetails.duration}</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-nutrition-green-lighter p-4 rounded-lg">
              <h3 className="font-bold text-nutrition-green-dark mb-3">
                Instrucciones de pago:
              </h3>
              <ol className="space-y-2 text-sm text-nutrition-gray">
                <li>1. Abre tu app de Bizum</li>
                <li>2. Selecciona "Enviar dinero"</li>
                <li>
                  3. Envía <strong>{planDetails.price}</strong> al número: 
                  <div className="bg-white p-2 rounded mt-1 font-mono text-lg text-center text-nutrition-green-dark">
                    {bizumNumber}
                  </div>
                </li>
                <li>4. En el concepto escribe: "{planDetails.name} - {user?.email}"</li>
              </ol>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white"
            >
              Ya he realizado el pago
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <Check className="w-12 h-12 mx-auto text-nutrition-green mb-4" />
              <h3 className="text-lg font-bold text-nutrition-green-dark mb-2">
                Subir comprobante
              </h3>
              <p className="text-sm text-nutrition-gray">
                Por favor, sube una captura de pantalla del pago realizado
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Referencia del pago (opcional)
              </label>
              <Input
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Ej: REF123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Notas adicionales (opcional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Cualquier información adicional sobre el pago..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Comprobante de pago *
              </label>
              <div className="border-2 border-dashed border-nutrition-green-light rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-nutrition-green mb-2" />
                <p className="text-sm text-nutrition-gray mb-4">
                  Haz clic para subir una imagen del comprobante
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="receipt-upload"
                />
                <Button
                  asChild
                  variant="outline"
                  disabled={uploading}
                  className="border-nutrition-green text-nutrition-green hover:bg-nutrition-green-lighter"
                >
                  <label htmlFor="receipt-upload" className="cursor-pointer">
                    {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
                  </label>
                </Button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Volver
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <Clock className="w-16 h-16 mx-auto text-nutrition-green" />
            <h3 className="text-xl font-bold text-nutrition-green-dark">
              ¡Comprobante enviado!
            </h3>
            <p className="text-nutrition-gray">
              Hemos recibido tu comprobante de pago. Verificaremos el pago y activaremos tu suscripción en un plazo máximo de 24 horas.
            </p>
            <p className="text-sm text-nutrition-gray bg-nutrition-green-lighter p-3 rounded">
              Te enviaremos una notificación por email cuando tu suscripción esté activa.
            </p>
            <Button
              onClick={handleClose}
              className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white"
            >
              Entendido
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BizumPaymentProcess;
