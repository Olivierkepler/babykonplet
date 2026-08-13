import { prisma } from "./prisma";

export async function getActivePromoBanners() {
  return prisma.promoBanner.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getActiveAdSlots() {
  return prisma.adSlot.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}