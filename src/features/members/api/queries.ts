import { queryOptions } from "@tanstack/react-query";
import { getMembers } from "./service";
import type { Member, MemberFilters } from "./types";

export type { Member };

export const memberKeys = {
  all: ["members"] as const,
  business: (businessId: string) =>
    [...memberKeys.all, businessId] as const,
  list: (businessId: string, filters: MemberFilters) =>
    [...memberKeys.all, businessId, "list", filters] as const,
  detail: (businessId: string, id: string) =>
    [...memberKeys.all, businessId, "detail", id] as const,
};

export const membersQueryOptions = (businessId: string, filters: MemberFilters) =>
  queryOptions({
    queryKey: memberKeys.list(businessId, filters),
    queryFn: () => getMembers(businessId, filters),
  });
