import { queryOptions } from "@tanstack/react-query";
import { getBusinesses } from "./service";

export const businessesKeys = {
  all: ["businesses"] as const,
  me: () => [...businessesKeys.all, "me"] as const,
};

export const businessessQueryOptions = () =>
  queryOptions({
    queryKey: businessesKeys.me(),
    queryFn: () => getBusinesses(),
  });
