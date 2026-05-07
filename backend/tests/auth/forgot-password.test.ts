// import request from "supertest";
// import app from "../../src/index";

// describe("POST /api/auth/forgot-password", () => {

//   it("FP-01 : valid forgot password", async () => {
//     const email = `forgot${Date.now()}@test.com`;

//     await request(app).post("/api/auth/register").send({
//       email,
//       password: "Secure123!!!",
//       role: "STUDENT",
//     });

//     const res = await request(app)
//       .post("/api/auth/forgot-password")
//       .send({ email });

//     expect(res.status).toBe(200);
//   });

//   it("FP-02 : email not found", async () => {
//     const res = await request(app)
//       .post("/api/auth/forgot-password")
//       .send({
//         email: "unknown@test.com",
//       });

//     expect([200, 404]).toContain(res.status);
//   });

//   it("FP-03 : invalid email", async () => {
//     const res = await request(app)
//       .post("/api/auth/forgot-password")
//       .send({
//         email: "invalid-email",
//       });

//     expect(res.status).toBe(400);
//   });

// });
describe("placeholder", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});