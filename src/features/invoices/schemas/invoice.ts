import * as z from 'zod';

export const invoiceSchema = z.object({
  clientId: z.string().length(24, "Invalid client ID format"),
  items: z.array(
    z.object({
      productId: z.string().length(24, "Invalid product ID format"),
      quantity: z.number().int().positive("Quantity must be a positive integer"),
    }),
  ).min(1, "At least one invoice item is required"),
  discount: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot be greater than 100")
    .optional(),
  tax: z
    .number()
    .min(0, "Tax cannot be negative")
    .max(100, "Tax cannot be greater than 100")
    .optional(),
  notes: z.string().optional(),
  dueDate: z.coerce
    .date<Date>()
    // .refine((date) => date > new Date(), "Due date must be in the future")
    .optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;