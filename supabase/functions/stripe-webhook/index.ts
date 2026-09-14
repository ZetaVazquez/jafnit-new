// Webhook de Stripe: activa la suscripción del usuario cuando el pago se confirma.
// El pago llega asociado al usuario mediante `client_reference_id`.
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const PLAN_BY_AMOUNT: Record<number, { plan: string; days: number }> = {
  2900: { plan: 'explorador', days: 30 },
  9900: { plan: 'constructor', days: 30 },
  29700: { plan: 'estratega', days: 30 },
};

Deno.serve(async (req) => {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!stripeKey) {
    console.error('STRIPE_SECRET_KEY no configurada');
    return new Response(JSON.stringify({ error: 'stripe_not_configured' }), { status: 200 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });
  const body = await req.text();
  let event: Stripe.Event;

  try {
    if (webhookSecret) {
      const signature = req.headers.get('stripe-signature') ?? '';
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error('Firma inválida', err);
    return new Response('invalid signature', { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  let session = event.data.object as Stripe.Checkout.Session;

  // Si no hay secreto de firma configurado, comprobamos la sesión directamente
  // contra Stripe para no fiarnos del cuerpo recibido.
  if (!webhookSecret) {
    try {
      session = await stripe.checkout.sessions.retrieve(session.id);
    } catch (err) {
      console.error('Sesión no verificable en Stripe', err);
      return new Response('unverified session', { status: 400 });
    }
    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ received: true, paid: false }), { status: 200 });
    }
  }

  const userId = session.client_reference_id;
  const amount = session.amount_total ?? 0;

  if (!userId) {
    console.warn('Pago sin client_reference_id', session.id, session.customer_details?.email);
    return new Response(JSON.stringify({ received: true, linked: false }), { status: 200 });
  }

  const mapped = PLAN_BY_AMOUNT[amount] ?? { plan: 'constructor', days: 30 };
  const now = new Date();
  const end = new Date(now.getTime() + mapped.days * 24 * 60 * 60 * 1000);

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { error } = await admin.from('subscriptions').insert({
    user_id: userId,
    plan_type: mapped.plan,
    status: 'active',
    start_date: now.toISOString(),
    end_date: end.toISOString(),
    payment_method: 'stripe',
    amount: amount / 100,
  });

  if (error) {
    console.error('No se pudo activar la suscripción', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  await admin.from('user_notifications').insert({
    user_id: userId,
    type: 'payment',
    title: '¡Pago confirmado!',
    message: `Tu plan ${mapped.plan} ya está activo. Recoge tu regalo de bienvenida en tu panel.`,
  });

  return new Response(JSON.stringify({ received: true, linked: true }), { status: 200 });
});
