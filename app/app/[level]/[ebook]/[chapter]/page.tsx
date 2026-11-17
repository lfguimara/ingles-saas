import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { getChapter, getAdjacent, chapterHref } from "@/lib/content";
import { getSession, chapterKey } from "@/lib/session";
import { canRead } from "@/lib/access";
import { checkLimit } from "@/lib/usage";
import { markRead } from "@/app/actions";
import { TutorChat } from "@/components/TutorChat";

type Params = { level: string; ebook: string; chapter: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const p = await params;
  const ch = getChapter(p.level, p.ebook, p.chapter);
  return { title: ch ? `${ch.title} — SpeakUp` : "SpeakUp" };
}

export default async function ChapterPage({ params }: { params: Promise<Params> }) {
  const p = await params;
  const ch = getChapter(p.level, p.ebook, p.chapter);
  if (!ch) notFound();
  const s = (await getSession())!;
  const { prev, next } = getAdjacent(p.level, p.ebook, p.chapter);
  const done = s.done.includes(chapterKey(p.level, p.ebook, p.chapter));

  if (!canRead(s.plan, ch)) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className="text-5xl">🔒</span>
        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-blue">{ch.ebook.title} · {ch.level.cefr}</p>
        <h1 className="mt-2 text-3xl font-extrabold text-navy">{ch.title}</h1>
        <p className="mt-4 text-muted">Este capítulo faz parte do plano completo. Assine para liberar todos os e-books e até 60 conversas por dia com o Max.</p>
        <Link href="/app/conta" className="btn btn-yellow mt-8">Assinar por 12x R$ 49 →</Link>
        <p className="mt-4"><Link href="/app/trilha" className="text-sm font-bold text-muted underline">Voltar para a trilha</Link></p>
      </main>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[1fr_420px]">
      <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-8 sm:px-8 lg:pb-16">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/app/trilha" className="font-bold hover:text-blue">Trilha</Link>
          <span>/</span>
          <span className="rounded-md bg-blue px-1.5 py-0.5 text-xs font-extrabold text-white">{ch.level.cefr}</span>
          <span>{ch.ebook.emoji} {ch.ebook.title}</span>
          <span>· Capítulo {ch.order}</span>
          {done && <span className="rounded-full bg-green/10 px-2 py-0.5 text-xs font-bold text-green">✓ lido</span>}
        </nav>

        <article className="prose-ch">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{ch.content}</ReactMarkdown>
        </article>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          {prev ? <Link href={chapterHref(prev)} className="btn btn-line">← Anterior</Link> : <span />}
          <form action={markRead.bind(null, p.level, p.ebook, p.chapter, next ? chapterHref(next) : null)}>
            <button className="btn btn-blue">{done ? "Próximo capítulo →" : "Marcar como lido e continuar →"}</button>
          </form>
        </div>
      </main>

      <TutorChat
        level={p.level}
        ebook={p.ebook}
        chapter={p.chapter}
        chapterTitle={ch.title}
        initialRemaining={checkLimit(s.plan, s.usage).remaining}
      />
    </div>
  );
}
