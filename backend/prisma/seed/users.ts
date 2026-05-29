import { PrismaClient, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedUsers() {
  const hashedPassword = await bcrypt.hash("Admin@1234", 10);

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
      nom: "Admin",
      prenom: "manager",
    },
  });

  console.log("✅ Admin user seeded");
}