import * as z from "zod";

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const optionalString = z.preprocess(
  (value: string | undefined) =>
    typeof value === "string" && value.trim() === ""
      ? undefined
      : value,
  z.string().optional()
);


export const productSchema = z.object({
  imageUrl: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB."
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),

  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be a positive number"),
  type: z.enum(["PRODUCT", "SERVICE"]),
  description: optionalString,
  stockQuantity: z
    .number()
    .int()
    .nonnegative("Stock quantity must be a non-negative integer"),

  sku: optionalString,
  category: optionalString,
});

export type ProductFormValues = Omit<
  z.infer<typeof productSchema>,
  "imageUrl"
> & {
  imageUrl?: File[] | undefined;
};