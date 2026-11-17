import { describe, expect, it } from "vitest";
import { buildSystemPrompt, demoReply, sanitizeHistory } from "./tutor";
import { getChapter } from "./content";

const ch = getChapter("a1", "ingles-do-zero", "se-apresentando")!;

describe("buildSystemPrompt", () => {
  it("inclui o nível, o título e o texto do capítulo", () => {
    const p = buildSystemPrompt(ch);
    expect(p).toContain("A1");
    expect(p).toContain(ch.title);
    expect(p).toContain("Nice to meet you");
  });
  it("traz as regras do spec: corrigir em português e não entregar a resposta pronta", () => {
    const p = buildSystemPrompt(ch);
    expect(p).toMatch(/português/i);
    expect(p).toMatch(/não entregue a resposta/i);
  });
});

describe("sanitizeHistory", () => {
  it("mantém só as últimas 20 mensagens válidas, corta textos longos e começa com o usuário", () => {
    const msgs = Array.from({ length: 30 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: "x".repeat(5000) }));
    const out = sanitizeHistory([{ role: "system", content: "hack" }, ...msgs]);
    expect(out.length).toBeLessThanOrEqual(20);
    expect(out[0].role).toBe("user");
    expect(out.every((m) => m.content.length <= 2000)).toBe(true);
    expect(out.some((m) => (m.role as string) === "system")).toBe(false);
  });
  it("devolve vazio para entrada inválida", () => {
    expect(sanitizeHistory("oi" as unknown)).toEqual([]);
  });
});

describe("demoReply", () => {
  it("para pedido de exercícios, usa frases do próprio capítulo", () => {
    const r = demoReply(ch, "Me passe exercícios");
    expect(r).toMatch(/exerc/i);
    expect(r).toMatch(/I'm|Nice to meet you|What's your name/);
  });
});
