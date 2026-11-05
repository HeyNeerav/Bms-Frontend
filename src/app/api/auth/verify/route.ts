import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, verificationCode } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required for verification",
        },
        { status: 400 },
      );
    }

    const res = await api.post("/auth/verify", { email, verificationCode });

    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to fetch user data",
        },
        { status: error.status || 500 },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch user data",
        },
        { status: 500 },
      );
    }
  }
}
