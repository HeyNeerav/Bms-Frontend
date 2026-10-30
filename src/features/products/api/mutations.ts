import { mutationOptions } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { createProduct, updateProduct, deleteProduct } from "./service";
import { productKeys } from "./queries";
import type { ProductMutationPayload } from "./types";

export const createProductMutation = mutationOptions({
  mutationFn: ({
    businessId,
    data,
  }: {
    businessId: string;
    data: ProductMutationPayload;
  }) => createProduct(businessId, data),
  onSuccess: (_, { businessId }) => {
    getQueryClient().invalidateQueries({ queryKey: productKeys.business(businessId) });
  },
});

export const updateProductMutation = mutationOptions({
  mutationFn: ({
    businessId,
    id,
    values,
  }: {
    businessId: string;
    id: string;
    values: ProductMutationPayload;
  }) => updateProduct(businessId, id, values),
  onSuccess: (_, { businessId }) => {
    getQueryClient().invalidateQueries({ queryKey: productKeys.business(businessId) });
  },
});

export const deleteProductMutation = mutationOptions({
  mutationFn: ({ businessId, id }: { businessId: string; id: string }) =>
    deleteProduct(businessId, id),
});
