import * as z from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  companyName: z.string().optional(),
  gstNumber: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
