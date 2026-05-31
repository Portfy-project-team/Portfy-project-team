import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";
import { createAndLoginAdmin } from "../helpers/auth.helper";

describe("POST /api/admin/reject-invite/:id", () => {

  let adminCookies: string[] = [];
  let pendingUserId: number;

  beforeAll(async () => {
    const admin = await createAndLoginAdmin();
    adminCookies = admin.cookies;

    const user = await prisma.user.create({
      data: {
        email:    `rejectpending${Date.now()}@test.com`,
        password: "hashedpassword",
        role:     "STUDENT",
        status:   "PENDING",
      },
    });
    pendingUserId = user.id;
  });

  it("RJ-01 : reject pending user", async () => {
    const res = await request(app)
      .post(`/api/admin/reject-invite/${pendingUserId}`)
      .set("Cookie", adminCookies)
      .send({ reason: "Invalid profile" });

    expect(res.status).toBe(200);
  });

  it("RJ-02 : already rejected returns 409", async () => {
    const res = await request(app)
      .post(`/api/admin/reject-invite/${pendingUserId}`)
      .set("Cookie", adminCookies)
      .send({ reason: "Again" });

    expect(res.status).toBe(409);
  });

  it("RJ-03 : invalid id returns 400", async () => {
    const res = await request(app)
      .post("/api/admin/reject-invite/abc")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(400);
  });

  it("RJ-04 : user not found returns 404", async () => {
    const res = await request(app)
      .post("/api/admin/reject-invite/999999")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(404);
  });

  it("RJ-05 : no token returns 401", async () => {
    const res = await request(app)
      .post(`/api/admin/reject-invite/${pendingUserId}`);

    expect(res.status).toBe(401);
  });
});

// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// const validStudent = { name: "Jean", prenom: "Dupont", role: "STUDENT" };

// describe("POST /api/admin/reject-invite/:id", () => {

//   let adminCookies: string[] = [];
//   let pendingUserId: number;

//   beforeAll(async () => {
//     const adminEmail = `rejectadmin${Date.now()}@test.com`;

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
//         email:    `rejectpending${Date.now()}@test.com`,
//         password: "hashedpassword",
//         role:     "STUDENT",
//         status:   "PENDING",
//       },
//     });

//     pendingUserId = user.id;
//   });

//   it("RJ-01 : reject pending user", async () => {
//     const res = await request(app)
//       .post(`/api/admin/reject-invite/${pendingUserId}`)
//       .set("Cookie", adminCookies)
//       .send({ reason: "Invalid profile" });

//     expect(res.status).toBe(200);
//   });

//   it("RJ-02 : already rejected user returns 409", async () => {
//     const res = await request(app)
//       .post(`/api/admin/reject-invite/${pendingUserId}`)
//       .set("Cookie", adminCookies)
//       .send({ reason: "Again" });

//     expect(res.status).toBe(409);
//   });

//   it("RJ-03 : invalid id returns 400", async () => {
//     const res = await request(app)
//       .post("/api/admin/reject-invite/abc")
//       .set("Cookie", adminCookies);

//     expect(res.status).toBe(400);
//   });

//   it("RJ-04 : user not found returns 404", async () => {
//     const res = await request(app)
//       .post("/api/admin/reject-invite/999999")
//       .set("Cookie", adminCookies);

//     expect(res.status).toBe(404);
//   });

//   it("RJ-05 : no token returns 401", async () => {
//     const res = await request(app)
//       .post(`/api/admin/reject-invite/${pendingUserId}`);

//     expect(res.status).toBe(401);
//   });
// });

// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // describe("POST /api/admin/reject-invite/:id", () => {

// //   let adminCookies: string[] = [];
// //   let pendingUserId: number;

// //   beforeAll(async () => {

// //     // create admin
// //     const adminEmail = `rejectadmin${Date.now()}@test.com`;

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
// //       adminCookies = Array.isArray(login.headers["set-cookie"])
// //       ? login.headers["set-cookie"]
// //       : [];

// //     // create pending user
// //     const user = await prisma.user.create({
// //       data: {
// //         email: `rejectpending${Date.now()}@test.com`,
// //         password: "hashedpassword",
// //         role: "STUDENT",
// //         status: "PENDING",
// //       },
// //     });

// //     pendingUserId = user.id;
// //   });

// //   it("RJ-01 : reject pending user", async () => {

// //     const res = await request(app)
// //       .post(`/api/admin/reject-invite/${pendingUserId}`)
// //       .set("Cookie", adminCookies)
// //       .send({
// //         reason: "Invalid profile",
// //       });

// //     expect(res.status).toBe(200);
// //   });

// //   it("RJ-02 : already rejected user", async () => {

// //     const res = await request(app)
// //       .post(`/api/admin/reject-invite/${pendingUserId}`)
// //       .set("Cookie", adminCookies)
// //       .send({
// //         reason: "Again",
// //       });

// //     expect(res.status).toBe(409);
// //   });

// //   it("RJ-03 : invalid id", async () => {

// //     const res = await request(app)
// //       .post("/api/admin/reject-invite/abc")
// //       .set("Cookie", adminCookies);

// //     expect(res.status).toBe(400);
// //   });

// //   it("RJ-04 : user not found", async () => {

// //     const res = await request(app)
// //       .post("/api/admin/reject-invite/999999")
// //       .set("Cookie", adminCookies);

// //     expect(res.status).toBe(404);
// //   });

// //   it("RJ-05 : no token", async () => {

// //     const res = await request(app)
// //       .post(`/api/admin/reject-invite/${pendingUserId}`);

// //     expect(res.status).toBe(401);
// //   });

// // });
