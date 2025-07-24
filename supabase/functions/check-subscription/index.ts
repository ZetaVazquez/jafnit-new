import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY is not set");
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified", { keyExists: !!stripeKey, keyPrefix: stripeKey.substring(0, 7) });

    // Use service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header provided");
      throw new Error("No authorization header provided");
    }
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    
    // Use anon key for user authentication instead of service role
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    logStep("Attempting user authentication");
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError) {
      logStep("ERROR: Authentication failed", { error: userError.message });
      throw new Error(`Authentication error: ${userError.message}`);
    }
    const user = userData.user;
    if (!user?.email) {
      logStep("ERROR: User not authenticated or email not available");
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    logStep("Initializing Stripe client");
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists in Stripe
    logStep("Checking for Stripe customer", { email: user.email });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      
      // Update database with inactive status
      await supabaseClient.from("stripe_subscriptions").upsert({
        user_id: user.id,
        stripe_customer_id: null,
        plan_type: "none",
        status: "inactive",
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      return new Response(JSON.stringify({ 
        subscribed: false,
        plan_type: null,
        subscription_end: null,
        is_basic_plan: false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    // Check for one-time payments (basic plan)
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 10,
    });

    let hasActiveSubscription = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionEnd = null;
    let isBasicPlan = false;

    if (hasActiveSubscription) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      // Determine subscription tier from price
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      
      if (amount <= 15000) { // Up to €150
        subscriptionTier = "premium";
      } else {
        subscriptionTier = "pro";
      }
      logStep("Determined subscription tier", { priceId, amount, subscriptionTier });

      // Update database
      await supabaseClient.from("stripe_subscriptions").upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        plan_type: subscriptionTier,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: subscriptionEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    } else {
      // Check for completed one-time payments (basic plan)
      const completedSessions = sessions.data.filter(s => s.payment_status === 'paid' && s.mode === 'payment');
      if (completedSessions.length > 0) {
        isBasicPlan = true;
        subscriptionTier = "basic";
        logStep("Found completed basic plan payment");

        // Update database for basic plan
        await supabaseClient.from("stripe_subscriptions").upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: null,
          plan_type: "basic",
          status: "active",
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      } else {
        logStep("No active subscription or basic plan found");
      }
    }

    const responseData = {
      subscribed: hasActiveSubscription || isBasicPlan,
      plan_type: subscriptionTier,
      subscription_end: subscriptionEnd,
      is_basic_plan: isBasicPlan
    };

    logStep("Returning subscription status", responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});