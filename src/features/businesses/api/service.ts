"use server";

import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";

type BusinessRole = "OWNER" | "ADMIN" | "EMPLOYEE";

type Business = {
  _id: string;
  name: string;
  slug: string;
  logo?: {
    url?: string | undefined;
    publicId?: string | undefined;
  },
  role: BusinessRole;
};


export async function getBusinesses() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.get<ApiResponse<Business[]>>("/businesses", { token });
}