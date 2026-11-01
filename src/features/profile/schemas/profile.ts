import * as z from 'zod';

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];


export const nameSchema = z.object({
  name: z.string().min(4, { message: 'Name must be at least 4 characters' }),
})

export type NameFormValues = z.infer<typeof nameSchema>;

export const profileImageSchema = z.object({
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
})

export type ProfileImageFormValues = z.infer<typeof profileImageSchema>;