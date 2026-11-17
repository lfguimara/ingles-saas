import { cookies } from "next/headers";
import type { Plan } from "./usage";

export const SESSION_COOKIE = "speakup_session";

export type Session = {
  name: string;
  email: string;
  goal: string;
  level: string; // slug do nível inicial, ex.: "a1"
  plan: Plan;
  done: string[]; // "nivel/ebook/capitulo" lidos
  usage: { day: string; today: number; total: number };
};

export const today = () => new Date().toISOString().slice(0, 10);

export function parseSession(raw: string | undefined): Session | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Session;
    if (!s.name || !s.plan) return null;
    if (s.usage.day !== today()) s.usage = { day: today(), today: 0, total: s.usage.total };
    return s;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  return parseSession((await cookies()).get(SESSION_COOKIE)?.value);
}

export const cookieOptions = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 60 };

export async function saveSession(s: Session) {
  (await cookies()).set(SESSION_COOKIE, JSON.stringify(s), cookieOptions);
}

export const chapterKey = (level: string, ebook: string, chapter: string) => `${level}/${ebook}/${chapter}`;
