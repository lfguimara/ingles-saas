import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignUpForm } from "@/components/SignUpForm";

export const metadata = { title: "Entrar — SpeakUp" };

export default function Entrar() {
  return (
    <AuthShell title="Bem-vindo de volta" subtitle="Na versão de demonstração, entrar é igual a criar uma conta nova.">
      <SignUpForm cta="Entrar →" />
      <p className="mt-6 text-center text-sm text-muted">Ainda não tem conta? <Link href="/cadastro" className="font-bold text-blue">Crie sua conta</Link></p>
    </AuthShell>
  );
}
