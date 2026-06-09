import { PrismaClient, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedUsers() {
  const hashedPassword = await bcrypt.hash("Admin@1234", 10);

  // ─── ADMIN ───
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@dev.local" },
    update: {},
    create: {
      email: "admin@dev.local",
      password: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
    },
  });

  await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      nom: "El Amrani",
      prenom: "Karim",
    },
  });

  console.log("✅ Admin user seeded");

  // ─── PROF ───
  const profUser = await prisma.user.upsert({
    where: { email: "prof@dev.local" },
    update: {},
    create: {
      email: "prof@dev.local",
      password: hashedPassword,
      role: Role.PROF,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
    },
  });

  await prisma.prof.upsert({
    where: { userId: profUser.id },
    update: {},
    create: {
      userId: profUser.id,
      nom: "Bensouda",
      prenom: "Youssef",
      departement: "Informatique",
      specialite: "Génie Logiciel",
    },
  });

  console.log("✅ Prof user seeded");

  // ─── STUDENT ───
  const studentUser = await prisma.user.upsert({
    where: { email: "student@dev.local" },
    update: {},
    create: {
      email: "student@dev.local",
      password: hashedPassword,
      role: Role.STUDENT,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
    },
  });

  await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      nom: "Agzennai",
      prenom: "Mouad",
      filiere: "Informatique",
    },
  });

  console.log("✅ Student user seeded");

  // ─── PRO ───
  const proUser = await prisma.user.upsert({
    where: { email: "pro@dev.local" },
    update: {},
    create: {
      email: "pro@dev.local",
      password: hashedPassword,
      role: Role.PRO,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
    },
  });

  await prisma.professionnel.upsert({
    where: { userId: proUser.id },
    update: {},
    create: {
      userId: proUser.id,
      nom: "Tazi",
      prenom: "Mehdi",
      entreprise: "Maroc Telecom",
      poste: "Directeur Technique",
    },
  });

  console.log("✅ Pro user seeded");
}