export type Plan = "trial" | "pro";

export const LIMITS = { proPerDay: 60, trialTotal: 10 } as const;

export function checkLimit(plan: Plan, used: { today: number; total: number }): { ok: boolean; remaining: number } {
  const remaining = Math.max(0, plan === "pro" ? LIMITS.proPerDay - used.today : LIMITS.trialTotal - used.total);
  return { ok: remaining > 0, remaining };
}
