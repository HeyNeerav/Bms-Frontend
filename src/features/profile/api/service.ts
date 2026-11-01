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

export async function updateProfile(name: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.patch<ApiResponse<User>>("/me", { name }, { token });
}

export async function updateAvatar(imageUrl: File | null) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const formData = new FormData();
  if (imageUrl) {
    formData.append("avatarUrl", imageUrl);
  }

  return await api.patch<ApiResponse<User>>("/users/update-avatar", formData, {
    token,
  });
}

export async function changePassword() {
  //
}
