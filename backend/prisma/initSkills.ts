
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.skill.count();
  if (count > 0) return;

  await prisma.skill.createMany({
    data: [
      { nom: "JavaScript" },
      { nom: "TypeScript" },
      { nom: "React" },
      { nom: "Node.js" },
      { nom: "Docker" },
      { nom: "PostgreSQL" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Skills seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());