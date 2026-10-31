import { queryOptions } from "@tanstack/react-query";
import { getClients } from "./service";
import type { Client, ClientFilters } from "./types";

export type { Client };

export const clientKeys = {
  all: ["clients"] as const,
  business: (businessId: string) =>
    [...clientKeys.all, businessId] as const,
  list: (businessId: string, filters: ClientFilters) =>
    [...clientKeys.all, businessId, "list", filters] as const,
  detail: (businessId: string, id: string) =>
    [...clientKeys.all, businessId, "detail", id] as const,
};

export const clientsQueryOptions = (businessId: string, filters: ClientFilters) =>
  queryOptions({
    queryKey: clientKeys.list(businessId, filters),
    queryFn: () => getClients(businessId, filters),
  });
