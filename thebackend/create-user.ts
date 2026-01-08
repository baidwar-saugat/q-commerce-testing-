// create-user.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Saugat Customer",
      email: "customer@example.com",
    },
  });
  console.log("Created User with ID:", user.id);
}

main();
