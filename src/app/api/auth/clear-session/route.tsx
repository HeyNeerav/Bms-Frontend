import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url));

  res.cookies.delete("accessToken");
  res.cookies.delete("refreshToken");

  return res;
}
