import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { NextRequest, NextResponse } from "next/server";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
  domain:
    process.env.NODE_ENV === "production"
      ? process.env.COOKIE_DOMAIN
      : undefined,
};

const verifyEmailCookieOptions = {
  ...cookieOptions,
  maxAge: 15 * 60,
};

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const respData = await api.post("/auth/register", payload);

    const res = NextResponse.json(respData);

    res.cookies.set(
      "pending_verify_email",
      payload.email,
      verifyEmailCookieOptions,
    );

    return res;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to fetch user data",
        },
        { status: error.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user data",
      },
      { status: 500 },
    );
  }
}
