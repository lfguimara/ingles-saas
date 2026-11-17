import Anthropic from "@anthropic-ai/sdk";
import { cookies } from "next/headers";
import { getChapter } from "@/lib/content";
import { canRead } from "@/lib/access";
import { checkLimit } from "@/lib/usage";
import { SESSION_COOKIE, cookieOptions, parseSession } from "@/lib/session";
import { buildSystemPrompt, demoReply, sanitizeHistory } from "@/lib/tutor";

const MODEL = process.env.TUTOR_MODEL ?? "claude-haiku-5-5";
const enc = new TextEncoder();

const json = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(req: Request) {
  const jar = await cookies();
  const session = parseSession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return json(401, "Sua sessão expirou. Entre de novo para falar com o Max.");

  const body = await req.json().catch(() => null);
  const ch = body && getChapter(String(body.level), String(body.ebook), String(body.chapter));
  if (!ch) return json(404, "Capítulo não encontrado.");
  if (!canRead(session.plan, ch)) return json(403, "Este capítulo faz parte do plano pago.");

  const messages = sanitizeHistory(body.messages);
  if (!messages.length || messages.at(-1)!.role !== "user") return json(400, "Mensagem vazia.");

  const limit = checkLimit(session.plan, session.usage);
  if (!limit.ok) {
    return json(
      429,
      session.plan === "trial"
        ? "Suas 10 mensagens do teste grátis acabaram. Assine para continuar praticando com o Max. 🚀"
        : "Você chegou ao limite de 60 mensagens de hoje. O Max volta amanhã! 💤",
    );
  }

  session.usage.today += 1;
  session.usage.total += 1;
  jar.set(SESSION_COOKIE, JSON.stringify(session), cookieOptions);

  const headers = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Remaining": String(limit.remaining - 1),
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    const text = demoReply(ch, messages.at(-1)!.content);
    const body = new ReadableStream({
      async start(ctrl) {
        for (const piece of text.match(/.{1,6}/gs) ?? []) {
          ctrl.enqueue(enc.encode(piece));
          await new Promise((r) => setTimeout(r, 12));
        }
        ctrl.close();
      },
    });
    return new Response(body, { headers: { ...headers, "X-Tutor-Mode": "demo" } });
  }

  const client = new Anthropic();
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 4000,
    output_config: { effort: "low" },
    system: buildSystemPrompt(ch),
    messages,
  });

  const out = new ReadableStream({
    async start(ctrl) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            ctrl.enqueue(enc.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          ctrl.enqueue(enc.encode("\n\nNão consigo ajudar com isso. Vamos voltar ao capítulo? 🙂"));
        }
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError) {
          ctrl.enqueue(enc.encode("\n\n_O Max está com muita demanda agora. Tente de novo em alguns segundos._"));
        } else if (err instanceof Anthropic.APIError) {
          console.error("[tutor] API error", err.status, err.message);
          ctrl.enqueue(enc.encode("\n\n_O Max teve um problema para responder. Tente de novo._"));
        } else {
          console.error("[tutor] unexpected", err);
          ctrl.enqueue(enc.encode("\n\n_Conexão perdida. Tente de novo._"));
        }
      } finally {
        ctrl.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(out, { headers: { ...headers, "X-Tutor-Mode": "ai" } });
}
