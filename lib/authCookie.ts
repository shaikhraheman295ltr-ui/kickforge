/**
 * The auth session lives in two places on purpose:
 *
 *   localStorage — read by the client store (FloatingNav, cart gating, ...).
 *   a cookie     — the only thing the middleware can see, so it is the source
 *                  of truth for "is this request allowed through".
 *
 * Always keep them in sync through the helpers below instead of writing to
 * either one directly.
 */
export const AUTH_COOKIE = "kf-auth";

export interface SessionUser {
  name: string;
  email: string;
}

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function isSessionUser(value: unknown): value is SessionUser {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<SessionUser>;
  return typeof candidate.name === "string" && typeof candidate.email === "string";
}

export function writeAuthCookie(user: SessionUser): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(user));
  // `Secure` would make the cookie undeliverable over plain http, which breaks
  // local production builds (`next start` on localhost), so only set it on https.
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${AUTH_COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  // Same Path/SameSite as the write, or the browser keeps the original around.
  document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function readAuthCookie(): SessionUser | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE}=`));
  if (!entry) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(entry.slice(AUTH_COOKIE.length + 1)));
    return isSessionUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
