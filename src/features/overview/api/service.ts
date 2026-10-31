"use server";

import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";
import { Analytics } from "./types";

export async function getAnalytics(businessId: string, period: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await api.get<ApiResponse<Analytics>>(`/analytics?period=${period}`, { token, businessId });

  console.dir(res.data, { depth: null, colors: true });

  return res;
}