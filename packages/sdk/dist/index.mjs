// src/uid.ts
var UID_KEY = "divisor_uid";
function getUid() {
  if (typeof window === "undefined") {
    return crypto.randomUUID();
  }
  let uid = localStorage.getItem(UID_KEY);
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem(UID_KEY, uid);
  }
  return uid;
}

// src/client.ts
var DivisorClient = class {
  constructor(config) {
    this.tenantId = config.tenantId;
    this.edgeUrl = "https://divisor-edge.dennergazevedo.workers.dev";
  }
  async get(experimentName) {
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
};
export {
  DivisorClient
};
