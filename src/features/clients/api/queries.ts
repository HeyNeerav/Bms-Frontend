import { queryOptions } from "@tanstack/react-query";
import { getUsers } from "./service";
import type { User, UserFilters } from "./types";

export type { User };

export const userKeys = {
  all: ["users"] as const,

  list: (businessId: string, filters: UserFilters) =>
    [...userKeys.all, businessId, "list", filters] as const,

  detail: (businessId: string, id: string) =>
    [...userKeys.all, businessId, "detail", id] as const,
};

export const usersQueryOptions = (businessId: string, filters: UserFilters) =>
  queryOptions({
    queryKey: userKeys.list(businessId, filters),
    queryFn: () => getUsers(businessId, filters),
  });
