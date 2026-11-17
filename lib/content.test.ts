import { describe, expect, it } from "vitest";
import { getLevels, getChapter, getAdjacent, getAllChapterRefs } from "./content";

describe("content", () => {
  it("lista os níveis de A1 a C1 em ordem", () => {
    expect(getLevels().map((l) => l.cefr)).toEqual(["A1", "A2", "B1", "B2", "C1"]);
  });

  it("todo nível tem ao menos um ebook com capítulos", () => {
    for (const level of getLevels()) {
      expect(level.ebooks.length).toBeGreaterThan(0);
      expect(level.ebooks[0].chapters.length).toBeGreaterThan(0);
    }
  });


  it("getChapter devolve conteúdo e contexto", () => {
    const a1 = getLevels()[0];
    const ch = getChapter(a1.slug, a1.ebooks[0].slug, a1.ebooks[0].chapters[0].slug);
    expect(ch).not.toBeNull();
    expect(ch!.content.length).toBeGreaterThan(200);
    expect(ch!.level.cefr).toBe("A1");
    expect(ch!.content).not.toMatch(/^---/);
  });

  it("getChapter devolve null para slug inexistente ou malicioso", () => {
    expect(getChapter("a1", "nao-existe", "x")).toBeNull();
    expect(getChapter("..", "..", "package")).toBeNull();
  });

  it("getAdjacent liga o último capítulo de um nível ao primeiro do próximo", () => {
    const refs = getAllChapterRefs();
    const firstA2 = refs.findIndex((r) => r.level === "a2");
    const lastA1 = refs[firstA2 - 1];
    expect(getAdjacent(lastA1.level, lastA1.ebook, lastA1.chapter).next).toEqual(refs[firstA2]);
    expect(getAdjacent(refs[0].level, refs[0].ebook, refs[0].chapter).prev).toBeNull();
  });
});
