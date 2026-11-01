import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) { 
  const backendUrl = process.env.BACKEND_API_URL!;

  return NextResponse.redirect(
    new URL(`${backendUrl}/auth/google`),
  );
}