import { mutationOptions } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { createPayment, deletePayment } from "./service";
import { paymentKeys } from "./queries";
import type { PaymentMutationPayload } from "./types";

export const createPaymentMutation = mutationOptions({
  mutationFn: ({
    businessId,
    data,
  }: {
    businessId: string;
    data: PaymentMutationPayload;
  }) => createPayment(businessId, data),
  onSuccess: (_, { businessId }) => {
    getQueryClient().invalidateQueries({ queryKey: paymentKeys.business(businessId) });
  },
});

export const deletePaymentMutation = mutationOptions({
  mutationFn: ({ businessId, id }: { businessId: string; id: string }) =>
    deletePayment(businessId, id),
});
