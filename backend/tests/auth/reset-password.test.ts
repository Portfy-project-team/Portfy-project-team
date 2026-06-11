// import request from "supertest";
// import app from "../../src/index";

// describe("POST /api/auth/reset-password", () => {

//   it("RP-01 : invalid token format returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/reset-password")
//       .send({
//         token:    "invalid-token",
//         password: "NewPassword123!!!",
//       });

//     expect(res.status).toBe(400);
//   });

//   it("RP-02 : missing token returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/reset-password")
//       .send({ password: "NewPassword123!!!" });

//     expect(res.status).toBe(400);
//   });

//   it("RP-03 : short password returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/reset-password")
//       .send({
//         token:    "fake-token",
//         password: "123",
//       });

//     expect(res.status).toBe(400);
//   });

//   it("RP-04 : missing password returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/reset-password")
//       .send({ token: "fake-token" });

//     expect(res.status).toBe(400);
//   });

//   it("RP-05 : valid format token but not in DB returns 400", async () => {
//     const fakeToken = "b".repeat(64);
//     const res = await request(app)
//       .post("/api/auth/reset-password")
//       .send({
//         token:    fakeToken,
//         password: "NewPassword123!!!",
//       });

//     expect(res.status).toBe(400);
//   });
// });

// // import request from "supertest";
// // import app from "../../src/index";

// // describe("POST /api/auth/reset-password", () => {

// //   it("RP-01 : invalid token", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/reset-password")
// //       .send({
// //         token: "invalid-token",
// //         password: "NewPassword123!!!",
// //       });

// //     expect([400, 401]).toContain(res.status);
// //   });

// //   it("RP-02 : missing token", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/reset-password")
// //       .send({
// //         password: "NewPassword123!!!",
// //       });

// //     expect(res.status).toBe(400);
// //   });

// //   it("RP-03 : short password", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/reset-password")
// //       .send({
// //         token: "fake-token",
// //         password: "123",
// //       });

// //     expect(res.status).toBe(400);
// //   });

// //   it("RP-04 : missing password", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/reset-password")
// //       .send({
// //         token: "fake-token",
// //       });

// //     expect(res.status).toBe(400);
// //   });

// // });

// // describe("POST /auth/reset-password", () => {
// //   it("RP-01 : not implemented yet", () => {
// //     expect(true).toBe(true);
// //   });
// // });
// // describe("placeholder", () => {
// //   it("should pass", () => {
// //     expect(true).toBe(true);
// //   });
// // });  
import request from "supertest";
import app from "../../src/index";

describe("POST /api/auth/reset-password", () => {

  it("RP-01 : invalid token format returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "invalid-token", password: "NewPassword123!!!" });

    expect(res.status).toBe(400);
  });

  it("RP-02 : missing token returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ password: "NewPassword123!!!" });

    expect(res.status).toBe(400);
  });

  it("RP-03 : short password returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "fake-token", password: "123" });

    expect(res.status).toBe(400);
  });

  it("RP-04 : missing password returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "fake-token" });

    expect(res.status).toBe(400);
  });

  it("RP-05 : valid format token not in DB returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "b".repeat(64), password: "NewPassword123!!!" });

    expect(res.status).toBe(400);
  });
});