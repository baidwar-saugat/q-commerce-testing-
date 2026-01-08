import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus), // Must be PENDING, PREPARING, etc.
  }),
});
