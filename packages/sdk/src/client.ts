import { getUid } from "./uid";
import type { DivisorConfig, ExperimentResult, GetVariant } from "./types";
import { getCookie, setCookie } from "./cookies";

export class DivisorClient {
  private tenantId: string;
  private edgeUrl: string;

  constructor(config: DivisorConfig) {
    this.tenantId = config.tenantId;
    this.edgeUrl = "https://divisor-edge.dennergazevedo.workers.dev";
  }

  async getVariant({
    experimentName,
    userId,
    variantFallback,
  }: GetVariant): Promise<ExperimentResult> {
    const cookieName = `__divisor_${this.tenantId}_${experimentName}`;

    // 1. Check if we have a cached variant in cookies
    const cachedVariant = getCookie(cookieName);
    if (cachedVariant) {
      return {
        experiment: experimentName,
        variant: cachedVariant,
      };
    }

    const uid = userId ?? getUid();

    const url = new URL(`${this.edgeUrl}/experiment`);
    url.searchParams.set("tenantId", this.tenantId);
    url.searchParams.set("name", experimentName);
    url.searchParams.set("uid", uid);

    try {
      const res = await fetch(url.toString());

      if (!res.ok) {
        return { experiment: experimentName, variant: variantFallback ?? null };
      }

      const result: ExperimentResult = await res.json();

      // 2. Cache the result for 1 hour if we got a variant
      if (result.variant) {
        setCookie(cookieName, result.variant, 1);
      }

      return result;
    } catch (error) {
      console.error("Divisor: Error fetching variant", error);
      return { experiment: experimentName, variant: variantFallback ?? null };
    }
  }
}
