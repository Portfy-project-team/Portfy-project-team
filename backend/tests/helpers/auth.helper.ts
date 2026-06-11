// // tests/helpers/auth.helper.ts
// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// /**
//  * Crée un utilisateur STUDENT via l'API register,
//  * vérifie son email directement en DB, et retourne son email.
//  */
// export async function createVerifiedStudent(suffix?: string): Promise<string> {
//   const email = `student${suffix ?? Date.now()}@test.com`;

//   const res = await request(app).post("/api/auth/register").send({
//     name:     "Test",
//     prenom:   "User",
//     email,
//     password: "SecurePassword123!!!",
//     role:     "STUDENT",
//   });

//   if (res.status !== 201) {
//     throw new Error(
//       `Register failed (${res.status}): ${JSON.stringify(res.body)}`
//     );
//   }

//   await prisma.user.update({
//     where: { email },
//     data:  { isEmailVerified: true },
//   });

//   return email;
// }

// /**
//  * Crée un admin : register en STUDENT, puis upgrade en DB.
//  */
// export async function createVerifiedAdmin(suffix?: string): Promise<string> {
//   const email = `admin${suffix ?? Date.now()}@test.com`;

//   const res = await request(app).post("/api/auth/register").send({
//     name:     "Admin",
//     prenom:   "Test",
//     email,
//     password: "SecurePassword123!!!",
//     role:     "STUDENT",
//   });

//   if (res.status !== 201) {
//     throw new Error(
//       `Register failed (${res.status}): ${JSON.stringify(res.body)}`
//     );
//   }

//   await prisma.user.update({
//     where: { email },
//     data:  { role: "ADMIN", isEmailVerified: true },
//   });

//   return email;
// }

// /**
//  * Login et retourne les cookies de session.
//  */
// export async function loginAs(email: string): Promise<string[]> {
//   const res = await request(app).post("/api/auth/login").send({
//     email,
//     password: "SecurePassword123!!!",
//   });

//   if (res.status !== 200) {
//     throw new Error(
//       `Login failed (${res.status}): ${JSON.stringify(res.body)}`
//     );
//   }

//   return Array.isArray(res.headers["set-cookie"])
//     ? res.headers["set-cookie"]
//     : [];
// }

// /**
//  * Crée un utilisateur vérifié ET retourne ses cookies de session.
//  */
// export async function createAndLoginStudent(suffix?: string): Promise<{
//   email:   string;
//   cookies: string[];
// }> {
//   const email   = await createVerifiedStudent(suffix);
//   const cookies = await loginAs(email);
//   return { email, cookies };
// }

// export async function createAndLoginAdmin(suffix?: string): Promise<{
//   email:   string;
//   cookies: string[];
// }> {
//   const email   = await createVerifiedAdmin(suffix);
//   const cookies = await loginAs(email);
//   return { email, cookies };
// }

// // // export const fakeToken = () => "fake-token";
// // // tests/helpers/auth.helper.ts
// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // /**
// //  * Crée un utilisateur STUDENT via l'API register,
// //  * vérifie son email directement en DB, et retourne son email.
// //  */
// // export async function createVerifiedStudent(suffix?: string): Promise<string> {
// //   const email = `student${suffix ?? Date.now()}@test.com`;

// //   const res = await request(app).post("/api/auth/register").send({
// //     name:     "Test",
// //     prenom:   "User",
// //     email,
// //     password: "SecurePassword123!!!",
// //     role:     "STUDENT",
// //   });

// //   if (res.status !== 201) {
// //     throw new Error(
// //       `Register failed (${res.status}): ${JSON.stringify(res.body)}`
// //     );
// //   }

// //   await prisma.user.update({
// //     where: { email },
// //     data:  { isEmailVerified: true },
// //   });

// //   return email;
// // }

// // /**
// //  * Crée un admin : register en STUDENT, puis upgrade en DB.
// //  */
// // export async function createVerifiedAdmin(suffix?: string): Promise<string> {
// //   const email = `admin${suffix ?? Date.now()}@test.com`;

// //   const res = await request(app).post("/api/auth/register").send({
// //     name:     "Admin",
// //     prenom:   "Test",
// //     email,
// //     password: "SecurePassword123!!!",
// //     role:     "STUDENT",
// //   });

// //   if (res.status !== 201) {
// //     throw new Error(
// //       `Register failed (${res.status}): ${JSON.stringify(res.body)}`
// //     );
// //   }

// //   await prisma.user.update({
// //     where: { email },
// //     data:  { role: "ADMIN", isEmailVerified: true },
// //   });

// //   return email;
// // }

// // /**
// //  * Login et retourne les cookies de session.
// //  */
// // export async function loginAs(email: string): Promise<string[]> {
// //   const res = await request(app).post("/api/auth/login").send({
// //     email,
// //     password: "SecurePassword123!!!",
// //   });

// //   if (res.status !== 200) {
// //     throw new Error(
// //       `Login failed (${res.status}): ${JSON.stringify(res.body)}`
// //     );
// //   }

// //   return Array.isArray(res.headers["set-cookie"])
// //     ? res.headers["set-cookie"]
// //     : [];
// // }

// // /**
// //  * Crée un utilisateur vérifié ET retourne ses cookies de session.
// //  */
// // export async function createAndLoginStudent(suffix?: string): Promise<{
// //   email:   string;
// //   cookies: string[];
// // }> {
// //   const email   = await createVerifiedStudent(suffix);
// //   const cookies = await loginAs(email);
// //   return { email, cookies };
// // }

// // export async function createAndLoginAdmin(suffix?: string): Promise<{
// //   email:   string;
// //   cookies: string[];
// // }> {
// //   const email   = await createVerifiedAdmin(suffix);
// //   const cookies = await loginAs(email);
// //   return { email, cookies };
// // }
import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

const PASSWORD = "SecurePassword123!!!";

// ── Création d'utilisateurs ────────────────────────────────────────

export async function createVerifiedStudent(suffix?: string): Promise<string> {
  const email = `student${suffix ?? Date.now()}@test.com`;
  const res = await request(app).post("/api/auth/register").send({
    name: "Test", prenom: "User", email, password: PASSWORD, role: "STUDENT",
  });
  if (res.status !== 201) throw new Error(`Register failed (${res.status}): ${JSON.stringify(res.body)}`);
  await prisma.user.update({ where: { email }, data: { isEmailVerified: true } });
  return email;
}

export async function createVerifiedAdmin(suffix?: string): Promise<string> {
  const email = `admin${suffix ?? Date.now()}@test.com`;
  const res = await request(app).post("/api/auth/register").send({
    name: "Admin", prenom: "Test", email, password: PASSWORD, role: "STUDENT",
  });
  if (res.status !== 201) throw new Error(`Register failed (${res.status}): ${JSON.stringify(res.body)}`);
  await prisma.user.update({ where: { email }, data: { role: "ADMIN", isEmailVerified: true } });
  return email;
}

export async function createVerifiedProf(suffix?: string): Promise<string> {
  const email = `prof${suffix ?? Date.now()}@test.com`;
  const res = await request(app).post("/api/auth/register").send({
    name: "Prof", prenom: "Test", email, password: PASSWORD, role: "PROF",
  });
  if (res.status !== 201) throw new Error(`Register failed (${res.status}): ${JSON.stringify(res.body)}`);
  await prisma.user.update({ where: { email }, data: { isEmailVerified: true } });
  return email;
}

export async function createVerifiedPro(suffix?: string): Promise<string> {
  const email = `pro${suffix ?? Date.now()}@test.com`;
  const res = await request(app).post("/api/auth/register").send({
    name: "Pro", prenom: "Test", email, password: PASSWORD, role: "PRO",
  });
  if (res.status !== 201) throw new Error(`Register failed (${res.status}): ${JSON.stringify(res.body)}`);
  await prisma.user.update({ where: { email }, data: { isEmailVerified: true } });
  return email;
}

// ── Login ──────────────────────────────────────────────────────────

export async function loginAs(email: string): Promise<string[]> {
  const res = await request(app).post("/api/auth/login").send({ email, password: PASSWORD });
  if (res.status !== 200) throw new Error(`Login failed (${res.status}): ${JSON.stringify(res.body)}`);
  return Array.isArray(res.headers["set-cookie"]) ? res.headers["set-cookie"] : [];
}

// ── Combinés ───────────────────────────────────────────────────────

export async function createAndLoginStudent(suffix?: string) {
  const email = await createVerifiedStudent(suffix);
  const cookies = await loginAs(email);
  return { email, cookies };
}

export async function createAndLoginAdmin(suffix?: string) {
  const email = await createVerifiedAdmin(suffix);
  const cookies = await loginAs(email);
  return { email, cookies };
}

export async function createAndLoginProf(suffix?: string) {
  const email = await createVerifiedProf(suffix);
  const cookies = await loginAs(email);
  return { email, cookies };
}

export async function createAndLoginPro(suffix?: string) {
  const email = await createVerifiedPro(suffix);
  const cookies = await loginAs(email);
  return { email, cookies };
}

// ── Helpers DB directs ─────────────────────────────────────────────

/** Récupère le studentId depuis l'email */
export async function getStudentId(email: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { email }, include: { student: true },
  });
  if (!user?.student) throw new Error(`Student not found for ${email}`);
  return user.student.id;
}

/** Récupère le profId depuis l'email */
export async function getProfId(email: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { email }, include: { prof: true },
  });
  if (!user?.prof) throw new Error(`Prof not found for ${email}`);
  return user.prof.id;
}

/** Crée un portfolio pour un student (s'il n'existe pas) */
export async function ensurePortfolio(studentId: number) {
  return prisma.portfolio.upsert({
    where:  { studentId },
    create: { studentId },
    update: {},
  });
}