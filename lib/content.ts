import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");
const SLUG = /^[a-z0-9-]+$/;

export type ChapterMeta = { slug: string; title: string; order: number; minutes: number };
export type Ebook = { slug: string; title: string; subtitle: string; emoji: string; chapters: ChapterMeta[] };
export type Level = { slug: string; title: string; cefr: string; description: string; ebooks: Ebook[] };
export type Chapter = ChapterMeta & { content: string; level: Omit<Level, "ebooks">; ebook: Omit<Ebook, "chapters"> };
export type ChapterRef = { level: string; ebook: string; chapter: string };

/** "01-cumprimentos" -> { order: 1, slug: "cumprimentos" } */
function parseName(name: string) {
  const m = name.replace(/\.md$/, "").match(/^(\d+)-(.+)$/);
  return m ? { order: Number(m[1]), slug: m[2] } : null;
}

function sortedEntries(dir: string, wantDirs: boolean) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => (wantDirs ? d.isDirectory() : d.isFile() && d.name.endsWith(".md")))
    .map((d) => ({ name: d.name, parsed: parseName(d.name) }))
    .filter((e): e is { name: string; parsed: { order: number; slug: string } } => e.parsed !== null)
    .sort((a, b) => a.parsed.order - b.parsed.order);
}

function readMeta(dir: string) {
  return JSON.parse(fs.readFileSync(path.join(dir, "_meta.json"), "utf8"));
}

function wordsToMinutes(text: string) {
  return Math.max(3, Math.round(text.split(/\s+/).length / 160));
}

let cache: Level[] | null = null;

export function getLevels(): Level[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const levels = sortedEntries(ROOT, true).map(({ name, parsed }) => {
    const levelDir = path.join(ROOT, name);
    const meta = readMeta(levelDir);
    const ebooks = sortedEntries(levelDir, true).map((eb) => {
      const ebDir = path.join(levelDir, eb.name);
      const ebMeta = readMeta(ebDir);
      const chapters = sortedEntries(ebDir, false).map((c) => {
        const { data, content } = matter(fs.readFileSync(path.join(ebDir, c.name), "utf8"));
        return {
          slug: c.parsed.slug,
          title: String(data.title ?? c.parsed.slug),
          order: c.parsed.order,
          minutes: wordsToMinutes(content),
        };
      });
      return { slug: eb.parsed.slug, title: ebMeta.title, subtitle: ebMeta.subtitle ?? "", emoji: ebMeta.emoji ?? "📘", chapters, _dir: eb.name };
    });
    return { slug: parsed.slug, title: meta.title, cefr: meta.cefr, description: meta.description ?? "", ebooks, _dir: name };
  });
  cache = levels;
  return levels;
}

export function getAllChapterRefs(): ChapterRef[] {
  return getLevels().flatMap((l) => l.ebooks.flatMap((e) => e.chapters.map((c) => ({ level: l.slug, ebook: e.slug, chapter: c.slug }))));
}

export function getChapter(level: string, ebook: string, chapter: string): Chapter | null {
  if (![level, ebook, chapter].every((s) => SLUG.test(s))) return null;
  const lv = getLevels().find((l) => l.slug === level) as (Level & { _dir: string }) | undefined;
  const eb = lv?.ebooks.find((e) => e.slug === ebook) as (Ebook & { _dir: string }) | undefined;
  const meta = eb?.chapters.find((c) => c.slug === chapter);
  if (!lv || !eb || !meta) return null;
  const file = path.join(ROOT, lv._dir, eb._dir, `${String(meta.order).padStart(2, "0")}-${meta.slug}.md`);
  const { content } = matter(fs.readFileSync(file, "utf8"));
  return {
    ...meta,
    content: content.trim(),
    level: { slug: lv.slug, title: lv.title, cefr: lv.cefr, description: lv.description },
    ebook: { slug: eb.slug, title: eb.title, subtitle: eb.subtitle, emoji: eb.emoji },
  };
}

export function getAdjacent(level: string, ebook: string, chapter: string): { prev: ChapterRef | null; next: ChapterRef | null } {
  const refs = getAllChapterRefs();
  const i = refs.findIndex((r) => r.level === level && r.ebook === ebook && r.chapter === chapter);
  if (i < 0) return { prev: null, next: null };
  return { prev: refs[i - 1] ?? null, next: refs[i + 1] ?? null };
}

export function chapterHref(r: ChapterRef) {
  return `/app/${r.level}/${r.ebook}/${r.chapter}`;
}
