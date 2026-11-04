import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
  domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
};

const accessTokenCookieOptions = {
  ...cookieOptions,
  maxAge: 60 * 60 * 24 * 7,
};

const refreshTokenCookieOptions = {
  ...cookieOptions,
  maxAge: 60 * 60 * 24 * 30,
};

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/auth/sign-in", req.url));

  res.cookies.delete({name: "accessToken", ...accessTokenCookieOptions});
  res.cookies.delete({ name: "refreshToken", ...refreshTokenCookieOptions });
  
  return res;
}
