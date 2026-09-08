import { supabase } from '@/integrations/supabase/client';
import { getPlanById } from '@/config/plans';
import { toast } from 'sonner';

/**
 * Crea una sesión de Stripe Checkout (suscripción) para el usuario autenticado
 * y redirige al pago. Requiere sesión iniciada.
 */
export const openStripeCheckout = async (
  planId: string,
  user: { id: string; email?: string | null } | null,
): Promise<boolean> => {
  const plan = getPlanById(planId);
  if (!plan) return false;

  if (!user) {
    toast.error('Necesitas una cuenta para poder pagar.');
    return false;
  }

  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { planId: plan.id },
    });

    if (error || !data?.url) {
      console.error('create-checkout error', error, data);
      toast.error(data?.error || 'No se pudo abrir el pago. Inténtalo de nuevo.');
      return false;
    }

    window.location.href = data.url as string;
    return true;
  } catch (err) {
    console.error(err);
    toast.error('No se pudo conectar con el pago seguro.');
    return false;
  }
};
