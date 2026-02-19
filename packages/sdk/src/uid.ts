const UID_KEY = "divisor_uid";

export function getUid(): string {
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
