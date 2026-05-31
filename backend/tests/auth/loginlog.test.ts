import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";
import { createVerifiedStudent } from "../helpers/auth.helper";

describe("Login Logs", () => {

  it("LG-01 : successful login is logged as SUCCESS", async () => {
    const email = await createVerifiedStudent();

    await request(app).post("/api/auth/login").send({
      email,
      password: "SecurePassword123!!!",
    });

    const user = await prisma.user.findUnique({ where: { email } });
    const log  = await prisma.loginLog.findFirst({
      where:   { userId: user!.id, status: "SUCCESS" },
      orderBy: { createdAt: "desc" },
    });

    expect(log).not.toBeNull();
    expect(log!.status).toBe("SUCCESS");
  });

  it("LG-02 : failed login is logged as FAILED", async () => {
    const email = await createVerifiedStudent();

    await request(app).post("/api/auth/login").send({
      email,
      password: "WrongPassword999!!!",
    });

    const user = await prisma.user.findUnique({ where: { email } });
    const log  = await prisma.loginLog.findFirst({
      where:   { userId: user!.id, status: "FAILED" },
      orderBy: { createdAt: "desc" },
    });

    expect(log).not.toBeNull();
  });

  it("LG-03 : unknown email login does not crash", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email:    "doesnotexist@test.com",
      password: "Wrong123!!!",
    });

    expect(res.status).toBe(401);
  });
});
// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// const validStudent = { name: "Jean", prenom: "Dupont", role: "STUDENT" };

// describe("Login Logs", () => {

//   it("LG-01 : successful login should be logged", async () => {
//     const email = `log${Date.now()}@test.com`;

//     await request(app).post("/api/auth/register").send({
//       ...validStudent,
//       email,
//       password: "SecurePassword123!!!",
//     });

//     await prisma.user.update({
//       where: { email },
//       data:  { isEmailVerified: true },
//     });

//     const res = await request(app).post("/api/auth/login").send({
//       email,
//       password: "SecurePassword123!!!",
//     });

//     expect(res.status).toBe(200);

//     // Vérifier que le log existe bien en base
//     const user = await prisma.user.findUnique({ where: { email } });
//     const log  = await prisma.loginLog.findFirst({
//       where:   { userId: user!.id, status: "SUCCESS" },
//       orderBy: { createdAt: "desc" },
//     });

//     expect(log).not.toBeNull();
//     expect(log!.status).toBe("SUCCESS");
//   });

//   it("LG-02 : failed login should be logged", async () => {
//     const email = `logfail${Date.now()}@test.com`;

//     // Créer l'utilisateur pour que le log soit enregistré
//     await request(app).post("/api/auth/register").send({
//       ...validStudent,
//       email,
//       password: "SecurePassword123!!!",
//     });

//     await prisma.user.update({
//       where: { email },
//       data:  { isEmailVerified: true },
//     });

//     const res = await request(app).post("/api/auth/login").send({
//       email,
//       password: "WrongPass999!!!",
//     });

//     expect(res.status).toBe(401);

//     const user = await prisma.user.findUnique({ where: { email } });
//     const log  = await prisma.loginLog.findFirst({
//       where:   { userId: user!.id, status: "FAILED" },
//       orderBy: { createdAt: "desc" },
//     });

//     expect(log).not.toBeNull();
//   });

//   it("LG-03 : unknown email login does not crash", async () => {
//     const res = await request(app).post("/api/auth/login").send({
//       email:    "wrong@test.com",
//       password: "Wrong123!!!",
//     });

//     expect(res.status).toBe(401);
//   });
// });
// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // describe("Login Logs", () => {

// //   it("LG-01 : successful login should be logged", async () => {
// //     const email = `log${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     await prisma.user.update({
// //       where: { email },
// //       data: { isEmailVerified: true },
// //     });

// //     const res = await request(app)
// //       .post("/api/auth/login")
// //       .send({
// //         email,
// //         password: "SecurePassword123!!!",
// //       });

// //     expect(res.status).toBe(200);
// //   });

// //   it("LG-02 : failed login", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/login")
// //       .send({
// //         email: "wrong@test.com",
// //         password: "Wrong123!!!",
// //       });

// //     expect(res.status).toBe(401);
// //   });

// // });
// // import request from "supertest";
// // import app from "../../src/index";

// // describe("Login Logs", () => {

// //   it("LG-01 : successful login should be logged", async () => {
// //     const email = `log${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     const res = await request(app)
// //       .post("/api/auth/login")
// //       .send({
// //         email,
// //         password: "SecurePassword123!!!",
// //       });

// //     expect(res.status).toBe(200);
// //   });

// //   it("LG-02 : failed login", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/login")
// //       .send({
// //         email: "wrong@test.com",
// //         password: "Wrong123!!!",
// //       });

// //     expect(res.status).toBe(401);
// //   });

// // });
