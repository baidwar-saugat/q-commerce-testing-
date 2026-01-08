import prisma from "../utils/prisma";
import { AppError } from "../utils/AppError";

// 1. Get Orders ready for delivery (Status = READY, No Rider yet)
// export const getAvailableOrders = async () => {
//   return prisma.order.findMany({
//     where: {
//       status: "READY",
//       riderId: null,
//     },
//     include: {
//       store: { select: { name: true, address: true } },
//       user: { select: { name: true, email: true } }, // Customer details
//       items: true,
//     },
//   });
// };
// Updated to accept optional storeId
export const getAvailableOrders = async (storeId?: string) => {
  const whereCondition: any = {
    status: "READY", // Only orders ready for pickup
    riderId: null, // Only unassigned orders
  };

  // If rider provided a store preference, filter by it
  if (storeId) {
    whereCondition.storeId = storeId;
  }

  return prisma.order.findMany({
    where: whereCondition,
    include: {
      store: { select: { name: true, address: true } },
      user: { select: { name: true, email: true } },
      items: true,
    },
  });
};

// 2. Get Orders currently assigned to this rider
export const getMyActiveOrders = async (riderId: string) => {
  return prisma.order.findMany({
    where: {
      riderId: riderId,
      status: { in: ["PICKED_UP", "READY"] }, // Only show active jobs
    },
    include: {
      store: true,
      user: true,
      items: true,
    },
  });
};

// 3. Accept Order (Assign Rider)
export const acceptOrder = async (orderId: string, riderId: string) => {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      riderId: riderId,
      status: "PICKED_UP", // Auto update status on accept
    },
  });
};

// 4. Complete Delivery
export const completeOrder = async (orderId: string) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: "COMPLETED" },
  });
};
