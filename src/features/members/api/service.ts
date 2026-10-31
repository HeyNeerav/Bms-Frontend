"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { GetApiResponse } from "@/types";

import type {
  MemberFilters,
  MembersResponse,
  MemberMutationPayload,
  Member,
} from "./types";

export async function getMembers(
  businessId: string,
  filters: MemberFilters,
): Promise<MembersResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const queryString = new URLSearchParams(
    filters as Record<string, string>,
  ).toString();

  const res = await api.get<GetApiResponse<Member>>(
    `/business-members?${queryString}`,
    {
      token,
      businessId,
    },
  );

  const cleaned = {
    success: res.statusCode < 400,
    time: new Date().toISOString(),
    message: "Members fetched successfully",
    total_members: res.data.totalDocs || 0,
    offset: (res.data.page - 1) * res.data.limit,
    limit: res.data.limit,
    members: res.data.docs,
  };

  return cleaned;
}

export async function createMember(
  businessId: string,
  data: MemberMutationPayload,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.post("/business-members", data, { token, businessId });
}

export async function updateMemberRole(
  businessId: string,
  id: string,
  role: Pick<MemberMutationPayload, "role">,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.patch(
    `/business-members/${id}/role`,
    { role },
    { token, businessId },
  );
}

export async function deleteMember(businessId: string, userId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.delete(`/business-members/${userId}`, { token, businessId });
}
  