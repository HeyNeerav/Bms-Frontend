import { api } from "@/lib/api";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (token) {
    try {
      await api.get("/auth/logout", { token });
    } catch {}
  }

  const res = NextResponse.redirect(new URL("/auth/sign-in", req.url));

  res.cookies.delete("accessToken");
  res.cookies.delete("refreshToken");

  return res;
}
