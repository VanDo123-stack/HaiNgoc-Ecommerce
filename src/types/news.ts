import { z } from "zod";

export const NewsArticleSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string(),
  content: z.string(),
  publishedAt: z.string(),
  image: z.string().startsWith("/images/").optional(),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;
