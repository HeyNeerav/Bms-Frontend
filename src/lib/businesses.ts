// lib/businesses.ts
import { cache } from "react";
import { cookies } from "next/headers";
import { api } from "@/lib/api";

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


export const getBusinessBySlug = cache(async (slug: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await api.get<{ data: Business[] }>("/businesses", { token });
  const business = res.data.find((business) => business.slug === slug);

  return business;
});