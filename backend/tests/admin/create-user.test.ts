import request from "supertest";
import app from "../../src/index";
import { createAndLoginAdmin } from "../helpers/auth.helper";

describe("POST /api/admin/users", () => {

  let adminCookies: string[] = [];

  beforeAll(async () => {
    const admin = await createAndLoginAdmin();
    adminCookies = admin.cookies;
  });

  it("AU-01 : admin create user", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Cookie", adminCookies)
      .send({
        email:    `newuser${Date.now()}@test.com`,
        password: "Password123!",
        role:     "STUDENT",
      });

    expect(res.status).toBe(201);
  });

  it("AU-02 : no token returns 401", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .send({
        email:    `newuser${Date.now()}@test.com`,
        password: "Password123!",
        role:     "STUDENT",
      });

    expect(res.status).toBe(401);
  });

  it("AU-03 : duplicate email returns 409", async () => {
    const email = `dup${Date.now()}@test.com`;

    await request(app)
      .post("/api/admin/users")
      .set("Cookie", adminCookies)
      .send({ email, password: "Password123!", role: "STUDENT" });

    const res = await request(app)
      .post("/api/admin/users")
      .set("Cookie", adminCookies)
      .send({ email, password: "Password123!", role: "STUDENT" });

    expect(res.status).toBe(409);
  });

  it("AU-04 : invalid email returns 400 or 500", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Cookie", adminCookies)
      .send({
        email:    "not-an-email",
        password: "Password123!",
        role:     "STUDENT",
      });

    expect([400, 500]).toContain(res.status);
  });
});

// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// const validStudent = { name: "Jean", prenom: "Dupont", role: "STUDENT" };

// describe("POST /api/admin/users", () => {

//   let adminCookies: string[] = [];

//   beforeAll(async () => {
//     const email = `admin${Date.now()}@test.com`;

//     await request(app).post("/api/auth/register").send({
//       ...validStudent,
//       email,
//       password: "SecurePassword123!!!",
//     });

//     await prisma.user.update({
//       where: { email },
//       data:  { role: "ADMIN", isEmailVerified: true },
//     });

//     const login = await request(app).post("/api/auth/login").send({
//       email,
//       password: "SecurePassword123!!!",
//     });

//     adminCookies = Array.isArray(login.headers["set-cookie"])
//       ? login.headers["set-cookie"]
//       : [];
//   });

//   it("AU-01 : admin create user", async () => {
//     const res = await request(app)
//       .post("/api/admin/users")
//       .set("Cookie", adminCookies)
//       .send({
//         email:    `user${Date.now()}@test.com`,
//         password: "Password123!",
//         role:     "STUDENT",
//       });

//     expect(res.status).toBe(201);
//   });

//   it("AU-02 : no token returns 401", async () => {
//     const res = await request(app)
//       .post("/api/admin/users")
//       .send({
//         email:    `user${Date.now()}@test.com`,
//         password: "Password123!",
//         role:     "STUDENT",
//       });

//     expect(res.status).toBe(401);
//   });

//   it("AU-03 : duplicate email returns 409", async () => {
//     const email = `dup${Date.now()}@test.com`;

//     // Créer une première fois
//     await request(app)
//       .post("/api/admin/users")
//       .set("Cookie", adminCookies)
//       .send({ email, password: "Password123!", role: "STUDENT" });

//     // Tenter de re-créer avec le même email
//     const res = await request(app)
//       .post("/api/admin/users")
//       .set("Cookie", adminCookies)
//       .send({ email, password: "Password123!", role: "STUDENT" });

//     expect(res.status).toBe(409);
//   });

//   it("AU-04 : invalid email returns 500 or 400", async () => {
//     const res = await request(app)
//       .post("/api/admin/users")
//       .set("Cookie", adminCookies)
//       .send({
//         email:    "not-an-email",
//         password: "Password123!",
//         role:     "STUDENT",
//       });

//     expect([400, 500]).toContain(res.status);
//   });
// });

// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// describe("POST /api/admin/users", () => {

//   let adminCookies: string[] = [];

//   beforeAll(async () => {

//     const email = `admin${Date.now()}@test.com`;

//     await request(app)
//       .post("/api/auth/register")
//       .send({
//         email,
//         password: "SecurePassword123!!!",
//         role: "STUDENT",
//       });

//     await prisma.user.update({
//       where: { email },
//       data: {
//         role: "ADMIN",
//         isEmailVerified: true,
//       },
//     });

//     const login = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email,
//         password: "SecurePassword123!!!",
//       });

//     adminCookies = Array.isArray(login.headers["set-cookie"])
//       ? login.headers["set-cookie"]
//       : [];
//   });

//   it("AU-01 : admin create user", async () => {

//     const res = await request(app)
//       .post("/api/admin/users")
//       .set("Cookie", adminCookies)
//       .send({
//         name: "Test User",
//         email: `user${Date.now()}@test.com`,
//         password: "Password123!",
//         role: "STUDENT",
//       });

//     expect(res.status).toBe(201);
//   });

//   it("AU-02 : no token", async () => {

//     const res = await request(app)
//       .post("/api/admin/users")
//       .send({
//         name: "Test User",
//         email: `user${Date.now()}@test.com`,
//         password: "Password123!",
//         role: "STUDENT",
//       });

//     expect(res.status).toBe(401);
//   });

// });
