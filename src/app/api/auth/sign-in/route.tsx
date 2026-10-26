import { api } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();
    const data = await api.post("/auth/login", {
      identifier,
      password,
    });

    return NextResponse.json({ message: "Login successful", data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}
