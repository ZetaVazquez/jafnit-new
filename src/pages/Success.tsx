import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshSubscription } = useSubscription();
  const { toast } = useToast();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Refresh subscription status after successful payment
    if (sessionId) {
      setTimeout(() => {
        refreshSubscription();
      }, 2000);

      toast({
        title: "¡Pago exitoso!",
        description: "Tu suscripción se ha activado correctamente.",
      });
    }
  }, [sessionId, refreshSubscription, toast]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-nutrition-black">
            ¡Pago Completado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-nutrition-gray">
            Tu pago se ha procesado exitosamente. Ya puedes acceder a todos los beneficios de tu plan.
          </p>
          
          {sessionId && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                ID de sesión: <span className="font-mono text-xs">{sessionId}</span>
              </p>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleGoToDashboard}
              className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white"
            >
              Ir al Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleGoToHome}
              className="w-full"
            >
              Volver al Inicio
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-nutrition-gray">
              Recibirás un email de confirmación en breve con todos los detalles de tu suscripción.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;