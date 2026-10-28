import { api } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  const { searchParams } = req.nextUrl;
  
  const data = api.get(`/clients/?${searchParams}`, {token})

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  const body = await req.json();
  const data = await api.post("/clients", body, {token})

  return NextResponse.json(data);
}
