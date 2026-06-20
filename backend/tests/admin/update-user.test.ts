import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";
import { createAndLoginAdmin } from "../helpers/auth.helper";

describe("PATCH /api/admin/users/:id", () => {

  let adminCookies: string[] = [];
  let userId: number;

  beforeAll(async () => {
    const admin = await createAndLoginAdmin();
    adminCookies = admin.cookies;

    const user = await prisma.user.create({
      data: {
        email:    `usertoupdate${Date.now()}@test.com`,
        password: "hashedpassword",
        role:     "STUDENT",
      },
    });
    userId = user.id;
  });

  it("UU-01 : admin update user role", async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${userId}`)
      .set("Cookie", adminCookies)
      .send({ role: "PROF" });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe("PROF");
  });

  it("UU-02 : invalid user id returns 400", async () => {
    const res = await request(app)
      .patch("/api/admin/users/abc")
      .set("Cookie", adminCookies)
      .send({ role: "PRO" });

    expect(res.status).toBe(400);
  });

  it("UU-03 : user not found returns 404", async () => {
    const res = await request(app)
      .patch("/api/admin/users/999999")
      .set("Cookie", adminCookies)
      .send({ role: "PRO" });

    expect(res.status).toBe(404);
  });

  it("UU-04 : no token returns 401", async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${userId}`)
      .send({ role: "PRO" });

    expect(res.status).toBe(401);
  });
});


// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// const validStudent = { name: "Jean", prenom: "Dupont", role: "STUDENT" };

// describe("PATCH /api/admin/users/:id", () => {

//   let adminCookies: string[] = [];
//   let userId: number;

//   beforeAll(async () => {
//     const adminEmail = `adminupdate${Date.now()}@test.com`;

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
//         email:    `usertoupdate${Date.now()}@test.com`,
//         password: "hashedpassword",
//         role:     "STUDENT",
//       },
//     });

//     userId = user.id;
//   });

//   it("UU-01 : admin update user role", async () => {
//     const res = await request(app)
//       .patch(`/api/admin/users/${userId}`)
//       .set("Cookie", adminCookies)
//       .send({ role: "PROF" });

//     expect(res.status).toBe(200);
//     expect(res.body.user.role).toBe("PROF");
//   });

//   it("UU-02 : invalid user id returns 400", async () => {
//     const res = await request(app)
//       .patch("/api/admin/users/abc")
//       .set("Cookie", adminCookies)
//       .send({ role: "PRO" });

//     expect(res.status).toBe(400);
//   });

//   it("UU-03 : user not found returns 404", async () => {
//     const res = await request(app)
//       .patch("/api/admin/users/999999")
//       .set("Cookie", adminCookies)
//       .send({ role: "PRO" });

//     expect(res.status).toBe(404);
//   });

//   it("UU-04 : no token returns 401", async () => {
//     const res = await request(app)
//       .patch(`/api/admin/users/${userId}`)
//       .send({ role: "PRO" });

//     expect(res.status).toBe(401);
//   });
// });
// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // describe("PATCH /api/admin/users/:id", () => {

// //   let adminCookies: string[] = [];
// //   let userId: number;

// //   beforeAll(async () => {

// //     // create admin
// //     const adminEmail = `adminupdate${Date.now()}@test.com`;

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
// //      adminCookies = Array.isArray(login.headers["set-cookie"])
// //       ? login.headers["set-cookie"]
// //       : [];

// //     // create normal user
// //     const user = await prisma.user.create({
// //       data: {
// //         email: `usertoupdate${Date.now()}@test.com`,
// //         password: "hashedpassword",
// //         role: "STUDENT",
// //       },
// //     });

// //     userId = user.id;
// //   });

// //   it("UU-01 : admin update user role", async () => {

// //     const res = await request(app)
// //       .patch(`/api/admin/users/${userId}`)
// //       .set("Cookie", adminCookies)
// //       .send({
// //         role: "PROF",
// //       });

// //     expect(res.status).toBe(200);
// //     expect(res.body.user.role).toBe("PROF");
// //   });

// //   it("UU-02 : invalid user id", async () => {

// //     const res = await request(app)
// //       .patch("/api/admin/users/abc")
// //       .set("Cookie", adminCookies)
// //       .send({
// //         role: "PRO",
// //       });

// //     expect(res.status).toBe(400);
// //   });

// //   it("UU-03 : user not found", async () => {

// //     const res = await request(app)
// //       .patch("/api/admin/users/999999")
// //       .set("Cookie", adminCookies)
// //       .send({
// //         role: "PRO",
// //       });

// //     expect(res.status).toBe(404);
// //   });

// //   it("UU-04 : no token", async () => {

// //     const res = await request(app)
// //       .patch(`/api/admin/users/${userId}`)
// //       .send({
// //         role: "PRO",
// //       });

// //     expect(res.status).toBe(401);
// //   });

// // });
