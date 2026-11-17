import { getSession } from "@/lib/session";
import { setPlan, signOut } from "@/app/actions";
import { checkLimit } from "@/lib/usage";

export const metadata = { title: "Conta — SpeakUp" };

export default async function Conta({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const s = (await getSession())!;
  const { ok } = await searchParams;
  const limit = checkLimit(s.plan, s.usage);
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold text-navy sm:text-4xl">Sua conta</h1>
      {ok && <p className="mt-4 rounded-xl bg-green/10 px-4 py-3 text-sm font-bold text-green">Plano atualizado!</p>}

      <section className="mt-8 rounded-3xl border border-line bg-white p-6">
        <p className="text-sm font-bold text-muted">Dados</p>
        <p className="mt-2 text-lg font-bold">{s.name}</p>
        <p className="text-muted">{s.email}</p>
      </section>

      <section className="mt-5 rounded-3xl border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-muted">Plano atual</p>
            <p className="mt-1 text-2xl font-extrabold text-navy">{s.plan === "pro" ? "Anual Pro" : "Sem assinatura"}</p>
            <p className="text-sm text-muted">
              {s.plan === "pro"
                ? `Todos os e-books · ${limit.remaining} de 60 mensagens restantes hoje`
                : "Assine para liberar os e-books e o tutor Max"}
            </p>
          </div>
          {s.plan !== "pro" ? (
            <form action={setPlan.bind(null, "pro")}><button className="btn btn-yellow">Assinar por 12x R$ 49 →</button></form>
          ) : (
            <form action={setPlan.bind(null, "none")}><button className="btn btn-line">Cancelar assinatura</button></form>
          )}
        </div>
        <p className="mt-4 rounded-xl bg-sky-soft px-4 py-3 text-xs text-navy">
          <b>Demonstração:</b> o botão troca de plano na hora, sem pagamento. Na versão final ele abre o checkout do Stripe (cartão e PIX).
        </p>
      </section>

      <form action={signOut} className="mt-8"><button className="text-sm font-bold text-muted underline hover:text-ink">Sair da conta</button></form>
    </main>
  );
}
