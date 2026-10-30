import * as z from 'zod';

export const paymentSchema = z.object({
  invoiceId: z.string().length(24, "Invalid invoice ID"),
  amount: z.number().positive(),
  method: z.enum(["UPI", "CASH", "BANK", "CARD"]).optional(),
  status: z.enum(["PENDING", "SUCCESS", "FAILED"]).optional(),
  transactionId: z.string().optional(),
  paidAt: z.date().optional(),
  notes: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;