import request from "supertest";
import app from "../../src/index";

describe("GET /api/auth/verify-email", () => {

  it("VE-01 : invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/verify-email?token=invalid-token");

    expect(res.status).toBe(400);
  });

  it("VE-02 : missing token", async () => {
    const res = await request(app)
      .get("/api/auth/verify-email");

    expect(res.status).toBe(400);
  });

});