import dotenv from "dotenv";
dotenv.config(); // Load .env
import app from "./app";
import prisma from "./utils/prisma";

const PORT = process.env.PORT || 4000;

async function main() {
  await prisma.$connect();
  console.log("✅ Database connected");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

main();
