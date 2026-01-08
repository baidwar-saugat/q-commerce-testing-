import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import * as orderService from "../services/order.service";
import { OrderStatus } from "@prisma/client";

export const placeOrder = catchAsync(async (req: Request, res: Response) => {
  const { userId, storeId, items } = req.body;

  // In a real app with Auth, userId would come from req.user.id
  const order = await orderService.createOrder(userId, storeId, items);

  res.status(201).json({
    status: "success",
    data: order,
  });
});

export const getOrderDetails = catchAsync(
  async (req: Request, res: Response) => {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json({ status: "success", data: order });
  }
);

// Get List of Orders
export const getStoreOrders = catchAsync(
  async (req: Request, res: Response) => {
    const { storeId } = req.params;
    const { status, page, limit } = req.query;

    // Convert query string to correct types
    const pageNum = page ? parseInt(page as string) : 1;
    const limitNum = limit ? parseInt(limit as string) : 10;
    const statusEnum = status ? (status as OrderStatus) : undefined;

    const result = await orderService.getOrdersByStore(
      storeId,
      statusEnum,
      pageNum,
      limitNum
    );

    res.status(200).json({ status: "success", data: result });
  }
);

// Get Counts (e.g., Pending: 5)
export const getStoreStats = catchAsync(async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const stats = await orderService.getOrderStats(storeId);
  res.status(200).json({ status: "success", data: stats });
});

// Update Status
export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // Expecting { "status": "PREPARING" }

  const order = await orderService.updateOrderStatus(id, status);
  res.status(200).json({ status: "success", data: order });
});
