import { Invoice } from "@/features/invoices/api/types";

export type PaymentMethod = "UPI" | "CASH" | "BANK" | "CARD";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface InvoiceItem {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Payment {
  _id: string;
  businessId: string;
  invoice: Pick<Invoice, "_id" | "invoiceNumber">;
  amount: number;
  method: PaymentMethod
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
  paidAt: Date;
  createdBy: string;
  isArchived: boolean;
  metadata?: Record<string, unknown>;
}

export interface PaymentMutationPayload {
  invoiceId: string;
  amount: number;
  method?: PaymentMethod;
  status?: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
  notes?: string;
}

export type PaymentFilters = {
  page?: number;
  limit?: number;
  categories?: string;
  search?: string;
  sort?: string;
};

export type PaymentsResponse = {
  success: boolean;
  time: string;
  message: string;
  total_payments: number;
  offset: number;
  limit: number;
  payments: Payment[];
};

export type PaymentByIdResponse = {
  success: boolean;
  time: string;
  message: string;
  payment: Payment;
};
