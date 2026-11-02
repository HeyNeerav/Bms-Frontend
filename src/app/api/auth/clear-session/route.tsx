import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
  domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
};


export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/auth/sign-in", req.url));

  res.cookies.delete({name: "accessToken", ...cookieOptions});
  res.cookies.delete({ name: "refreshToken", ...cookieOptions });
  
  return res;
}
