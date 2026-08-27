import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY no configurada" }, 500);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "no auth" }, 401);

    // Only admins may spend AI credits here
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "unauthorized" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roleData } = await admin
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleData) return json({ error: "forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const mode = body?.mode === "status" ? "status" : "generate";

    // Progress report: how many dishes still need a photo
    if (mode === "status") {
      const { count: total } = await admin.from("meals_library").select("id", { count: "exact", head: true });
      const { count: pending } = await admin
        .from("meals_library").select("id", { count: "exact", head: true }).is("image_url", null);
      return json({ total: total ?? 0, pending: pending ?? 0, done: (total ?? 0) - (pending ?? 0) });
    }

    // Generate the photo of ONE dish (the client loops to show per-dish progress and can resume anytime)
    const mealId: string | undefined = body?.meal_id;
    let meal;
    if (mealId) {
      const { data } = await admin.from("meals_library").select("*").eq("id", mealId).maybeSingle();
      meal = data;
    } else {
      const { data } = await admin
        .from("meals_library").select("*").is("image_url", null).order("name").limit(1).maybeSingle();
      meal = data;
    }
    if (!meal) return json({ done: true, message: "No quedan platos pendientes" });

    const prompt = `Fotografía profesional de comida, plano cenital, de "${meal.name}". ` +
      `${meal.ingredients ? `Ingredientes visibles: ${meal.ingredients}. ` : ""}` +
      `Plato servido en vajilla oscura sobre fondo de pizarra gris oscuro, luz natural lateral suave, ` +
      `estilo editorial de nutrición deportiva, altamente apetecible, sin texto ni marcas de agua.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!aiResp.ok) {
      const text = await aiResp.text();
      console.error("AI image error", aiResp.status, text);
      // Se devuelve 200 con el estado dentro del cuerpo: el cliente pausa la cola
      // y el preview no marca la invocación como error de runtime.
      if (aiResp.status === 402) {
        return json({ ok: false, error: "Sin créditos de IA. Recarga créditos y reanuda la generación.", code: "no_credits", meal_id: meal.id, meal_name: meal.name });
      }
      if (aiResp.status === 429) {
        return json({ ok: false, error: "Límite de peticiones alcanzado, espera unos segundos.", code: "rate_limit", meal_id: meal.id, meal_name: meal.name });
      }
      return json({ ok: false, error: `Error de la IA (${aiResp.status})`, code: "ai_error", meal_id: meal.id, meal_name: meal.name });
    }


    const aiData = await aiResp.json();
    const b64 = aiData?.data?.[0]?.b64_json;
    if (!b64) {
      console.error("No image payload", JSON.stringify(aiData).slice(0, 500));
      return json({ error: "La IA no devolvió imagen", meal_id: meal.id, meal_name: meal.name }, 502);
    }

    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const path = `library/${meal.id}.png`;
    const { error: upErr } = await admin.storage.from("meal-media").upload(path, bytes, {
      contentType: "image/png",
      upsert: true,
    });
    if (upErr) throw upErr;

    const { data: pub } = admin.storage.from("meal-media").getPublicUrl(path);
    const { error: updErr } = await admin
      .from("meals_library").update({ image_url: pub.publicUrl }).eq("id", meal.id);
    if (updErr) throw updErr;

    return json({ success: true, meal_id: meal.id, meal_name: meal.name, image_url: pub.publicUrl });
  } catch (e) {
    console.error("generate-meal-photos error", e);
    return json({ error: (e as Error).message }, 500);
  }
});
