import prisma from "../utils/prisma";

// 1. Assign Master Product to Store (Create/Update)
export const addProductToStore = async (storeId: string, data: any) => {
  return prisma.storeProduct.upsert({
    where: {
      storeId_productId: {
        storeId,
        productId: data.productId,
      },
    },
    update: { ...data },
    create: {
      storeId,
      ...data,
    },
  });
};

// 2. Get Menu for User App
export const getStoreMenu = async (storeId: string) => {
  return prisma.storeProduct.findMany({
    where: { storeId },
    include: {
      product: {
        include: { category: true },
      },
    },
  });
};

// 3. Update Stock (The Missing Function)
export const updateStoreStock = async (
  storeId: string,
  productId: string,
  data: any
) => {
  return prisma.storeProduct.update({
    where: {
      storeId_productId: {
        storeId,
        productId,
      },
    },
    data,
  });
};
