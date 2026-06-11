import request from "supertest";
import app from "../../src/index.js";
import { prisma } from "../../src/utils/prisma.js";

describe("GET /api/admin/users", () => {

  let adminCookies: string[] = [];

  beforeAll(async () => {

    const email = `adminlist${Date.now()}@test.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        email,
        password: "SecurePassword123!!!",
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
        password: "SecurePassword123!!!",
      });

    adminCookies = Array.isArray(login.headers["set-cookie"])
      ? login.headers["set-cookie"]
      : [];
  });

  it("GU-01 : admin get users", async () => {

    const res = await request(app)
      .get("/api/admin/users")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(200);
  });

});
