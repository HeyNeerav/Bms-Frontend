import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.BACKEND_API_URL || "http://localhost:8000/api/v1";

const AUTH_ROUTES = new Set([
  "/auth/sign-up",
  "/auth/sign-in",
  "/auth/forgot-password",
]);

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  domain:
    process.env.NODE_ENV === "production"
      ? process.env.COOKIE_DOMAIN
      : undefined,
};

const AUTH_COOKIE_NAMES = ["accessToken", "refreshToken"] as const;

function getTokenExpiry(token?: string): number | null {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = JSON.parse(atob(normalized));

    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token?: string) {
  const expiry = getTokenExpiry(token);

  return expiry === null || expiry <= Date.now() / 1000 + 15;
}

function getCookieValue(setCookie: string, name: string) {
  return setCookie.match(new RegExp(`^${name}=([^;]*)`))?.[1] ?? null;
}

async function refreshTokens(request: NextRequest) {
  if (!request.cookies.has("refreshToken")) return null;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const setCookies = response.headers.getSetCookie();

    const hasAccessToken = setCookies.some(
      (cookie) => getCookieValue(cookie, "accessToken") !== null,
    );

    const hasRefreshToken = setCookies.some(
      (cookie) => getCookieValue(cookie, "refreshToken") !== null,
    );

    if (!hasAccessToken || !hasRefreshToken) return null;

    return setCookies;
  } catch {
    return null;
  }
}

function createResponse(
  request: NextRequest,
  setCookies: string[] = [],
) {
  const requestHeaders = new Headers(request.headers);

  if (setCookies.length) {
    const cookies = new Map(
      request.cookies.getAll().map(({ name, value }) => [name, value]),
    );

    for (const cookie of setCookies) {
      for (const name of AUTH_COOKIE_NAMES) {
        const value = getCookieValue(cookie, name);

        if (value !== null) {
          cookies.set(name, value);
        }
      }
    }

    requestHeaders.set(
      "cookie",
      [...cookies].map(([name, value]) => `${name}=${value}`).join("; "),
    );
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  for (const cookie of setCookies) {
    response.headers.append("Set-Cookie", cookie);
  }

  return response;
}

function clearAuthCookies(response: NextResponse) {
  for (const name of AUTH_COOKIE_NAMES) {
    response.cookies.set(name, "", {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 0,
    });
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (AUTH_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const hasRefreshToken = request.cookies.has("refreshToken");

  if (!accessToken && !hasRefreshToken) {
    return NextResponse.redirect(
      new URL("/auth/sign-in", request.url),
    );
  }

  if (!isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  const setCookies = await refreshTokens(request);

  if (setCookies) {
    return createResponse(request, setCookies);
  }

  const response = clearAuthCookies(NextResponse.next());

  if (request.headers.has("next-action")) {
    return response;
  }

  return NextResponse.redirect(
    new URL("/auth/sign-in", request.url),
  );
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next/static|_next/image|.*\\.(?:html?|css|js(?!on)|jpe?g|avif|png|gif|webp|svg|ico|ttf|woff2?|mp3|wav|csv|docx?|xlsx?|zip|webmanifest)$|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};
