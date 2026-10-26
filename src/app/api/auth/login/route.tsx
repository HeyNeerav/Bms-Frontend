import { api } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try { 
    const { identifier, password } = await req.json();
    const res = await api.post("/auth/login", {
      identifier,
      password
    });
    console.log("Api res", res);

    return NextResponse.json("test");
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}