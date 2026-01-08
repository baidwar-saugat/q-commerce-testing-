import prisma from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { OrderStatus } from "@prisma/client";

interface OrderItemInput {
  productId: string;
  quantity: number;
}

export const createOrder = async (
  userId: string,
  storeId: string,
  items: OrderItemInput[]
) => {
  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData = [];

    // 1. Loop through items to calculate price and check stock
    for (const item of items) {
      // Fetch the store-specific product details (Price & Stock)
      const storeProduct = await tx.storeProduct.findUnique({
        where: {
          storeId_productId: {
            storeId,
            productId: item.productId,
          },
        },
        include: { product: true },
      });

      if (!storeProduct) {
        throw new AppError(
          `Product ${item.productId} not found in this store`,
          404
        );
      }

      if (!storeProduct.isAvailable || storeProduct.stock < item.quantity) {
        throw new AppError(
          `Product ${storeProduct.product.name} is out of stock`,
          400
        );
      }

      // Use the Store-Specific price if set, otherwise Base Price
      const finalPrice = storeProduct.price || storeProduct.product.basePrice;

      totalAmount += finalPrice * item.quantity;

      // Prepare data for OrderItem table
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: finalPrice,
      });

      // 2. DECREMENT STOCK
      await tx.storeProduct.update({
        where: { storeId_productId: { storeId, productId: item.productId } },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // 3. Create the Order
    const order = await tx.order.create({
      data: {
        userId,
        storeId,
        total: totalAmount,
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return order;
  });
};

export const getOrderById = async (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      store: true,
      user: true,
    },
  });
};

// 1. Get Orders with Filters (Pagination + Status)
export const getOrdersByStore = async (
  storeId: string,
  status?: OrderStatus,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  // Build the filter object
  const whereCondition: any = { storeId };
  if (status) {
    whereCondition.status = status;
  }

  const orders = await prisma.order.findMany({
    where: whereCondition,
    include: {
      user: { select: { name: true, email: true } }, // Show User Info
      items: {
        include: { product: true }, // Show Product details
      },
    },
    orderBy: { createdAt: "desc" }, // Newest first
    skip,
    take: Number(limit),
  });

  const total = await prisma.order.count({ where: whereCondition });

  return { orders, total, page, totalPages: Math.ceil(total / limit) };
};

// 2. Get Stats (For Dashboard Badges)
// Returns: [ { status: 'PENDING', _count: 5 }, { status: 'COMPLETED', _count: 20 } ]
export const getOrderStats = async (storeId: string) => {
  const stats = await prisma.order.groupBy({
    by: ["status"],
    where: { storeId },
    _count: {
      id: true,
    },
  });
  return stats;
};

// 3. Update Status (Kitchen moves order forward)
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};
