import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';

/**
 * Página de retorno de Stripe. Espera a que la suscripción quede activa
 * y lleva al cliente a su panel, donde se muestra el regalo de bienvenida.
 */
const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { hasActiveSubscription, refreshSubscription } = useSubscription();
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      await refreshSubscription();
      if (attempts >= 6) {
        clearInterval(interval);
        setChecking(false);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [refreshSubscription]);

  useEffect(() => {
    if (hasActiveSubscription) {
      setChecking(false);
    }
  }, [hasActiveSubscription]);

  const goToDashboard = () => {
    localStorage.setItem('jafn_open_dashboard', '1');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center rounded-2xl border border-white/10 bg-white/5 p-8 text-white">
        <div className="mx-auto mb-4 flex justify-center">
          <CheckCircle className="w-16 h-16 text-[hsl(var(--accent-green))]" />
        </div>
        <h1 className="text-2xl font-bold mb-3">¡Pago completado!</h1>
        <p className="text-white/60 mb-6">
          {hasActiveSubscription
            ? 'Tu cuenta ya está activa. Entra a tu panel y recoge tu regalo de bienvenida.'
            : checking
              ? 'Estamos confirmando tu pago con Stripe, esto tarda unos segundos...'
              : 'Hemos recibido tu pago. Si tu panel aún aparece bloqueado, actualiza en un minuto.'}
        </p>

        {checking && !hasActiveSubscription && (
          <div className="flex items-center justify-center gap-2 text-white/50 mb-6">
            <Loader2 className="w-4 h-4 animate-spin" /> Verificando...
          </div>
        )}

        <div className="space-y-3">
          <Button onClick={goToDashboard} disabled={!user} className="btn-cta w-full py-3">
            Ir a mi panel <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}
            className="w-full border-white/20 bg-transparent text-white/70 hover:bg-white/10">
            Volver al inicio
          </Button>
        </div>

        {sessionId && (
          <p className="mt-6 text-[11px] text-white/25 font-mono break-all">Ref: {sessionId}</p>
        )}
      </div>
    </div>
  );
};

export default Success;
