import { Router } from "express";
import * as c from "../controllers/inventory.controller";
import { validate } from "../middlewares/validate.middleware";
import * as s from "../validations/admin.schema";

const router = Router();
// Admin: Assign product to store
router.post(
  "/:storeId/products",
  validate(s.assignProductSchema),
  c.assignToStore
);
// Public: Get Store Menu
router.get("/:storeId/menu", c.getMenu);
export default router;
