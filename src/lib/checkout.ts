import { getPlanById } from '@/config/plans';

/**
 * Abre el pago de Stripe asociándolo SIEMPRE a un usuario ya registrado.
 * - client_reference_id: id del usuario -> permite activar la suscripción al confirmarse el pago.
 * - prefilled_email: evita que el cliente pague con un email distinto al de su cuenta.
 */
export const openStripeCheckout = (
  planId: string,
  user: { id: string; email?: string | null } | null,
) => {
  const plan = getPlanById(planId);
  if (!plan?.stripeUrl || !user) return false;

  const url = new URL(plan.stripeUrl);
  url.searchParams.set('client_reference_id', user.id);
  if (user.email) url.searchParams.set('prefilled_email', user.email);
  url.searchParams.set('utm_source', 'jafn-web');

  window.location.href = url.toString();
  return true;
};
