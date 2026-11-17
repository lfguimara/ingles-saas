import { Logo } from "./Logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-navy p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-sky/20 blur-3xl" />
        <Logo light />
        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">Seu tutor de inglês está online <span className="text-yellow">24h por dia.</span></h2>
          <div className="mt-8 space-y-3 rounded-3xl bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-widest text-sky">Tutor Max 🤖</p>
            <p className="w-fit rounded-2xl rounded-tl-sm bg-white/15 px-4 py-2.5">Tell me about your last trip!</p>
            <p className="ml-auto w-fit rounded-2xl rounded-tr-sm bg-blue px-4 py-2.5">I go to Rio last month.</p>
            <p className="w-fit rounded-2xl rounded-tl-sm bg-white/15 px-4 py-2.5">Quase! Como foi no passado, use <b className="text-yellow">went</b>: “I went to Rio last month.” ✨</p>
          </div>
        </div>
        <p className="relative text-sm text-white/60">E-books do A1 ao C1 · correção na hora · no seu ritmo</p>
      </aside>
      <section className="flex flex-col px-4 py-8 sm:px-10">
        <div className="lg:hidden"><Logo /></div>
        <div className="m-auto w-full max-w-md py-10">
          <h1 className="text-3xl font-extrabold text-navy sm:text-4xl">{title}</h1>
          <p className="mb-8 mt-2 text-muted">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
