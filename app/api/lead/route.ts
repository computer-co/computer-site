// Recebe o lead do formulário "Falar com o time" (components/ContactFlow.tsx).
// Se LEAD_WEBHOOK_URL estiver definido (ex.: webhook do n8n), encaminha o lead
// para lá. Sem ele, apenas registra no log do servidor.

const FIELDS = ["nome", "empresa", "cargo", "faturamento", "motivo", "email", "whatsapp", "site", "origem", "etapa"] as const;
// etapa: "parcial" (passou do contato, ainda não terminou) | "completo" (respondeu tudo)

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // honeypot: bots preenchem o campo invisível — fingimos sucesso e descartamos
  if (typeof body.website === "string" && body.website.trim()) {
    return Response.json({ ok: true });
  }

  const lead: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = body[f];
    lead[f] = typeof v === "string" ? v.trim().slice(0, 2000) : "";
  }

  if (!lead.nome || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) {
    return Response.json({ ok: false }, { status: 422 });
  }

  const payload = { ...lead, recebidoEm: new Date().toISOString() };
  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
    } catch (err) {
      console.error("[lead] falha ao encaminhar para o webhook", err);
    }
  } else {
    console.log("[lead]", JSON.stringify(payload));
  }

  return Response.json({ ok: true });
}
