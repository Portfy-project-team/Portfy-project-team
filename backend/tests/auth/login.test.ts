import request from "supertest";
import app from "../../src/index";
import { createVerifiedStudent, loginAs } from "../helpers/auth.helper";

describe("POST /api/auth/login", () => {

  it("L-01 : valid login returns 200 with cookies", async () => {
    const email = await createVerifiedStudent();

    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "SecurePassword123!!!",
    });

    expect(res.status).toBe(200);

    const cookies = Array.isArray(res.headers["set-cookie"])
      ? res.headers["set-cookie"]
      : [];

    expect(cookies.some((c: string) => c.includes("access_token"))).toBe(true);
    expect(cookies.some((c: string) => c.includes("refresh_token"))).toBe(true);
  });

  it("L-02 : unknown email returns 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email:    "unknown@test.com",
      password: "SecurePassword123!!!",
    });

    expect(res.status).toBe(401);
  });

  it("L-03 : wrong password returns 401", async () => {
    const email = await createVerifiedStudent();

    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "WrongPass999!!!",
    });

    expect(res.status).toBe(401);
  });

  it("L-04 : missing email returns 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      password: "SecurePassword123!!!",
    });

    expect(res.status).toBe(401);
  });

  it("L-05 : missing password returns 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
    });

    expect(res.status).toBe(401);
  });
});
// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// // Payload valide réutilisé dans tous les tests
// const validStudent = {
//   name:   "Jean",
//   prenom: "Dupont",
//   role:   "STUDENT",
// };

// describe("POST /api/auth/login", () => {

//   it("L-01 : valid login", async () => {
//     const email = `login${Date.now()}@test.com`;

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

//     const rawCookies = res.headers["set-cookie"];
//     const cookies = Array.isArray(rawCookies) ? rawCookies : [];

//     expect(cookies.some((c: string) => c.includes("access_token"))).toBe(true);
//     expect(cookies.some((c: string) => c.includes("refresh_token"))).toBe(true);
//   });

//   it("L-02 : email not found", async () => {
//     const res = await request(app).post("/api/auth/login").send({
//       email:    "unknown@test.com",
//       password: "SecurePassword123!!!",
//     });

//     expect(res.status).toBe(401);
//   });

//   it("L-03 : wrong password", async () => {
//     const email = `wrongpass${Date.now()}@test.com`;

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
//   });

//   it("L-04 : missing email returns 401", async () => {
//     const res = await request(app).post("/api/auth/login").send({
//       password: "SecurePassword123!!!",
//     });

//     expect(res.status).toBe(401);
//   });

//   it("L-05 : missing password returns 401", async () => {
//     const res = await request(app).post("/api/auth/login").send({
//       email: "test@test.com",
//     });

//     expect(res.status).toBe(401);
//   });
// });

// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // describe("POST /api/auth/login", () => {

// //   it("L-01 : valid login", async () => {
// //     const email = `login${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     await prisma.user.update({
// //       where: { email },
// //       data: { isEmailVerified: true },
// //     });

// //     const res = await request(app).post("/api/auth/login").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //     });

// //     expect(res.status).toBe(200);

// //     const rawCookies = res.headers["set-cookie"];
// //     const cookies = Array.isArray(rawCookies) ? rawCookies : [];

// //     expect(cookies.some((c: string) => c.includes("access_token"))).toBe(true);
// //     expect(cookies.some((c: string) => c.includes("refresh_token"))).toBe(true);
// //   });

// //   it("L-02 : email not found", async () => {
// //     const res = await request(app).post("/api/auth/login").send({
// //       email: "unknown@test.com",
// //       password: "SecurePassword123!!!",
// //     });

// //     expect(res.status).toBe(401);
// //   });

// //   it("L-03 : wrong password", async () => {
// //     const email = `wrongpass${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     await prisma.user.update({
// //       where: { email },
// //       data: { isEmailVerified: true },
// //     });

// //     const res = await request(app).post("/api/auth/login").send({
// //       email,
// //       password: "WrongPass999!!!",
// //     });

// //     expect(res.status).toBe(401);
// //   });

// // });









// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // describe("POST /api/auth/login", () => {

// //   it("L-01 : valid login", async () => {
// //     const email = `login${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     await prisma.user.update({
// //       where: { email },
// //       data: { isEmailVerified: true },
// //     });

// //     const res = await request(app).post("/api/auth/login").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //     });

// //     expect(res.status).toBe(200);

// //     const rawCookies = res.headers["set-cookie"];
// //     const cookies = Array.isArray(rawCookies) ? rawCookies : [];

// //     expect(cookies).toBeDefined();
// //     expect(cookies.some((c: string) => c.includes("access_token"))).toBe(true);
// //     expect(cookies.some((c: string) => c.includes("refresh_token"))).toBe(true);
// //   });

// //   it("L-02 : email not found", async () => {
// //     const res = await request(app).post("/api/auth/login").send({
// //       email: "unknown@test.com",
// //       password: "SecurePassword123!!!",
// //     });

// //     expect(res.status).toBe(401);
// //   });

// //   // it("L-03 : wrong password", async () => {
// //   //   const email = `wrong${Date.now()}@test.com`;

// //   //   await request(app).post("/api/auth/register").send({
// //   //     email,
// //   //     password: "SecurePassword123!!!",
// //   //     role: "STUDENT",
// //   //   });

// //   //   await prisma.user.update({
// //   //     where: { email },
// //   //     data: { isEmailVerified: true },
// //   //   });

// //   //   const res = await request(app).post("/api/auth/login").send({
// //   //     email,
// //   //     password: "WrongPass999!!!",
// //   //   });

// //   //   expect(res.status).toBe(401);
// //   // });
// // it("L-03 : wrong password", async () => {
// //   const email = `wrongpass${Date.now()}@test.com`;

// //   await request(app).post("/api/auth/register").send({
// //     email,
// //     password: "SecurePassword123!!!",
// //     role: "STUDENT",
// //   });

// //   await prisma.user.update({
// //     where: { email },
// //     data: { isEmailVerified: true },
// //   });

// //   const res = await request(app).post("/api/auth/login").send({
// //     email,
// //     password: "WrongPass999!!!",
// //   });

// //   expect(res.status).toBe(401);
// // });
// // });























// // import request from "supertest";
// // import app from "../../src/index";

// // describe("POST /api/auth/login", () => {

// //   it("L-01 : valid login", async () => {
// //     const email = `login${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     const res = await request(app).post("/api/auth/login").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //     });

// //     expect(res.status).toBe(200);
// //     // const cookies = res.headers["set-cookie"] as string[];
// //     // const cookies = res.headers["set-cookie"] ;
// //     const rawCookies = res.headers["set-cookie"];
// //     const cookies = Array.isArray(rawCookies) ? rawCookies : [];
// //     expect(cookies).toBeDefined();
// //     expect(cookies.some((c: string) => c.includes("access_token"))).toBe(true);
// //     expect(cookies.some((c: string) => c.includes("refresh_token"))).toBe(true);
// //   });

// //   it("L-02 : email not found", async () => {
// //     const res = await request(app).post("/api/auth/login").send({
// //       email: "unknown@test.com",
// //       password: "SecurePassword123!!!",
// //     });

// //     expect(res.status).toBe(401);
// //   });

// //   it("L-03 : wrong password", async () => {
// //     const email = `wrong${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     const res = await request(app).post("/api/auth/login").send({
// //       email,
// //       password: "WrongPass999!!!",
// //     });

// //     expect(res.status).toBe(401);
// //   });

// // });
