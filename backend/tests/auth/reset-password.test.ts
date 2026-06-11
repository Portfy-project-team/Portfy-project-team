import request from "supertest";
import app from "../../src/index.js";

describe("POST /api/auth/reset-password", () => {

  it("RP-01 : invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({
        token: "invalid-token",
        password: "NewPassword123!!!",
      });

    expect([400, 401]).toContain(res.status);
  });

  it("RP-02 : missing token", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({
        password: "NewPassword123!!!",
      });

    expect(res.status).toBe(400);
  });

  it("RP-03 : short password", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({
        token: "fake-token",
        password: "123",
      });

    expect(res.status).toBe(400);
  });

  it("RP-04 : missing password", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({
        token: "fake-token",
      });

    expect(res.status).toBe(400);
  });

});

// describe("POST /auth/reset-password", () => {
//   it("RP-01 : not implemented yet", () => {
//     expect(true).toBe(true);
//   });
// });
// describe("placeholder", () => {
//   it("should pass", () => {
//     expect(true).toBe(true);
//   });
// });  
