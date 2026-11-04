import { api, ApiError } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Email is required for verification",
      }, { status: 400 });
    }

    const res = await api.post(
      "/auth/verify/send",
      { email },
    );

    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({
        success: false,
        message: error.message || "Internal server error",
      }, {status: error.status || 500});
    } else {
      return NextResponse.json({
        success: false,
        message: "Internal server error",
      }, { status: 500});
    }
  }
}
