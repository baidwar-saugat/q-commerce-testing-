import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import * as inventoryService from "../services/inventory.service";

export const assignToStore = catchAsync(async (req: Request, res: Response) => {
  const data = await inventoryService.addProductToStore(
    req.params.storeId,
    req.body
  );
  res.status(200).json({ status: "success", data });
});

export const getMenu = catchAsync(async (req: Request, res: Response) => {
  const data = await inventoryService.getStoreMenu(req.params.storeId);
  res.status(200).json({ status: "success", data });
});

// This was missing!
export const updateStock = catchAsync(async (req: Request, res: Response) => {
  const { storeId, productId } = req.params;
  const data = await inventoryService.updateStoreStock(
    storeId,
    productId,
    req.body
  );
  res.status(200).json({ status: "success", data });
});
