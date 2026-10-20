import { z } from "npm:zod@3.23.8";

export const chatInputSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(6000),
  }).strict()).min(1).max(100),
}).strict().superRefine((value, ctx) => {
  if (value.messages.at(-1)?.role !== "user") {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Escribe un mensaje para FIT." });
  }
  if (value.messages.reduce((size, message) => size + message.content.length, 0) > 50000) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La conversación es demasiado larga." });
  }
});

type AllowanceClient = {
  rpc: (name: string, args: Record<string, unknown>) => PromiseLike<{ data: unknown; error: unknown }>;
};

export async function consumeAllowance(client: AllowanceClient, key: string, authenticated: boolean, gateway = false) {
  const { data, error } = await client.rpc("consume_fit_allowance", {
    p_key: key, p_authenticated: authenticated, p_gateway: gateway,
  });
  if (error) throw new Error("No se ha podido comprobar la disponibilidad de FIT.");
  return data === true;
}

export async function callerKey(req: Request, userId: string | undefined, salt: string) {
  if (userId) return `user:${userId}`;
  // Forwarded addresses are only a supplementary throttle, never a trusted identity.
  // Rotating/spoofing them cannot bypass the shared guest/global gateway budgets.
  const hint = (req.headers.get("x-forwarded-for") || "unknown").slice(0, 256);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${hint}`));
  return `guest:${Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("")}`;
}

export function limitResponse(cors: Record<string, string>) {
  return new Response(JSON.stringify({ error: "FIT ha alcanzado temporalmente su límite de uso. Prueba más tarde." }), {
    status: 429,
    headers: { ...cors, "Content-Type": "application/json", "Retry-After": "60" },
  });
}