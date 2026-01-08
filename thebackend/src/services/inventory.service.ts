import prisma from "../utils/prisma";

// Admin assigns item to store
export const addProductToStore = async (storeId: string, data: any) => {
  return prisma.storeProduct.upsert({
    where: { storeId_productId: { storeId, productId: data.productId } },
    update: { ...data },
    create: { storeId, ...data },
  });
};

// Get Store Menu (User Facing)
export const getStoreMenu = async (storeId: string) => {
  return prisma.storeProduct.findMany({
    where: { storeId, isAvailable: true },
    include: { product: { include: { category: true } } },
  });
};

// Partner Toggle (On/Off)
export const updateStock = async (
  storeId: string,
  productId: string,
  data: any
) => {
  return prisma.storeProduct.update({
    where: { storeId_productId: { storeId, productId } },
    data,
  });
};
