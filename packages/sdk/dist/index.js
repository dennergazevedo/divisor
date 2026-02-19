"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DivisorClient: () => DivisorClient
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DivisorClient
});
