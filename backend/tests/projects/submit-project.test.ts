import request from "supertest";
import app from "../../src/index.js";
import { prisma } from "../../src/utils/prisma.js";

describe("POST /api/projects/:id/submit", () => {

  let studentCookies: string[] = [];
  let projectId: number;

  beforeAll(async () => {
    const email = `submitproject${Date.now()}@test.com`;

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

    const create = await request(app)
      .post("/api/projects")
      .set("Cookie", studentCookies)
      .send({
        titre: "Projet à soumettre",
        type: "MODULE",
      });

    projectId = create.body.project.id;
  });

  it("SP-01 : submit project", async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/submit`)
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
    expect(res.body.project.statusV).toBe("PENDING");
  });

  it("SP-02 : invalid id", async () => {
    const res = await request(app)
      .post("/api/projects/abc/submit")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(400);
  });

  it("SP-03 : no token", async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/submit`);

    expect(res.status).toBe(401);
  });

});
