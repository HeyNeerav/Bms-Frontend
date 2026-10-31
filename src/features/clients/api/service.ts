"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { GetApiResponse } from "@/types";

import type {
  ClientFilters,
  ClientsResponse,
  ClientMutationPayload,
  Client,
} from "./types";

export async function getClients(
  businessId: string,
  filters: ClientFilters,
): Promise<ClientsResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const queryString = new URLSearchParams(
    filters as Record<string, string>,
  ).toString();
  
  const res = await api.get<GetApiResponse<Client>>(`/clients?${queryString}`, {
    token,
    businessId,
  });

  const cleaned = {
    success: res.statusCode < 400,
    time: new Date().toISOString(),
    message: "Clients fetched successfully",
    total_clients: res.data.totalDocs || 0,
    offset: (res.data.page - 1) * res.data.limit,
    limit: res.data.limit,
    clients: res.data.docs,
  };

  return cleaned;
}

export async function createClient(
  businessId: string,
  data: ClientMutationPayload,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.post("/clients", data, { token, businessId });
}

export async function updateClient(businessId: string, id: string, data: ClientMutationPayload) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.patch(`/clients/${id}`, data, { token, businessId });
}

export async function deleteClient(businessId: string, id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.delete(`/clients/${id}`, { token, businessId });
}
