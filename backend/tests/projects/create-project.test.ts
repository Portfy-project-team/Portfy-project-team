import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("POST /api/projects", () => {

  let studentCookies: string[] = [];

  beforeAll(async () => {
    const email = `createproject${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "SecurePassword123!!!",
      role: "STUDENT",
    });

    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "SecurePassword123!!!",
    });

    studentCookies = Array.isArray(login.headers["set-cookie"])
      ? login.headers["set-cookie"]
      : [];
  });

  it("CP-01 : create project with valid data", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Cookie", studentCookies)
      .send({
        titre: "Mon Projet Test",
        description: "Description du projet",
        type: "PERSONNEL",
      });

    expect(res.status).toBe(201);
    expect(res.body.project.titre).toBe("Mon Projet Test");
    expect(res.body.project.statusV).toBe("PENDING");
  });

  it("CP-02 : missing titre", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Cookie", studentCookies)
      .send({
        description: "Description sans titre",
      });

    expect(res.status).toBe(400);
  });

  it("CP-03 : titre too short", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Cookie", studentCookies)
      .send({
        titre: "AB",
      });

    expect(res.status).toBe(400);
  });

  it("CP-04 : invalid type", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Cookie", studentCookies)
      .send({
        titre: "Projet valide",
        type: "INVALID_TYPE",
      });

    expect(res.status).toBe(400);
  });

  it("CP-05 : no token", async () => {
    const res = await request(app)
      .post("/api/projects")
      .send({
        titre: "Projet sans auth",
      });

    expect(res.status).toBe(401);
  });

});
