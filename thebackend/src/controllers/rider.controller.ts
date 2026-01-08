import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import * as riderService from "../services/rider.service";

// export const getAvailable = catchAsync(async (req: Request, res: Response) => {
//   const data = await riderService.getAvailableOrders();
//   res.status(200).json({ status: "success", data });
// });

export const getAvailable = catchAsync(async (req: Request, res: Response) => {
  // Get storeId from query string (http://.../available?storeId=xyz)
  const { storeId } = req.query;

  const data = await riderService.getAvailableOrders(storeId as string);
  res.status(200).json({ status: "success", data });
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const { riderId } = req.params;
  const data = await riderService.getMyActiveOrders(riderId);
  res.status(200).json({ status: "success", data });
});

export const accept = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { riderId } = req.body;
  const data = await riderService.acceptOrder(orderId, riderId);
  res.status(200).json({ status: "success", data });
});

export const complete = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const data = await riderService.completeOrder(orderId);
  res.status(200).json({ status: "success", data });
});
