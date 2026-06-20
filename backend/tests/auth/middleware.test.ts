// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// const validStudent = { name: "Jean", prenom: "Dupont", role: "STUDENT" };

// describe("Auth Middleware", () => {

//   it("MW-01 : access protected route with valid token", async () => {
//     const email = `mw${Date.now()}@test.com`;

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

//   it("MW-02 : no token returns 401", async () => {
//     const res = await request(app).post("/api/auth/logout");

//     expect(res.status).toBe(401);
//   });

//   it("MW-03 : invalid token returns 401", async () => {
//     const res = await request(app)
//       .post("/api/auth/logout")
//       .set("Cookie", "access_token=fake.invalid.token");

//     expect(res.status).toBe(401);
//   });
// });
// // import request from "supertest";
// // import app from "../../src/index";

// // describe("Auth Middleware", () => {

// //   it("MW-01 : access protected route with token", async () => {
// //     const email = `mw${Date.now()}@test.com`;

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

// //   it("MW-02 : no token", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/logout");

// //     expect(res.status).toBe(401);
// //   });

// // });
// // describe("placeholder", () => {
// //   it("should pass", () => {
// //     expect(true).toBe(true);
// //   });
// // });  
// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // describe("Auth Middleware", () => {

// //   it("MW-01 : access protected route with token", async () => {
// //     const email = `mw${Date.now()}@test.com`;

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

// //   it("MW-02 : no token", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/logout");

// //     expect(res.status).toBe(401);
// //   });

// // });
import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("Auth Middleware", () => {

  it("MW-01 : valid token allows access to protected route", async () => {
    const { cookies } = await createAndLoginStudent();

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
  });

  it("MW-02 : no token returns 401", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(401);
  });

  it("MW-03 : invalid token returns 401", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", "access_token=fake.invalid.token");

    expect(res.status).toBe(401);
  });
});