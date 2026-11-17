import Link from "next/link";
import { getLevels } from "@/lib/content";
import { getSession, chapterKey } from "@/lib/session";
import { levelProgress } from "@/lib/progress";
import { canRead } from "@/lib/access";

export const metadata = { title: "Trilha — SpeakUp" };

export default async function Trilha() {
  const s = (await getSession())!;
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold text-navy sm:text-4xl">Sua trilha</h1>
      <p className="mt-2 text-muted">Leia cada capítulo e pratique com o Max logo em seguida.</p>
      <div className="mt-10 space-y-10">
        {getLevels().map((l) => {
          const p = levelProgress(l, s.done);
          return (
            <section key={l.slug} id={l.slug} className="scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <span className="rounded-lg bg-blue px-2.5 py-1 font-head text-sm font-extrabold text-white">{l.cefr}</span>
                  <h2 className="mt-2 text-2xl font-extrabold text-navy">{l.title}</h2>
                  <p className="text-sm text-muted">{l.description}</p>
                </div>
                <p className="text-sm font-bold text-muted">{p.pct}% concluído</p>
              </div>
              {l.ebooks.map((e) => (
                <div key={e.slug} className="mt-4 overflow-hidden rounded-3xl border border-line bg-white">
                  <div className="flex items-center gap-3 border-b border-line bg-bg px-5 py-4">
                    <span className="text-3xl">{e.emoji}</span>
                    <div><p className="font-head text-lg font-bold">{e.title}</p><p className="text-sm text-muted">{e.subtitle}</p></div>
                  </div>
                  <ol>
                    {e.chapters.map((c) => {
                      const done = s.done.includes(chapterKey(l.slug, e.slug, c.slug));
                      const open = canRead(s.plan);
                      return (
                        <li key={c.slug} className="border-b border-line last:border-0">
                          <Link href={`/app/${l.slug}/${e.slug}/${c.slug}`} className="flex items-center gap-4 px-5 py-4 transition hover:bg-bg">
                            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${done ? "bg-green text-white" : open ? "bg-sky-soft text-navy" : "bg-bg2 text-muted"}`}>
                              {done ? "✓" : open ? c.order : "🔒"}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-bold">{c.title}</span>
                              <span className="text-xs text-muted">~{c.minutes} min</span>
                            </span>
                            <span className="text-blue">→</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </main>
  );
}
