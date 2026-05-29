/// <reference types="node" />

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const skills = [
  { nom: "JavaScript" },
  { nom: "TypeScript" },
  // ...
];

export async function seedSkills() {
  await Promise.all(
    skills.map((skill) =>
      prisma.skill.upsert({
        where: { nom: skill.nom },
        update: {},
        create: skill,
      })
    )
  );

  console.log(`✅ ${skills.length} skills seeded`);
}