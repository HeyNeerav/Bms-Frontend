import { NextRequest, NextResponse } from "next/server";

const privateAuthRoutes = [
  "/auth/sign-up",
  "/auth/sign-in",
  "/auth/forgot-password",
];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateAuthRoute = privateAuthRoutes.some((route) =>
    matchesRoute(pathname, route),
  );
  const hasAccessToken = request.cookies.has("accessToken");

  if (isPrivateAuthRoute && hasAccessToken) {
    const homeUrl = new URL("/businesses", request.url);
    return NextResponse.redirect(homeUrl);
  }

  if (!isPrivateAuthRoute && !hasAccessToken) {
    const loginUrl = new URL("/auth/sign-in", request.url);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes
     * - _next/static and _next/image
     * - Static media, fonts, and assets
     * - Metadata files
     */
    "/((?!api|trpc|_next/static|_next/image|.*\\.(?:html?|css|js(?!on)|jpe?g|avif|png|gif|webp|svg|ico|ttf|woff2?|mp3|wav|csv|docx?|xlsx?|zip|webmanifest)$|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};
