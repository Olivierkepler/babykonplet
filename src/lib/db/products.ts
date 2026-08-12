import { prisma } from "../prisma";

export async function getAllProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
  });
}

export async function createProduct(data: {
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock?: number;
  isActive?: boolean;
}) {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      stock: data.stock ?? 0,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    description: string;
    price: number;
    imageUrl?: string;
    stock: number;
    isActive: boolean;
  }>
) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}