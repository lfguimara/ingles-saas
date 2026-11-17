"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession, saveSession, today, chapterKey, SESSION_COOKIE } from "@/lib/session";
import { getLevels } from "@/lib/content";

export async function signUp(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim().slice(0, 40);
  const email = String(formData.get("email") ?? "").trim().slice(0, 120);
  const goal = String(formData.get("goal") ?? "dia-a-dia");
  const levelIn = String(formData.get("level") ?? "a1");
  if (!name) redirect("/cadastro?erro=nome");
  const level = getLevels().some((l) => l.slug === levelIn) ? levelIn : "a1";
  await saveSession({ name, email, goal, level, plan: "trial", done: [], usage: { day: today(), today: 0, total: 0 } });
  redirect("/app");
}

export async function markRead(level: string, ebook: string, chapter: string, nextHref: string | null) {
  const s = await getSession();
  if (!s) redirect("/cadastro");
  const key = chapterKey(level, ebook, chapter);
  if (!s.done.includes(key)) s.done.push(key);
  await saveSession(s);
  redirect(nextHref ?? "/app/trilha");
}

export async function setPlan(plan: "trial" | "pro") {
  const s = await getSession();
  if (!s) redirect("/cadastro");
  s.plan = plan;
  await saveSession(s);
  redirect("/app/conta?ok=1");
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
