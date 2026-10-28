"use server";

// ============================================================
// User Service — Data Access Layer
// ============================================================
// This is the ONLY file you modify when connecting to your backend.
// Queries (queries.ts) and components import from here — they never change.
//
// Pick your pattern and replace the function bodies below:
//
// 1. Server Actions + ORM (Prisma / Drizzle / Supabase)
//    → Add 'use server' at the top of this file
//    → Call your ORM directly in each function
//
// 2. Route Handlers + ORM
//    → import { apiClient } from '@/lib/api-client'
//    → return apiClient<UsersResponse>('/users?...')
//    → Replace mock calls in route handlers (src/app/api/users/) with ORM
//
// 3. BFF — Route Handlers proxy to external backend (Laravel, Go, etc.)
//    → import { apiClient } from '@/lib/api-client'
//    → return apiClient<UsersResponse>('/users?...')
//    → Route handlers proxy requests to your external backend service
//
// 4. Direct external API (frontend-only, no Next.js backend)
//    → const res = await fetch('https://your-api.com/users?...')
//    → return res.json()
//
// Current: Mock (in-memory fake data for demo/prototyping)
// ============================================================

import { fakeUsers } from '@/constants/mock-api-users';
import type { UserFilters, UsersResponse, UserMutationPayload } from './types';
import { api } from '@/lib/api';
import { cookies } from 'next/headers';

export async function getUsers(filters: UserFilters): Promise<UsersResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const queryString = new URLSearchParams(filters as Record<string, string>).toString();

  return api.get(`/clients?${queryString}`, {token});
}

export async function createUser(data: UserMutationPayload) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.post('/clients', data, {token});
}

export async function updateUser(id: string, data: UserMutationPayload) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.patch(`/clients/${id}`, data, {token});
}

export async function deleteUser(id: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.delete(`/clients/${id}`, {token});
}
