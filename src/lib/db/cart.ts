import { prisma } from "../prisma";

export async function getCartByUserId(userId: string) {
  const cart = await prisma.cart.findFirst({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return cart || { items: [] };
}

export async function addItemToCart(
  userId: string,
  productId: string,
  quantity: number
) {
  let cart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
}

export async function removeItemFromCart(
  userId: string,
  productId: string
) {
  const cart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });

  if (!cart) return null;

  return prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      productId,
    },
  });
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });

  if (!cart) return null;

  return prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });
}

export async function clearCartByUserId(userId: string) {
  return clearCart(userId);
}