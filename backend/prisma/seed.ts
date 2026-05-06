// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================================
  // 1. Seed skills (المهارات)
  // ============================================================
  const skills = [
    { nom: "JavaScript", categorie: "Frontend" },
    { nom: "TypeScript", categorie: "Frontend" },
    { nom: "React", categorie: "Frontend" },
    { nom: "Node.js", categorie: "Backend" },
    { nom: "Express.js", categorie: "Backend" },
    { nom: "Prisma", categorie: "Backend" },
    { nom: "MongoDB", categorie: "Database" },
    { nom: "PostgreSQL", categorie: "Database" },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { nom: skill.nom },
      create: skill,
      update: {},
    });
  }
  console.log("✅ Skills seeded");

  // ============================================================
  // 2. Seed admin user (مدير النظام الافتراضي)
  // ============================================================
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "ADMIN",
      status: "active",
      admin: {
        create: {
          nom: "System",
          prenom: "Admin",
        },
      },
    },
  });
  console.log(`✅ Admin user ready: ${admin.email}`);

  // ============================================================
  // 3. Seed test student (طالب تجريبي)
  // ============================================================
  const studentPassword = await bcrypt.hash("student123", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@gmail.com" },
    update: {},
    create: {
      name: "Student Test",
      email: "student@gmail.com",
      password: studentPassword,
      role: "STUDENT",
      status: "active",
      student: {
        create: {
          nom: "Test",
          prenom: "Student",
          bio: "Étudiant en informatique",
          filiere: "Génie Logiciel",
        },
      },
    },
  });
  console.log(`✅ Student user ready: ${student.email}`);

  // ============================================================
  // 4. Seed test professor (أستاذ تجريبي)
  // ============================================================
  const profPassword = await bcrypt.hash("prof123456", 12);
  const prof = await prisma.user.upsert({
    where: { email: "prof@gmail.com" },
    update: {},
    create: {
      name: "Prof Test",
      email: "prof@gmail.com",
      password: profPassword,
      role: "PROF",
      status: "active",
      prof: {
        create: {
          nom: "Test",
          prenom: "Professor",
          departement: "Informatique",
          specialite: "Génie Logiciel",
        },
      },
    },
  });
  console.log(`✅ Professor user ready: ${prof.email}`);

  // ============================================================
  // 5. Seed test professional/company (شركة تجريبية)
  // ============================================================
  const proPassword = await bcrypt.hash("pro123456", 12);
  const pro = await prisma.user.upsert({
    where: { email: "pro@gmail.com" },
    update: {},
    create: {
      name: "Pro Test",
      email: "pro@gmail.com",
      password: proPassword,
      role: "PRO",
      status: "active",
      professionnel: {
        create: {
          nom: "TechCorp",
          prenom: "Contact",
          entreprise: "TechCorp SARL",
          poste: "Recruteur",
        },
      },
    },
  });
  console.log(`✅ Professional user ready: ${pro.email}`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("📋 Test accounts:");
  console.log("   Admin:    admin@gmail.com    / admin123456");
  console.log("   Student:  student@gmail.com  / student123");
  console.log("   Prof:     prof@gmail.com     / prof123456");
  console.log("   Pro:      pro@gmail.com      / pro123456");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });