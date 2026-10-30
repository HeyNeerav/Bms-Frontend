import { queryOptions } from "@tanstack/react-query";
import { getPayments, getPaymentById } from "./service";
import type { Payment, PaymentFilters } from "./types";

export type { Payment };

export const paymentKeys = {
  all: ["payments"] as const,
  business: (businessId: string) =>
    [...paymentKeys.all, businessId] as const,
  list: (businessId: string, filters: PaymentFilters) =>
    [...paymentKeys.all, businessId, "list", filters] as const,
  detail: (businessId: string, id: string) =>
    [...paymentKeys.all, businessId, "detail", id] as const,
};

export const paymentsQueryOptions = (
  businessId: string,
  filters: PaymentFilters,
) =>
  queryOptions({
    queryKey: paymentKeys.list(businessId, filters),
    queryFn: () => getPayments(businessId, filters),
  });

export const paymentByIdOptions = (businessId: string, id: string) =>
  queryOptions({
    queryKey: paymentKeys.detail(businessId, id),
    queryFn: () => getPaymentById(businessId, id),
  });
