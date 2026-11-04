import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookies = req.cookies;
  const email = cookies.get("pending_verify_email")?.value;

  if (!email) {
    return NextResponse.json(
      {
        success: false,
        message: "No pending verification email found",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      email: email,
    },
    { status: 200 },
  );
}
