import { signUp } from "@/app/actions";
import { getLevels } from "@/lib/content";

const GOALS = [
  ["carreira", "💼 Carreira"],
  ["viagens", "✈️ Viagens"],
  ["intercambio", "🎓 Intercâmbio"],
  ["dia-a-dia", "☕ Dia a dia"],
];

export function SignUpForm({ cta }: { cta: string }) {
  const levels = getLevels();
  return (
    <form action={signUp} className="space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Como podemos te chamar?</span>
        <input name="name" required maxLength={40} placeholder="Seu nome" className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-blue focus:ring-4 focus:ring-blue/15" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">E-mail</span>
        <input name="email" type="email" required placeholder="voce@email.com" className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-blue focus:ring-4 focus:ring-blue/15" />
      </label>
      <fieldset>
        <legend className="mb-1.5 text-sm font-bold">Seu objetivo</legend>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map(([v, label], i) => (
            <label key={v} className="cursor-pointer">
              <input type="radio" name="goal" value={v} defaultChecked={i === 0} className="peer sr-only" />
              <span className="block rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium peer-checked:border-blue peer-checked:bg-sky-soft peer-checked:text-navy peer-focus-visible:ring-4 peer-focus-visible:ring-blue/15">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Seu nível hoje</span>
        <select name="level" defaultValue="a1" className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-blue">
          {levels.map((l) => (
            <option key={l.slug} value={l.slug}>{l.cefr} · {l.title}{l.slug === "a1" ? " (ou não sei)" : ""}</option>
          ))}
        </select>
      </label>
      <button className="btn btn-blue w-full py-3.5 text-base">{cta}</button>
      <p className="text-center text-xs text-muted">Versão de demonstração: nenhuma senha ou pagamento é pedido.</p>
    </form>
  );
}
