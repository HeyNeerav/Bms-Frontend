import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = req.cookies;
  const token = cookieStore.get("accessToken")?.value;

  try {
    const respData = await api.get("/businesses", { token });
    return NextResponse.json(respData);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = req.cookies;
  const token = cookieStore.get("accessToken")?.value;

  try {
    const data = await req.json();
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== "" && value != null,
      ),
    );

    const respData = await api.post("/businesses", cleanedData, { token });
    return NextResponse.json(
      { message: "Business created successfully", data: respData },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.json(
      { message: "Failed to create business" },
      { status: 500 },
    );
  }
}
