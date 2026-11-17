export type Plan = "none" | "pro";

export const LIMITS = { proPerDay: 60 } as const;

export function checkLimit(plan: Plan, used: { today: number; total: number }): { ok: boolean; remaining: number } {
  const remaining = plan === "pro" ? Math.max(0, LIMITS.proPerDay - used.today) : 0;
  return { ok: remaining > 0, remaining };
}
