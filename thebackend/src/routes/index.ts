import { Router } from "express";
import adminRoutes from "./admin.routes";
import inventoryRoutes from "./inventory.routes";
import storeRoutes from "./store.routes";
import orderRoutes from "./order.routes";
import riderRoutes from "./rider.routes";

const router = Router();
router.use("/admin", adminRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/location", storeRoutes);
router.use("/orders", orderRoutes);
router.use("/rider", riderRoutes); // Add this line

export default router;
