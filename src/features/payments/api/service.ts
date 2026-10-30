"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { GetApiResponse } from "@/types";

import type {
  PaymentFilters,
  PaymentsResponse,
  PaymentByIdResponse,
  PaymentMutationPayload,
  Payment,
} from "./types";

export async function getPayments(
  businessId: string,
  filters: PaymentFilters,
): Promise<PaymentsResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const queryString = new URLSearchParams(
    filters as Record<string, string>,
  ).toString();

  const res = await api.get<GetApiResponse<Payment>>(
    `/payments?${queryString}`,
    { token, businessId },
  );

  const cleaned = {
    success: res.statusCode < 400,
    time: new Date().toISOString(),
    message: "Payments fetched successfully",
    total_payments: res.data.totalDocs || 0,
    offset: (res.data.page - 1) * res.data.limit,
    limit: res.data.limit,
    payments: res.data.docs,
  };

  return cleaned;
}

export async function getPaymentById(
  businessId: string,
  id: string,
): Promise<PaymentByIdResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await api.get<{
    statusCode: number;
    data: Payment;
    message?: string;
  }>(`/payments/${id}`, { token, businessId });

  const cleaned = {
    success: res.statusCode < 400,
    time: new Date().toISOString(),
    message: res?.message ?? "Payment fetched successfully",
    payment: res.data,
  };
  
  return cleaned;
}

export async function createPayment(
  businessId: string,
  data: PaymentMutationPayload,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.post("/payments", data, { token, businessId });
}


export async function deletePayment(businessId: string, id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.delete(`/payments/${id}`, { token, businessId });
}
