import { mutationOptions } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { createInvoice, updateInvoice, deleteInvoice } from "./service";
import { invoiceKeys } from "./queries";
import type { InvoiceMutationPayload } from "./types";

export const createInvoiceMutation = mutationOptions({
  mutationFn: ({
    businessId,
    data,
  }: {
    businessId: string;
    data: InvoiceMutationPayload;
  }) => createInvoice(businessId, data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: invoiceKeys.all });
  },
});

export const updateInvoiceMutation = mutationOptions({
  mutationFn: ({
    businessId,
    id,
    values,
  }: {
    businessId: string;
    id: string;
    values: InvoiceMutationPayload;
  }) => updateInvoice(businessId, id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: invoiceKeys.all });
  },
});

export const deleteInvoiceMutation = mutationOptions({
  mutationFn: ({ businessId, id }: { businessId: string; id: string }) =>
    deleteInvoice(businessId, id),
});
