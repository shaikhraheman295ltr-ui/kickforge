import { NextResponse, type NextRequest } from "next/server";

/** Must match AUTH_COOKIE in lib/authCookie.ts */
const AUTH_COOKIE = "kf-auth";

/**
 * Login is mandatory: no route renders for an anonymous visitor. The check runs
 * at the edge so protected content is never sent to the browser in the first
 * place — a client-side guard would leak the page and flash it before redirect.
 *
 * The cookie is only a presence check, not a signature: this demo has no auth
 * server to verify against, so treat it as a gate, not as security.
 */
export function middleware(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE)?.value);
  const { pathname, search } = request.nextUrl;

  /* Already signed in — the login page has nothing to offer. */
  if (pathname === "/login") {
    if (!hasSession) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (hasSession) return NextResponse.next();

  /* Anonymous — everything else is off limits. Remember where they were headed
     so the login page can send them straight back after a successful sign in. */
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match every path except Next's build output and the static assets the
     * login page needs to render — redirecting those would break the page that
     * is supposed to let people in.
     */
    "/((?!_next/static|_next/image|frames/|images/|.*\\.(?:svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|css|js|map|txt|xml|json|mp4|webm)$).*)",
  ],
};
