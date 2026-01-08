import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import * as storeService from "../services/store.service";
import * as inventoryService from "../services/inventory.service";

export const checkServiceability = catchAsync(
  async (req: Request, res: Response) => {
    const { latitude, longitude } = req.body;
    const store = await storeService.findNearestStore(latitude, longitude);

    if (!store) {
      return res
        .status(200)
        .json({ serviceable: false, message: "Coming soon!" });
    }

    // If store found, fetch ITS menu automatically
    const menu = await inventoryService.getStoreMenu(store.id);

    res.status(200).json({
      serviceable: true,
      store: { id: store.id, name: store.name },
      menu,
    });
  }
);
