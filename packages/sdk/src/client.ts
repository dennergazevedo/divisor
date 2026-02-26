import { getUid } from "./uid";
import type {
  ConversionData,
  DivisorConfig,
  ExperimentResult,
  GetVariant,
} from "./types";
import { getCookie, setCookie } from "./cookies";

export class DivisorClient {
  private tenantId: string;
  private userId: string;
  private edgeUrl: string;
  private divisorUrl: string;

  constructor(config: DivisorConfig) {
    this.tenantId = config.tenantId;
    this.userId = config.userId ?? getUid();
    this.edgeUrl = "https://divisor-edge.dennergazevedo.workers.dev";
    this.divisorUrl = "https://app.divisor.dev";
  }

  async getVariant({
    experimentName,
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

    const uid = this.userId;

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

  async conversion(data: ConversionData): Promise<void> {
    const url = `${this.divisorUrl}/api/conversion`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          tenantId: this.tenantId,
          userId: this.userId,
        }),
      });

      if (!res.ok) {
        console.error("Divisor: Error sending conversion", await res.text());
      }
    } catch (error) {
      console.error("Divisor: Error sending conversion", error);
    }
  }
}
