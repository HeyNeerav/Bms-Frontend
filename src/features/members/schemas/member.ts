import * as z from "zod";

export const memberSchema = z.object({
  email: z.string().trim().email("Invalid email format").or(z.literal("")),
  role: z.enum(
    ["OWNER", "ADMIN", "EMPLOYEE"],
    "Owner, Admin, or Employee role is required",
  ),
});

export type MemberFormValues = z.infer<typeof memberSchema>;
