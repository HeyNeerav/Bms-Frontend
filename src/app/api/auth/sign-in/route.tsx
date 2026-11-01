import { api, ApiError } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookiesToForward: string[] = [];

  try {
    const { identifier, password } = await req.json();

    const data = await api.post(
      "/auth/login",
      { identifier, password },
      {
        onResponse(response) {
          cookiesToForward.push(...response.headers.getSetCookie());
        },
      },
    );

    const nextResponse = NextResponse.json({
      message: "Login successful",
      data,
    });

    return nextResponse;
  } catch (error) {
    let nextResponse: NextResponse;

    if (error instanceof ApiError) {
      const backendStatus = error.status || 500;
      const backendMessage = error.message || "Failed to fetch user data";

      nextResponse = NextResponse.json(
        { error: backendMessage },
        { status: backendStatus },
      );
    } else {
      nextResponse = NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 },
      );
    }

    for (const cookie of cookiesToForward) {
      nextResponse.headers.append("Set-Cookie", cookie);
    }

    return nextResponse;
  }
}
