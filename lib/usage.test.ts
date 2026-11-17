import { describe, expect, it } from "vitest";
import { checkLimit, LIMITS } from "./usage";

describe("checkLimit", () => {
  it("usa os limites do spec", () => {
    expect(LIMITS).toEqual({ proPerDay: 60, trialTotal: 10 });
  });
  it("assinante: 59 mensagens hoje ainda pode, 60 bloqueia", () => {
    expect(checkLimit("pro", { today: 59, total: 500 })).toEqual({ ok: true, remaining: 1 });
    expect(checkLimit("pro", { today: 60, total: 500 })).toEqual({ ok: false, remaining: 0 });
  });
  it("teste: conta o total, não o dia", () => {
    expect(checkLimit("trial", { today: 0, total: 9 })).toEqual({ ok: true, remaining: 1 });
    expect(checkLimit("trial", { today: 0, total: 10 })).toEqual({ ok: false, remaining: 0 });
  });
});
