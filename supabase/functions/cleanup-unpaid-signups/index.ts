import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GRACE_MINUTES = 10;
const PROTECTED_EMAILS = [
  "josefiguenu@gmail.com",
  "consultajafn@gmail.com",
  "zaiidav347@gmail.com",
];

const TABLES = [
  "activity_logs",
  "body_measurements",
  "client_forms",
  "client_progress_reviews",
  "coach_conversations",
  "coach_measurements",
  "daily_goals",
  "daily_progress",
  "diet_plans",
  "guide_purchases",
  "initial_evaluations",
  "lead_followups",
  "pending_payments",
  "questionnaire_responses",
  "stripe_customers",
  "stripe_subscriptions",
  "subscriptions",
  "terms_acceptances",
  "user_modal_interactions",
  "user_notifications",
  "user_roles",
  "user_testimonials",
  "workout_plans",
];

/**
 * Borra las cuentas creadas hace más de 10 minutos que nunca han pagado
 * (sin suscripción, sin suscripción de Stripe y sin pago pendiente).
 * Se ejecuta periódicamente desde una tarea programada.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const cutoff = Date.now() - GRACE_MINUTES * 60 * 1000;

    const { data: list, error: listError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (listError) return json({ error: listError.message }, 500);

    const candidates = (list?.users ?? []).filter((u) => {
      if (!u.created_at) return false;
      if (new Date(u.created_at).getTime() > cutoff) return false;
      return !PROTECTED_EMAILS.includes((u.email ?? "").toLowerCase());
    });

    const deleted: string[] = [];

    for (const user of candidates) {
      const [roles, subs, stripeSubs, pending, purchases] = await Promise.all([
        admin.from("user_roles").select("role").eq("user_id", user.id),
        admin.from("subscriptions").select("id").eq("user_id", user.id),
        admin.from("stripe_subscriptions").select("id").eq("user_id", user.id),
        admin.from("pending_payments").select("id").eq("user_id", user.id),
        admin.from("guide_purchases").select("id").eq("user_id", user.id),
      ]);

      const isAdmin = (roles.data ?? []).some((r: any) => r.role === "admin");
      const hasPaidTrace =
        (subs.data?.length ?? 0) > 0 ||
        (stripeSubs.data?.length ?? 0) > 0 ||
        (pending.data?.length ?? 0) > 0 ||
        (purchases.data?.length ?? 0) > 0;

      if (isAdmin || hasPaidTrace) continue;

      for (const table of TABLES) {
        const { error } = await admin.from(table).delete().eq("user_id", user.id);
        if (error) console.log(`[CLEANUP] ${table}: ${error.message}`);
      }
      await admin.from("diet_plans").delete().eq("assigned_to", user.id);
      await admin.from("workout_plans").delete().eq("assigned_to", user.id);
      await admin.from("profiles").delete().eq("id", user.id);

      const { error: delError } = await admin.auth.admin.deleteUser(user.id);
      if (delError) {
        console.log(`[CLEANUP] deleteUser ${user.id}: ${delError.message}`);
        continue;
      }
      deleted.push(user.id);
    }

    console.log(`[CLEANUP] cuentas eliminadas: ${deleted.length}`);
    return json({ success: true, deleted: deleted.length });
  } catch (error) {
    console.error("[CLEANUP]", error);
    return json({ error: error instanceof Error ? error.message : "Error desconocido" }, 500);
  }
});
