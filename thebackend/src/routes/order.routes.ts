import { Router } from "express";
import * as c from "../controllers/order.controller";
import { validate } from "../middlewares/validate.middleware";
import { updateStatusSchema } from "../validations/order.schema"; // Import the new schema

import { z } from "zod";

const router = Router();

// Validation Schema for Placing Order
const createOrderSchema = z.object({
  body: z.object({
    userId: z.string().uuid(), // You must create a user first manually in DB or API
    storeId: z.string().uuid(),
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.number().min(1),
        })
      )
      .min(1),
  }),
});

router.post("/", validate(createOrderSchema), c.placeOrder);
router.get("/:id", c.getOrderDetails);

router.get("/store/:storeId", c.getStoreOrders);
router.get("/store/:storeId/stats", c.getStoreStats);
router.patch("/:id/status", validate(updateStatusSchema), c.updateStatus);

export default router;
