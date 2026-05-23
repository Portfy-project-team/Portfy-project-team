import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("PUT /api/user/me/profile", () => {

  let studentCookies: string[] = [];
  let secondStudentCookies: string[] = [];

  beforeAll(async () => {

    // STUDENT 1
    const studentEmail = `student${Date.now()}@test.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        email: studentEmail,
        password: "Secure123!!!",
        role: "STUDENT",
      });

    await prisma.user.update({
      where: { email: studentEmail },
      data: { isEmailVerified: true },
    });

    const studentLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: studentEmail,
        password: "Secure123!!!",
      });

    studentCookies = Array.isArray(studentLogin.headers["set-cookie"])
      ? studentLogin.headers["set-cookie"]
      : [];

    // STUDENT 2
    const secondEmail = `second${Date.now()}@test.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        email: secondEmail,
        password: "Secure123!!!",
        role: "STUDENT",
      });

    await prisma.user.update({
      where: { email: secondEmail },
      data: { isEmailVerified: true },
    });

    const secondLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: secondEmail,
        password: "Secure123!!!",
      });

    secondStudentCookies = Array.isArray(secondLogin.headers["set-cookie"])
      ? secondLogin.headers["set-cookie"]
      : [];
  });

  afterAll(async () => {
    const testUsers = await prisma.user.findMany({
      where: { email: { contains: "@test.com" } },
      select: { id: true },
    });
    const userIds = testUsers.map((u) => u.id);

    await prisma.studentSkill.deleteMany({
      where: { student: { userId: { in: userIds } } },
    });
    await prisma.loginLog.deleteMany({
      where: { userId: { in: userIds } },
    });
    await prisma.passwordResetToken.deleteMany({
      where: { userId: { in: userIds } },
    });
    await prisma.refreshToken.deleteMany({
      where: { userId: { in: userIds } },
    });
    await prisma.student.deleteMany({
      where: { userId: { in: userIds } },
    });
    await prisma.skill.deleteMany({
      where: { nom: { contains: "React-" } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });

    await prisma.$disconnect();
  });

  it("UP-01 : update student profile", async () => {

    const skill = await prisma.skill.create({
      data: { nom: `React-${Date.now()}` },
    });

    const res = await request(app)
      .put("/api/user/me/profile")
      .set("Cookie", studentCookies)
      .send({
        nom: "Wissal",
        prenom: "Test",
        filiere: "GI",
        skills: [{ skillId: skill.id, niveau: "AVANCE" }],
      });

    expect(res.status).toBe(200);
    expect(res.body.user.student.nom).toBe("Wissal");
    expect(res.body.user.student.skills.length).toBeGreaterThan(0);
  });

  it("UP-02 : update another student profile", async () => {

    const res = await request(app)
      .put("/api/user/me/profile")
      .set("Cookie", secondStudentCookies)
      .send({
        nom: "Second",
        prenom: "User",
        filiere: "DEV",
      });

    expect(res.status).toBe(200);
    expect(res.body.user.student.nom).toBe("Second");
  });

  it("UP-03 : unauthorized", async () => {

    const res = await request(app)
      .put("/api/user/me/profile")
      .send({ nom: "Test" });

    expect(res.status).toBe(401);
  });

  it("UP-04 : invalid bio", async () => {

    const res = await request(app)
      .put("/api/user/me/profile")
      .set("Cookie", studentCookies)
      .send({ bio: "a".repeat(600) });

    expect([400, 500]).toContain(res.status);
  });

});
// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// describe("PUT /api/user/me/profile", () => {

//   let studentCookies: string[] = [];
//   let secondStudentCookies: string[] = [];

//   beforeAll(async () => {

//     // STUDENT 1
//     const studentEmail = `student${Date.now()}@test.com`;

//     await request(app)
//       .post("/api/auth/register")
//       .send({
//         email: studentEmail,
//         password: "Secure123!!!",
//         role: "STUDENT",
//       });

//     await prisma.user.update({
//       where: { email: studentEmail },
//       data: { isEmailVerified: true },
//     });

//     const studentLogin = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email: studentEmail,
//         password: "Secure123!!!",
//       });

//     studentCookies = Array.isArray(studentLogin.headers["set-cookie"])
//       ? studentLogin.headers["set-cookie"]
//       : [];

//     // STUDENT 2
//     const secondEmail = `second${Date.now()}@test.com`;

//     await request(app)
//       .post("/api/auth/register")
//       .send({
//         email: secondEmail,
//         password: "Secure123!!!",
//         role: "STUDENT",
//       });

//     await prisma.user.update({
//       where: { email: secondEmail },
//       data: { isEmailVerified: true },
//     });

//     const secondLogin = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email: secondEmail,
//         password: "Secure123!!!",
//       });

//     secondStudentCookies = Array.isArray(secondLogin.headers["set-cookie"])
//       ? secondLogin.headers["set-cookie"]
//       : [];
//   });

//   // afterAll(async () => {
//   //   // Ordre FK correct : enfants avant parents
//   //   await prisma.studentSkill.deleteMany();
//   //   await prisma.loginLog.deleteMany();
//   //   await prisma.passwordResetToken.deleteMany();
//   //   await prisma.refreshToken.deleteMany();
//   //   await prisma.student.deleteMany();
//   //   await prisma.skill.deleteMany();
//   //   await prisma.user.deleteMany({
//   //     where: {
//   //       email: { contains: "@test.com" },
//   //     },
//   //   });
//   //   await prisma.$disconnect();
//   // });
//   afterAll(async () => {
//   // Récupérer les IDs des users de test uniquement
//   const testUsers = await prisma.user.findMany({
//     where: { email: { contains: "@test.com" } },
//     select: { id: true },
//   });
//   const userIds = testUsers.map((u) => u.id);

//   // Supprimer uniquement les données liées à CES users
//   await prisma.studentSkill.deleteMany({
//     where: { student: { userId: { in: userIds } } },
//   });
//   await prisma.loginLog.deleteMany({
//     where: { userId: { in: userIds } },
//   });
//   await prisma.passwordResetToken.deleteMany({
//     where: { userId: { in: userIds } },
//   });
//   await prisma.refreshToken.deleteMany({
//     where: { userId: { in: userIds } },
//   });
//   await prisma.student.deleteMany({
//     where: { userId: { in: userIds } },
//   });
//   await prisma.skill.deleteMany({
//     where: { nom: { contains: "React-" } },
//   });
//   await prisma.user.deleteMany({
//     where: { id: { in: userIds } },
//   });

//   await prisma.$disconnect();
// });

//   it("UP-01 : update student profile", async () => {

//     const skill = await prisma.skill.create({
//       data: { nom: `React-${Date.now()}` },
//     });

//     const res = await request(app)
//       .put("/api/user/me/profile")
//       .set("Cookie", studentCookies)
//       .send({
//         nom: "Wissal",
//         prenom: "Test",
//         filiere: "GI",
//         skills: [{ skillId: skill.id, niveau: "AVANCE" }],
//       });

//     expect(res.status).toBe(200);
//     expect(res.body.user.student.nom).toBe("Wissal");
//     expect(res.body.user.student.skills.length).toBeGreaterThan(0);
//   });

//   it("UP-02 : update another student profile", async () => {

//     const res = await request(app)
//       .put("/api/user/me/profile")
//       .set("Cookie", secondStudentCookies)
//       .send({
//         nom: "Second",
//         prenom: "User",
//         filiere: "DEV",
//       });

//     expect(res.status).toBe(200);
//     expect(res.body.user.student.nom).toBe("Second");
//   });

//   it("UP-03 : unauthorized", async () => {

//     const res = await request(app)
//       .put("/api/user/me/profile")
//       .send({ nom: "Test" });

//     expect(res.status).toBe(401);
//   });

//   it("UP-04 : invalid bio", async () => {

//     const res = await request(app)
//       .put("/api/user/me/profile")
//       .set("Cookie", studentCookies)
//       .send({ bio: "a".repeat(600) });

//     expect([400, 500]).toContain(res.status);
//   });

// });
// afterAll(async () => {
//   // Supprimer dans l'ordre FK : enfants avant parents
//   await prisma.studentSkill.deleteMany();
//   await prisma.loginLog.deleteMany();
//   await prisma.passwordResetToken.deleteMany();
//   await prisma.refreshToken.deleteMany();   // ← doit être avant user
//   await prisma.student.deleteMany();
//   await prisma.skill.deleteMany();
//   await prisma.user.deleteMany({
//     where: {
//       email: {
//         contains: "@test.com",
//       },
//     },
//   });

//   await prisma.$disconnect();
// });
// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// describe("PUT /api/user/me/profile", () => {

//   let studentCookies: string[] = [];
//   let secondStudentCookies: string[] = [];

//   beforeAll(async () => {

//     // STUDENT 1
//     const studentEmail = `student${Date.now()}@test.com`;

//     await request(app)
//       .post("/api/auth/register")
//       .send({
//         email: studentEmail,
//         password: "Secure123!!!",
//         role: "STUDENT",
//       });

//     await prisma.user.update({
//       where: { email: studentEmail },
//       data: {
//         isEmailVerified: true,
//       },
//     });

//     const studentLogin = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email: studentEmail,
//         password: "Secure123!!!",
//       });

//     studentCookies = Array.isArray(studentLogin.headers["set-cookie"])
//       ? studentLogin.headers["set-cookie"]
//       : [];



//     // STUDENT 2
//     const secondEmail = `second${Date.now()}@test.com`;

//     await request(app)
//       .post("/api/auth/register")
//       .send({
//         email: secondEmail,
//         password: "Secure123!!!",
//         role: "STUDENT",
//       });

//     await prisma.user.update({
//       where: { email: secondEmail },
//       data: {
//         isEmailVerified: true,
//       },
//     });

//     const secondLogin = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email: secondEmail,
//         password: "Secure123!!!",
//       });

//     secondStudentCookies = Array.isArray(secondLogin.headers["set-cookie"])
//       ? secondLogin.headers["set-cookie"]
//       : [];
//   });



//   afterAll(async () => {

//     await prisma.studentSkill.deleteMany();

//     await prisma.refreshToken.deleteMany();

//     await prisma.loginLog.deleteMany();

//     await prisma.passwordResetToken.deleteMany();

//     await prisma.student.deleteMany();

//     await prisma.skill.deleteMany();

//     await prisma.user.deleteMany({
//       where: {
//         email: {
//           contains: "@test.com",
//         },
//       },
//     });

//     await prisma.$disconnect();
//   });



//   it("UP-01 : update student profile", async () => {

//     const skill = await prisma.skill.create({
//       data: {
//         nom: `React-${Date.now()}`,
//       },
//     });

//     const res = await request(app)
//       .put("/api/user/me/profile")
//       .set("Cookie", studentCookies)
//       .send({
//         nom: "Wissal",
//         prenom: "Test",
//         filiere: "GI",
//         skills: [
//           {
//             skillId: skill.id,
//             niveau: "AVANCE",
//           },
//         ],
//       });

//     expect(res.status).toBe(200);
//     expect(res.body.user.student.nom).toBe("Wissal");
//     expect(res.body.user.student.skills.length).toBeGreaterThan(0);
//   });



//   it("UP-02 : update another student profile", async () => {

//     const res = await request(app)
//       .put("/api/user/me/profile")
//       .set("Cookie", secondStudentCookies)
//       .send({
//         nom: "Second",
//         prenom: "User",
//         filiere: "DEV",
//       });

//     expect(res.status).toBe(200);
//     expect(res.body.user.student.nom).toBe("Second");
//   });



//   it("UP-03 : unauthorized", async () => {

//     const res = await request(app)
//       .put("/api/user/me/profile")
//       .send({
//         nom: "Test",
//       });

//     expect(res.status).toBe(401);
//   });



//   it("UP-04 : invalid bio", async () => {

//     const res = await request(app)
//       .put("/api/user/me/profile")
//       .set("Cookie", studentCookies)
//       .send({
//         bio: "a".repeat(600),
//       });

  
//     expect([400, 500]).toContain(res.status);
//   });

// });
// import request from "supertest";
// import bcrypt from "bcryptjs";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// describe("PUT /api/user/me/profile", () => {

//   let studentCookies: string[] = [];
//   let profCookies: string[] = [];
//   let proCookies: string[] = [];

//   beforeAll(async () => {

//     // =========================
//     // STUDENT
//     // =========================

//     const studentEmail = `student${Date.now()}@test.com`;

//     await request(app)
//       .post("/api/auth/register")
//       .send({
//         email: studentEmail,
//         password: "Secure123!!!",
//         role: "STUDENT",
//       });

//     await prisma.user.update({
//       where: { email: studentEmail },
//       data: {
//         isEmailVerified: true,
//         status: "ACTIVE",
//       },
//     });

//     const studentLogin = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email: studentEmail,
//         password: "Secure123!!!",
//       });

//     studentCookies = Array.isArray(studentLogin.headers["set-cookie"])
//       ? studentLogin.headers["set-cookie"]
//       : [];



//     // =========================
//     // PROF
//     // =========================

//     const profEmail = `prof${Date.now()}@test.com`;

//     const hashedProfPassword = await bcrypt.hash("Secure123!!!", 12);

//     await prisma.user.create({
//       data: {
//         email: profEmail,
//         password: hashedProfPassword,
//         role: "PROF",
//         status: "ACTIVE",
//         isEmailVerified: true,
//       },
//     });

//     const profLogin = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email: profEmail,
//         password: "Secure123!!!",
//       });

//     profCookies = Array.isArray(profLogin.headers["set-cookie"])
//       ? profLogin.headers["set-cookie"]
//       : [];



//     // =========================
//     // PRO
//     // =========================

//     const proEmail = `pro${Date.now()}@test.com`;

//     const hashedProPassword = await bcrypt.hash("Secure123!!!", 12);

//     await prisma.user.create({
//       data: {
//         email: proEmail,
//         password: hashedProPassword,
//         role: "PRO",
//         status: "ACTIVE",
//         isEmailVerified: true,
//       },
//     });

//     const proLogin = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email: proEmail,
//         password: "Secure123!!!",
//       });

//     proCookies = Array.isArray(proLogin.headers["set-cookie"])
//       ? proLogin.headers["set-cookie"]
//       : [];
//   });



//   afterAll(async () => {
//     await prisma.studentSkill.deleteMany();
//     await prisma.student.deleteMany();
//     await prisma.prof.deleteMany();
//     await prisma.professionnel.deleteMany();
//     await prisma.skill.deleteMany();

//     await prisma.user.deleteMany({
//       where: {
//         email: {
//           contains: "@test.com",
//         },
//       },
//     });
//   });



