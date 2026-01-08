// import { Request, Response } from "express";
// import { catchAsync } from "../utils/catchAsync";
// import * as adminService from "../services/admin.service";

// export const createCategory = catchAsync(
//   async (req: Request, res: Response) => {
//     const data = await adminService.createCategory(req.body);
//     res.status(201).json({ status: "success", data });
//   }
// );

// export const createProduct = catchAsync(async (req: Request, res: Response) => {
//   const data = await adminService.createProduct(req.body);
//   res.status(201).json({ status: "success", data });
// });

// export const createStore = catchAsync(async (req: Request, res: Response) => {
//   const data = await adminService.createStore(req.body);
//   res.status(201).json({ status: "success", data });
// });
import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import * as adminService from "../services/admin.service";

// --- Categories ---
export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const data = await adminService.createCategory(req.body);
    res.status(201).json({ status: "success", data });
  }
);

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const data = await adminService.getCategories();
  res.status(200).json({ status: "success", data });
});

// --- Products ---
export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const data = await adminService.createProduct(req.body);
  res.status(201).json({ status: "success", data });
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const data = await adminService.getProducts();
  res.status(200).json({ status: "success", data });
});

// --- Stores ---
export const createStore = catchAsync(async (req: Request, res: Response) => {
  const data = await adminService.createStore(req.body);
  res.status(201).json({ status: "success", data });
});

export const getStores = catchAsync(async (req: Request, res: Response) => {
  const data = await adminService.getStores();
  res.status(200).json({ status: "success", data });
});
export const getStoreDetails = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const store = await adminService.getStoreById(id);

    if (!store) {
      return res
        .status(404)
        .json({ status: "fail", message: "Store not found" });
    }

    res.status(200).json({ status: "success", data: store });
  }
);
