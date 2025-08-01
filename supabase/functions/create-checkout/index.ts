import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Use service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get request body
    const { planType } = await req.json();
    if (!planType) throw new Error("Plan type is required");
    logStep("Plan type received", { planType });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.name || user.email,
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });

      // Save customer to database
      await supabaseClient.from("stripe_customers").upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        email: user.email,
        name: user.user_metadata?.name || null,
      });
    }

    // Define plan configurations
    const planConfigs = {
      basic: {
        amount: 7500, // €75.00
        name: "Plan Básico",
        description: "Plan mensual básico con seguimiento",
        mode: "subscription" as const,
        recurring: { interval: "month" as const },
      },
      premium: {
        amount: 12000, // €120.00
        name: "Plan Premium", 
        description: "Plan mensual con seguimiento personalizado",
        mode: "subscription" as const,
        recurring: { interval: "month" as const },
      },
      pro: {
        amount: 30000, // €300.00
        name: "Plan PRO",
        description: "Plan profesional con entrenamiento personal (mínimo 6 meses)",
        mode: "subscription" as const,
        recurring: { interval: "month" as const },
      },
    };

    const config = planConfigs[planType as keyof typeof planConfigs];
    if (!config) throw new Error("Invalid plan type");

    logStep("Plan configuration", config);

    // Create checkout session
    const sessionParams: any = {
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: config.name,
              description: config.description,
            },
            unit_amount: config.amount,
            ...(config.recurring && { recurring: config.recurring }),
          },
          quantity: 1,
        },
      ],
      mode: config.mode,
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/?cancelled=true`,
    };

    // For PRO plan, set minimum billing cycles (6 months)
    if (planType === "pro" && config.mode === "subscription") {
      sessionParams.subscription_data = {
        billing_cycle_anchor_config: { day_of_month: new Date().getDate() },
        proration_behavior: "none",
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});