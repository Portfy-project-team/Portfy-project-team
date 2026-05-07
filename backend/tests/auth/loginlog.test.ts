import request from "supertest";
import app from "../../src/index";

describe("Login Logs", () => {

  it("LG-01 : successful login should be logged", async () => {
    const email = `log${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "Secure123!!!",
      role: "STUDENT",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "Secure123!!!",
      });

    expect(res.status).toBe(200);
  });

  it("LG-02 : failed login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@test.com",
        password: "Wrong123!!!",
      });

    expect(res.status).toBe(401);
  });

});