import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { AppNav } from "@/components/AppNav";
import { getSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/cadastro");
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-6">
            <Logo href="/app" />
            <div className="hidden sm:block"><AppNav /></div>
          </div>
          <div className="flex items-center gap-3">
            {s.plan === "trial" ? (
              <Link href="/app/conta" className="btn btn-yellow px-4 py-2 text-sm">Assinar</Link>
            ) : (
              <span className="rounded-full bg-green/10 px-3 py-1 text-xs font-bold text-green">PRO</span>
            )}
            <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-soft font-bold text-navy" title={s.name}>{s.name[0]?.toUpperCase()}</span>
          </div>
        </div>
        <div className="border-t border-line px-4 py-2 sm:hidden"><AppNav /></div>
      </header>
      {children}
    </div>
  );
}
