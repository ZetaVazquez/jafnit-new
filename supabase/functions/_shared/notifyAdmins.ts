// Avisa a todos los administradores de que un cliente ha pagado un programa.
// dedupe_key evita avisos duplicados (webhook + check-subscription).
export async function notifyAdminsOfPayment(
  admin: any,
  opts: { userId: string; plan: string; amount: number; ref: string },
) {
  try {
    const { data: admins } = await admin.from("user_roles").select("user_id").eq("role", "admin");
    if (!admins?.length) return;
    const { data: profile } = await admin.from("profiles").select("name, email").eq("id", opts.userId).maybeSingle();
    const who = profile ? `${profile.name || "Cliente"} (${profile.email})` : opts.userId;
    const when = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
    const rows = admins.map((a: any) => ({
      user_id: a.user_id,
      type: "admin_payment",
      title: "💳 Nuevo pago de programa",
      message: `${who} ha contratado ${opts.plan} (${opts.amount.toFixed(2)} €) el ${when}.`,
      dedupe_key: `payment:${opts.ref}`,
    }));
    await admin.from("user_notifications").upsert(rows, { onConflict: "user_id,dedupe_key", ignoreDuplicates: true });
  } catch (e) {
    console.error("notifyAdminsOfPayment failed", e);
  }
}
