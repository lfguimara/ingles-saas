import { describe, expect, it } from "vitest";
import { canRead } from "./access";
import { parseSession } from "./session";

describe("acesso sem teste grátis", () => {
  it("só assinante lê capítulos", () => {
    expect(canRead("pro")).toBe(true);
    expect(canRead("none")).toBe(false);
  });
  it("sessões antigas com plano 'trial' viram 'none'", () => {
    const s = parseSession(JSON.stringify({ name: "A", email: "", goal: "", level: "a1", plan: "trial", done: [], usage: { day: "2000-01-01", today: 3, total: 3 } }));
    expect(s?.plan).toBe("none");
  });
});
