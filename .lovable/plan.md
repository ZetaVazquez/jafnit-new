
# Coach IA para clientes NO activos

Un chat automático que aparece justo después de terminar el cuestionario de la home. Habla en tono cercano de personal trainer, ya conoce las respuestas del cuestionario, pide medidas clave paso a paso, las guarda en su ficha, y al final ofrece un mini-plan orientativo con consejos generales de mejora e invita a suscribirse para el plan real.

## Cómo se comportará

1. Al terminar el cuestionario de la home (usuario recién registrado, aún no activo), en vez de pasar directo al modal de pago, se abre la conversación con el "Coach JAFN".
2. El coach saluda por su nombre, resume en 1–2 frases lo que ha entendido del cuestionario (objetivo, situación, disponibilidad) y le propone hacer una "mini-valoración" de 4–6 preguntas.
3. Va preguntando de una en una, con lenguaje natural, y **guarda cada respuesta** en la ficha del cliente:
   - Peso actual, altura, edad (si no las tiene ya)
   - Perímetro de cintura
   - Nivel de actividad diaria real (sedentario / ligero / activo)
   - Horas de sueño medias
   - Nº de comidas al día y consumo de agua aproximado
4. Con esos datos + los del cuestionario da un **mini-diagnóstico orientativo**: IMC, punto de partida, 3 palancas de mejora priorizadas (ej. "duermes poco → recuperación", "poca proteína → saciedad", "sedentarismo → 8k pasos").
5. Cierra con un mensaje motivacional del estilo "esto es una foto general; para tu plan individualizado con seguimiento real, mira los programas" + botón que abre el modal de suscripción.
6. La conversación queda **guardada como un único hilo por usuario** y se puede retomar desde su área privada (badge de "Coach IA" en el sidebar). Al volver, el coach reanuda desde donde lo dejaron.

Reglas importantes:
- El coach **no** prescribe rutinas ni dietas concretas (nada de "haz 4x10 sentadillas" o "come 150g de pollo"): solo hábitos, principios y siguientes pasos.
- Todo en castellano, tuteando, tono José Antonio (directo, cercano, motivador).
- Se muestra como personal trainer, sin destapar que es IA salvo si el usuario lo pregunta directamente.

## Dónde vive en la app

- **Auto-apertura**: al completar `Questionnaire.tsx` (home). En vez de saltar solo a `AuthModal → ClientForm`, tras el registro se abre el chat como pantalla completa.
- **Acceso permanente** para clientes no activos: nueva entrada "Coach IA" en el sidebar/menú del usuario logueado sin suscripción, y CTA en su dashboard vacío.
- Para clientes activos no se muestra (ya tienen plan real).

## Detalles técnicos

Modelo: Lovable AI Gateway con `google/gemini-3.6-flash` (rápido y barato para chat multivuelta). System prompt en servidor, nunca en cliente.

Backend (nuevas piezas):
- Tabla `coach_conversations` (una fila por usuario): `user_id` (PK única), `messages jsonb[]`, `updated_at`. RLS: el usuario ve/edita solo la suya; admin puede leer todas.
- Tabla `coach_measurements`: `user_id`, `weight_kg`, `height_cm`, `age`, `waist_cm`, `activity_level`, `sleep_hours`, `meals_per_day`, `water_l`, `updated_at`. Upsert por `user_id`. RLS igual.
- Edge function `coach-chat`:
  - Entrada: `{ messages }` (el hilo completo se manda cada vez — el modelo es stateless).
  - Carga respuestas del cuestionario (`questionnaire_responses` + `client_forms`) y medidas ya guardadas, las inyecta en el system prompt.
  - Usa AI SDK con streaming (`streamText` + `toUIMessageStreamResponse`) y define **tools**:
    - `save_measurement({ field, value })` → upsert en `coach_measurements`.
    - `mark_ready_for_diagnosis()` → señal al front para renderizar el bloque final con CTA a planes.
  - Al finalizar (`onFinish`) persiste el hilo actualizado en `coach_conversations`.
- RPC `admin_read_coach_conversation(p_user_id)` con `SECURITY DEFINER` para que el admin lo vea desde su panel.

Frontend (nuevas piezas):
- Instalar AI Elements (`conversation`, `message`, `prompt-input`, `shimmer`) y `@ai-sdk/react` + `ai`.
- `src/components/Coach/CoachChat.tsx`: usa `useChat` con `DefaultChatTransport` apuntando a la edge function, `id = user.id` (hilo único), carga los mensajes previos al montar.
- `src/components/Coach/CoachLauncher.tsx`: envoltorio full-screen con el branding (avatar JAFN, verde/negro).
- Enganches en `Index.tsx`: tras `handleClientFormComplete` → abrir `CoachLauncher` en vez de dashboard directo; añadir botón "Coach IA" cuando `!hasActiveSubscription`.
- En `AdminClientsTable`: botón "Ver chat coach" que abre el hilo en modo lectura.

Seguridad:
- `LOVABLE_API_KEY` ya está — no pedimos nada al usuario.
- Toda llamada al modelo desde la edge function; nunca desde el navegador.
- RLS en ambas tablas nuevas + GRANTs a `authenticated` y `service_role`.

## Fuera de alcance (para no inflar esto)
- Notificaciones por email del coach.
- Voz / audio.
- Recordatorios diarios automáticos.
- Panel admin para editar el system prompt (irá hardcodeado inicialmente; se puede iterar después).

¿Le damos caña con esto tal cual?
