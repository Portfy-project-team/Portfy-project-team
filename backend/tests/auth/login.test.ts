import request from "supertest";
import app from "../../src/index";

describe("POST /auth/login", () => {

  it("L-01 : valid login", async () => {
    const email = `login${Date.now()}@test.com`;

    // register first
    await request(app).post("/auth/register").send({
      email,
      password: "Secure123!",
      role: "STUDENT",
    });

    const res = await request(app).post("/auth/login").send({
      email,
      password: "Secure123!",
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it("L-02 : email not found", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "unknown@test.com",
      password: "Secure123!",
    });

    expect(res.status).toBe(401);
  });

  it("L-03 : wrong password", async () => {
    const email = `wrong${Date.now()}@test.com`;

    await request(app).post("/auth/register").send({
      email,
      password: "Secure123!",
      role: "STUDENT",
    });

    const res = await request(app).post("/auth/login").send({
      email,
      password: "wrongpass",
    });

    expect(res.status).toBe(401);
  });

});