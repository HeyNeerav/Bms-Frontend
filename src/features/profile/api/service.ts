"use server";

import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";
import { User } from "./types";

export async function getProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.get<ApiResponse<User>>("/users/me", { token });
}
