import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Precios recurrentes ya existentes en Stripe (modo TEST)
const PRICE_BY_PLAN: Record<string, string> = {
  explorador: "price_1UDPmGPtWMY1We6RrAECdeee",
  constructor: "price_1UDPokPtWMY1We6Rbk0m2rgQ",
  estratega: "price_1UDPpmPtWMY1We6Rq6wxFLF5",
};

const log = (step: string, details?: unknown) =>
  console.log(`[CREATE-CHECKOUT] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ error: "Stripe no está configurado." }, 500);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Debes iniciar sesión para pagar." }, 401);

    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );
    const { data: userData, error: userError } = await authClient.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    const user = userData?.user;
    if (userError || !user?.email) return json({ error: "Sesión no válida." }, 401);
    log("user", { id: user.id, email: user.email });

    const { planId } = await req.json().catch(() => ({ planId: null }));
    const price = planId ? PRICE_BY_PLAN[planId] : null;
    if (!price) return json({ error: "Plan no válido." }, 400);

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Reutilizamos el cliente de Stripe si ya existe para este email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data[0]?.id;
    log("customer", { customerId: customerId ?? "new" });

    const origin = req.headers.get("origin") ?? "https://metodojafn.com";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      client_reference_id: user.id,
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      subscription_data: { metadata: { user_id: user.id, plan_id: planId } },
      metadata: { user_id: user.id, plan_id: planId },
      allow_promotion_codes: true,
      locale: "es",
    });

    log("session created", { id: session.id });
    return json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERROR", { message });
    return json({ error: message }, 500);
  }
});
