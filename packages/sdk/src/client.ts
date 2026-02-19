import { getUid } from "./uid";
import type { DivisorConfig, ExperimentResult } from "./types";

export class DivisorClient {
  private tenantId: string;
  private edgeUrl: string;

  constructor(config: DivisorConfig) {
    this.tenantId = config.tenantId;
    this.edgeUrl = "https://divisor-edge.dennergazevedo.workers.dev";
  }

  async get(experimentName: string): Promise<ExperimentResult> {
    const uid = getUid();

    const url = new URL(`${this.edgeUrl}/experiment`);
    url.searchParams.set("tenantId", this.tenantId);
    url.searchParams.set("name", experimentName);
    url.searchParams.set("uid", uid);

    const res = await fetch(url.toString());

    if (!res.ok) {
      return { experiment: experimentName, variant: null };
    }

    return res.json();
  }
}
