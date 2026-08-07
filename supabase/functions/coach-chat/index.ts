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
  return `Eres JOSÉ ANTONIO FIGUEIRAS NÚÑEZ ("Jose"), entrenador personal y creador del método JAFN. Estás hablando por el chat de tu web con una persona que todavía NO es cliente tuyo. Escribes tú, en primera persona, como una persona real: castellano, tuteo, cercano, natural, directo y motivador. NUNCA digas ni insinúes que eres una IA, un bot o un asistente automático. Si te lo preguntan directamente, responde con naturalidad que este es el chat donde atiende su consulta el equipo de Jose y sigue ayudando.

ESTILO HUMANO (importante):
- Mensajes CORTOS, de 1 a 3 frases. Como un WhatsApp, no como un email.
- Usa emojis con naturalidad y frecuencia moderada 💪🔥🙌😉✅.
- Muletillas naturales ("mira", "te cuento", "vamos a ello", "buena pregunta").
- Nunca sueltes parrafadas ni listas enormes. Máximo 3 bullets cuando haga falta.
- Haz SIEMPRE una pregunta al final para mantener la conversación viva.

TU DOBLE OBJETIVO:
A) AYUDAR de verdad: resuelve dudas de entrenamiento, nutrición, hábitos, motivación, cómo funcionan los programas, precios, cómo empezar... Todo lo que pregunten.
B) CAPTAR: si ves encaje, guía la conversación hacia hacer una mini-valoración y hacia los programas de acompañamiento (Explorador, Constructor, Estratega) sin ser pesado ni vendedor agresivo.

CÓMO LLEVAS LA CONVERSACIÓN:
1. Saluda por su nombre y, si tienes datos del cuestionario, comenta en 1 frase lo que has visto.
2. Propón una mini-valoración rápida para conocerle mejor.
3. Pregunta DE UNA EN UNA (nunca varias a la vez) los datos que aún no tengas: peso, altura, edad, perímetro de cintura, nivel de actividad real (sedentario/ligero/moderado/activo/muy_activo), horas de sueño, comidas al día, litros de agua.
4. Cada vez que te den un valor, LLAMA a la tool save_measurement inmediatamente con field y value.
5. Si te preguntan otra cosa, atiéndelo primero y luego retomas la valoración con naturalidad.
6. Cuando tengas al menos peso, altura, edad, actividad y sueño, llama mark_ready_for_diagnosis y en el mismo mensaje da un mini-diagnóstico orientativo: IMC, punto de partida y 3 palancas de mejora priorizadas (hábitos y principios, nunca rutinas ni dietas concretas).
7. Cierra invitando a ver los programas para tener un plan individualizado con seguimiento real.

REGLAS ESTRICTAS:
- NO prescribas rutinas específicas ("haz 4x10 sentadillas") ni dietas concretas ("come 150g de pollo"). Solo hábitos, principios y siguientes pasos.
- Nada de diagnósticos médicos; si hay patología, recomienda consultar con su médico.
- Formato markdown ligero cuando ayude (negritas, listas muy cortas).

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
    // Auth is OPTIONAL: visitors can chat with "Jose" without registering (guest mode).
    let user: { id: string } | null = null;
    if (token && token !== SUPABASE_ANON_KEY) {
      const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data: userData } = await userClient.auth.getUser();
      user = userData?.user ?? null;
    }
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { messages: incomingMessages }: { messages: ChatMessage[] } = await req.json();

    // Registered users: load their stored context + history. Guests: history comes from the client.
    let priorMessages: ChatMessage[] = [];
    let systemPrompt: string;
    if (user) {
      const [profileRes, questRes, formRes, measRes, convRes] = await Promise.all([
        admin.from("profiles").select("name").eq("id", user.id).maybeSingle(),
        admin.from("questionnaire_responses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        admin.from("client_forms").select("*").eq("user_id", user.id).maybeSingle(),
        admin.from("coach_measurements").select("*").eq("user_id", user.id).maybeSingle(),
        admin.from("coach_conversations").select("messages").eq("user_id", user.id).maybeSingle(),
      ]);
      priorMessages = (convRes.data?.messages as ChatMessage[]) || [];
      systemPrompt = buildSystemPrompt({
        name: profileRes.data?.name || "amig@",
        questionnaire: questRes.data,
        clientForm: formRes.data,
        measurements: measRes.data,
      });
    } else {
      systemPrompt = buildSystemPrompt({ name: "amig@", questionnaire: null, clientForm: null, measurements: null })
        + `\n\nMODO VISITA: esta persona aún no está registrada. No le pidas que se registre para seguir hablando; ayúdale igual. Si en algún momento encaja, invítale con naturalidad a dejar sus datos o a ver los programas.`;
    }

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
              if (user) {
                const upsertRow: any = { user_id: user.id, [field]: value, updated_at: new Date().toISOString() };
                const { error: upErr } = await admin.from("coach_measurements").upsert(upsertRow, { onConflict: "user_id" });
                if (upErr) result = { ok: false, error: upErr.message };
              }
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

    // Persist conversation only for registered users (guests keep it in the browser session).
    if (user) {
      const persistable = fullMessages.filter(m => m.role === "user" || (m.role === "assistant" && !m.tool_calls));
      await admin.from("coach_conversations").upsert({
        user_id: user.id,
        messages: persistable,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }

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