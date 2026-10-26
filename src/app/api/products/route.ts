// ============================================================
// Route Handler — Products (list + create)
// ============================================================
// Used with Pattern 2 (Route Handlers + ORM) or Pattern 3 (BFF).
//
// Fullstack (ORM): Replace fakeProducts calls with your ORM
//   const products = await db.query.products.findMany({ ... })
//
// BFF (proxy): Replace with fetch to your external backend
//   const res = await fetch(`${BACKEND_URL}/products?${searchParams}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   })
//   return NextResponse.json(await res.json())
//
// Current: Mock (in-memory fake data for demo/prototyping)
// ============================================================

import { fakeProducts } from '@/constants/mock-api';
import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { cookies, headers as getHeaders } from 'next/headers';

export async function GET(request: NextRequest) {

  const { searchParams } = request.nextUrl;

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const categories = searchParams.get('categories') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const sort = searchParams.get('sort') ?? undefined;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const businesId = cookieStore.get('businessId')?.value;
  const headers = await getHeaders();

  const data = await api.get(`/products?${searchParams.toString()}`, {
    token: accessToken,
    headers: {
      "x-business-id": `${businesId}`, 
      Authorization: `Bearer ${accessToken}`,
      Cookie: `acessToken=${accessToken}`,
    },
  })
  // const data = await fakeProducts.getProducts({
  //   page,
  //   limit,
  //   categories,
  //   search,
  //   sort
  // });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {

  const body = await request.json();
  const data = await fakeProducts.createProduct(body);
  return NextResponse.json(data, { status: 201 });
}
