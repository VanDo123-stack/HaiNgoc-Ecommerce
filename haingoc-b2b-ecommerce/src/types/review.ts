import { z } from "zod";

export const ReviewSchema = z.object({
  id: z.string().min(1),
  productSlug: z.string().min(1),
  authorName: z.string().min(1),
  company: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
  date: z.string(), // ISO date string
  verified: z.boolean(),
});

export type Review = z.infer<typeof ReviewSchema>;
