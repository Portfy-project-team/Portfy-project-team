import request from "supertest";
import app from "../../src/index";
import { createAndLoginAdmin } from "../helpers/auth.helper";

describe("GET /api/admin/users", () => {

  let adminCookies: string[] = [];

  beforeAll(async () => {
    const admin = await createAndLoginAdmin();
    adminCookies = admin.cookies;
  });

  it("GU-01 : admin get all users", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("users");
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it("GU-02 : filter by role STUDENT", async () => {
    const res = await request(app)
      .get("/api/admin/users?role=STUDENT")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(200);
  });

  it("GU-03 : no token returns 401", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.status).toBe(401);
  });
});


// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// const validStudent = { name: "Jean", prenom: "Dupont", role: "STUDENT" };

// describe("GET /api/admin/users", () => {

//   let adminCookies: string[] = [];

//   beforeAll(async () => {
//     const email = `adminlist${Date.now()}@test.com`;

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

//   it("GU-01 : admin get all users", async () => {
//     const res = await request(app)
//       .get("/api/admin/users")
//       .set("Cookie", adminCookies);

//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty("users");
//     expect(Array.isArray(res.body.users)).toBe(true);
//   });

//   it("GU-02 : filter by role STUDENT", async () => {
//     const res = await request(app)
//       .get("/api/admin/users?role=STUDENT")
//       .set("Cookie", adminCookies);

//     expect(res.status).toBe(200);
//   });

//   it("GU-03 : no token returns 401", async () => {
//     const res = await request(app).get("/api/admin/users");

//     expect(res.status).toBe(401);
//   });
// });


// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // describe("GET /api/admin/users", () => {

// //   let adminCookies: string[] = [];

// //   beforeAll(async () => {

// //     const email = `adminlist${Date.now()}@test.com`;

// //     await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         email,
// //         password: "SecurePassword123!!!",
// //         role: "STUDENT",
// //       });

// //     await prisma.user.update({
// //       where: { email },
// //       data: {
// //         role: "ADMIN",
// //         isEmailVerified: true,
// //       },
// //     });

// //     const login = await request(app)
// //       .post("/api/auth/login")
// //       .send({
// //         email,
// //         password: "SecurePassword123!!!",
// //       });

// //     adminCookies = Array.isArray(login.headers["set-cookie"])
// //       ? login.headers["set-cookie"]
// //       : [];
// //   });

// //   it("GU-01 : admin get users", async () => {

// //     const res = await request(app)
// //       .get("/api/admin/users")
// //       .set("Cookie", adminCookies);

// //     expect(res.status).toBe(200);
// //   });

// // });
