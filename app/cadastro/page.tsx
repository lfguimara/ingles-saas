import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignUpForm } from "@/components/SignUpForm";

export const metadata = { title: "Criar conta — SpeakUp" };

export default function Cadastro() {
  return (
    <AuthShell title="Comece grátis" subtitle="Crie sua conta e converse com o Max em menos de 1 minuto.">
      <SignUpForm cta="Criar minha conta grátis →" />
      <p className="mt-6 text-center text-sm text-muted">Já tem conta? <Link href="/entrar" className="font-bold text-blue">Entrar</Link></p>
    </AuthShell>
  );
}
