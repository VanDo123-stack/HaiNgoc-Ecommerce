import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  categorySlug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  material: z.string(),
  origin: z.string(),
  standard: z.string(),
  description: z.string(),
  image: z.string().startsWith("/images/"),
  status: z.enum(["in-stock", "out-of-stock"]),
  price: z.number().positive().nullable(),
  // v2.0 optional fields — all use .optional() so existing 22 products pass validation without modification
  originalPrice: z.number().positive().nullable().optional(),
  salePrice: z.number().positive().nullable().optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  images: z.array(z.string().startsWith("/images/")).optional(),
  relatedSlugs: z.array(z.string()).optional(),
  standardType: z.enum(["JIS", "ASTM", "DIN", "AWS", "other"]).optional(),
  dimensionCategory: z.string().optional(),
  materialGrade: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const CategorySchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: z.string().default(""),
  image: z.string().startsWith("/images/").optional(),
  productCount: z.number().int().nonnegative().default(0),
});

export type Category = z.infer<typeof CategorySchema>;
