import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const MODEL = "google/gemini-3.6-flash";

type ChatMessage = { role: "system" | "user" | "assistant" | "tool"; content: string; tool_call_id?: string; tool_calls?: any[] };

const tools = [
  {
    type: "function",
    function: {
      name: "save_measurement",
      description: "Guarda una medida o dato del cliente en su ficha. Llama esta función cada vez que el usuario te confirme un valor (peso, altura, edad, cintura, actividad, sueño, comidas, agua).",
      parameters: {
        type: "object",
        properties: {
          field: {
            type: "string",
            enum: ["weight_kg", "height_cm", "age", "waist_cm", "activity_level", "sleep_hours", "meals_per_day", "water_l"],
          },
          value: { type: ["number", "string"], description: "Valor numérico, o para activity_level uno de: sedentario, ligero, moderado, activo, muy_activo" },
        },
        required: ["field", "value"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "mark_ready_for_diagnosis",
      description: "Llama esta función cuando ya tengas suficientes datos para dar el mini-diagnóstico orientativo final.",
      parameters: { type: "object", properties: {} },
    },
  },
];

function buildSystemPrompt(ctx: {
  name: string;
  questionnaire: any;
  clientForm: any;
  measurements: any;
}) {
  const q = ctx.questionnaire || {};
  const cf = ctx.clientForm || {};
  const m = ctx.measurements || {};
  return `Eres "Coach JAFN", el personal trainer de José Antonio Figueiras Núñez. Hablas en castellano, tuteando, tono directo, cercano y motivador. NO reveles que eres una IA salvo que te lo pregunten directamente.

Tu misión con este cliente NO ACTIVO (aún no ha contratado plan):
1. Saluda por su nombre y resume en 1-2 frases lo que has entendido de su cuestionario inicial.
2. Propón hacer una "mini-valoración" corta (4-6 preguntas) para conocerle mejor.
3. Pregunta DE UNA EN UNA (nunca varias a la vez) los datos que aún no tengas: peso, altura, edad, perímetro de cintura, nivel de actividad real (sedentario/ligero/moderado/activo/muy_activo), horas de sueño medias, comidas al día, litros de agua.
4. Cada vez que el usuario te dé un valor, LLAMA a la tool save_measurement inmediatamente con field y value.
5. Cuando tengas al menos peso, altura, edad, actividad y sueño, llama mark_ready_for_diagnosis y en el mismo mensaje da un mini-diagnóstico orientativo: calcula IMC, punto de partida general, y 3 palancas de mejora priorizadas (hábitos generales, no rutinas ni dietas concretas).
6. Cierra invitándole a ver los programas para su plan personalizado real.

REGLAS ESTRICTAS:
- NO prescribas rutinas específicas ("haz 4x10 sentadillas") ni dietas concretas ("come 150g de pollo"). Solo hábitos, principios, siguientes pasos.
- Mensajes cortos y conversacionales, máx 3-4 frases por turno.
- Usa emojis con moderación (💪 🎯 🔥 ✅).
- Formato markdown ligero cuando ayude (negritas, listas cortas).

DATOS DEL CLIENTE:
- Nombre: ${ctx.name}
- Cuestionario inicial: ${JSON.stringify({
    objetivo: q.health_goals,
    situacion_actual: q.activity_level,
    compromiso: q.exercise_frequency,
    vida_diaria: q.dietary_preferences,
    inversion: q.health_conditions,
  })}
- Ficha: ${JSON.stringify({ edad: cf.age, altura: cf.height, peso: cf.weight, objetivos: cf.goals })}
- Medidas ya guardadas: ${JSON.stringify({
    peso: m.weight_kg,
    altura: m.height_cm,
    edad: m.age,
    cintura: m.waist_cm,
    actividad: m.activity_level,
    sueño: m.sleep_hours,
    comidas: m.meals_per_day,
    agua: m.water_l,
  })}

Si es el PRIMER mensaje del hilo (no hay historial), empieza tú saludando y proponiendo la mini-valoración.`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const user = userData.user;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { messages: incomingMessages }: { messages: ChatMessage[] } = await req.json();

    // Load context in parallel
    const [profileRes, questRes, formRes, measRes, convRes] = await Promise.all([
      admin.from("profiles").select("name").eq("id", user.id).maybeSingle(),
      admin.from("questionnaire_responses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      admin.from("client_forms").select("*").eq("user_id", user.id).maybeSingle(),
      admin.from("coach_measurements").select("*").eq("user_id", user.id).maybeSingle(),
      admin.from("coach_conversations").select("messages").eq("user_id", user.id).maybeSingle(),
    ]);

    const priorMessages: ChatMessage[] = (convRes.data?.messages as ChatMessage[]) || [];
    const systemPrompt = buildSystemPrompt({
      name: profileRes.data?.name || "amig@",
      questionnaire: questRes.data,
      clientForm: formRes.data,
      measurements: measRes.data,
    });

    // Merge prior + new incoming user messages. Client sends only NEW user message(s).
    const fullMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...priorMessages,
      ...incomingMessages,
    ];

    let readyForDiagnosis = false;
    let assistantFinal: ChatMessage | null = null;
    const savedMeasurements: any = {};

    // Tool loop (max 5 iterations)
    for (let i = 0; i < 5; i++) {
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": LOVABLE_API_KEY,
        },
        body: JSON.stringify({ model: MODEL, messages: fullMessages, tools, tool_choice: "auto" }),
      });

      if (!aiRes.ok) {
        const errText = await aiRes.text();
        if (aiRes.status === 429) {
          return new Response(JSON.stringify({ error: "Demasiadas peticiones. Prueba en un momento." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        if (aiRes.status === 402) {
          return new Response(JSON.stringify({ error: "Se ha agotado el crédito de IA. Contacta con el administrador." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        console.error("AI gateway error:", aiRes.status, errText);
        return new Response(JSON.stringify({ error: "Error del asistente" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const data = await aiRes.json();
      const msg = data.choices?.[0]?.message;
      if (!msg) break;

      // If tool calls, execute and continue
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        fullMessages.push({ role: "assistant", content: msg.content || "", tool_calls: msg.tool_calls });
        for (const call of msg.tool_calls) {
          const fname = call.function?.name;
          const args = JSON.parse(call.function?.arguments || "{}");
          let result: any = { ok: true };
          if (fname === "save_measurement") {
            const { field, value } = args;
            const allowed = ["weight_kg", "height_cm", "age", "waist_cm", "activity_level", "sleep_hours", "meals_per_day", "water_l"];
            if (allowed.includes(field)) {
              savedMeasurements[field] = value;
              const upsertRow: any = { user_id: user.id, [field]: value, updated_at: new Date().toISOString() };
              const { error: upErr } = await admin.from("coach_measurements").upsert(upsertRow, { onConflict: "user_id" });
              if (upErr) result = { ok: false, error: upErr.message };
            } else {
              result = { ok: false, error: "campo no permitido" };
            }
          } else if (fname === "mark_ready_for_diagnosis") {
            readyForDiagnosis = true;
          }
          fullMessages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
        }
        continue;
      }

      // Final assistant message
      assistantFinal = { role: "assistant", content: msg.content || "" };
      fullMessages.push(assistantFinal);
      break;
    }

    // Persist conversation (strip system + tool internals for storage; keep user/assistant text)
    const persistable = fullMessages.filter(m => m.role === "user" || (m.role === "assistant" && !m.tool_calls));
    await admin.from("coach_conversations").upsert({
      user_id: user.id,
      messages: persistable,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    return new Response(JSON.stringify({
      reply: assistantFinal?.content || "",
      readyForDiagnosis,
      savedMeasurements,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("coach-chat error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});