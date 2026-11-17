import { describe, expect, it } from "vitest";
import { checkLimit, LIMITS } from "./usage";

describe("checkLimit", () => {
  it("usa o limite do spec", () => {
    expect(LIMITS).toEqual({ proPerDay: 60 });
  });
  it("assinante: 59 mensagens hoje ainda pode, 60 bloqueia", () => {
    expect(checkLimit("pro", { today: 59, total: 500 })).toEqual({ ok: true, remaining: 1 });
    expect(checkLimit("pro", { today: 60, total: 500 })).toEqual({ ok: false, remaining: 0 });
  });
  it("sem assinatura não tem mensagens (não existe teste grátis)", () => {
    expect(checkLimit("none", { today: 0, total: 0 })).toEqual({ ok: false, remaining: 0 });
  });
});
