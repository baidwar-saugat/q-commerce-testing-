// create-rider.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const rider = await prisma.user.create({
    data: {
      name: "Rider Tom",
      email: "rider@qcommerce.com",
      password: "password123",
      //   role: "RIDER" // If you have roles enum, otherwise just default
    },
  });

  console.log("\n✅ RIDER CREATED!");
  console.log("-----------------------------------------");
  console.log("Rider ID:", rider.id); // <--- COPY THIS
  console.log("-----------------------------------------\n");
}

main();
