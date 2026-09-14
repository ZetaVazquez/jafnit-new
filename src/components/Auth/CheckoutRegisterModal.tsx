import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, Lock } from 'lucide-react';

interface CheckoutRegisterModalProps {
  isOpen: boolean;
  planId: string | null;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

/**
 * Paso previo a la contratación de un programa: para asociar el pago a una
 * cuenta, el visitante debe iniciar sesión. Si no tiene cuenta, puede crearla
 * desde el enlace "Pulsa aquí para crear una nueva cuenta". Una vez dentro,
 * el modal de planes le permite completar el pago.
 */
const CheckoutRegisterModal: React.FC<CheckoutRegisterModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const { user } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md bg-[hsl(220,20%,10%)] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
            Inicia sesión para contratar
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Para asociar el pago del programa a tu cuenta necesitas iniciar sesión.
            Si ya tienes cuenta, accede y podrás completar la contratación desde tu área de cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Button
            onClick={onLogin}
            className="btn-cta w-full py-3"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Iniciar sesión
          </Button>

          {!user && (
            <p className="text-center text-sm text-white/60">
              ¿Todavía no tienes cuenta?{' '}
              <button
                type="button"
                onClick={onRegister}
                className="text-[hsl(var(--accent-green-light))] underline font-semibold"
              >
                Pulsa aquí para crear una nueva cuenta
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutRegisterModal;
