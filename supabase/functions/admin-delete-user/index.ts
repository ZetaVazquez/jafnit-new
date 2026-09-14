import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Elimina por completo un cliente (cuenta + datos asociados).
 * Sólo puede ejecutarla un usuario con rol de administrador.
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "No autenticado" }, 401);

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user) return json({ error: "Sesión no válida" }, 401);

    const caller = userData.user;

    // Comprobamos el rol de administrador en la tabla de roles.
    const { data: isAdmin, error: roleError } = await admin.rpc("has_role", {
      _user_id: caller.id,
      _role: "admin",
    });
    if (roleError) return json({ error: roleError.message }, 500);
    if (!isAdmin) return json({ error: "No tienes permisos de administrador" }, 403);

    const { userId } = await req.json();
    if (!userId) return json({ error: "Falta el identificador del cliente" }, 400);
    if (userId === caller.id) return json({ error: "No puedes eliminar tu propia cuenta" }, 400);

    // Borramos los datos dependientes que no tienen borrado en cascada.
    const tables = [
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

    for (const table of tables) {
      const { error } = await admin.from(table).delete().eq("user_id", userId);
      if (error) console.log(`[ADMIN-DELETE-USER] ${table}: ${error.message}`);
    }

    // Planes asignados al cliente por el administrador.
    await admin.from("diet_plans").delete().eq("assigned_to", userId);
    await admin.from("workout_plans").delete().eq("assigned_to", userId);
    await admin.from("profiles").delete().eq("id", userId);

    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) return json({ error: deleteError.message }, 500);

    return json({ success: true });
  } catch (error) {
    console.error("[ADMIN-DELETE-USER]", error);
    return json({ error: error instanceof Error ? error.message : "Error desconocido" }, 500);
  }
});
