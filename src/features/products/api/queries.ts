import { queryOptions } from "@tanstack/react-query";
import { getProducts, getProductById } from "./service";
import type { Product, ProductFilters } from "./types";

export type { Product };

export const productKeys = {
  all: ["products"] as const,
  business: (businessId: string) =>
    [...productKeys.all, businessId] as const,
  list: (businessId: string, filters: ProductFilters) =>
    [...productKeys.all, businessId, "list", filters] as const,
  detail: (businessId: string, id: string) =>
    [...productKeys.all, businessId, "detail", id] as const,
};

export const productsQueryOptions = (
  businessId: string,
  filters: ProductFilters,
) =>
  queryOptions({
    queryKey: productKeys.list(businessId, filters),
    queryFn: () => getProducts(businessId, filters),
  });

export const productByIdOptions = (businessId: string, id: string) =>
  queryOptions({
    queryKey: productKeys.detail(businessId, id),
    queryFn: () => getProductById(businessId, id),
  });
