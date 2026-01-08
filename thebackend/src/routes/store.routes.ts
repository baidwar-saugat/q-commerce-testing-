import { Router } from "express";
import * as c from "../controllers/store.controller";
import { validate } from "../middlewares/validate.middleware";
import { coordsSchema } from "../validations/common.schema";

const router = Router();
router.post(
  "/check-availability",
  validate(coordsSchema),
  c.checkServiceability
);
export default router;
