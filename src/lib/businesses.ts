import { getQueryClient } from "./query-client";
import { businessessQueryOptions } from "@/features/businesses/api/queries";

export const getBusinessBySlug = async (slug: string) => {
  const queryClient = getQueryClient();
  const { data } = await queryClient.query(businessessQueryOptions());
  return data.find((business) => business.slug === slug);
};  