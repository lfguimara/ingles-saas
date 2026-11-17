import Link from "next/link";
import { getLevels, chapterHref } from "@/lib/content";
import { getSession } from "@/lib/session";
import { levelProgress, nextChapter, findMeta } from "@/lib/progress";
import { checkLimit } from "@/lib/usage";
import { canRead } from "@/lib/access";

export const metadata = { title: "Início — SpeakUp" };

export default async function Dashboard() {
  const s = (await getSession())!;
  const levels = getLevels();
  const next = nextChapter(s);
  const nextMeta = next ? findMeta(next) : null;
  const limit = checkLimit(s.plan, s.usage);
  const totalChapters = levels.reduce((n, l) => n + levelProgress(l, s.done).total, 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-blue">Olá, {s.name} 👋</p>
      <h1 className="mt-1 text-3xl font-extrabold text-navy sm:text-4xl">Bora praticar hoje?</h1>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {nextMeta && next ? (
          <Link href={chapterHref(next)} className="group relative overflow-hidden rounded-3xl bg-navy p-7 text-white shadow-xl shadow-navy/20 sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue/50 blur-3xl" />
            <p className="relative text-sm font-bold uppercase tracking-widest text-sky">{s.done.length ? "Continue de onde parou" : "Comece por aqui"}</p>
            <p className="relative mt-3 text-sm text-white/70">{nextMeta.ebook.emoji} {nextMeta.ebook.title} · {nextMeta.level.cefr}</p>
            <h2 className="relative mt-1 text-2xl font-extrabold sm:text-3xl">{nextMeta.chapter.title}</h2>
            <p className="relative mt-2 text-white/70">~{nextMeta.chapter.minutes} min de leitura + prática com o Max</p>
            <span className="btn btn-yellow relative mt-6">
              {canRead(s.plan, nextMeta.chapter) ? "Abrir capítulo →" : "🔒 Desbloquear com o plano"}
            </span>
          </Link>
        ) : (
          <div className="rounded-3xl bg-navy p-9 text-white">
            <h2 className="text-2xl font-extrabold">Você leu todos os capítulos! 🎉</h2>
            <p className="mt-2 text-white/70">Novos e-books chegam em breve.</p>
          </div>
        )}

        <div className="grid gap-5">
          <div className="rounded-3xl border border-line bg-white p-6">
            <p className="text-sm font-bold text-muted">🤖 Mensagens com o Max</p>
            <p className="mt-2 font-head text-4xl font-extrabold text-navy">{limit.remaining}</p>
            <p className="text-sm text-muted">{s.plan === "pro" ? "restantes hoje (60 por dia)" : "restantes no teste grátis"}</p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6">
            <p className="text-sm font-bold text-muted">📚 Capítulos lidos</p>
            <p className="mt-2 font-head text-4xl font-extrabold text-navy">{s.done.length}<span className="text-xl text-muted">/{totalChapters}</span></p>
          </div>
        </div>
      </div>

      <h2 className="mt-12 text-2xl font-extrabold text-navy">Sua trilha</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {levels.map((l) => {
          const p = levelProgress(l, s.done);
          return (
            <Link key={l.slug} href={`/app/trilha#${l.slug}`} className={`rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${l.slug === s.level ? "border-blue ring-4 ring-blue/10" : "border-line"}`}>
              <div className="flex items-center justify-between">
                <span className="font-head text-2xl font-extrabold text-blue">{l.cefr}</span>
                {l.slug === s.level && <span className="rounded-full bg-sky-soft px-2 py-0.5 text-[11px] font-bold text-navy">seu nível</span>}
              </div>
              <p className="mt-1 font-bold">{l.title}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg2"><div className="h-full rounded-full bg-green" style={{ width: `${p.pct}%` }} /></div>
              <p className="mt-1.5 text-xs text-muted">{p.read} de {p.total} capítulos</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
