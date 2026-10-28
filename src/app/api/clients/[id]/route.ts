import { api } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const token = req.cookies.get("accessToken")?.value;

  const { id } = await params;
  const data = await api.patch(`/clients/${id}`, { token });

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const token = req.cookies.get("accessToken")?.value;

  const { id } = await params;
  const body = await req.json();
  const data = await api.patch(`/clients/${id}`, body, { token });

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const token = req.cookies.get("accessToken")?.value;

  const { id } = await params;
  const data = await api.delete(`/clients/${id}`, { token });

  return NextResponse.json(data);
}
