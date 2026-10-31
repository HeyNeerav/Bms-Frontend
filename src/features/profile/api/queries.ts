import { queryOptions } from "@tanstack/react-query";
import { getProfile } from "./service";

export const userKeys = {
  all: ["user", "me"] as const,
};

export const userMeQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.all,
    queryFn: () => getProfile(),
  });