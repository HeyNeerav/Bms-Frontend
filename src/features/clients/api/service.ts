"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { GetApiResponse } from "@/types";

import type {
  UserFilters,
  UsersResponse,
  UserMutationPayload,
  User,
} from "./types";

export async function getUsers(
  businessId: string,
  filters: UserFilters,
): Promise<UsersResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const queryString = new URLSearchParams(
    filters as Record<string, string>,
  ).toString();
  
  const res = await api.get<GetApiResponse<User>>(`/clients?${queryString}`, {
    token,
    businessId,
  });

  const cleaned = {
    success: res.statusCode < 400,
    time: new Date().toISOString(),
    message: "Users fetched successfully",
    total_users: res.data.totalDocs || 0,
    offset: (res.data.page - 1) * res.data.limit,
    limit: res.data.limit,
    users: res.data.docs,
  };

  return cleaned;
}

export async function createUser(
  businessId: string,
  data: UserMutationPayload,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.post("/clients", data, { token, businessId });
}

export async function updateUser(businessId: string, id: string, data: UserMutationPayload) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.patch(`/clients/${id}`, data, { token, businessId });
}

export async function deleteUser(businessId: string, id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.delete(`/clients/${id}`, { token, businessId });
}
