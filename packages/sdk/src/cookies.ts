/**
 * Sanitizes a string to be safe for use as a cookie name or value.
 * Removes characters that are not allowed in cookies (semicolons, commas, equals, spaces).
 */
export function sanitize(str: string): string {
  return str.replace(/[;=,\s]/g, "_")?.toLowerCase();
}

export function setCookie(name: string, value: string, hours: number) {
  if (typeof document === "undefined") return;

  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();

  document.cookie = `${sanitize(name)}=${sanitize(value)}${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = sanitize(name) + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
