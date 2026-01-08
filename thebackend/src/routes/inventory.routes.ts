import { Router } from "express";
import * as c from "../controllers/inventory.controller";
import { validate } from "../middlewares/validate.middleware";
import * as s from "../validations/admin.schema";
import { z } from "zod"; // Import Zod for local validation

const router = Router();

// Validation Schema for Updating Stock (Partner App)
const updateStockSchema = z.object({
  body: z.object({
    isAvailable: z.boolean().optional(),
    stock: z.number().int().optional(),
    price: z.number().positive().optional(),
  }),
});

// Admin: Assign product to store
router.post(
  "/:storeId/products",
  validate(s.assignProductSchema),
  c.assignToStore
);

// Public: Get Store Menu
router.get("/:storeId/menu", c.getMenu);

// Partner: Update Stock/Availability (TOGGLE SWITCH)
// This was missing!
router.patch(
  "/:storeId/products/:productId",
  validate(updateStockSchema),
  c.updateStock
);

export default router;
