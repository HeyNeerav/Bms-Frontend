import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const cookieDomain =
  process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined;

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/auth/sign-in", req.url));

  res.cookies.delete({
    name: "accessToken",
    path: "/",
    domain: cookieDomain,
  });
  res.cookies.delete({
    name: "refreshToken",
    path: "/",
    domain: cookieDomain,
  });

  return res;
}
