import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("GET /api/user/me", () => {

  let cookies: string[] = [];

  beforeAll(async () => {

    const email = `me${Date.now()}@test.com`;

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
        isEmailVerified: true,
      },
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "Secure123!!!",
      });

    cookies = Array.isArray(login.headers["set-cookie"])
      ? login.headers["set-cookie"]
      : [];
  });

  it("UM-01 : get my profile", async () => {

    const res = await request(app)
      .get("/api/user/me")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
  });

  it("UM-02 : no token", async () => {

    const res = await request(app)
      .get("/api/user/me");

    expect(res.status).toBe(401);
  });

});