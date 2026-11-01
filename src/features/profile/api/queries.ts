import { queryOptions } from "@tanstack/react-query";
import { getProfile } from "./service";

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export const userMeQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.me(),
    queryFn: () => getProfile(),
  });
