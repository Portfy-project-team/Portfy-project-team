import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("GET /api/projects/pending", () => {

  let profCookies: string[] = [];
  let studentCookies: string[] = [];

  beforeAll(async () => {
    // prof
    const profEmail = `pendingprof${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email: profEmail,
      password: "SecurePassword123!!!",
      role: "STUDENT",
    });

    await prisma.user.update({
      where: { email: profEmail },
      data: { role: "PROF", isEmailVerified: true },
    });

    const profLogin = await request(app).post("/api/auth/login").send({
      email: profEmail,
      password: "SecurePassword123!!!",
    });

    profCookies = Array.isArray(profLogin.headers["set-cookie"])
      ? profLogin.headers["set-cookie"]
      : [];

    // student
    const studentEmail = `pendingstudent${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email: studentEmail,
      password: "SecurePassword123!!!",
      role: "STUDENT",
    });

    await prisma.user.update({
      where: { email: studentEmail },
      data: { isEmailVerified: true },
    });

    const studentLogin = await request(app).post("/api/auth/login").send({
      email: studentEmail,
      password: "SecurePassword123!!!",
    });

    studentCookies = Array.isArray(studentLogin.headers["set-cookie"])
      ? studentLogin.headers["set-cookie"]
      : [];
  });

  it("PEP-01 : prof can get pending projects", async () => {
    const res = await request(app)
      .get("/api/projects/pending")
      .set("Cookie", profCookies);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.projects)).toBe(true);
  });

  it("PEP-02 : student cannot get pending projects", async () => {
    const res = await request(app)
      .get("/api/projects/pending")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(403);
  });

  it("PEP-03 : no token", async () => {
    const res = await request(app).get("/api/projects/pending");
    expect(res.status).toBe(401);
  });

});
