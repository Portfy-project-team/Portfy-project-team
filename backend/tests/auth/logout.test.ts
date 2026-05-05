import request from "supertest";
import app from "../../src/index";

describe("POST /auth/logout", () => {

  it("LO-01 : valid logout", async () => {
    const email = `logout${Date.now()}@test.com`;

    await request(app).post("/auth/register").send({
      email,
      password: "Secure123!",
      role: "STUDENT",
    });

    const login = await request(app).post("/auth/login").send({
      email,
      password: "Secure123!",
    });

    const res = await request(app).post("/auth/logout").send({
      refreshToken: login.body.refreshToken,
    });

    expect(res.status).toBe(200);
  });

  it("LO-04 : logout twice", async () => {
    const email = `logout2${Date.now()}@test.com`;

    await request(app).post("/auth/register").send({
      email,
      password: "Secure123!",
      role: "STUDENT",
    });

    const login = await request(app).post("/auth/login").send({
      email,
      password: "Secure123!",
    });

    await request(app).post("/auth/logout").send({
      refreshToken: login.body.refreshToken,
    });

    const res = await request(app).post("/auth/logout").send({
      refreshToken: login.body.refreshToken,
    });

    expect(res.status).toBe(401);
  });

});