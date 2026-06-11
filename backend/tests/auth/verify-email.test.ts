// import request from "supertest";
// import app from "../../src/index";

// describe("GET /api/auth/verify-email", () => {

//   it("VE-01 : invalid token returns 400", async () => {
//     const res = await request(app)
//       .get("/api/auth/verify-email?token=invalid-token");

//     expect(res.status).toBe(400);
//   });

//   it("VE-02 : missing token returns 400", async () => {
//     const res = await request(app)
//       .get("/api/auth/verify-email");

//     expect(res.status).toBe(400);
//   });

//   it("VE-03 : token correct format but not in DB returns 400", async () => {
//     // Token de 64 caractères hex valide côté format mais inexistant en DB
//     const fakeToken = "a".repeat(64);
//     const res = await request(app)
//       .get(`/api/auth/verify-email?token=${fakeToken}`);

//     expect(res.status).toBe(400);
//   });
// });

// // import request from "supertest";
// // import app from "../../src/index";

// // describe("GET /api/auth/verify-email", () => {

// //   it("VE-01 : invalid token", async () => {
// //     const res = await request(app)
// //       .get("/api/auth/verify-email?token=invalid-token");

// //     expect(res.status).toBe(400);
// //   });

// //   it("VE-02 : missing token", async () => {
// //     const res = await request(app)
// //       .get("/api/auth/verify-email");

// //     expect(res.status).toBe(400);
// //   });

// // });
import request from "supertest";
import app from "../../src/index";

describe("GET /api/auth/verify-email", () => {

  it("VE-01 : invalid token returns 400", async () => {
    const res = await request(app)
      .get("/api/auth/verify-email?token=invalid-token");

    expect(res.status).toBe(400);
  });

  it("VE-02 : missing token returns 400", async () => {
    const res = await request(app).get("/api/auth/verify-email");
    expect(res.status).toBe(400);
  });

  it("VE-03 : valid format but unknown token returns 400", async () => {
    const fakeToken = "a".repeat(64);
    const res = await request(app)
      .get(`/api/auth/verify-email?token=${fakeToken}`);

    expect(res.status).toBe(400);
  });
});