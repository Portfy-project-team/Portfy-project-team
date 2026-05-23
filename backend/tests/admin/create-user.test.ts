import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("POST /api/admin/users", () => {

  let adminCookies: string[] = [];

  beforeAll(async () => {

    const email = `admin${Date.now()}@test.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        email,
        password: "Secure123!!!",
        role: "STUDENT",
      });

    await prisma.user.update({
      where: { email },
      data: {
        role: "ADMIN",
        isEmailVerified: true,
      },
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "Secure123!!!",
      });

    adminCookies = Array.isArray(login.headers["set-cookie"])
      ? login.headers["set-cookie"]
      : [];
  });

  it("AU-01 : admin create user", async () => {

    const res = await request(app)
      .post("/api/admin/users")
      .set("Cookie", adminCookies)
      .send({
        name: "Test User",
        email: `user${Date.now()}@test.com`,
        password: "Password123!",
        role: "STUDENT",
      });

    expect(res.status).toBe(201);
  });

  it("AU-02 : no token", async () => {

    const res = await request(app)
      .post("/api/admin/users")
      .send({
        name: "Test User",
        email: `user${Date.now()}@test.com`,
        password: "Password123!",
        role: "STUDENT",
      });

    expect(res.status).toBe(401);
  });

});