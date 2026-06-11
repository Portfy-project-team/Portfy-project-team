// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// const validStudent = { name: "Jean", prenom: "Dupont", role: "STUDENT" };

// describe("POST /api/auth/logout", () => {

//   it("LO-01 : valid logout", async () => {
//     const email = `logout${Date.now()}@test.com`;

//     await request(app).post("/api/auth/register").send({
//       ...validStudent,
//       email,
//       password: "SecurePassword123!!!",
//     });

//     await prisma.user.update({
//       where: { email },
//       data:  { isEmailVerified: true },
//     });

//     const login = await request(app).post("/api/auth/login").send({
//       email,
//       password: "SecurePassword123!!!",
//     });

//     const cookies = login.headers["set-cookie"];

//     const res = await request(app)
//       .post("/api/auth/logout")
//       .set("Cookie", cookies);

//     expect(res.status).toBe(200);
//   });

//   it("LO-02 : no token returns 401", async () => {
//     const res = await request(app).post("/api/auth/logout");

//     expect(res.status).toBe(401);
//   });

//   it("LO-03 : logout twice should stay safe", async () => {
//     const email = `logout2${Date.now()}@test.com`;

//     await request(app).post("/api/auth/register").send({
//       ...validStudent,
//       email,
//       password: "SecurePassword123!!!",
//     });

//     await prisma.user.update({
//       where: { email },
//       data:  { isEmailVerified: true },
//     });

//     const login = await request(app).post("/api/auth/login").send({
//       email,
//       password: "SecurePassword123!!!",
//     });

//     const cookies = Array.isArray(login.headers["set-cookie"])
//       ? login.headers["set-cookie"]
//       : [];

//     // Premier logout
//     await request(app)
//       .post("/api/auth/logout")
//       .set("Cookie", cookies);

//     // Deuxième logout avec les mêmes cookies
//     const res = await request(app)
//       .post("/api/auth/logout")
//       .set("Cookie", cookies);

//     // Après le 1er logout, le cookie access_token est effacé côté serveur
//     // Le middleware renvoie 401 car le cookie envoyé n'est plus valide
//     expect([200, 401]).toContain(res.status);
//   });
// });
// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // describe("POST /api/auth/logout", () => {

// //   it("LO-01 : valid logout", async () => {
// //     const email = `logout${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     await prisma.user.update({
// //       where: { email },
// //       data: { isEmailVerified: true },
// //     });

// //     const login = await request(app).post("/api/auth/login").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //     });

// //     const cookies = login.headers["set-cookie"];

// //     const res = await request(app)
// //       .post("/api/auth/logout")
// //       .set("Cookie", cookies);

// //     expect(res.status).toBe(200);
// //   });

// //   it("LO-04 : logout twice should stay safe", async () => {
// //     const email = `logout2${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     await prisma.user.update({
// //       where: { email },
// //       data: { isEmailVerified: true },
// //     });

// //     const login = await request(app).post("/api/auth/login").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //     });

// //     const cookies = Array.isArray(login.headers["set-cookie"])
// //       ? login.headers["set-cookie"]
// //       : [];

// //     await request(app)
// //       .post("/api/auth/logout")
// //       .set("Cookie", cookies);

// //     const res = await request(app)
// //       .post("/api/auth/logout")
// //       .set("Cookie", cookies);

// //     expect([200, 401]).toContain(res.status);
// //   });

// // });
// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // describe("POST /api/auth/logout", () => {

// //   it("LO-01 : valid logout", async () => {
// //     const email = `logout${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     await prisma.user.update({
// //       where: { email },
// //       data: { isEmailVerified: true },
// //     });

// //     const login = await request(app).post("/api/auth/login").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //     });

// //     const cookies = login.headers["set-cookie"];

// //     const res = await request(app)
// //       .post("/api/auth/logout")
// //       .set("Cookie", cookies);

// //     expect(res.status).toBe(200);
// //   });
// // it("LO-04 : logout twice should stay safe", async () => {
// //   const email = `logout2${Date.now()}@test.com`;

// //   await request(app).post("/api/auth/register").send({
// //     email,
// //     password: "SecurePassword123!!!",
// //     role: "STUDENT",
// //   });

// //   await prisma.user.update({
// //     where: { email },
// //     data: { isEmailVerified: true },
// //   });

// //   const login = await request(app).post("/api/auth/login").send({
// //     email,
// //     password: "SecurePassword123!!!",
// //   });

// //   const cookies = Array.isArray(login.headers["set-cookie"])
// //     ? login.headers["set-cookie"]
// //     : [];

// //   // Si le login a échoué (parallélisme), on skip gracieusement
// //   if (cookies.length === 0) {
// //     expect([200, 401, 500]).toContain(login.status);
// //     return;
// //   }

// //   await request(app)
// //     .post("/api/auth/logout")
// //     .set("Cookie", cookies);

// //   const res = await request(app)
// //     .post("/api/auth/logout")
// //     .set("Cookie", cookies);

// //   expect([200, 401]).toContain(res.status);
// // });
// //   // it("LO-04 : logout twice should stay safe", async () => {
// //   //   const email = `logout2${Date.now()}@test.com`;

// //   //   await request(app).post("/api/auth/register").send({
// //   //     email,
// //   //     password: "SecurePassword123!!!",
// //   //     role: "STUDENT",
// //   //   });

// //   //   await prisma.user.update({
// //   //     where: { email },
// //   //     data: { isEmailVerified: true },
// //   //   });

// //   //   const login = await request(app).post("/api/auth/login").send({
// //   //     email,
// //   //     password: "SecurePassword123!!!",
// //   //   });

// //   //   const cookies = login.headers["set-cookie"];

// //   //   await request(app)
// //   //     .post("/api/auth/logout")
// //   //     .set("Cookie", cookies);

// //   //   const res = await request(app)
// //   //     .post("/api/auth/logout")
// //   //     .set("Cookie", cookies);

// //   //   expect([200, 401]).toContain(res.status);
// //   // });

// // });

// // import request from "supertest";
// // import app from "../../src/index";

// // describe("POST /api/auth/logout", () => {

// //   it("LO-01 : valid logout", async () => {
// //     const email = `logout${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     const login = await request(app).post("/api/auth/login").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //     });

// //     const cookies = login.headers["set-cookie"];

// //     const res = await request(app)
// //       .post("/api/auth/logout")
// //       .set("Cookie", cookies);

// //     expect(res.status).toBe(200);
// //   });

// //   it("LO-04 : logout twice should stay safe", async () => {
// //     const email = `logout2${Date.now()}@test.com`;

// //     await request(app).post("/api/auth/register").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //       role: "STUDENT",
// //     });

// //     const login = await request(app).post("/api/auth/login").send({
// //       email,
// //       password: "SecurePassword123!!!",
// //     });

// //     const cookies = login.headers["set-cookie"];

// //     await request(app)
// //       .post("/api/auth/logout")
// //       .set("Cookie", cookies);

// //     const res = await request(app)
// //       .post("/api/auth/logout")
// //       .set("Cookie", cookies);

// //     // verifyToken may reject because cookie cleared/invalid
// //     expect([200, 401]).toContain(res.status);
// //   });

// // });

import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("POST /api/auth/logout", () => {

  it("LO-01 : valid logout returns 200", async () => {
    const { cookies } = await createAndLoginStudent();

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
  });

  it("LO-02 : no token returns 401", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(401);
  });

  it("LO-03 : logout twice is safe", async () => {
    const { cookies } = await createAndLoginStudent();

    await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies);

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies);

    expect([200, 401]).toContain(res.status);
  });
});