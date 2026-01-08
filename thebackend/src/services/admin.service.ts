import prisma from "../utils/prisma";

export const createCategory = async (data: any) =>
  prisma.category.create({ data });
export const getCategories = async () => prisma.category.findMany();

export const createProduct = async (data: any) =>
  prisma.product.create({ data });
export const getProducts = async () =>
  prisma.product.findMany({ include: { category: true } });

export const createStore = async (data: any) => prisma.store.create({ data });
export const getStores = async () => prisma.store.findMany();
export const getStoreById = async (id: string) => {
  return prisma.store.findUnique({
    where: { id },
    include: {
      inventory: {
        include: {
          product: {
            include: { category: true }, // Include Category details too
          },
        },
      },
    },
  });
};
