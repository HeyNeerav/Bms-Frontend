"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { GetApiResponse } from "@/types";

import type {
  InvoiceFilters,
  InvoicesResponse,
  InvoiceByIdResponse,
  InvoiceMutationPayload,
  Invoice,
} from "./types";

export async function getInvoices(
  businessId: string,
  filters: InvoiceFilters,
): Promise<InvoicesResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const queryString = new URLSearchParams(
    filters as Record<string, string>,
  ).toString();

  const res = await api.get<GetApiResponse<Invoice>>(
    `/invoices?${queryString}`,
    { token, businessId },
  );

  const cleaned = {
    success: res.statusCode < 400,
    time: new Date().toISOString(),
    message: "Invoices fetched successfully",
    total_invoices: res.data.totalDocs || 0,
    offset: (res.data.page - 1) * res.data.limit,
    limit: res.data.limit,
    invoices: res.data.docs,
  };

  return cleaned;
}

export async function getInvoiceById(
  businessId: string,
  id: string,
): Promise<InvoiceByIdResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await api.get<{
    statusCode: number;
    data: Invoice;
    message?: string;
  }>(`/invoices/${id}`, { token, businessId });

  const cleaned = {
    success: res.statusCode < 400,
    time: new Date().toISOString(),
    message: res?.message ?? "Invoice fetched successfully",
    invoice: res.data,
  };
  
  return cleaned;
}

export async function createInvoice(
  businessId: string,
  data: InvoiceMutationPayload,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.post("/invoices", data, { token, businessId });
}

export async function updateInvoice(
  businessId: string,
  id: string,
  data: InvoiceMutationPayload,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.patch(`/invoices/${id}`, data, { token, businessId });
}

export async function deleteInvoice(businessId: string, id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return await api.delete(`/invoices/${id}`, { token, businessId });
}
