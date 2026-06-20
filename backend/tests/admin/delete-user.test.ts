import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";
import { createAndLoginAdmin } from "../helpers/auth.helper";

describe("DELETE /api/admin/users/:id", () => {

  let adminCookies: string[] = [];
  let userId: number;

  beforeAll(async () => {
    const admin = await createAndLoginAdmin();
    adminCookies = admin.cookies;

    const user = await prisma.user.create({
      data: {
        email:    `deleteuser${Date.now()}@test.com`,
        password: "hashed",
        role:     "STUDENT",
      },
    });
    userId = user.id;
  });

  it("DU-01 : admin delete user", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${userId}`)
      .set("Cookie", adminCookies);

    expect(res.status).toBe(200);
  });

  it("DU-02 : invalid id returns 400", async () => {
    const res = await request(app)
      .delete("/api/admin/users/abc")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(400);
  });

  it("DU-03 : user not found returns 404", async () => {
    const res = await request(app)
      .delete("/api/admin/users/999999")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(404);
  });

  it("DU-04 : no token returns 401", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${userId}`);

    expect(res.status).toBe(401);
  });
});

// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// const validStudent = { name: "Jean", prenom: "Dupont", role: "STUDENT" };

// describe("DELETE /api/admin/users/:id", () => {

//   let adminCookies: string[] = [];
//   let userId: number;

//   beforeAll(async () => {
//     const adminEmail = `admindelete${Date.now()}@test.com`;

//     await request(app).post("/api/auth/register").send({
//       ...validStudent,
//       email:    adminEmail,
//       password: "SecurePassword123!!!",
//     });

//     await prisma.user.update({
//       where: { email: adminEmail },
//       data:  { role: "ADMIN", isEmailVerified: true },
//     });

//     const login = await request(app).post("/api/auth/login").send({
//       email:    adminEmail,
//       password: "SecurePassword123!!!",
//     });

//     adminCookies = Array.isArray(login.headers["set-cookie"])
//       ? login.headers["set-cookie"]
//       : [];

//     const user = await prisma.user.create({
//       data: {
//         email:    `deleteuser${Date.now()}@test.com`,
//         password: "hashed",
//         role:     "STUDENT",
//       },
//     });

//     userId = user.id;
//   });

//   it("DU-01 : admin delete user", async () => {
//     const res = await request(app)
//       .delete(`/api/admin/users/${userId}`)
//       .set("Cookie", adminCookies);

//     expect(res.status).toBe(200);
//   });

//   it("DU-02 : invalid id returns 400", async () => {
//     const res = await request(app)
//       .delete("/api/admin/users/abc")
//       .set("Cookie", adminCookies);

//     expect(res.status).toBe(400);
//   });

//   it("DU-03 : user not found returns 404", async () => {
//     const res = await request(app)
//       .delete("/api/admin/users/999999")
//       .set("Cookie", adminCookies);

//     expect(res.status).toBe(404);
//   });

//   it("DU-04 : no token returns 401", async () => {
//     const res = await request(app)
//       .delete(`/api/admin/users/${userId}`);

//     expect(res.status).toBe(401);
//   });
// });

// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // describe("DELETE /api/admin/users/:id", () => {

// //   let adminCookies: string[] = [];
// //   let userId: number;

// //   beforeAll(async () => {

// //     const adminEmail = `admindelete${Date.now()}@test.com`;

// //     await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         email: adminEmail,
// //         password: "SecurePassword123!!!",
// //         role: "STUDENT",
// //       });

// //     await prisma.user.update({
// //       where: { email: adminEmail },
// //       data: {
// //         role: "ADMIN",
// //         isEmailVerified: true,
// //       },
// //     });

// //     const login = await request(app)
// //       .post("/api/auth/login")
// //       .send({
// //         email: adminEmail,
// //         password: "SecurePassword123!!!",
// //       });

// //     // adminCookies = login.headers["set-cookie"];
// //     adminCookies = Array.isArray(login.headers["set-cookie"])
// //       ? login.headers["set-cookie"]
// //       : [];

// //     const user = await prisma.user.create({
// //       data: {
// //         email: `deleteuser${Date.now()}@test.com`,
// //         password: "hashed",
// //         role: "STUDENT",
// //       },
// //     });

// //     userId = user.id;
// //   });

// //   it("DU-01 : admin delete user", async () => {

// //     const res = await request(app)
// //       .delete(`/api/admin/users/${userId}`)
// //       .set("Cookie", adminCookies);

// //     expect(res.status).toBe(200);
// //   });

// //   it("DU-02 : invalid id", async () => {

// //     const res = await request(app)
// //       .delete("/api/admin/users/abc")
// //       .set("Cookie", adminCookies);

// //     expect(res.status).toBe(400);
// //   });

// //   it("DU-03 : user not found", async () => {

// //     const res = await request(app)
// //       .delete("/api/admin/users/999999")
// //       .set("Cookie", adminCookies);

// //     expect(res.status).toBe(404);
// //   });

// //   it("DU-04 : no token", async () => {

// //     const res = await request(app)
// //       .delete(`/api/admin/users/${userId}`);

// //     expect(res.status).toBe(401);
// //   });

// // });
