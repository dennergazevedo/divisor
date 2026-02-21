export const PLAN_LIMITS = {
  free: {
    tenants: 1,
    activeTests: 1,
  },
  growth: {
    tenants: 1,
    activeTests: 5,
  },
  pro: {
    tenants: 3,
    activeTests: Infinity,
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: string | null | undefined) {
  const planKey = (plan?.toLowerCase() || "free") as PlanType;
  return PLAN_LIMITS[planKey] || PLAN_LIMITS.free;
}
