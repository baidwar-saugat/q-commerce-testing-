// import { Router } from "express";
// import * as c from "../controllers/admin.controller";
// import { validate } from "../middlewares/validate.middleware";
// import * as s from "../validations/admin.schema";

// const router = Router();
// router.post("/categories", validate(s.createCategorySchema), c.createCategory);
// router.post("/products", validate(s.createProductSchema), c.createProduct);
// router.post("/stores", validate(s.createStoreSchema), c.createStore);
// export default router;
import { Router } from "express";
import * as c from "../controllers/admin.controller";
import { validate } from "../middlewares/validate.middleware";
import * as s from "../validations/admin.schema";

const router = Router();

// Categories
router.post("/categories", validate(s.createCategorySchema), c.createCategory);
router.get("/categories", c.getCategories); // <--- ADDED THIS

// Products
router.post("/products", validate(s.createProductSchema), c.createProduct);
router.get("/products", c.getProducts); // <--- ADDED THIS

// Stores
router.post("/stores", validate(s.createStoreSchema), c.createStore);
router.get("/stores", c.getStores); // <--- ADDED THIS

router.get("/stores/:id", c.getStoreDetails);

export default router;
