"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

const QUICK = ["Me passe exercícios", "Corrija minha frase", "Explique de novo"];

export function TutorChat({ level, ebook, chapter, chapterTitle, initialRemaining }: {
  level: string; ebook: string; chapter: string; chapterTitle: string; initialRemaining: number;
}) {
  const storageKey = `speakup:chat:${level}/${ebook}/${chapter}`;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState(initialRemaining);
  const [mode, setMode] = useState<"ai" | "demo" | null>(null);
  const [open, setOpen] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setMsgs(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(msgs.filter((m) => !m.error).slice(-40))); } catch {}
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, storageKey]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const history = [...msgs.filter((m) => !m.error), { role: "user" as const, content }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, ebook, chapter, messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok || !res.body) {
        const { error } = await res.json().catch(() => ({ error: "Algo deu errado. Tente de novo." }));
        if (res.status === 429) setRemaining(0);
        setMsgs([...history, { role: "assistant", content: error, error: true }]);
        return;
      }
      setMode(res.headers.get("X-Tutor-Mode") === "demo" ? "demo" : "ai");
      const r = res.headers.get("X-Remaining");
      if (r) setRemaining(Number(r));
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...history, { role: "assistant", content: acc }]);
      }
    } catch {
      setMsgs([...history, { role: "assistant", content: "Sem conexão. Verifique sua internet e tente de novo.", error: true }]);
    } finally {
      setBusy(false);
    }
  }

  const blocked = remaining <= 0;

  const panel = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-navy text-xl">🤖</span>
        <div className="min-w-0 flex-1">
          <p className="font-head font-bold">Max, seu tutor</p>
          <p className="truncate text-xs text-muted">
            {mode === "demo" ? "Modo demonstração" : "Online"} · {remaining} {remaining === 1 ? "mensagem restante" : "mensagens restantes"}
          </p>
        </div>
        <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full text-xl text-muted hover:bg-bg lg:hidden" aria-label="Fechar chat">×</button>
      </div>

      <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {msgs.length === 0 && (
          <div className="rounded-2xl rounded-tl-sm bg-bg p-4 text-[15px]">
            Oi! 👋 Eu sou o Max. Leu o capítulo <b>{chapterTitle}</b>? Peça exercícios, mande uma frase para eu corrigir ou tire suas dúvidas.
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
            <div className={`chat-md max-w-[88%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
              m.role === "user" ? "rounded-tr-sm bg-blue text-white" : m.error ? "rounded-tl-sm bg-yellow/30" : "rounded-tl-sm bg-bg"
            }`}>
              {m.content ? <ReactMarkdown>{m.content}</ReactMarkdown> : <span className="inline-flex gap-1 py-1"><Dot /><Dot d={150} /><Dot d={300} /></span>}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-line p-3">
        {blocked ? (
          <Link href="/app/conta" className="btn btn-yellow w-full">Liberar mais mensagens →</Link>
        ) : (
          <>
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {QUICK.map((q) => (
                <button key={q} disabled={busy} onClick={() => send(q)} className="shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold text-navy hover:border-blue disabled:opacity-50">{q}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={2000} placeholder="Escreva em inglês ou português…" className="min-w-0 flex-1 rounded-full border border-line bg-bg px-4 py-2.5 text-[15px] outline-none focus:border-blue" />
              <button disabled={busy || !input.trim()} className="btn btn-blue h-11 w-11 shrink-0 p-0" aria-label="Enviar">➤</button>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] border-l border-line lg:block">{panel}</aside>
      <button onClick={() => setOpen(true)} className="btn btn-blue fixed bottom-4 right-4 z-30 shadow-xl shadow-blue/30 lg:hidden">🤖 Praticar com o Max</button>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 h-[85dvh] overflow-hidden rounded-t-3xl shadow-2xl">{panel}</div>
        </div>
      )}
    </>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return <i className="h-2 w-2 animate-bounce rounded-full bg-muted/60" style={{ animationDelay: `${d}ms` }} />;
}
