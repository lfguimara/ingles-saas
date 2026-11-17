import { getAllChapterRefs, getLevels, type ChapterRef, type Level } from "./content";
import { chapterKey, type Session } from "./session";

export const refKey = (r: ChapterRef) => chapterKey(r.level, r.ebook, r.chapter);

export function levelProgress(level: Level, done: string[]) {
  const keys = level.ebooks.flatMap((e) => e.chapters.map((c) => chapterKey(level.slug, e.slug, c.slug)));
  const read = keys.filter((k) => done.includes(k)).length;
  return { read, total: keys.length, pct: keys.length ? Math.round((read / keys.length) * 100) : 0 };
}

/** Próximo capítulo não lido, a partir do nível inicial do aluno. */
export function nextChapter(s: Session): ChapterRef | null {
  const refs = getAllChapterRefs();
  const start = Math.max(0, refs.findIndex((r) => r.level === s.level));
  return [...refs.slice(start), ...refs.slice(0, start)].find((r) => !s.done.includes(refKey(r))) ?? null;
}

export function findMeta(r: ChapterRef) {
  const level = getLevels().find((l) => l.slug === r.level)!;
  const ebook = level.ebooks.find((e) => e.slug === r.ebook)!;
  const chapter = ebook.chapters.find((c) => c.slug === r.chapter)!;
  return { level, ebook, chapter };
}
