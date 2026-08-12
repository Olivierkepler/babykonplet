import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Wireless Headphones",
        slug: "wireless-headphones",
        description: "Premium wireless headphones with noise cancellation.",
        price: 12999,
        imageUrl: "/images/headphones.jpg",
        stock: 20,
        isActive: true,
      },
      {
        name: "Smart Watch",
        slug: "smart-watch",
        description: "Track fitness, calls, and notifications.",
        price: 8999,
        imageUrl: "/images/watch.jpg",
        stock: 15,
        isActive: true,
      },
      {
        name: "Gaming Mouse",
        slug: "gaming-mouse",
        description: "High precision gaming mouse with RGB lighting.",
        price: 4599,
        imageUrl: "/images/mouse.jpg",
        stock: 25,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed error:", error);
    await prisma.$disconnect();
    process.exit(1);
  });