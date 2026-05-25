import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("GET /api/portfolio/me", () => {

  let studentCookies: string[] = [];

  beforeAll(async () => {
    const email = `portfoliome${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "Secure123!!!",
      role: "STUDENT",
    });

    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "Secure123!!!",
    });

    studentCookies = Array.isArray(login.headers["set-cookie"])
      ? login.headers["set-cookie"]
      : [];
  });

  it("PM-01 : get my portfolio as student", async () => {
    const res = await request(app)
      .get("/api/portfolio/me")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("portfolio");
  });

  it("PM-02 : no token", async () => {
    const res = await request(app).get("/api/portfolio/me");

    expect(res.status).toBe(401);
  });

  it("PM-03 : non-student cannot access", async () => {
    const email = `proportfolio${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "Secure123!!!",
      role: "PRO",
    });

    await prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        professionnel: { update: { statusV: "VALIDATED" } },
      },
    });

    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "Secure123!!!",
    });

    const proCookies = Array.isArray(login.headers["set-cookie"])
      ? login.headers["set-cookie"]
      : [];

    const res = await request(app)
      .get("/api/portfolio/me")
      .set("Cookie", proCookies);

    expect(res.status).toBe(403);
  });

});