"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { GetApiResponse } from "@/types";

import type {
  ProductFilters,
  ProductsResponse,
  ProductByIdResponse,
  ProductMutationPayload,
  Product,
} from "./types";

export async function getProducts(
  businessId: string,
  filters: ProductFilters,
): Promise<ProductsResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const queryString = new URLSearchParams(
    filters as Record<string, string>,
  ).toString();

  const res = await api.get<GetApiResponse<Product>>(
    `/products?${queryString}`,
    { token, businessId },
  );

  const cleaned = {
    success: res.statusCode < 400,
    time: new Date().toISOString(),
    message: "Products fetched successfully",
    total_products: res.data.totalDocs || 0,
    offset: (res.data.page - 1) * res.data.limit,
    limit: res.data.limit,
    products: res.data.docs,
  };

  return cleaned;
}

export async function getProductById(
  businessId: string,
  id: string,
): Promise<ProductByIdResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await api.get<{
    statusCode: number;
    data: Product;
    message?: string;
  }>(`/products/${id}`, { token, businessId });

  const cleaned = {
    success: res.statusCode < 400,
    time: new Date().toISOString(),
    message: res?.message ?? "Product fetched successfully",
    product: res.data,
  };
  
  return cleaned;
}

export async function createProduct(
  businessId: string,
  data: ProductMutationPayload,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }

  return await api.post("/products", formData, { token, businessId });
}

export async function updateProduct(
  businessId: string,
  id: string,
  data: ProductMutationPayload,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.patch(`/products/${id}`, data, { token, businessId });
}

export async function deleteProduct(businessId: string, id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.delete(`/products/${id}`, { token, businessId });
}
