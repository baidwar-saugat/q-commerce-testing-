import { Router } from "express";
import * as c from "../controllers/rider.controller";

const router = Router();

router.get("/available", c.getAvailable);
router.get("/:riderId/active", c.getMyOrders);
router.patch("/:orderId/accept", c.accept);
router.patch("/:orderId/complete", c.complete);

export default router;
