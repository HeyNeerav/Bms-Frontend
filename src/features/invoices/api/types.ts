import { User } from "@/features/clients/api/types";

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"

export interface InvoiceItem {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  _id: string;
  businessId: string;
  client: Pick<User, "_id" | "name" | "email">;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  dueDate?: Date;
  issuedDate: Date;
  notes?: string;
  createdBy: string;
  paidAt?: Date;
  isArchived: boolean;
  metadata?: Record<string, unknown>;
}

export interface InvoiceMutationPayload {
  items: Pick<InvoiceItem, "productId" | "quantity" >[];
  discount?: number;
  tax?: number;
  dueDate?: Date;
  notes?: string;
}

export type InvoiceFilters = {
  page?: number;
  limit?: number;
  categories?: string;
  search?: string;
  sort?: string;
};

export type InvoicesResponse = {
  success: boolean;
  time: string;
  message: string;
  total_invoices: number;
  offset: number;
  limit: number;
  invoices: Invoice[];
};

export type InvoiceByIdResponse = {
  success: boolean;
  time: string;
  message: string;
  invoice: Invoice;
};
