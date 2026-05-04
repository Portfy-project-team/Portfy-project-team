import request from "supertest";
import app from "../../src/index";

describe("POST /auth/refresh", () => {

  it("RT-01 : valid refresh", async () => {
    const email = `refresh${Date.now()}@test.com`;

    await request(app).post("/auth/register").send({
      email,
      password: "Secure123!",
      role: "STUDENT",
    });

    const login = await request(app).post("/auth/login").send({
      email,
      password: "Secure123!",
    });

    const res = await request(app).post("/auth/refresh").send({
      refreshToken: login.body.refreshToken,
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("RT-04 : no token", async () => {
    const res = await request(app).post("/auth/refresh").send({});
    expect(res.status).toBe(400);
  });

});