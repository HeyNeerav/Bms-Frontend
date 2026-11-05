import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookiesToForward: string[] = [];
  let nextResponse: NextResponse;

  try {
    const { identifier, password } = await req.json();

    const respData = await api.post(
      "/auth/login",
      { identifier, password },
      {
        onResponse(response) {
          cookiesToForward.push(...response.headers.getSetCookie());
        },
      },
    );

    nextResponse = NextResponse.json(respData);
  } catch (error) {
    if (error instanceof ApiError) {
      nextResponse = NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to fetch user data",
        },
        { status: error.status || 500 },
      );
    } else {
      nextResponse = NextResponse.json(
        {
          success: false,
          message: "Failed to fetch user data",
        },
        { status: 500 },
      );
    }
  }

  for (const cookie of cookiesToForward) {
    nextResponse.headers.append("Set-Cookie", cookie);
  }

  return nextResponse;
}
