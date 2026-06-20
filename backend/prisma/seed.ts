import { PrismaClient, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seeding...");

  // 1. Seeding des Skills (Compétences)
  const skills = [
    { nom: "JavaScript" },
    { nom: "TypeScript" },
    { nom: "React" },
    { nom: "Node.js" },
    { nom: "Docker" },
    { nom: "PostgreSQL" },
    { nom: "Python" },
    { nom: "Java" },
    { nom: "C++" },
    { nom: "PHP" },
    { nom: "Swift" },
    { nom: "Kotlin" },
    { nom: "Go" },
    { nom: "Rust" },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { nom: skill.nom },
      update: {},
      create: skill,
    });
  }
  console.log("✅ Compétences initialisées");

  // 2. Seeding de l'utilisateur Admin
  const adminEmail = "elghazranijihane@gmail.com";
  const adminPassword = "Admin123@";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      isEmailVerified: true,
      status: UserStatus.ACTIVE,
      admin: {
        create: {
          nom: "El Ghazrani",
          prenom: "Jihane",
        },
      },
    },
  });

  console.log(`✅ Administrateur créé/mis à jour : ${adminEmail}`);
  console.log(`🔑 Mot de passe configuré : ${adminPassword}`);
  console.log("🌱 Seeding terminé avec succès.");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
