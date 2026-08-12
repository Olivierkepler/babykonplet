import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  description: z.string().min(5),
  price: z.number().int().min(0),
  imageUrl: z.string().url().optional().or(z.literal("")),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(200).optional(),
  slug: z.string().min(2).max(200).optional(),
  description: z.string().min(5).optional(),
  price: z.number().int().min(0).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});