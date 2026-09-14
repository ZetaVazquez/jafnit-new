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

    const url = data.url as string;
    const inIframe = window.self !== window.top;

    if (inIframe) {
      // Stripe Checkout no se puede mostrar dentro de un iframe (preview):
      // se abre en una pestaña nueva.
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        try {
          (window.top as Window).location.href = url;
        } catch {
          window.location.href = url;
        }
      }
    } else {
      window.location.href = url;
    }
    return true;
  } catch (err) {
    console.error(err);
    toast.error('No se pudo conectar con el pago seguro.');
    return false;
  }
};
