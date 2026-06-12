import { PrismaClient, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import process from "node:process";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@portfy.com";

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
    },
  });

  await prisma.admin.create({
    data: {
      nom: "Super",
      prenom: "Admin",
      userId: user.id,
    },
  });

  console.log("Admin created successfully");
  console.log("Email:", email);
  console.log("Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });