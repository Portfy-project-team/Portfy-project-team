// prisma/seed/index.ts
import { PrismaClient } from "@prisma/client";
import { seedSkills } from "./initSkills.js";
import { seedUsers } from "./users.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...\n");
  await seedSkills();
  await seedUsers();
  console.log("\n🎉 Done!");
}

main()
  .catch((e) => { console.error("❌", e); process.exit(1); })
  .finally(() => prisma.$disconnect());