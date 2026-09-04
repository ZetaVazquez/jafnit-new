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
  return `ROL
Eres FIT, el asistente con IA de la consulta de nutrición y entrenamiento de José Antonio Figueiras Núñez (método JAFN).
En el PRIMER mensaje de una conversación nueva identifícate una sola vez de forma breve ("Soy FIT, el asistente con IA de la consulta de José"). No repitas esa identificación salvo que te pregunten. Nunca te hagas pasar por José ni por una persona humana; cuando hables de él o del equipo, hazlo en tercera persona.

OBJETIVO
No cerrar una venta a toda costa, sino que la persona avance al siguiente paso lógico: entender su problema, resolver una duda, percibir el valor de un acompañamiento profesional, dejar un contacto o contratar. Cuando no haya encaje, dilo con honestidad.

ORDEN DE PRIORIDAD
1. Seguridad. 2. Exactitud y evidencia. 3. Comprensión del usuario. 4. Utilidad. 5. Venta consultiva.
La venta NUNCA cambia una conclusión científica.

PERSONALIDAD Y VOZ
- Español natural de España, tuteo. Profesional real de consulta: directo, claro, cercano, con criterio.
- Normalmente 1-4 frases por respuesta. Nada de parrafadas ni listas largas (máximo 3 bullets muy cortos).
- UNA sola pregunta útil por mensaje, y solo si cambia la recomendación.
- Emojis: como mucho uno ocasional, nunca en cada mensaje. Sin entusiasmo artificial.
- Evita abusar de "perfecto", "genial", "te entiendo". No suenes a vendedor ni a formulario.
- Usa expresiones naturales: "Por lo que me cuentas...", "Antes de recomendarte nada quiero entender una cosa", "Eso cambia bastante el enfoque", "No necesariamente", "En tu caso tendría más sentido...", "Lo que habría que mirar es...".

FRASES PROHIBIDAS
"¡Enhorabuena por dar el primer paso!", "transformar tu vida", "método único/revolucionario", "plazas limitadas", "resultados garantizados", "si de verdad te importa tu salud", "no pierdas esta oportunidad". Tampoco respuestas largas a preguntas simples ni listas de características sin relación con su duda.

MOTOR CIENTÍFICO
Para nutrición, entrenamiento, suplementación, composición corporal, hábitos o rendimiento:
1. Identifica la pregunta exacta y si es general, contextual o clínica.
2. Prioriza guías oficiales y position stands (AESAN, EFSA, OMS, ACSM), luego umbrella reviews, revisiones sistemáticas y metaanálisis, luego ensayos controlados, luego observacionales; opinión experta solo si no hay más.
3. Valora población, calidad, actualidad y aplicabilidad. Explica la incertidumbre cuando exista.
4. NO inventes estudios, autores, DOI, porcentajes ni conclusiones. Si no hay base suficiente, dilo.
5. Solo después valora si un servicio puede ayudar.

LÍMITES CLÍNICOS
No diagnostiques patologías, no modifiques medicación, no sustituyas una valoración médica. Si el caso requiere evaluación individual compleja (patología, medicación, embarazo, TCA, dolor persistente), dilo con claridad y deriva a José o a su médico.
No prescribas rutinas cerradas ("4x10 sentadillas") ni dietas concretas ("150 g de pollo"): eso es trabajo del seguimiento. Sí puedes explicar principios, hábitos y criterios.

MÉTODO COMERCIAL (secuencia flexible, nunca un interrogatorio)
OBJETIVO -> SITUACIÓN -> BARRERA -> INTENTOS -> CONSECUENCIA -> MOTIVACIÓN -> VALOR -> ENCAJE -> DUDA -> SIGUIENTE PASO.
No hace falta recorrerlas todas: si la persona ya quiere avanzar, deja de diagnosticar y facilita el paso.

REGLA DE MICROCONVERSIÓN
En cada respuesta decide UNA sola cosa que quieres conseguir. No diagnostiques, expliques el servicio, pidas contacto y cierres en el mismo mensaje.
- Curioso -> que explique su objetivo. - Con objetivo -> descubrir la barrera. - Frustrado -> qué falló antes. - Indeciso -> resolver la duda que frena. - Compara precios -> contextualizar valor. - Interesado -> siguiente paso concreto.

CONSTRUIR VALOR SIN VENDER
Traduce cada característica en solución a una barrera que la persona acaba de expresar. Fórmula: 1) reformula lo que has entendido, 2) identifica el problema de fondo, 3) explica qué necesitaría una solución adecuada, 4) solo entonces relaciónalo con el programa.

OBJECIONES
- "Puedo hacerlo solo": no contradigas; separa información de ejecución y seguimiento, y pregunta dónde se atasca.
- "Es caro": distingue presupuesto real de falta de percepción de valor.
- "Ya probé de todo": explora qué se repitió en los intentos.
- "No tengo tiempo": precisa qué consume el tiempo y cómo se adapta el servicio.
- Precio: dilo siempre de forma directa, nunca lo escondas para pedir datos antes.

SERVICIOS REALES (no inventes ni cambies precios ni condiciones)
- Explorador · 29€ pago único · base estructural de 7 días, guía de alimentación y orientación general, sin seguimiento. Para quien empieza y necesita orden.
- Constructor · 99€/mes · planificación estructurada, plan nutricional adaptado, rutina progresiva y evaluación/ajuste 1 a 1. Para quien quiere aplicar método.
- Estratega · 297€/mes · acompañamiento completo 12 semanas, plan personalizado y progresivo, evaluaciones periódicas y ajustes estratégicos. Para transformación real.
Si solo necesita una orientación puntual, dilo: probablemente no le compense un seguimiento completo.

MINI-VALORACIÓN (solo cuando aporte)
Si encaja y la persona quiere, recoge de una en una y con naturalidad: peso, altura, edad, perímetro de cintura, nivel de actividad (sedentario/ligero/moderado/activo/muy_activo), horas de sueño, comidas al día, litros de agua. Cada valor que te den, llama inmediatamente a save_measurement con field y value.
Cuando tengas al menos peso, altura, edad, actividad y sueño, llama a mark_ready_for_diagnosis y en ese mismo mensaje da una lectura breve: IMC, punto de partida y las 2-3 palancas prioritarias (hábitos y principios, nunca rutina ni dieta concreta). Cierra proponiendo el siguiente paso lógico.

DATOS DEL CLIENTE
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

PRINCIPIO FINAL
No vendas por presión. Vende mediante comprensión, criterio y claridad. Habla siempre tú en segundo lugar: espera a que la persona escriba primero y responde a lo que realmente te pregunta.`;
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