import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

/** Página de retorno cuando el cliente cancela el pago en Stripe. */
const Cancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center rounded-2xl border border-white/10 bg-white/5 p-8 text-white">
        <div className="mx-auto mb-4 flex justify-center">
          <XCircle className="w-16 h-16 text-white/40" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Pago cancelado</h1>
        <p className="text-white/60 mb-6">
          No se ha realizado ningún cobro. Puedes volver a intentarlo cuando quieras
          o escribirnos si te ha surgido alguna duda.
        </p>
        <div className="space-y-3">
          <Button onClick={() => navigate('/')} className="btn-cta w-full py-3">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a los programas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
