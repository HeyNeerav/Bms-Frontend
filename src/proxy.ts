
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/home", "/dashboard"];
const authRoutes = ["/login", "/signup"];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    matchesRoute(pathname, route),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const hasAccessToken = request.cookies.has("accessToken");

  if (!hasAccessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

 
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static, _next/image
     * - all static media, fonts, and assets (.png, .jpg, .svg, .ttf, etc.)
     * - metadata files (favicon, sitemap, robots, webmanifest)
     */
    "/((?!api|_next/static|_next/image|.*\\.(?:png|avif|jpg|jpeg|gif|webp|svg|ico|ttf|woff|woff2|mp3|wav|webmanifest)$|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
}