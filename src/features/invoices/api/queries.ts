import { queryOptions } from "@tanstack/react-query";
import { getInvoices, getInvoiceById } from "./service";
import type { Invoice, InvoiceFilters } from "./types";

export type { Invoice };

export const invoiceKeys = {
  all: ["invoices"] as const,
  list: (businessId: string, filters: InvoiceFilters) =>
    [...invoiceKeys.all, businessId, "list", filters] as const,
  detail: (businessId: string, id: string) =>
    [...invoiceKeys.all, businessId, "detail", id] as const,
};

export const invoicesQueryOptions = (
  businessId: string,
  filters: InvoiceFilters,
) =>
  queryOptions({
    queryKey: invoiceKeys.list(businessId, filters),
    queryFn: () => getInvoices(businessId, filters),
  });

export const invoiceByIdOptions = (businessId: string, id: string) =>
  queryOptions({
    queryKey: invoiceKeys.detail(businessId, id),
    queryFn: () => getInvoiceById(businessId, id),
  });
