import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(3),
    image: z.string().url().optional(),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    basePrice: z.number().positive(),
    categoryId: z.string().uuid(),
    image: z.string().url().optional(),
    isAdult: z.boolean().optional(),
  }),
});

export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    address: z.string(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    radiusKm: z.number().positive().optional(),
  }),
});

export const assignProductSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    price: z.number().positive().optional(),
    isAvailable: z.boolean().optional(),
  }),
  params: z.object({
    storeId: z.string().uuid(),
  }),
});
