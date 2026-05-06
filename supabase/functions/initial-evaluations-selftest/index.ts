// Self-test endpoint that verifies initial_evaluations save & read flow.
// Uses the service role to bypass RLS and clean up after itself.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

export interface SelfTestReport {
  ok: boolean;
  steps: { name: string; ok: boolean; detail?: string }[];
}

export async function runSelfTest(): Promise<SelfTestReport> {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const steps: SelfTestReport["steps"] = [];
  const record = (name: string, ok: boolean, detail?: string) =>
    steps.push({ name, ok, detail });

  // Create temp auth user so FK / RLS-shaped flows behave realistically.
  const email = `selftest+${crypto.randomUUID()}@jafn.test`;
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password: crypto.randomUUID(),
    email_confirm: true,
  });
  if (createErr || !created?.user) {
    record("create_user", false, createErr?.message);
    return { ok: false, steps };
  }
  const userId = created.user.id;
  record("create_user", true);

  try {
    // INSERT
    const insertPayload = {
      user_id: userId,
      block_1_identification: { full_name: "Self Test", age: 30 },
    };
    const ins = await admin
      .from("initial_evaluations")
      .insert(insertPayload)
      .select("*")
      .single();
    record("insert", !ins.error, ins.error?.message);
    if (ins.error) throw ins.error;

    // UPDATE another block
    const upd = await admin
      .from("initial_evaluations")
      .update({ block_2_health_screening: { has_conditions: false } })
      .eq("id", ins.data.id)
      .select("*")
      .single();
    record(
      "update",
      !upd.error && upd.data?.block_2_health_screening?.has_conditions === false,
      upd.error?.message,
    );

    // SELECT
    const sel = await admin
      .from("initial_evaluations")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    const selOk =
      !sel.error &&
      sel.data?.block_1_identification?.full_name === "Self Test" &&
      sel.data?.block_2_health_screening?.has_conditions === false;
    record("select", selOk, sel.error?.message);

    // Mark completed
    const done = await admin
      .from("initial_evaluations")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", ins.data.id)
      .select("completed")
      .single();
    record("complete", !done.error && done.data?.completed === true, done.error?.message);
  } finally {
    await admin.from("initial_evaluations").delete().eq("user_id", userId);
    await admin.auth.admin.deleteUser(userId);
  }

  const ok = steps.every((s) => s.ok);
  return { ok, steps };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const report = await runSelfTest();
    return new Response(JSON.stringify(report), {
      status: report.ok ? 200 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});