import { api } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookiesToForward: string[] = [];

  try {
    const searchParams = req.nextUrl.searchParams;

    await api.get(`/auth/google/callback?${searchParams.toString()}`, {
      onResponse(response) {
        cookiesToForward.push(...response.headers.getSetCookie());
      },
    });

    const nextResponse = NextResponse.redirect(
      new URL("/businesses", req.url),
    );

    for (const cookie of cookiesToForward) {
      nextResponse.headers.append("Set-Cookie", cookie);
    }

    return nextResponse;
  } catch (error) {
    const nextResponse = NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    );

    for (const cookie of cookiesToForward) {
      nextResponse.headers.append("Set-Cookie", cookie);
    }

    return nextResponse;
  }
}
