import { api, ApiError } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = req.cookies;
  const token = cookieStore.get("accessToken")?.value;

  try {
    const respData = await api.get("/businesses", { token });
    return NextResponse.json(respData)
  } catch (error) {

    if (error instanceof ApiError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 },
        );
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
    const respData = await api.post("/businesses", data, { token });
    return NextResponse.json(
      { message: "Business created successfully", data: respData },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error create business", error);
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 },
    ); 
  }
}