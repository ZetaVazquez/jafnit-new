import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { computeTargets, genericTargets } from "../_shared/nutrition.ts";
import { computeMealFromIngredients, normalize as normName } from "../_shared/bedca.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "no auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Verify caller is admin
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roleData } = await admin.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleData) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { user_id, type, duration } = await req.json();
    if (!user_id || !["workout", "diet"].includes(type)) {
      return new Response(JSON.stringify({ error: "invalid params" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Duration mapping
    const WORKOUT_DURATIONS: Record<string, { label: string; days: string[] }> = {
      "1_day": { label: "1 Día", days: ["Día 1"] },
      "1_week": { label: "1 Semana", days: ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"] },
      "15_days": { label: "15 Días", days: Array.from({length:15},(_,i)=>`Día ${i+1}`) },
      "1_month": { label: "1 Mes", days: Array.from({length:28},(_,i)=>`Día ${i+1}`) },
    };
    const DIET_DURATIONS: Record<string, { label: string; days: string[] }> = {
      "1_day": { label: "1 Día", days: ["Día 1"] },
      "3_days": { label: "3 Días", days: ["Día 1","Día 2","Día 3"] },
      "1_week": { label: "1 Semana", days: ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"] },
    };
    const durationKey = duration || "1_week";
    const durationConfig = type === "workout"
      ? (WORKOUT_DURATIONS[durationKey] || WORKOUT_DURATIONS["1_week"])
      : (DIET_DURATIONS[durationKey] || DIET_DURATIONS["1_week"]);

    // Load questionnaire + initial evaluation
    const { data: profile } = await admin.from("profiles").select("name, email").eq("id", user_id).single();
    const { data: questionnaire } = await admin.from("questionnaire_responses").select("*").eq("user_id", user_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    const { data: initial } = await admin.from("initial_evaluations").select("*").eq("user_id", user_id).maybeSingle();
    const { data: clientForm } = await admin.from("client_forms").select("*").eq("user_id", user_id).order("created_at", { ascending: false }).limit(1).maybeSingle();

    // Detect if we have enough data — otherwise generate a GENERIC plan
    const hasInitial = !!initial && Object.values(initial).some((v:any) =>
      v && typeof v === "object" && Object.keys(v).length > 0
    );
    const isGeneric = !questionnaire && !hasInitial && !clientForm;

    const profileSummary = {
      name: profile?.name,
      questionnaire,
      initial_evaluation: initial,
      client_form: clientForm,
      _note: isGeneric ? "NO HAY DATOS DEL CLIENTE. Genera un plan GENÉRICO equilibrado para adulto promedio." : undefined,
    };

    if (type === "workout") {
      const { data: exercises } = await admin.from("exercises_library").select("id, name, muscle_group, difficulty, equipment");
      const exList = (exercises || []).map(e => `- [${e.id}] ${e.name} (${e.muscle_group}, ${e.difficulty})`).join("\n");

      const systemPrompt = `Eres un entrenador personal experto del método JAFN. Genera un plan de entrenamiento adaptado a los datos del cliente. SOLO puedes elegir ejercicios de la biblioteca proporcionada usando su exact id. Devuelve JSON estricto.
IMPORTANTE: El plan debe tener EXACTAMENTE ${durationConfig.days.length} día(s) usando estos nombres en este orden: ${durationConfig.days.join(", ")}. NO añadas días extra.${isGeneric ? "\nEl cliente NO ha rellenado cuestionario: genera un plan GENÉRICO equilibrado de dificultad intermedia." : ""}`;
      const userPrompt = `Datos del cliente:\n${JSON.stringify(profileSummary, null, 2)}\n\nBiblioteca disponible:\n${exList}\n\nDías a generar (${durationConfig.days.length}): ${durationConfig.days.join(", ")}`;

      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          tools: [{
            type: "function",
            function: {
              name: "build_workout_plan",
              description: "Construye un plan de entrenamiento semanal",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  difficulty_level: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
                  days: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "string" },
                        items: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              exercise_id: { type: "string" },
                              sets: { type: "number" },
                              reps: { type: "string" },
                              rest_seconds: { type: "number" },
                              notes: { type: "string" }
                            },
                            required: ["exercise_id", "sets", "reps", "rest_seconds"]
                          }
                        }
                      },
                      required: ["day", "items"]
                    }
                  }
                },
                required: ["title", "description", "difficulty_level", "days"]
              }
            }
          }],
          tool_choice: { type: "function", function: { name: "build_workout_plan" } }
        })
      });

      if (!aiResp.ok) {
        const t = await aiResp.text();
        console.error("AI error", aiResp.status, t);
        if (aiResp.status === 429) return new Response(JSON.stringify({ error: "Rate limit, intenta de nuevo en un momento." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (aiResp.status === 402) return new Response(JSON.stringify({ error: "Sin créditos en Lovable AI." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error("AI gateway error");
      }

      const aiData = await aiResp.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("AI did not return tool call");
      const args = JSON.parse(toolCall.function.arguments);

      // Enrich items with library data
      const exMap = new Map((exercises || []).map(e => [e.id, e] as const));
      const { data: libFull } = await admin.from("exercises_library").select("*");
      const libMap = new Map((libFull || []).map(e => [e.id, e] as const));
      let enrichedDays = (args.days || []).map((d: any) => ({
        day: d.day,
        items: (d.items || []).filter((it: any) => libMap.has(it.exercise_id)).map((it: any) => {
          const lib = libMap.get(it.exercise_id)!;
          return {
            exercise_id: lib.id, name: lib.name, muscle_group: lib.muscle_group,
            video_url: lib.video_url, thumbnail_url: lib.thumbnail_url,
            sets: it.sets, reps: it.reps, rest_seconds: it.rest_seconds, notes: it.notes || ""
          };
        })
      })).filter((d: any) => d.items.length > 0);
      // Enforce duration: trim or pad
      enrichedDays = enrichedDays.slice(0, durationConfig.days.length);

      const { error } = await admin.from("workout_plans").insert({
        title: (isGeneric ? "[Genérico] " : "") + args.title,
        description: args.description,
        user_id, assigned_to: user_id,
        difficulty_level: args.difficulty_level,
        status: "draft", generated_by_ai: true,
        exercises: { duration: durationKey, duration_label: durationConfig.label, days: enrichedDays, is_generic: isGeneric }
      });
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // DIET
    const { data: meals } = await admin.from("meals_library").select("id, name, meal_type, calories, protein_g, carbs_g, fats_g, diet_tags");
    const mealsList = (meals || []).map(m => `- [${m.id}] ${m.name} (${m.meal_type}, ${m.calories ?? "?"} kcal)`).join("\n");

    const systemPrompt = `Eres un nutricionista del método JAFN. Genera un plan de dieta. SOLO usa comidas de la biblioteca por su id. Devuelve JSON estricto.
IMPORTANTE:
- El plan debe tener EXACTAMENTE ${durationConfig.days.length} día(s) usando estos nombres en este orden: ${durationConfig.days.join(", ")}. NO añadas días extra.
- Para CADA día debes incluir EXACTAMENTE 2 OPCIONES por cada tipo de comida (breakfast, lunch, snack, dinner). Es decir, 8 entradas por día (2 breakfast, 2 lunch, 2 snack, 2 dinner). NUNCA repitas la misma comida dentro del mismo tipo y día.
- Para CADA entrada, rellena el campo "quantity" con la cantidad en gramos/unidades/ml ajustada al peso, altura, sexo y objetivo del cliente (ej: "150 g de pechuga + 80 g arroz integral cocido").
- Para CADA entrada, rellena el campo "notes" con las instrucciones de PREPARACIÓN paso a paso de la receta (ej: "Cocer el arroz 12 min, plancha la pechuga 4 min/lado con AOVE, salpimentar"). Las notas deben respetar las intolerancias, alergias y restricciones del cliente del cuestionario, y deben ajustar técnicas y acompañamientos a su objetivo (déficit, mantenimiento o volumen).${isGeneric ? "\n- El cliente NO ha rellenado cuestionario: genera un plan GENÉRICO equilibrado de ~2000 kcal con cantidades estándar para adulto promedio." : ""}`;
    const userPrompt = `Datos del cliente:\n${JSON.stringify(profileSummary, null, 2)}\n\nBiblioteca disponible:\n${mealsList}\n\nDías a generar (${durationConfig.days.length}): ${durationConfig.days.join(", ")}\nRecuerda: 2 opciones POR CADA tipo de comida (8 entradas/día), con quantity en gramos/unidades reales y notes con la preparación detallada y personalizada.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        tools: [{
          type: "function",
          function: {
            name: "build_diet_plan",
            description: "Construye un plan de dieta",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                calories_target: { type: "number" },
                days: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      day: { type: "string" },
                      meals: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            meal_id: { type: "string" },
                            quantity: { type: "string" },
                            notes: { type: "string" }
                          },
                          required: ["meal_id", "quantity", "notes"]
                        }
                      }
                    },
                    required: ["day", "meals"]
                  }
                }
              },
              required: ["title", "description", "calories_target", "days"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "build_diet_plan" } }
      })
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI error", aiResp.status, t);
      if (aiResp.status === 429) return new Response(JSON.stringify({ error: "Rate limit." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiResp.status === 402) return new Response(JSON.stringify({ error: "Sin créditos." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error");
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI did not return tool call");
    const args = JSON.parse(toolCall.function.arguments);

    const { data: libFull } = await admin.from("meals_library").select("*");
    const libMap = new Map((libFull || []).map(m => [m.id, m] as const));
    let enrichedDays = (args.days || []).map((d: any) => ({
      day: d.day,
      meals: (d.meals || []).filter((m: any) => libMap.has(m.meal_id)).map((m: any) => {
        const lib = libMap.get(m.meal_id)!;
        return {
          meal_id: lib.id, name: lib.name, meal_type: lib.meal_type, image_url: lib.image_url,
          calories: lib.calories, protein_g: lib.protein_g, carbs_g: lib.carbs_g, fats_g: lib.fats_g,
          quantity: m.quantity || "1 ración", notes: m.notes || ""
        };
      })
    })).filter((d: any) => d.meals.length > 0);
    enrichedDays = enrichedDays.slice(0, durationConfig.days.length);

    const { error } = await admin.from("diet_plans").insert({
      title: (isGeneric ? "[Genérico] " : "") + args.title,
      description: args.description,
      user_id, assigned_to: user_id,
      calories_target: args.calories_target,
      status: "draft", generated_by_ai: true,
      meal_plan: { duration: durationKey, duration_label: durationConfig.label, days: enrichedDays, is_generic: isGeneric }
    });
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("generate-plans error", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});