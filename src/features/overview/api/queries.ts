import { queryOptions } from "@tanstack/react-query";
import { AnalyticsPeriod } from "./types";
import { getAnalytics } from "./service";

const analyticsKeys = {
  all: ["analytics"] as const,
  business: (businessId: string) =>
    [...analyticsKeys.all, businessId] as const,
  list: (businessId: string, period: AnalyticsPeriod) =>
    [...analyticsKeys.all, businessId, "list", period] as const,
};

export const analyticsQueryOptions = (businessId: string, period: AnalyticsPeriod) =>
  queryOptions({
    queryKey: analyticsKeys.list(businessId, period),
    queryFn: () => getAnalytics(businessId, period),
  });
